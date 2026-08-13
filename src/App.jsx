import React, { useMemo, useState } from "react";

export default function App() {
  const [currency, setCurrency] = useState("€");

  const [form, setForm] = useState({
    productName: "",
    unitPrice: "",
    quantity: "1",
    shipping: "",
    customs: "",
    vat: "",
    otherFees: "",
    sellingPrice: "",
  });

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const number = (value) => {
    const n = parseFloat(String(value).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const calculations = useMemo(() => {
    const unitPrice = number(form.unitPrice);
    const quantity = Math.max(1, number(form.quantity));
    const shipping = number(form.shipping);
    const customs = number(form.customs);
    const vat = number(form.vat);
    const otherFees = number(form.otherFees);
    const sellingPrice = number(form.sellingPrice);

    const productsTotal = unitPrice * quantity;
    const totalCost = productsTotal + shipping + customs + vat + otherFees;
    const costPerUnit = totalCost / quantity;

    const revenue = sellingPrice * quantity;
    const profit = revenue - totalCost;

    const margin =
      sellingPrice > 0 ? (profit / revenue) * 100 : 0;

    const markup =
      costPerUnit > 0
        ? ((sellingPrice - costPerUnit) / costPerUnit) * 100
        : 0;

    return {
      quantity,
      productsTotal,
      totalCost,
      costPerUnit,
      revenue,
      profit,
      margin,
      markup,
    };
  }, [form]);

  const money = (value) =>
    `${value.toFixed(2).replace(".", ",")} ${currency}`;

  const reset = () => {
    setForm({
      productName: "",
      unitPrice: "",
      quantity: "1",
      shipping: "",
      customs: "",
      vat: "",
      otherFees: "",
      sellingPrice: "",
    });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>Margeo</div>
          <div style={styles.subtitle}>
            Calculateur de coûts & de marge
          </div>
        </div>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={styles.currency}
        >
          <option value="€">EUR €</option>
          <option value="$">USD $</option>
          <option value="£">GBP £</option>
        </select>
      </header>

      <main style={styles.container}>
        <section style={styles.hero}>
          <div>
            <span style={styles.badge}>V1</span>
            <h1 style={styles.title}>
              Calcule ta vraie marge
            </h1>
            <p style={styles.heroText}>
              Prends en compte le prix d'achat, la livraison,
              les douanes et les autres frais.
            </p>
          </div>
        </section>

        <div style={styles.grid}>
          {/* PRODUIT */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.icon}>📦</div>
              <div>
                <h2 style={styles.cardTitle}>Produit</h2>
                <p style={styles.cardDescription}>
                  Informations sur ton achat
                </p>
              </div>
            </div>

            <Field
              label="Nom du produit"
              placeholder="Ex : T-shirt Nike"
              value={form.productName}
              onChange={(v) => update("productName", v)}
            />

            <div style={styles.twoColumns}>
              <Field
                label="Prix unitaire"
                placeholder="0,00"
                type="number"
                value={form.unitPrice}
                onChange={(v) => update("unitPrice", v)}
              />

              <Field
                label="Quantité"
                placeholder="1"
                type="number"
                value={form.quantity}
                onChange={(v) => update("quantity", v)}
              />
            </div>

            <div style={styles.infoBox}>
              <span>Prix total des produits</span>
              <strong>
                {money(calculations.productsTotal)}
              </strong>
            </div>
          </section>

          {/* FRAIS */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.icon}>💳</div>
              <div>
                <h2 style={styles.cardTitle}>Frais</h2>
                <p style={styles.cardDescription}>
                  Tous les coûts supplémentaires
                </p>
              </div>
            </div>

            <Field
              label="Frais de livraison"
              placeholder="0,00"
              type="number"
              value={form.shipping}
              onChange={(v) => update("shipping", v)}
              suffix={currency}
            />

            <Field
              label="Frais de douane"
              placeholder="0,00"
              type="number"
              value={form.customs}
              onChange={(v) => update("customs", v)}
              suffix={currency}
            />

            <Field
              label="TVA / taxes"
              placeholder="0,00"
              type="number"
              value={form.vat}
              onChange={(v) => update("vat", v)}
              suffix={currency}
            />

            <Field
              label="Autres frais"
              placeholder="0,00"
              type="number"
              value={form.otherFees}
              onChange={(v) => update("otherFees", v)}
              suffix={currency}
            />
          </section>

          {/* VENTE */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.icon}>🏷️</div>
              <div>
                <h2 style={styles.cardTitle}>Vente</h2>
                <p style={styles.cardDescription}>
                  Définis ton prix de vente
                </p>
              </div>
            </div>

            <Field
              label="Prix de vente unitaire"
              placeholder="0,00"
              type="number"
              value={form.sellingPrice}
              onChange={(v) => update("sellingPrice", v)}
              suffix={currency}
            />

            <div style={styles.priceSuggestion}>
              <div>
                <span style={styles.smallLabel}>
                  Coût réel par unité
                </span>
                <strong style={styles.bigNumber}>
                  {money(calculations.costPerUnit)}
                </strong>
              </div>

              <div style={styles.arrow}>→</div>

              <div>
                <span style={styles.smallLabel}>
                  Prix de vente
                </span>
                <strong style={styles.bigNumber}>
                  {money(number(form.sellingPrice))}
                </strong>
              </div>
            </div>
          </section>

          {/* RESULTATS */}
          <section style={{ ...styles.card, ...styles.resultCard }}>
            <div style={styles.cardHeader}>
              <div style={styles.icon}>📊</div>
              <div>
                <h2 style={styles.cardTitle}>Résultats</h2>
                <p style={styles.cardDescription}>
                  Ta rentabilité en un coup d'œil
                </p>
              </div>
            </div>

            <div style={styles.resultsGrid}>
              <Result
                label="Coût total"
                value={money(calculations.totalCost)}
              />

              <Result
                label="Coût par unité"
                value={money(calculations.costPerUnit)}
              />

              <Result
                label="Chiffre d'affaires"
                value={money(calculations.revenue)}
              />

              <Result
                label="Bénéfice total"
                value={money(calculations.profit)}
                highlight
              />
            </div>

            <div style={styles.marginBox}>
              <div>
                <span style={styles.marginLabel}>
                  Marge
                </span>
                <strong style={styles.marginValue}>
                  {calculations.margin.toFixed(1)} %
                </strong>
              </div>

              <div>
                <span style={styles.marginLabel}>
                  Taux de marque
                </span>
                <strong style={styles.marginValue}>
                  {calculations.margin.toFixed(1)} %
                </strong>
              </div>

              <div>
                <span style={styles.marginLabel}>
                  Taux de marge
                </span>
                <strong style={styles.marginValue}>
                  {calculations.markup.toFixed(1)} %
                </strong>
              </div>
            </div>
          </section>
        </div>

        <section style={styles.summary}>
          <div>
            <span style={styles.summaryLabel}>
              {form.productName || "Ton produit"}
            </span>
            <strong style={styles.summaryTitle}>
              Résumé de l'opération
            </strong>
          </div>

          <div style={styles.summaryStats}>
            <div>
              <span>Quantité</span>
              <strong>{calculations.quantity}</strong>
            </div>

            <div>
              <span>Coût total</span>
              <strong>{money(calculations.totalCost)}</strong>
            </div>

            <div>
              <span>Bénéfice</span>
              <strong>{money(calculations.profit)}</strong>
            </div>
          </div>
        </section>

        <button onClick={reset} style={styles.resetButton}>
          ↻ Réinitialiser le calcul
        </button>
      </main>

      <footer style={styles.footer}>
        Margeo · Calculateur de marge · V1
      </footer>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  suffix,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <div style={styles.inputWrapper}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
          min={type === "number" ? "0" : undefined}
          step={type === "number" ? "0.01" : undefined}
        />

        {suffix && (
          <span style={styles.suffix}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Result({ label, value, highlight }) {
  return (
    <div
      style={{
        ...styles.result,
        ...(highlight ? styles.highlightResult : {}),
      }}
    >
      <span style={styles.resultLabel}>{label}</span>
      <strong style={styles.resultValue}>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    color: "#172033",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "18px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontSize: "25px",
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#718096",
    fontSize: "13px",
    marginTop: "2px",
  },

  currency: {
    border: "1px solid #d9dee8",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    fontWeight: 600,
    outline: "none",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "28px 18px 50px",
  },

  hero: {
    background:
      "linear-gradient(135deg, #111827 0%, #263449 100%)",
    borderRadius: "22px",
    padding: "32px",
    color: "#ffffff",
    marginBottom: "22px",
    boxShadow: "0 15px 40px rgba(15,23,42,0.12)",
  },

  badge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 5vw, 42px)",
    letterSpacing: "-1.5px",
  },

  heroText: {
    margin: "10px 0 0",
    color: "#cbd5e1",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "650px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
  },

  resultCard: {
    gridColumn: "span 1",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  icon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 750,
  },

  cardDescription: {
    margin: "3px 0 0",
    color: "#7b8494",
    fontSize: "12px",
  },

  field: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 650,
    marginBottom: "7px",
    color: "#374151",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d9dee8",
    borderRadius: "10px",
    background: "#ffffff",
    overflow: "hidden",
  },

  input: {
    width: "100%",
    minWidth: 0,
    border: 0,
    outline: 0,
    padding: "12px",
    fontSize: "15px",
    background: "transparent",
    color: "#172033",
    boxSizing: "border-box",
  },

  suffix: {
    paddingRight: "12px",
    color: "#7b8494",
    fontWeight: 600,
    fontSize: "13px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  infoBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "13px",
    color: "#64748b",
  },

  priceSuggestion: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  smallLabel: {
    display: "block",
    fontSize: "11px",
    color: "#7b8494",
    marginBottom: "4px",
  },

  bigNumber: {
    fontSize: "18px",
  },

  arrow: {
    fontSize: "22px",
    color: "#94a3b8",
  },

  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  result: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "14px",
  },

  highlightResult: {
    background: "#ecfdf5",
  },

  resultLabel: {
    display: "block",
    color: "#718096",
    fontSize: "11px",
    marginBottom: "5px",
  },

  resultValue: {
    fontSize: "17px",
  },

  marginBox: {
    marginTop: "14px",
    padding: "16px",
    borderRadius: "14px",
    background: "#111827",
    color: "#ffffff",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },

  marginLabel: {
    display: "block",
    color: "#9ca3af",
    fontSize: "10px",
    marginBottom: "4px",
  },

  marginValue: {
    fontSize: "18px",
  },

  summary: {
    marginTop: "20px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  summaryLabel: {
    display: "block",
    color: "#7b8494",
    fontSize: "12px",
    marginBottom: "4px",
  },

  summaryTitle: {
    fontSize: "18px",
  },

  summaryStats: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
  },

  summaryStatsItem: {
    display: "flex",
    flexDirection: "column",
  },

  resetButton: {
    marginTop: "18px",
    width: "100%",
    border: "1px solid #d9dee8",
    background: "#ffffff",
    color: "#374151",
    borderRadius: "12px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 650,
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    padding: "25px",
    color: "#8a94a6",
    fontSize: "12px",
  },
};
