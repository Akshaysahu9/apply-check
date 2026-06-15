# GitHub + Live Link Setup (5 minutes)

## Step 1 — GitHub login (one time)

Open terminal in this folder and run:

```bash
gh auth login
```

Choose:
- GitHub.com
- HTTPS
- Login with browser (easiest)

## Step 2 — Upload to GitHub

```bash
cd "C:\Users\AKSHAY SAHU\Projects\resume-match-platform"
git branch -M main
gh repo create apply-check --public --source=. --remote=origin --push
```

Your repo will be: `https://github.com/YOUR_USERNAME/apply-check`

## Step 3 — Live link on Vercel (free)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Add New → Project**
3. Import **apply-check** repo
4. Before deploy, add **Environment Variables**:

| Name | Value |
|------|-------|
| `AUTH_SECRET` | `applycheck-secret-2026-change-this-random` |
| `AUTH_URL` | `https://YOUR-APP-NAME.vercel.app` (update after first deploy if URL differs) |

5. Click **Deploy**

After ~2 min you get a live URL like:
`https://apply-check.vercel.app`

## Step 4 — Fix login on live site

After first deploy, copy your exact Vercel URL and set:
- Vercel → Project → Settings → Environment Variables
- Update `AUTH_URL` to that URL (with `https://`)
- Redeploy (Deployments → ... → Redeploy)

## Resume / interview line

> **ApplyCheck** — Resume checker with ATS scoring and job match.  
> Live: `https://your-url.vercel.app` | Code: `https://github.com/yourusername/apply-check`
