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
4. 若构建报错 `Environment variable not found: DATABASE_URL`，在 **Settings → Environment Variables** 手动添加：

| Name | Value |
|------|--------|
| `DATABASE_URL` | 复制 Storage 里 Neon 的 `POSTGRES_URL` 或 **Non-pooling** 连接串 |

（勾选 Production，保存后 Redeploy）

### Vercel Blob 图片存储

1. 项目 → **Storage** → **Create Database** → **Blob**
2. **Access 选 Public**（网站图片需要公开 URL；Private 需额外代理，见下）
3. 创建后打开该 Blob → **Projects** → **Connect to Project** → 选 **gc-crafts**
4. 会自动注入 `BLOB_READ_WRITE_TOKEN` 和/或 `BLOB_STORE_ID`
5. **Deployments → Redeploy**（必须，否则环境变量不生效）

若 Blob 已是 **Private**（例如 `gccrafts`）：

| 变量 | 值 |
|------|-----|
| `BLOB_ACCESS` | `private` |

并确认已 Connect 到 gc-crafts。图片会通过 `/api/media` 代理显示。

**仍报 “Blob is not configured”**：到 Blob 页 **Quickstart → .env.local** 复制 `BLOB_READ_WRITE_TOKEN`，手动加到 gc-crafts 项目环境变量后 Redeploy。

## 三、环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `BLOB_READ_WRITE_TOKEN` | 连接 Blob 后自动注入 |
| `BLOB_STORE_ID` | 新版 OIDC 连接时自动注入 |
| `BLOB_ACCESS` | `public`（默认）或 `private`（Private 存储必填） |
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
