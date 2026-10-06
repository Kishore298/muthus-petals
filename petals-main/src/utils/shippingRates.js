/* ════════════════════════════════════════════════
   Shipping-rate calculator — single source of truth
   ════════════════════════════════════════════════ */

// ── Zone 1: Chennai (₹50) ──
const CHENNAI = new Set([
  "chennai",
]);

// ── Zone 2: Tamil Nadu other cities & districts (₹90) ──
const TAMILNADU_CITIES = new Set([
  "kancheepuram", "chengalpattu", "tiruvallur", "tambaram", "avadi",
  "ambattur", "chromepet", "porur", "medavakkam", "sholinganallur",
  "karaikudi", "ramnad", "sivagangai", "virudhunagar",
  "vellore", "ranipet", "tirupattur", "tiruvannamalai",
  "villupuram", "kallakurichi", "cuddalore",
  "salem", "namakkal", "dharmapuri", "krishnagiri",
  "coimbatore", "tiruppur", "erode",
  "the nilgiris", "nilgiris", "ooty",
  "tiruchirappalli", "trichy", "karur", "perambalur", "ariyalur",
  "thanjavur", "tiruvarur", "nagapattinam", "mayiladuthurai", "pudukkottai",
  "madurai", "dindigul", "theni", "sivaganga",
  "ramanathapuram", "thoothukudi", "tuticorin",
  "tirunelveli", "tenkasi", "kanyakumari",
  "hosur", "kumbakonam", "nagercoil", "pollachi", "arani",
  "pondicherry", "puducherry",
]);

// ── Zone 3: Kerala major cities & towns (₹90) ──
const KERALA_CITIES = new Set([
  "thiruvananthapuram", "trivandrum",
  "kochi", "ernakulam", "cochin",
  "kozhikode", "calicut",
  "thrissur", "trichur",
  "kollam", "quilon",
  "alappuzha", "alleppey",
  "palakkad", "palghat",
  "kannur", "cannanore",
  "malappuram",
  "kottayam",
  "pathanamthitta",
  "idukki",
  "wayanad",
  "kasaragod",
  "guruvayur", "munnar", "thekkady",
  "perinthalmanna", "manjeri", "tirur",
  "thalassery", "vatakara", "payyanur",
  "attingal", "neyyattinkara", "nedumangad",
  "changanassery", "pala", "thodupuzha",
  "aluva", "angamaly", "perumbavoor", "muvattupuzha",
  "kayamkulam", "mavelikkara", "cherthala",
  "ottapalam", "shornur", "chittur",
  "irinjalakuda", "chalakudy", "kodungallur",
]);

// ── Zone 4: Karnataka major cities & towns (₹90) ──
const KARNATAKA_CITIES = new Set([
  "bengaluru", "bangalore",
  "mysuru", "mysore",
  "mangaluru", "mangalore",
  "hubli", "dharwad", "hubballi",
  "belgaum", "belagavi",
  "gulbarga", "kalaburagi",
  "davanagere", "davangere",
  "bellary", "ballari",
  "shimoga", "shivamogga",
  "tumkur", "tumakuru",
  "raichur",
  "bidar",
  "hassan",
  "mandya",
  "udupi",
  "chikmagalur", "chikkamagaluru",
  "chitradurga",
  "kolar",
  "ramanagara",
  "bagalkot",
  "gadag",
  "haveri",
  "kodagu", "coorg",
  "koppal",
  "yadgir",
  "chamarajanagar",
  "vijayapura", "bijapur",
  "karwar",
  "hospet", "hosapete",
  "robertson pet",
]);

// ── Zone 5 identifiers: Kerala & Karnataka state names (for fallback ₹110) ──
const KERALA_KARNATAKA_STATE = new Set([
  "kerala", "karnataka",
]);

/**
 * Calculate shipping charge based on city / district name.
 *
 * Priority:
 *  1. Chennai  →  ₹50
 *  2. Other Tamil Nadu cities  →  ₹90
 *  3. Kerala major cities/towns  →  ₹90
 *  4. Karnataka major cities/towns  →  ₹90
 *  5. "kerala" or "karnataka" typed as-is (or any unrecognised Kerala/Karnataka village)  →  ₹110
 *  6. Everything else (North India / rest)  →  ₹150
 *
 * @param {string} cityName - City / district entered by the customer
 * @returns {number} shipping charge in ₹
 */
export const getShippingCharge = (cityName) => {
  if (!cityName || !cityName.trim()) return 0;
  const key = cityName.trim().toLowerCase();

  if (CHENNAI.has(key)) return 50;
  if (TAMILNADU_CITIES.has(key)) return 90;
  if (KERALA_CITIES.has(key)) return 90;
  if (KARNATAKA_CITIES.has(key)) return 90;
  if (KERALA_KARNATAKA_STATE.has(key)) return 110;

  // Fallback → North India / rest of India
  return 150;
};

/**
 * Flat list of all known city names (title-cased) for autocomplete UIs.
 */
export const ALL_LOCATIONS = [
  ...CHENNAI,
  ...TAMILNADU_CITIES,
  ...KERALA_CITIES,
  ...KARNATAKA_CITIES,
].map((loc) => loc.replace(/\b\w/g, (c) => c.toUpperCase()));
