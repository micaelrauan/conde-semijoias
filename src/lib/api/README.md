# API Helpers de Frontend

Este modulo agrupa funcoes utilitarias para consumo de dados no frontend.

Importante:

- Catalogo e categorias sao consumidos da API interna do Next, que por sua vez integra com a Nuvemshop.
- Carrinho e pedidos em src/lib/api usam mock local em memoria para cenarios de UI/teste rapido.
- O fluxo oficial de compra em producao e feito por POST /api/checkout + webhook order/paid.

## Importacao

```typescript
import * as api from "@/lib/api";
// ou
import { getProducts, getCategories } from "@/lib/api";
```

## Produtos e Categorias

Funcoes principais:

- getProducts(params?)
- getProductById(id)
- getProductBySlug(slug)
- getProductsByCategory(categorySlug)
- searchProducts(query)
- getCategories()
- getCategoryBySlug(slug)

Exemplo:

```typescript
const products = await getProducts({ page: 1, per_page: 24 });
const category = await getCategoryBySlug("aneis");
```

## Carrinho (mock local)

Funcoes:

- getCartItems(userId)
- addToCart(userId, dto)
- updateCartItemQuantity(cartItemId, quantity)
- removeFromCart(cartItemId)
- clearCart(userId)
- getCartTotal(userId)

Observacao: essas funcoes nao persistem em banco; usam estrutura mock em memoria.

## Pedidos (mock local)

Funcoes:

- getOrders(userId)
- getOrderById(orderId, userId)
- createOrder(userId, dto)
- updateOrderStatus(orderId, status)
- cancelOrder(orderId, userId)

Observacao: essas funcoes sao utilitarias de mock para interface.

## Usuarios

Funcoes:

- getProfile(userId)
- updateProfile(userId, dto)
- getCurrentUser()

## Tipos exportados

```typescript
import type {
  Product,
  Category,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  Profile,
  CreateOrderDTO,
  UpdateProfileDTO,
  AddToCartDTO,
} from "@/lib/api";
```

## Fluxo oficial de compra (producao)

Nao use createOrder de mock para checkout real.

Para compra real:

1. Enviar itens para POST /api/checkout
2. Redirecionar para checkoutUrl da Nuvemshop
3. Aguardar webhook order/paid em /api/webhooks/nuvemshop
4. Consultar historico em GET /api/pedidos

## Tratamento de erros

Todas as funcoes podem lancar excecao. Use try/catch no consumo:

```typescript
try {
  const products = await getProducts();
} catch (error) {
  console.error(error);
}
```

## Nota de manutencao

Se o projeto migrar totalmente para APIs server-side sem mocks locais, este modulo deve ser simplificado para wrappers HTTP dedicados.
