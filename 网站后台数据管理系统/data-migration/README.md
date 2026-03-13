# 历史数据导入说明

本目录包含将两个旧网站的 Supabase 历史数据迁移到后台管理系统（Neon PostgreSQL）的脚本。

## 涉及的两个网站

| 网站 | 域名 | Supabase 项目 | 已有数据 |
|------|------|--------------|---------|
| **zxqconsulting**（中医出海咨询） | zxqconsulting.com | `ejdzppssgflbacagarfr.supabase.co` | visitors（访客）、submissions（表单提交）、behaviors（行为轨迹） |
| **StarLoom**（AI 占卜平台） | starloom.ai | 需在 StarLoom Supabase Dashboard 确认 | profiles（注册用户）、divination_records（占卜记录）、chat_messages（聊天记录） |

## Neon 后台数据库中的映射关系

| Supabase 表 | Neon 表 | 租户 |
|------------|---------|------|
| `visitors` | `public.users` | zxqconsulting |
| `submissions` | `public.inquiries` | zxqconsulting |
| `behaviors` | `public.tracking_events` | zxqconsulting |
| `profiles` | `public.users` | starloom |
| `divination_records` | `public.divination_records` | starloom |
| `chat_messages` | `public.chat_histories` | starloom |

## 执行步骤

### 第一步：获取 Supabase Service Role Key

**zxqconsulting**（已知 URL: `ejdzppssgflbacagarfr.supabase.co`）：
1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择 zxqconsulting 项目
3. 左侧菜单 → Settings → API
4. 复制 **service_role (secret)** key（不是 anon public key）

**StarLoom**：
1. 同上，选择 StarLoom 项目
2. 复制项目 URL 和 service_role key

### 第二步：运行 zxqconsulting 迁移

```bash
# 1. 编辑脚本，填写 SUPABASE_SERVICE_KEY
open /Users/john/网站后台数据管理系统/data-migration/migrate-zxqconsulting.mjs

# 2. 复制到 backend-admin 目录（需要 node_modules）
cd /Users/john/网站后台数据管理系统/backend-admin
cp ../data-migration/migrate-zxqconsulting.mjs ./migrate-zxqconsulting.mjs

# 3. 执行
node migrate-zxqconsulting.mjs

# 4. 执行完毕后清理
rm ./migrate-zxqconsulting.mjs
```

### 第三步：运行 StarLoom 迁移

```bash
# 1. 编辑脚本，填写 STARLOOM_SUPABASE_URL 和 STARLOOM_SUPABASE_SERVICE_KEY
open /Users/john/网站后台数据管理系统/data-migration/migrate-starloom.mjs

# 2. 复制到 backend-admin 目录
cd /Users/john/网站后台数据管理系统/backend-admin
cp ../data-migration/migrate-starloom.mjs ./migrate-starloom.mjs

# 3. 执行
node migrate-starloom.mjs

# 4. 执行完毕后清理
rm ./migrate-starloom.mjs
```

### 第四步：验证数据

在后台管理系统中检查数据是否正常显示，或直接查询 Neon：

```sql
-- 查看各租户用户数
SELECT t.name, COUNT(u.id) AS users
FROM public.tenants t
LEFT JOIN public.users u ON u.tenant_id = t.id
GROUP BY t.name;

-- 查看各租户询盘数
SELECT t.name, COUNT(i.id) AS inquiries
FROM public.tenants t
LEFT JOIN public.inquiries i ON i.tenant_id = t.id
GROUP BY t.name;

-- 查看 StarLoom 占卜记录
SELECT divination_type, COUNT(*) AS count
FROM public.divination_records
WHERE tenant_id = '976773e8-befd-4c6d-8fad-bba5414cb571'
GROUP BY divination_type;
```

## 已完成的数据库变更

以下变更在执行本说明前已自动完成：

- [x] 在 `public.tenants` 中添加 **StarLoom 占卜平台** 租户（slug: `starloom`，ID: `976773e8-befd-4c6d-8fad-bba5414cb571`）
- [x] 创建 `public.divination_records` 表（含索引）
- [x] 创建 `public.chat_histories` 表（含索引）

## 注意事项

- 脚本支持**幂等执行**（`ON CONFLICT DO NOTHING`），重复执行不会产生重复数据
- behaviors/chat_messages 数据量可能较大，请耐心等待
- Service Role Key 有完整数据库权限，执行完毕后请勿泄露
- 迁移完成后，旧 Supabase 数据可继续保留作为备份，无需删除
