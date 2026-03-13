/**
 * 数据迁移脚本：StarLoom.ai → 后台管理系统（Neon PostgreSQL）
 *
 * 数据来源：Supabase（StarLoom 项目，project ID 待确认）
 *   - profiles 表          → Neon public.users（仅保存基础信息）
 *   - divination_records 表 → Neon public.divination_records
 *   - chat_messages 表      → Neon public.chat_histories
 *
 * 使用方法：
 *   1. 填写下方 STARLOOM_SUPABASE_URL 和 STARLOOM_SUPABASE_SERVICE_KEY
 *      （在 StarLoom 的 Supabase 项目 Dashboard → Settings → API 获取）
 *   2. cd /Users/john/网站后台数据管理系统/backend-admin
 *   3. cp ../data-migration/migrate-starloom.mjs ./migrate-starloom.mjs
 *   4. node migrate-starloom.mjs
 *   5. 完成后删除：rm ./migrate-starloom.mjs
 */

import { neon } from '@neondatabase/serverless';

// ============================================================
// 配置区（请填写真实值）
// ============================================================

// StarLoom 的 Supabase 项目 URL（在 Supabase Dashboard → Settings → API 获取）
const STARLOOM_SUPABASE_URL = 'YOUR_STARLOOM_SUPABASE_URL_HERE';
const STARLOOM_SUPABASE_SERVICE_KEY = 'YOUR_STARLOOM_SUPABASE_SERVICE_ROLE_KEY_HERE';

const DATABASE_URL = 'postgresql://neondb_owner:npg_Wb8lMyAIZv1m@ep-little-rain-ai32bkeo-pooler.c-4.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

// StarLoom 在 Neon 中的租户 ID（已自动创建）
const TENANT_ID = '976773e8-befd-4c6d-8fad-bba5414cb571';

// ============================================================

const sql = neon(DATABASE_URL);

/** 通用 Supabase 分页拉取（无 website_id 过滤，StarLoom 表无此字段） */
async function fetchTable(table, page = 0, pageSize = 500) {
  const from = page * pageSize;
  const res = await fetch(
    `${STARLOOM_SUPABASE_URL}/rest/v1/${table}?order=created_at.asc&offset=${from}&limit=${pageSize}`,
    {
      headers: {
        apikey: STARLOOM_SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${STARLOOM_SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'count=exact',
      },
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase fetch failed [${table}]: ${res.status} ${text}`);
  }
  return res.json();
}

async function countTable(table) {
  const res = await fetch(
    `${STARLOOM_SUPABASE_URL}/rest/v1/${table}?select=id`,
    {
      headers: {
        apikey: STARLOOM_SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${STARLOOM_SUPABASE_SERVICE_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    }
  );
  const cr = res.headers.get('content-range');
  return cr ? (parseInt(cr.split('/')[1], 10) || 0) : 0;
}

// ============================================================
// 迁移 profiles → public.users（仅有 Supabase Auth 的注册用户）
// ============================================================
async function migrateProfiles() {
  console.log('\n[1/3] 迁移 profiles → public.users ...');
  const total = await countTable('profiles');
  console.log(`  Supabase profiles 总数: ${total}`);
  if (total === 0) { console.log('  无数据，跳过'); return 0; }

  // 建立 supabase_user_id → neon_user_id 的映射，供后续关联用
  const profileIdMap = new Map(); // supabase UUID → neon UUID

  let imported = 0;
  const pages = Math.ceil(total / 500);

  for (let p = 0; p < pages; p++) {
    const rows = await fetchTable('profiles', p, 500);
    for (const profile of rows) {
      try {
        const inserted = await sql`
          INSERT INTO public.users (
            tenant_id, visitor_id,
            name, email,
            source,
            created_at, updated_at
          ) VALUES (
            ${TENANT_ID},
            ${'supabase_' + profile.id},
            ${profile.username ?? null},
            ${profile.email ?? null},
            ${'starloom_auth'},
            ${profile.created_at},
            ${profile.updated_at ?? profile.created_at}
          )
          ON CONFLICT DO NOTHING
          RETURNING id
        `;
        if (inserted[0]) {
          profileIdMap.set(profile.id, inserted[0].id);
          imported++;
        } else {
          // 已存在则查出 id
          const existing = await sql`
            SELECT id FROM public.users
            WHERE tenant_id = ${TENANT_ID} AND visitor_id = ${'supabase_' + profile.id}
            LIMIT 1
          `;
          if (existing[0]) profileIdMap.set(profile.id, existing[0].id);
        }
      } catch (e) {
        console.warn(`  SKIP profile ${profile.id}: ${e.message}`);
      }
    }
    console.log(`  Page ${p + 1}/${pages} done (${imported} imported so far)`);
  }
  console.log(`  ✓ profiles 迁移完成，共导入 ${imported} 条`);
  return { imported, profileIdMap };
}

// ============================================================
// 迁移 divination_records → public.divination_records
// ============================================================
async function migrateDivinationRecords(profileIdMap) {
  console.log('\n[2/3] 迁移 divination_records → public.divination_records ...');
  const total = await countTable('divination_records');
  console.log(`  Supabase divination_records 总数: ${total}`);
  if (total === 0) { console.log('  无数据，跳过'); return 0; }

  let imported = 0;
  const pageSize = 500;
  const pages = Math.ceil(total / pageSize);

  for (let p = 0; p < pages; p++) {
    const rows = await fetchTable('divination_records', p, pageSize);
    for (const d of rows) {
      const neonUserId = d.user_id ? (profileIdMap.get(d.user_id) ?? null) : null;
      const visitorId = d.user_id ? ('supabase_' + d.user_id) : null;

      try {
        await sql`
          INSERT INTO public.divination_records (
            tenant_id, user_id, visitor_id,
            divination_type, user_question, ai_response,
            birth_time, extra_data,
            created_at
          ) VALUES (
            ${TENANT_ID}, ${neonUserId}, ${visitorId},
            ${d.divination_type}, ${d.user_question ?? null}, ${d.ai_response ?? null},
            ${d.birth_time ?? null},
            ${'{}'},
            ${d.created_at}
          )
        `;
        imported++;
      } catch (e) {
        console.warn(`  SKIP divination ${d.id}: ${e.message}`);
      }
    }
    console.log(`  Page ${p + 1}/${pages} done (${imported} imported so far)`);
  }
  console.log(`  ✓ divination_records 迁移完成，共导入 ${imported} 条`);
  return imported;
}

// ============================================================
// 迁移 chat_messages → public.chat_histories
// ============================================================
async function migrateChatMessages(profileIdMap) {
  console.log('\n[3/3] 迁移 chat_messages → public.chat_histories ...');
  const total = await countTable('chat_messages');
  console.log(`  Supabase chat_messages 总数: ${total}`);
  if (total === 0) { console.log('  无数据，跳过'); return 0; }

  let imported = 0;
  const pageSize = 1000;
  const pages = Math.ceil(total / pageSize);

  // chat_messages 没有 session_id，用 user_id + 日期 拼一个伪 session
  for (let p = 0; p < pages; p++) {
    const rows = await fetchTable('chat_messages', p, pageSize);
    for (const m of rows) {
      const neonUserId = m.user_id ? (profileIdMap.get(m.user_id) ?? null) : null;
      const visitorId = m.user_id ? ('supabase_' + m.user_id) : null;
      // 用 user_id + 当天日期 合成 session_id（简单聚合，同一用户同一天归为一个 session）
      const sessionDate = m.created_at ? m.created_at.substring(0, 10) : 'unknown';
      const sessionId = `starloom_${m.user_id ?? 'anon'}_${sessionDate}`;

      try {
        await sql`
          INSERT INTO public.chat_histories (
            tenant_id, user_id, visitor_id,
            session_id, role, content, model,
            created_at
          ) VALUES (
            ${TENANT_ID}, ${neonUserId}, ${visitorId},
            ${sessionId}, ${m.role}, ${m.content}, ${m.model ?? 'deepseek-chat'},
            ${m.created_at}
          )
        `;
        imported++;
      } catch (e) {
        console.warn(`  SKIP chat_message ${m.id}: ${e.message}`);
      }
    }
    if ((p + 1) % 5 === 0 || p + 1 === pages) {
      console.log(`  Page ${p + 1}/${pages} done (${imported} imported so far)`);
    }
  }
  console.log(`  ✓ chat_messages 迁移完成，共导入 ${imported} 条`);
  return imported;
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  console.log('========================================');
  console.log('  StarLoom 历史数据迁移');
  console.log('  Supabase → Neon（后台管理系统）');
  console.log('========================================');

  if (
    STARLOOM_SUPABASE_URL === 'YOUR_STARLOOM_SUPABASE_URL_HERE' ||
    STARLOOM_SUPABASE_SERVICE_KEY === 'YOUR_STARLOOM_SUPABASE_SERVICE_ROLE_KEY_HERE'
  ) {
    console.error('\n❌ 请先填写 StarLoom 的 Supabase 配置！');
    console.error('   获取方式：打开 StarLoom 的 Supabase Dashboard → Settings → API');
    console.error('   填写脚本顶部的 STARLOOM_SUPABASE_URL 和 STARLOOM_SUPABASE_SERVICE_KEY');
    process.exit(1);
  }

  const t0 = Date.now();
  const { imported: profileCount, profileIdMap } = await migrateProfiles();
  const divinationCount = await migrateDivinationRecords(profileIdMap);
  const chatCount = await migrateChatMessages(profileIdMap);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log('\n========================================');
  console.log(`  迁移完成！耗时 ${elapsed}s`);
  console.log(`  profiles(users):            ${profileCount}`);
  console.log(`  divination_records:          ${divinationCount}`);
  console.log(`  chat_messages(chat_histories): ${chatCount}`);
  console.log('========================================');
}

main().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
