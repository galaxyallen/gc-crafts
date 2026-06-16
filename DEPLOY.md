# 部署到 Vercel（全栈）

GC CRAFTS 使用 Next.js + Prisma + PostgreSQL + **Vercel Blob**。全部可在 Vercel 控制台完成，无需 Cloudinary 或单独 Neon 账号。

## 一、在 Vercel 创建项目

1. 将代码推送到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new) → Import 仓库
3. **Build Command**: `npm run vercel-build`（已配置）

## 二、创建 Storage（数据库 + 图片）

### Postgres 数据库

1. 项目 → **Storage** → **Create Database** → **Postgres**
2. 创建后点 **Connect to Project**
3. 在 **Environment Variables** 确认有 `POSTGRES_URL`
4. 手动添加（若未自动映射）：

```
DATABASE_URL = （与 POSTGRES_URL 相同，或 Storage 里的 Direct / Non-pooling 连接串）
```

### Vercel Blob 图片存储

1. 项目 → **Storage** → **Create Database** → **Blob**
2. 创建后点 **Connect to Project**
3. 会自动注入 `BLOB_READ_WRITE_TOKEN`（无需手动复制）

## 三、环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `BLOB_READ_WRITE_TOKEN` | 连接 Blob 后自动注入 |
| `NEXTAUTH_SECRET` | 随机字符串 |
| `NEXTAUTH_URL` | `https://www.galaxybz.com` |
| `ADMIN_EMAIL` | 后台管理员邮箱 |
| `ADMIN_PASSWORD` | 后台管理员密码 |

## 四、绑定域名 www.galaxybz.com

1. **Settings → Domains** → 添加 `www.galaxybz.com` 和 `galaxybz.com`
2. DNS 设置：

| 类型 | 主机 | 值 |
|------|------|-----|
| CNAME | `www` | `cname.vercel-dns.com` |
| A | `@` | `76.76.21.21` |

3. 确认 `NEXTAUTH_URL=https://www.galaxybz.com` 后 **Redeploy**

## 五、初始化数据

部署成功后，本地 `.env` 填入线上 `DATABASE_URL`，执行：

```bash
npm run db:seed
```

## 六、访问地址

- 网站：https://www.galaxybz.com
- 后台：https://www.galaxybz.com/admin
- 登录：https://www.galaxybz.com/login

## 本地开发

- 未配置 `BLOB_READ_WRITE_TOKEN` 时，图片保存到 `public/uploads/`（仅本地有效）
- 若要本地也走 Blob，在 Vercel 项目 **Storage → Blob → .env.local** 复制 token 到本地 `.env`

## 常见问题

**图片上传失败**
- 确认 Blob 已 **Connect to Project**，且存在 `BLOB_READ_WRITE_TOKEN`
- 单张图片建议小于 4.5 MB（Vercel 函数请求体限制）

**构建失败 migrate deploy**
- `DATABASE_URL` 必须是 PostgreSQL 直连字符串

**登录失败**
- `NEXTAUTH_URL` 必须与浏览器地址栏完全一致
