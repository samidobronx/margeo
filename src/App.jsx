import  React, { useState } from "react";

export default function App() {
  const [prixAchat, setPrixAchat] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [quantite, setQuantite] = useState("1");

  const achat = Number(prixAchat) || 0;
  const vente = Number(prixVente) || 0;
  const qte = Number(quantite) || 1;

  const margeUnitaire = vente - achat;
  const margeTotale = margeUnitaire * qte;
  const tauxMarge = achat > 0 ? (margeUnitaire / achat) * 100 : 0;
  const tauxMarque = vente > 0 ? (margeUnitaire / vente) * 100 : 0;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Margeo</h1>
        <p style={styles.subtitle}>
          Calculateur de marge simple et rapide
        </p>

        <div style={styles.card}>
          <label style={styles.label}>Prix d'achat (€)</label>
          <input
            style={styles.input}
            type="number"
            step="0.01"
            placeholder="Ex : 10"
            value={prixAchat}
            onChange={(e) => setPrixAchat(e.target.value)}
          />

          <label style={styles.label}>Prix de vente (€)</label>
          <input
            style={styles.input}
            type="number"
            step="0.01"
            placeholder="Ex : 25"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
          />

          <label style={styles.label}>Quantité</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
        </div>

        <div style={styles.resultCard}>
          <div style={styles.mainResult}>
            <span>Marge totale</span>
            <strong style={styles.bigNumber}>
              {margeTotale.toFixed(2)} €
            </strong>
          </div>

          <div style={styles.results}>
            <div style={styles.result}>
              <span>Marge unitaire</span>
              <strong>{margeUnitaire.toFixed(2)} €</strong>
            </div>

            <div style={styles.result}>
              <span>Taux de marge</span>
              <strong>{tauxMarge.toFixed(1)} %</strong>
            </div>

            <div style={styles.result}>
              <span>Taux de marque</span>
              <strong>{tauxMarque.toFixed(1)} %</strong>
            </div>
          </div>
        </div>

        <p style={styles.formula}>
          Marge = Prix de vente − Prix d'achat
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px 16px",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  container: {
    maxWidth: "600px",
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    fontSize: "42px",
    margin: "10px 0 5px",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "30px",
    fontSize: "16px",
  },

  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "16px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "17px",
  },

  resultCard: {
    marginTop: "20px",
    background: "#111827",
    color: "white",
    padding: "24px",
    borderRadius: "18px",
  },

  mainResult: {
    textAlign: "center",
    paddingBottom: "20px",
    borderBottom: "1px solid #374151",
  },

  bigNumber: {
    display: "block",
    fontSize: "32px",
    marginTop: "8px",
  },

  results: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "15px",
    marginTop: "20px",
  },

  result: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1f2937",
    padding: "15px",
    borderRadius: "10px",
  },

  formula: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "20px",
  },
};
