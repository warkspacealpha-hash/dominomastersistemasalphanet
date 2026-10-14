# Backend — Dominó Play (novo, controlado pelo dono)

Este documento descreve o backend **novo** que o frontend espelhado em
`public/dp/` espera encontrar. Nenhuma credencial, usuário, dado ou chave do
projeto de origem é reutilizada aqui.

## Como conectar

1. Crie um **novo** projeto no [Supabase](https://supabase.com) (você é o dono).
2. Aplique a migration em `supabase/migrations/00000000000000_copyai_new_equivalent_schema.sql`
   e **expanda o schema** conforme os contratos abaixo (a migration inicial é
   um esqueleto com RLS habilitado — revise antes de aplicar).
3. Copie `.env.example` para `.env` e preencha com as chaves **do seu** projeto:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` (somente servidor — nunca exponha no frontend)
4. Habilite o Realtime no painel do Supabase para os canais do jogo.
5. Teste cada contrato abaixo de ponta a ponta antes de considerar pronto.

## Contratos de API inferidos (nível de evidência)

| Método | Caminho | Uso |
|---|---|---|
| POST | `/rest/v1/rpc/register_guest` | Registro de convidado (CONFIRMADO) |
| POST | `/rest/v1/rpc/get_quota` | Consulta de cota/limite (CONFIRMADO) |
| WS | `/realtime/v1/websocket` | Partidas ao vivo, chat (CONFIRMADO) |
| GET | `/auth/v1/user` | Sessão do usuário (CONFIRMADO) |
| * | `/api/broadcast` | Difusão de eventos (PROVÁVEL) |
| * | `/storage/v1` | Avatares/imagens (PROVÁVEL) |
| * | `/functions/v1` | Funções de jogo: match, torneios, cobrança (PROVÁVEL) |

## Fluxos de autenticação

- `login`, `logout`, `session`, `registration`, `password_reset` via Supabase Auth.
- O frontend também opera em modo convidado (`register_guest`).

## Serviços externos

- **Mercado Pago** — pagamentos (loja/VIP). Configure suas próprias
  credenciais; nenhum dado de cobrança da origem foi copiado.

## RLS

Todas as tabelas novas devem ter Row Level Security habilitado e políticas
revisadas (dono lê/escreve o que é dele; dados de partida visíveis apenas aos
participantes). Não suba o schema sem revisar as políticas.
