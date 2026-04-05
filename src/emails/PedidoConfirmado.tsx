import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  customerName: string;
  orderId: number;
  total: string;
  products: { name: string; quantity: number; price: string; image?: string }[];
  shippingAddress?: {
    address: string;
    city: string;
    province: string;
    zipcode: string;
  };
  orderUrl: string;
}

export function PedidoConfirmado({
  customerName,
  orderId,
  total,
  products,
  shippingAddress,
  orderUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f8fafc", padding: "24px 0" }}>
        <Container
          style={{
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "24px",
          }}
        >
          <Section>
            <Text style={{ color: "#670006", margin: 0, letterSpacing: "1px" }}>
              CONDE SEMIJOIAS
            </Text>
            <Heading
              as="h1"
              style={{ margin: "8px 0 0", fontSize: "24px", fontWeight: 500 }}
            >
              Confirmacao de Pedido
            </Heading>
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Text style={{ margin: 0 }}>Ola, {customerName}! 🎉</Text>
            <Text style={{ margin: "12px 0 0" }}>
              Seu pedido #{orderId} foi confirmado. Assim que despachado, voce
              recebera o codigo de rastreio.
            </Text>
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Heading as="h2" style={{ fontSize: "18px", margin: 0 }}>
              Itens do Pedido
            </Heading>

            {products.map((item, i) => (
              <Row key={`${item.name}-${i}`} style={{ marginTop: "12px" }}>
                <Column width="70">
                  {item.image ? (
                    <Img
                      src={item.image}
                      alt={item.name}
                      width="60"
                      height="60"
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        backgroundColor: "#f3f4f6",
                      }}
                    />
                  )}
                </Column>
                <Column>
                  <Text style={{ margin: 0 }}>{item.name}</Text>
                  <Text style={{ margin: "6px 0 0", color: "#6b7280" }}>
                    Qtd: {item.quantity} · R$ {item.price}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />

            <Row>
              <Column>
                <Text style={{ margin: 0, color: "#6b7280" }}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={{ margin: 0, fontSize: "20px" }}>R$ {total}</Text>
              </Column>
            </Row>
          </Section>

          {shippingAddress && (
            <Section style={{ marginTop: "20px" }}>
              <Heading as="h2" style={{ fontSize: "18px", margin: 0 }}>
                Endereco de Entrega
              </Heading>
              <Text style={{ margin: "8px 0 0" }}>
                {shippingAddress.address}
                <br />
                {shippingAddress.city} - {shippingAddress.province}
                <br />
                CEP {shippingAddress.zipcode}
              </Text>
            </Section>
          )}

          <Section style={{ marginTop: "24px" }}>
            <Link
              href={orderUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#111827",
                color: "#ffffff",
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "10px",
              }}
            >
              VER MEU PEDIDO
            </Link>
          </Section>

          <Text
            style={{ marginTop: "20px", color: "#6b7280", fontSize: "12px" }}
          >
            Conde Semijoias · Duvidas? Fale conosco
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
