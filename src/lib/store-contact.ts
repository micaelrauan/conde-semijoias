export const STORE_WHATSAPP_NUMBER = "5585998395280";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
