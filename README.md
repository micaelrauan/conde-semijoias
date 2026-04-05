# CONDE SEMIJOIAS - Frontend + Checkout Nuvemshop

Aplicacao de e-commerce em Next.js com autenticacao via Clerk, catalogo Nuvemshop e fluxo de compra hospedado na Nuvemshop.

## Visao Geral

O checkout funciona em 4 etapas:

1. Carrinho local cria um Draft Order na Nuvemshop
2. Cliente e redirecionado para o checkout hospedado da Nuvemshop (frete e pagamento)
3. Webhook order/paid salva pedido em arquivo local e envia email de confirmacao
4. Cliente acessa paginas de sucesso e historico em Meus Pedidos

## Stack Atual

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Clerk (auth)
- Nuvemshop API (catalogo + draft orders + webhook)
- Resend + React Email (confirmacao de pedido)
- Persistencia de pedidos em arquivo JSON (sem banco)

## Estrutura Relevante

- src/app/api/checkout/route.ts: cria draft order e devolve URL de checkout
- src/app/api/webhooks/nuvemshop/route.ts: recebe order/paid
- src/app/api/pedidos/route.ts: lista pedidos do usuario logado
- src/lib/nuvemshop.ts: cliente de catalogo Nuvemshop
- src/lib/nuvemshop-checkout.ts: integracao draft_orders
- src/lib/orders-store.ts: leitura/escrita em data/orders.json
- src/lib/resend.ts: envio de email transacional
- src/emails/PedidoConfirmado.tsx: template de email

## Variaveis de Ambiente

Configure no arquivo .env.local:

```env
NUVEMSHOP_TOKEN=seu_token
NUVEMSHOP_STORE_ID=sua_loja

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_chave_publica
CLERK_SECRET_KEY=sua_chave_privada
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

RESEND_API_KEY=re_sua_chave
RESEND_FROM_EMAIL=pedidos@condesemijoias.com.br
NEXT_PUBLIC_SITE_URL=https://conde-semijoias.vercel.app
```

## Setup Local

```bash
npm install
npm run dev
```

Aplicacao em http://localhost:3000.

## Fluxo de Compra

1. Usuario adiciona itens ao carrinho
2. Botao Finalizar Compra chama POST /api/checkout
3. API cria draft order na Nuvemshop e retorna checkoutUrl
4. Frontend redireciona para checkoutUrl
5. Pagamento aprovado dispara webhook order/paid
6. Webhook:

- salva pedido em data/orders.json
- envia email de confirmacao com Resend

7. Usuario acessa:

- /pedido/sucesso
- /meus-pedidos

## Passos Manuais Obrigatorios na Nuvemshop

1. Habilitar escopos do app:

- write_draft_orders
- read_draft_orders

2. Reinstalar app na loja e atualizar token
3. Configurar webhook:

- Evento: order/paid
- URL: https://seu-dominio.com/api/webhooks/nuvemshop

4. Configurar redirect de sucesso no checkout:

- https://seu-dominio.com/pedido/sucesso?order_id={order_id}

Sem os escopos de draft orders, a criacao de draft order retorna 403.

## Armazenamento de Pedidos

- Arquivo: data/orders.json
- Nao utiliza banco de dados
- Arquivo ignorado no git
- data/.gitkeep mantem o diretorio versionado

## Comandos Principais

```bash
npm run dev
npm run build
npm run start
```

## Checklist de Verificacao

- Build sem erros
- Checkout redireciona para Nuvemshop
- Webhook order/paid recebido com sucesso
- data/orders.json atualizado apos pagamento
- Email de confirmacao enviado
- /meus-pedidos lista pedidos do usuario logado

## Deploy

Consulte VERCEL_DEPLOY.md para checklist e configuracoes de producao.

## Documentacao Nuvemshop

Para setup completo da conexao com app, OAuth, escopos, token, checkout e webhook:

- NUVEMSHOP_CONNECT.md
