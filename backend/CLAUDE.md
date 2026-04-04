# CLAUDE.md — Backend ZURT

## Stack
- Node.js + Fastify + TypeScript + ESM
- PostgreSQL (managed DigitalOcean)
- PM2 process manager

## Comandos
- Build: npx tsc
- Restart: pm2 restart all
- Logs: pm2 logs --lines 20 --nostream
- DB: psql "postgresql://fintech_user:Basketball%400615@localhost:5432/fintech_db"

## Regras
- SEMPRE ler arquivo antes de editar
- SEMPRE compilar depois: npx tsc && pm2 restart all
- SEMPRE verificar sed: grep depois
- NAO usar avatar_url (nao existe em users)
- NAO usar type = CREDIT sozinho (usar CREDIT_CARD e CREDIT)
- SEMPRE DISTINCT ON (name) em pluggy_accounts/investments
- Family roles: admin, co-admin, member (NAO owner)
- Logger: fastify.log.error("msg: " + String(error))

## Tabelas
- users: id, email, full_name, role, plan_id, google_id, created_at
- pluggy_accounts: id, user_id, name, type, current_balance, updated_at
- pluggy_investments: id, user_id, name, type, current_value, quantity, updated_at
- family_groups: id, name, owner_id
- family_members: id, group_id, user_id, role, display_name
- family_permissions: id, member_id, group_id, can_view_*
- family_invites: id, group_id, email, invite_code, status, expires_at
