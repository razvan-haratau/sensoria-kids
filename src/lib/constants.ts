export const AGE_COLORS: Record<string, string> = {
  '2-4': 'bg-[#F4A68F]/20 text-[#E08870]',
  '4-6': 'bg-[#5BC4C0]/20 text-[#3EA8A4]',
  '6-8': 'bg-[#B07CC6]/20 text-[#8A5EAA]',
  '8-10': 'bg-[#E86B9E]/20 text-[#D04D82]',
}

export const DIFF_COLORS: Record<string, string> = {
  Ușor: 'bg-green-100 text-green-700',
  Mediu: 'bg-yellow-100 text-yellow-700',
  Avansat: 'bg-red-100 text-red-700',
}

// Romanian phone validation: 07xxxxxxxx, +407xxxxxxxx, 004 07xxxxxxxx etc.
export function isValidRomanianPhone(phone: string): boolean {
  return /^(\+40|0040|0)\s?7\d{2}\s?\d{3}\s?\d{3}$/.test(phone.trim())
}
