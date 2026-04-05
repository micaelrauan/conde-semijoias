import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(params: {
  to: string;
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
}) {
  const { PedidoConfirmado } = await import("@/emails/PedidoConfirmado");
  const orderUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/meus-pedidos`;

  const { error } = await resend.emails.send({
    from: `Conde Semijoias <${process.env.RESEND_FROM_EMAIL}>`,
    to: params.to,
    subject: `Pedido #${params.orderId} confirmado!`,
    react: PedidoConfirmado({ ...params, orderUrl }),
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log("Confirmation email sent to:", params.to);
}
