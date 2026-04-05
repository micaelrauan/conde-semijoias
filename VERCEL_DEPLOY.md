# Deploy no Vercel - CONDE SEMIJOIAS

Guia de deploy para o stack atual com Next.js + Clerk + Nuvemshop + Resend.

Guia detalhado de conexao com Nuvemshop:

- NUVEMSHOP_CONNECT.md

## Pre-requisitos

- Conta no Vercel
- Repositorio conectado (GitHub/GitLab/Bitbucket)
- App Clerk configurado
- App Nuvemshop com token valido
- Conta Resend ativa

## Deploy

### Opcao 1: via painel do Vercel

1. Criar novo projeto no Vercel
2. Selecionar o repositorio
3. Definir as variaveis de ambiente
4. Executar deploy

### Opcao 2: via CLI

```bash
npm install -g vercel
vercel
```

## Variaveis de ambiente obrigatorias

Cadastre no projeto do Vercel (Production e Preview):

```env
NUVEMSHOP_TOKEN=
NUVEMSHOP_STORE_ID=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

RESEND_API_KEY=
RESEND_FROM_EMAIL=pedidos@condesemijoias.com.br
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

NEXT_PUBLIC_SITE_URL deve usar o dominio final de producao.

## Build

- Framework: Next.js 16
- Comando: npm run build
- Output: .next

Valide localmente antes do deploy:

```bash
npm run build
```

## Passos manuais apos deploy

### Nuvemshop

1. Confirmar escopos do app:
   - write_draft_orders
   - read_draft_orders
2. Reinstalar app na loja caso tenha alterado escopos
3. Configurar webhook:
   - Evento: order/paid
   - URL: https://seu-dominio.com/api/webhooks/nuvemshop
4. Configurar redirect de sucesso do checkout:
   - https://seu-dominio.com/pedido/sucesso?order_id={order_id}

### Resend

1. Verificar dominio/remetente autorizado para RESEND_FROM_EMAIL
2. Confirmar entregabilidade de email em ambiente de producao

## Checklist de producao

- Build concluido sem erros
- Login Clerk funcionando
- Checkout redireciona para Nuvemshop
- Evento order/paid chega no webhook
- Pedido salvo em data/orders.json
- Email de confirmacao enviado
- /meus-pedidos exibindo historico do usuario logado

## Troubleshooting

### Erro 403 ao criar draft order

Causa comum: escopo write_draft_orders ausente ou token antigo.

Acao:

1. Ajustar escopos no app Nuvemshop
2. Reinstalar app
3. Atualizar NUVEMSHOP_TOKEN

### Email nao enviado

Acao:

1. Validar RESEND_API_KEY
2. Validar RESEND_FROM_EMAIL
3. Conferir logs da API de webhook

### /meus-pedidos vazio

Acao:

1. Confirmar pagamento aprovado no checkout
2. Confirmar recebimento de order/paid
3. Verificar email do pedido comparado ao email do usuario Clerk
