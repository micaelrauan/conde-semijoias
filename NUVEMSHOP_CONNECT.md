# Guia de Integracao com Nuvemshop

Este documento explica o processo completo para conectar o projeto com a Nuvemshop, desde o app no painel de parceiros ate o checkout funcionando com webhook.

## Objetivo

Ao final deste guia, voce tera:

- Catalogo carregando via API da Nuvemshop
- Checkout iniciado por Draft Order
- Redirecionamento para checkout hospedado
- Webhook order/paid ativo
- Token e escopos corretos para producao

## 1) Criar e configurar app no Partner Portal

1. Entre no portal de parceiros da Nuvemshop.
2. Crie ou abra seu app.
3. Configure o redirect URI de OAuth para seu ambiente.
4. Salve as credenciais do app:
   - client_id
   - client_secret

## 2) Escopos obrigatorios

No app, habilite os escopos:

- read_products
- read_categories
- read_orders
- write_draft_orders
- read_draft_orders

Importante: se voce alterar escopos depois de ja ter instalado o app, e obrigatorio reinstalar o app na loja para gerar token com os novos escopos.

## 3) Fluxo OAuth correto

O token precisa vir de um authorization_code valido. Nao use code null.

### 3.1 URL de autorizacao (exemplo)

```text
https://www.tiendanube.com/apps/authorize?client_id=SEU_CLIENT_ID&state=SEU_ESTADO&response_type=code
```

Depois que o lojista autoriza, a Nuvemshop redireciona com o parametro code.

### 3.2 Troca de code por token

```bash
curl -X POST "https://www.tiendanube.com/apps/authorize/token" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "SEU_CLIENT_ID",
    "client_secret": "SEU_CLIENT_SECRET",
    "grant_type": "authorization_code",
    "code": "AUTHORIZATION_CODE_VALIDO"
  }'
```

Resposta esperada: access_token com escopos solicitados.

## 4) Variaveis de ambiente no projeto

Configure no .env.local:

```env
NUVEMSHOP_TOKEN=token_recebido_no_oauth
NUVEMSHOP_STORE_ID=id_da_loja
```

Se estiver em producao (Vercel), configure as mesmas variaveis no painel do projeto.

## 5) Validar catalogo

Com o app rodando:

1. Acesse a pagina de produtos.
2. Confirme carregamento de produtos e categorias.
3. Se falhar com 401/403:
   - token invalido/expirado
   - escopo insuficiente
   - app nao reinstalado

## 6) Validar checkout por Draft Order

Fluxo esperado:

1. Usuario logado clica em Prosseguir para checkout
2. Front chama POST /api/checkout
3. API cria Draft Order em /draft_orders
4. Retorna checkoutUrl
5. Front redireciona para checkout hospedado

Se retornar 403 Missing required scope: write_draft_orders:

1. habilite write_draft_orders e read_draft_orders no app
2. reinstale o app
3. gere novo token
4. atualize NUVEMSHOP_TOKEN
5. reinicie o servidor

## 7) Configurar webhook de pedido pago

No admin da Nuvemshop:

1. Configuracoes > API > Webhooks
2. Evento: order/paid
3. URL:

```text
https://seu-dominio.com/api/webhooks/nuvemshop
```

No projeto, esse webhook:

- salva pedido em data/orders.json
- envia email de confirmacao via Resend

## 8) Configurar redirect de sucesso

No checkout da Nuvemshop:

```text
https://seu-dominio.com/pedido/sucesso?order_id={order_id}
```

Pagina de cancelamento opcional no seu fluxo:

```text
https://seu-dominio.com/pedido/cancelado
```

## 9) Checklist final

- OAuth gerou token valido
- Escopos corretos aplicados
- App reinstalado apos mudar escopos
- NUVEMSHOP_TOKEN e NUVEMSHOP_STORE_ID configurados
- /api/checkout cria draft order sem erro
- Redireciona para checkout hospedado
- Webhook order/paid recebendo eventos
- Pedido salvo em data/orders.json
- Email de confirmacao enviado

## 10) Troubleshooting rapido

### 401 no /draft_orders

Token invalido, expirado ou incorreto.

### 403 no /draft_orders

Escopo ausente (geralmente write_draft_orders).

### 422 no /draft_orders

Payload invalido (exemplo: variant_id inexistente).

### Webhook nao salva pedido

- URL errada no admin
- Ambiente inacessivel publicamente
- Evento diferente de order/paid

## 11) Seguranca

- Nunca commitar client_secret, access_token ou chaves privadas.
- Se alguma credencial foi exposta, gere uma nova imediatamente.
