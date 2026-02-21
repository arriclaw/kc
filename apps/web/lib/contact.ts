export type ContactInfo = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function contactLinks(contact: ContactInfo) {
  const email = (contact.email || "").trim();
  const phone = (contact.phone || "").trim();
  const whatsapp = (contact.whatsapp || phone).trim();

  const telDigits = phone ? digitsOnly(phone) : "";
  const waDigits = whatsapp ? digitsOnly(whatsapp) : "";

  return {
    emailHref: email ? `mailto:${email}` : null,
    phoneHref: telDigits ? `tel:+${telDigits}` : null,
    whatsappHref: waDigits ? `https://wa.me/${waDigits}` : null
  };
}
