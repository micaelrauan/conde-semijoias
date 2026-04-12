export interface WhatsappParseResult {
  ok: boolean;
  normalized?: string;
  error?: string;
}

/**
 * Normaliza telefone para E.164 brasileiro (+55...).
 */
export function parseWhatsapp(input: string): WhatsappParseResult {
  const digits = input.replace(/\D/g, "");

  if (!digits) {
    return { ok: false, error: "Informe um numero de WhatsApp." };
  }

  let localDigits = digits;

  if (localDigits.startsWith("55")) {
    localDigits = localDigits.slice(2);
  }

  if (localDigits.length < 10 || localDigits.length > 11) {
    return {
      ok: false,
      error: "Numero invalido. Use DDD + numero, ex: (85) 99999-9999.",
    };
  }

  return { ok: true, normalized: `+55${localDigits}` };
}

export function formatWhatsapp(normalized: string): string {
  const digits = normalized.replace(/\D/g, "");

  if (!digits.startsWith("55")) {
    return normalized;
  }

  const local = digits.slice(2);
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }

  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }

  return normalized;
}
