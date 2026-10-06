/* ════════════════════════════════════════════════
   Shipping-rate calculator — PIN code based
   Single source of truth for all shipping zones.

   Zone rules:
     Chennai city    600001–600119  →  ₹50
     Tamil Nadu rest 600120–638999  →  ₹90
     Kerala major    (see list)     →  ₹90
     Kerala villages (rest of 67x-69x) → ₹110
     Karnataka       560001–591999  →  ₹90
     Rest of India   everything else → ₹150
   ════════════════════════════════════════════════ */

/**
 * PIN prefixes (first 3 digits) for Kerala's major cities / towns → ₹90
 * Everything else in 670–695 range → ₹110
 */
const KERALA_MAJOR_CITY_PREFIXES = new Set([
  // Thiruvananthapuram
  695, 694,
  // Kollam
  691,
  // Pathanamthitta / Alappuzha
  689, 688,
  // Kottayam
  686,
  // Ernakulam / Kochi
  682, 683, 684,
  // Thrissur
  680, 679,
  // Palakkad
  678,
  // Malappuram
  676,
  // Kozhikode
  673,
  // Wayanad
  670,
  // Kannur
  670, 671, 672,
  // Kasaragod
  671,
  // Idukki
  685,
]);

/**
 * Calculate shipping charge from a 6-digit Indian PIN code.
 *
 * @param {string|number} pin - The 6-digit PIN code
 * @returns {{ charge: number, zone: string }} shipping charge in ₹ and zone label
 */
export const getShippingByPin = (pin) => {
  if (!pin) return { charge: 0, zone: "" };

  const cleaned = String(pin).replace(/\s/g, "");
  if (!/^\d{6}$/.test(cleaned)) return { charge: 0, zone: "" };

  const num = parseInt(cleaned, 10);
  const prefix3 = Math.floor(num / 1000); // first 3 digits

  // ── Chennai city (600001–600119) ──
  if (num >= 600001 && num <= 600119) {
    return { charge: 50, zone: "Chennai" };
  }

  // ── Tamil Nadu rest (600120–638999) ──
  if (num >= 600120 && num <= 638999) {
    return { charge: 90, zone: "Tamil Nadu" };
  }

  // ── Karnataka (560001–591999) ──
  if (num >= 560001 && num <= 591999) {
    return { charge: 90, zone: "Karnataka" };
  }

  // ── Kerala (670001–695999) ──
  if (num >= 670001 && num <= 695999) {
    if (KERALA_MAJOR_CITY_PREFIXES.has(prefix3)) {
      return { charge: 90, zone: "Kerala" };
    }
    return { charge: 110, zone: "Kerala (village/town)" };
  }

  // ── Rest of India ──
  return { charge: 150, zone: "Rest of India" };
};
