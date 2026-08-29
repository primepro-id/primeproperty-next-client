import type { Lead } from "@/lib/types";

type LeadWhatsappContact = Pick<Lead, "name" | "phone_number">;

function normalizeIndonesianMobileNumber(phoneNumber: string) {
  const trimmedPhoneNumber = phoneNumber.trim();
  if (!trimmedPhoneNumber || !/^\+?[\d\s()-]+$/.test(trimmedPhoneNumber)) {
    return null;
  }

  const digits = trimmedPhoneNumber.replace(/\D/g, "");
  const localNumber = digits.startsWith("62")
    ? digits.slice(2)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;

  if (!/^8\d{7,13}$/.test(localNumber)) {
    return null;
  }

  return `62${localNumber}`;
}

export function createLeadWhatsappUrl({
  name,
  phone_number,
}: LeadWhatsappContact) {
  const phoneNumber = normalizeIndonesianMobileNumber(phone_number);
  if (!phoneNumber) {
    return null;
  }

  const whatsappUrl = new URL("https://api.whatsapp.com/send");
  whatsappUrl.searchParams.set("phone", phoneNumber);
  whatsappUrl.searchParams.set(
    "text",
    `Halo ${name.trim()}, saya dari PrimePro Indonesia. Kami menghubungi Anda terkait permintaan informasi properti yang Anda kirimkan. Apakah ada yang bisa kami bantu?`,
  );

  return whatsappUrl.toString();
}
