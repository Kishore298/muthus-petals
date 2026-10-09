/* ════════════════════════════════════════════════
   Shipping-rate calculator — PIN code based (API)
   Uses api.postalpincode.in to fetch State/District accurately.
   ════════════════════════════════════════════════ */

/**
 * Calculate shipping charge from a 6-digit Indian PIN code using Postal API.
 *
 * @param {string|number} pin - The 6-digit PIN code
 * @returns {Promise<{ charge: number, zone: string }>}
 */
export const getShippingByPin = async (pin) => {
  if (!pin) return { charge: 0, zone: "" };

  const cleaned = String(pin).replace(/\s/g, "");
  if (!/^\d{6}$/.test(cleaned)) return { charge: 0, zone: "" };

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`);
    const data = await response.json();

    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
      // Often a PIN has multiple post offices, we take the first one
      const po = data[0].PostOffice[0];
      const state = po.State.toLowerCase();
      const district = po.District.toLowerCase();
      const branchType = po.BranchType.toLowerCase();
      const name = po.Name;

      // ── Tamil Nadu ──
      if (state === "tamil nadu" || state === "tamilnadu") {
        if (district === "chennai" || cleaned.startsWith("600")) {
          return { charge: 50, zone: `Chennai (${name})` };
        }
        return { charge: 90, zone: `Tamil Nadu (${name})` };
      }

      // ── Karnataka ──
      if (state === "karnataka") {
        return { charge: 90, zone: `Karnataka (${name})` };
      }

      // ── Kerala ──
      if (state === "kerala") {
        // "Branch Post Office" generally covers rural / inner villages
        // "Sub Post Office" and "Head Post Office" are for cities/towns
        if (branchType.includes("branch")) {
          return { charge: 110, zone: `Kerala Village (${name})` };
        }
        return { charge: 90, zone: `Kerala City/Town (${name})` };
      }

      // ── Rest of India ──
      return { charge: 150, zone: `${po.State} (${name})` };
    }
  } catch (error) {
    console.error("Postal API error:", error);
  }

  // Fallback if API is down or PIN is missing in API (basic ranges)
  const num = parseInt(cleaned, 10);
  if (num >= 600001 && num <= 600119) return { charge: 50, zone: "Chennai (Fallback)" };
  if (num >= 600120 && num <= 649999) return { charge: 90, zone: "Tamil Nadu (Fallback)" };
  if (num >= 560001 && num <= 591999) return { charge: 90, zone: "Karnataka (Fallback)" };
  if (num >= 670001 && num <= 695999) return { charge: 110, zone: "Kerala (Fallback)" };
  
  return { charge: 150, zone: "Rest of India (Fallback)" };
};
