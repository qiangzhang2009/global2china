/**
 * 数据迁移脚本：zxqconsulting.com → 后台管理系统（Neon PostgreSQL）
 *
 * 数据来源：Supabase（ejdzppssgflbacagarfr.supabase.co）
 *   - visitors 表   → Neon public.users
 *   - submissions 表 → Neon public.inquiries
 *   - behaviors 表   → Neon public.tracking_events
 *
 * 使用方法：
 *   1. 填写下方 SUPABASE_URL 和 SUPABASE_SERVICE_KEY
 *   2. cd /Users/john/网站后台数据管理系统/backend-admin
 *   3. cp ../data-migration/migrate-zxqconsulting.mjs ./migrate-zxqconsulting.mjs
 *   4. node migrate-zxqconsulting.mjs
 *   5. 完成后删除：rm ./migrate-zxqconsulting.mjs
 */

import { neon } from '@neondatabase/serverless';

// ============================================================
// 配置区（请填写真实值）
// ============================================================

const SUPABASE_URL = 'https://ejdzppssgflbacagarfr.supabase.co';
const SUPABASE_SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE'; // 在 Supabase Dashboard → Settings → API → service_role key

const DATABASE_URL = 'postgresql://neondb_owner:npg_Wb8lMyAIZv1m@ep-little-rain-ai32bkeo-pooler.c-4.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

// zxqconsulting 在 Neon 中的租户 ID（已存在）
const TENANT_ID = '87d65ab5-6a18-41f1-8592-2e6280dfe19c';

// ============================================================

const sql = neon(DATABASE_URL);

/** 从 Supabase 拉取数据，支持分页 */
async function fetchFromSupabase(table, page = 0, pageSize = 500) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?website_id=eq.zxqconsulting&order=created_at.asc&offset=${from}&limit=${pageSize}`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'count=exact',
        Range: `${from}-${to}`,
      },
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase fetch failed [${table}]: ${res.status} ${text}`);
  }
  return res.json();
}

/** 获取某张表总记录数 */
async function countFromSupabase(table) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?website_id=eq.zxqconsulting&select=id`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    }
  );
  const contentRange = res.headers.get('content-range'); // e.g. "0-0/123"
  if (contentRange) {
    const total = contentRange.split('/')[1];
    return parseInt(total, 10) || 0;
  }
  return 0;
}

// ============================================================
// 迁移 visitors → public.users
// ============================================================
async function migrateVisitors() {
  console.log('\n[1/3] 迁移 visitors → public.users ...');
  const total = await countFromSupabase('visitors');
  console.log(`  Supabase visitors 总数: ${total}`);
  if (total === 0) { console.log('  无数据，跳过'); return 0; }

  let imported = 0;
  const pageSize = 500;
  const pages = Math.ceil(total / pageSize);

  for (let p = 0; p < pages; p++) {
    const rows = await fetchFromSupabase('visitors', p, pageSize);
    for (const v of rows) {
      try {
        await sql`
          INSERT INTO public.users (
            tenant_id, visitor_id,
            name, phone, email, company,
            product_type, target_market,
            source, inquiry_count, visit_count,
            first_visit_at, last_visit_at,
            created_at, updated_at
          ) VALUES (
            ${TENANT_ID}, ${v.visitor_id},
            ${v.contact_name ?? null}, ${v.contact_phone ?? null},
            ${v.email ?? null}, ${v.company_name ?? null},
            ${v.product_category ?? null},
            ${v.target_region ?? (v.selected_markets ? JSON.stringify(v.selected_markets) : null)},
            ${'website_form'},
            0, ${v.visit_count ?? 1},
            ${v.first_visit ?? v.created_at}, ${v.last_visit ?? v.updated_at},
            ${v.created_at}, ${v.updated_at}
          )
          ON CONFLICT DO NOTHING
        `;
        imported++;
      } catch (e) {
        console.warn(`  SKIP visitor ${v.visitor_id}: ${e.message}`);
      }
    }
    console.log(`  Page ${p + 1}/${pages} done (${imported} imported so far)`);
  }
  console.log(`  ✓ visitors 迁移完成，共导入 ${imported} 条`);
  return imported;
}

// ============================================================
// 迁移 submissions → public.inquiries
// ============================================================
async function migrateSubmissions() {
  console.log('\n[2/3] 迁移 submissions → public.inquiries ...');
  const total = await countFromSupabase('submissions');
  console.log(`  Supabase submissions 总数: ${total}`);
  if (total === 0) { console.log('  无数据，跳过'); return 0; }

  let imported = 0;
  const pageSize = 500;
  const pages = Math.ceil(total / pageSize);

  for (let p = 0; p < pages; p++) {
    const rows = await fetchFromSupabase('submissions', p, pageSize);
    for (const s of rows) {
      // 尝试找到对应 user_id
      let userId = null;
      if (s.visitor_id) {
        const userRows = await sql`
          SELECT id FROM public.users
          WHERE tenant_id = ${TENANT_ID} AND visitor_id = ${s.visitor_id}
          LIMIT 1
        `;
        userId = userRows[0]?.id ?? null;
      }

      try {
        await sql`
          INSERT INTO public.inquiries (
            tenant_id, user_id, visitor_id,
            name, phone, email, company,
            product_type, target_market,
            message, source, status,
            created_at, updated_at
          ) VALUES (
            ${TENANT_ID}, ${userId}, ${s.visitor_id ?? null},
            ${s.name ?? null}, ${s.phone ?? null},
            ${s.email ?? null}, ${s.company ?? null},
            ${s.product_interest ?? null}, ${null},
            ${s.message ?? null}, ${'website_form'},
            ${s.status === 'new' ? 'pending' : (s.status ?? 'pending')},
            ${s.created_at}, ${s.updated_at}
          )
          ON CONFLICT DO NOTHING
        `;
        imported++;
      } catch (e) {
        console.warn(`  SKIP submission ${s.id}: ${e.message}`);
      }
    }
    console.log(`  Page ${p + 1}/${pages} done (${imported} imported so far)`);
  }
  console.log(`  ✓ submissions 迁移完成，共导入 ${imported} 条`);
  return imported;
}

// ============================================================
// 迁移 behaviors → public.tracking_events
// ============================================================
async function migrateBehaviors() {
  console.log('\n[3/3] 迁移 behaviors → public.tracking_events ...');
  const total = await countFromSupabase('behaviors');
  console.log(`  Supabase behaviors 总数: ${total}`);
  if (total === 0) { console.log('  无数据，跳过'); return 0; }

  let imported = 0;
  const pageSize = 1000;
  const pages = Math.ceil(total / pageSize);

  for (let p = 0; p < pages; p++) {
    const rows = await fetchFromSupabase('behaviors', p, pageSize);
    for (const b of rows) {
      try {
        await sql`
          INSERT INTO public.tracking_events (
            tenant_id, event_type, visitor_id,
            page_url, page_title,
            event_data,
            created_at
          ) VALUES (
            ${TENANT_ID}, ${b.event_type ?? 'page_view'}, ${b.visitor_id},
            ${b.page_url ?? null}, ${b.page_title ?? null},
            ${JSON.stringify({
              event_category: b.event_category,
              event_label: b.event_label,
              duration_seconds: b.duration_seconds,
              metadata: b.metadata,
            })},
            ${b.created_at}
          )
        `;
        imported++;
      } catch (e) {
        console.warn(`  SKIP behavior ${b.id}: ${e.message}`);
      }
    }
    if ((p + 1) % 5 === 0 || p + 1 === pages) {
      console.log(`  Page ${p + 1}/${pages} done (${imported} imported so far)`);
    }
  }
  console.log(`  ✓ behaviors 迁移完成，共导入 ${imported} 条`);
  return imported;
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  console.log('========================================');
  console.log('  zxqconsulting 历史数据迁移');
  console.log('  Supabase → Neon（后台管理系统）');
  console.log('========================================');

  if (SUPABASE_SERVICE_KEY === 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE') {
    console.error('\n❌ 请先填写 SUPABASE_SERVICE_KEY！');
    console.error('   在脚本顶部 const SUPABASE_SERVICE_KEY = ... 处填写真实的 service_role key');
    console.error('   获取方式：Supabase Dashboard → 项目 → Settings → API → service_role (secret)');
    process.exit(1);
  }

  const t0 = Date.now();
  const v = await migrateVisitors();
  const s = await migrateSubmissions();
  const b = await migrateBehaviors();

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log('\n========================================');
  console.log(`  迁移完成！耗时 ${elapsed}s`);
  console.log(`  visitors(users):   ${v}`);
  console.log(`  submissions(inquiries): ${s}`);
  console.log(`  behaviors(tracking_events): ${b}`);
  console.log('========================================');
}

main().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
