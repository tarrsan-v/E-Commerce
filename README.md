# ShopEase – two Vercel deployments, one shared database

customer/  -> Vercel project 1 (Root Directory = customer)
admin/     -> Vercel project 2 (Root Directory = admin)
Each folder has its own copy of api/index.js; both talk to the SAME Redis database.

## Steps
1. Push this folder to GitHub (or run `vercel` inside customer/ and admin/).
2. Create ONE Upstash Redis database (Vercel dashboard > Storage > Marketplace > Upstash Redis, or upstash.com).
3. Copy its REST URL and token. In BOTH Vercel projects add env vars:
   KV_REST_API_URL   = <REST URL>
   KV_REST_API_TOKEN = <REST token>
   (Connecting the same Upstash database to both projects sets these automatically.)
4. Optional: ADMIN_EMAIL / ADMIN_PASSWORD env vars (defaults: admin@gmail.com / password).
5. Redeploy both projects.

Customer site: open "/" then Start Shopping. Admin site: its own URL, login page.
