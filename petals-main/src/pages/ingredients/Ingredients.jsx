import { useState } from "react";

const PRODUCTS = [
  {
    id: "hair",
    category: "Hair Care",
    emoji: "",
    accent: "#9860a0ff",
    accentLight: "#d8f3dc",
    accentText: "#431b43ff",
    items: [
      {
        id: "rice-water",
        name: "Rice Water Shampoo",
        tag: "Formula A",
        description: "Nourishes and strengthens hair with fermented rice water and natural botanicals.",
        benefits: ["Strengthens hair", "Hydrates scalp", "Reduces frizz"],
        emoji: "",
        ingredients: [
          { num: "01", name: "Rice Water", role: "" },
          { num: "02", name: "Flaxseed Gel", role: "" },
          { num: "03", name: "DM Water", role: "" },
          { num: "04", name: "D-Panthenol", role: "" },
          { num: "05", name: "Veg Glycerine", role: "" },
        ],
      },
      {
        id: "lice",
        name: "Lice & Nits Removal Shampoo",
        tag: "Formula B",
        description: "Powerful herbal blend that naturally eliminates lice and nits while soothing the scalp.",
        benefits: ["Removes lice & nits", "Soothes scalp", "Herbal & natural"],
        emoji: "",
        ingredients: [
          { num: "01", name: "Neem Leaf ", role: "" },
          { num: "02", name: "Curry Leaves", role: "" },
          { num: "03", name: "Hibiscus", role: "" },
          { num: "04", name: "Cloves", role: "" },
          { num: "05", name: "Fenugreek", role: "" },
          { num: "06", name: "Tea Tree Oil", role: "" },
          { num: "07", name: "Neem Oil", role: "" },
          { num: "08", name: "Rosemary Essential Oil", role: "" },
        ],
      },
    ],
  },
];

const styles = {
  page: {
    fontFamily: "'Lato', 'Segoe UI', sans-serif",
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    background: "linear-gradient(160deg, #f8fffe 0%, #f3f0ff 100%)",
    minHeight: "100vh",
  },
  hero: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: -1,
    // background: "linear-gradient(135deg, #2d6a4f 0%, #9b4dca 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 34,
    color: "#c681cfff",
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: 300,
  },
  tabs: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginBottom: "2rem",
  },
  tab: (active, accent, accentLight) => ({
    padding: "8px 24px",
    borderRadius: 50,
    border: `1.5px solid ${active ? accent : "#e0e0e0"}`,
    background: active ? accentLight : "white",
    color: active ? accent : "#666",
    fontWeight: active ? 700 : 400,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: (accent, accentLight, expanded) => ({
    background: "white",
    borderRadius: 16,
    border: `1px solid ${expanded ? accent : "#ebebeb"}`,
    overflow: "hidden",
    transition: "all 0.25s",
    cursor: "pointer",
    boxShadow: expanded ? `0 4px 24px ${accentLight}` : "0 1px 4px rgba(0,0,0,0.06)",
  }),
  cardHeader: (accent, accentLight) => ({
    background: accentLight,
    padding: "1.1rem 1.25rem 0.9rem",
    borderBottom: `1px solid ${accent}22`,
  }),
  cardTag: (accent, accentLight, accentText) => ({
    display: "inline-block",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "3px 10px",
    borderRadius: 20,
    background: accent,
    color: "white",
    marginBottom: 8,
  }),
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 1.3,
  },
  cardDesc: {
    fontSize: 12,
    color: "#666",
    lineHeight: 1.5,
  },
  benefits: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 10,
  },
  benefit: (accent, accentLight) => ({
    fontSize: 11,
    padding: "3px 9px",
    borderRadius: 20,
    background: "white",
    color: accent,
    border: `1px solid ${accent}44`,
    fontWeight: 600,
  }),
  ingredientsWrap: {
    padding: "0.8rem 1.25rem 1.25rem",
  },
  ingredientsTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#bbb",
    marginBottom: 10,
    marginTop: 4,
  },
  ingredientRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "7px 0",
    borderBottom: "0.5px solid #f0f0f0",
  },
  ingredientNum: (accent) => ({
    fontSize: 10,
    fontWeight: 800,
    color: accent,
    minWidth: 20,
    paddingTop: 1,
  }),
  ingredientName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#222",
    flex: 1,
  },
  ingredientRole: {
    fontSize: 11,
    color: "#999",
    marginTop: 1,
  },
  expandBtn: (accent) => ({
    width: "100%",
    padding: "10px",
    background: "transparent",
    border: "none",
    borderTop: "0.5px solid #f0f0f0",
    color: accent,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    fontFamily: "inherit",
    transition: "background 0.15s",
  }),
  footer: {
    textAlign: "center",
    marginTop: "2.5rem",
    fontSize: 12,
    color: "#bbb",
    fontStyle: "italic",
  },
  emojiIcon: {
    fontSize: 28,
    marginBottom: 6,
    display: "block",
  },
};

function ProductCard({ product, accent, accentLight, accentText }) {
  const [expanded, setExpanded] = useState(false);
  const showCount = expanded ? product.ingredients.length : 4;

  return (
    <div style={styles.card(accent, accentLight, expanded)} onClick={() => setExpanded(!expanded)}>
      <div style={styles.cardHeader(accent, accentLight)}>
        <span style={styles.emojiIcon}>{product.emoji}</span>
        <span style={styles.cardTag(accent, accentLight, accentText)}>{product.tag}</span>
        <div style={styles.cardTitle}>{product.name}</div>
        <div style={styles.cardDesc}>{product.description}</div>
        <div style={styles.benefits}>
          {product.benefits.map((b) => (
            <span key={b} style={styles.benefit(accent, accentLight)}>{b}</span>
          ))}
        </div>
      </div>

      <div style={styles.ingredientsWrap}>
        <div style={styles.ingredientsTitle}>
          {product.ingredients.length} Ingredients
        </div>
        {product.ingredients.slice(0, showCount).map((ing) => (
          <div key={ing.num} style={styles.ingredientRow}>
            <span style={styles.ingredientNum(accent)}>{ing.num}</span>
            <div style={{ flex: 1 }}>
              <div style={styles.ingredientName}>{ing.name}</div>
              {ing.role && <div style={styles.ingredientRole}>{ing.role}</div>}
            </div>
          </div>
        ))}
      </div>

      <button
        style={styles.expandBtn(accent)}
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
      >
        {expanded
          ? "▲ Show less"
          : `▼ Show all ${product.ingredients.length} ingredients`}
      </button>
    </div>
  );
}

export default function Ingredients() {
  const active = PRODUCTS[0];

  return (
<>

    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Hair Care Formulas</h1>
        <p style={styles.heroSub}>Natural Ingredient Collection</p>
      </div>

      <div style={styles.grid}>
        {active.items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            accent={active.accent}
            accentLight={active.accentLight}
            accentText={active.accentText}
          />
        ))}
      </div>

      <p style={styles.footer}>
        All formulas crafted with 100% natural botanicals · Click any card to expand
      </p>
    </div>
</>
  );
}