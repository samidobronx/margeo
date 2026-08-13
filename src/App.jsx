import React, { useMemo, useState } from "react";

export default function App() {
  const [prixAchat, setPrixAchat] = useState("");
  const [quantite, setQuantite] = useState("1");
  const [livraison, setLivraison] = useState("");
  const [douane, setDouane] = useState("");
  const [tva, setTva] = useState("");
  const [emballage, setEmballage] = useState("");
  const [autresFrais, setAutresFrais] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [fraisPlateforme, setFraisPlateforme] = useState("");
  const [fraisPaiement, setFraisPaiement] = useState("");
  const [margeCible, setMargeCible] = useState("30");

  const n = (value) => Number(value) || 0;

  const resultats = useMemo(() => {
    const achat = n(prixAchat);
    const qte = Math.max(n(quantite), 1);

    const livraisonTotal = n(livraison);
    const douaneTotal = n(douane);
    const emballageUnitaire = n(emballage);
    const autresFraisTotal = n(autresFrais);

    const sousTotalImport =
      achat * qte +
      livraisonTotal +
      douaneTotal +
      autresFraisTotal;

    const tvaMontant = sousTotalImport * (n(tva) / 100);

    const coutTotal =
      sousTotalImport +
      tvaMontant +
      emballageUnitaire * qte;

    const coutUnitaire = coutTotal / qte;

    const venteUnitaire = n(prixVente);

    const plateformeMontant =
      venteUnitaire * (n(fraisPlateforme) / 100);

    const paiementMontant = n(fraisPaiement);

    const coutVenteUnitaire =
      coutUnitaire + plateformeMontant + paiementMontant;

    const beneficeUnitaire =
      venteUnitaire - coutVenteUnitaire;

    const beneficeTotal = beneficeUnitaire * qte;

    const margePourcentage =
      venteUnitaire > 0
        ? (beneficeUnitaire / venteUnitaire) * 100
        : 0;

    const prixRecommande =
      margeCible < 100
        ? coutUnitaire /
          (1 - n(margeCible) / 100)
        : 0;

    return {
      qte,
      coutTotal,
      coutUnitaire,
      plateformeMontant,
      paiementMontant,
      coutVenteUnitaire,
      beneficeUnitaire,
      beneficeTotal,
      margePourcentage,
      prixRecommande,
    };
  }, [
    prixAchat,
    quantite,
    livraison,
    douane,
    tva,
    emballage,
    autresFrais,
    prixVente,
    fraisPlateforme,
    fraisPaiement,
    margeCible,
  ]);

  const reset = () => {
    setPrixAchat("");
    setQuantite("1");
    setLivraison("");
    setDouane("");
    setTva("");
    setEmballage("");
    setAutresFrais("");
    setPrixVente("");
    setFraisPlateforme("");
    setFraisPaiement("");
    setMargeCible("30");
  };

  const money = (value) => `${value.toFixed(2)} €`;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.logo}>Margeo</div>
            <p style={styles.subtitle}>
              Calcule le vrai coût de tes produits et ta rentabilité.
            </p>
          </div>

          <button style={styles.resetButton} onClick={reset}>
            Réinitialiser
          </button>
        </header>

        <section style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>1. Achat</h2>

            <Field
              label="Prix d'achat unitaire"
              value={prixAchat}
              onChange={setPrixAchat}
              placeholder="Ex : 8"
            />

            <Field
              label="Quantité"
              value={quantite}
              onChange={setQuantite}
              placeholder="Ex : 50"
            />
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>2. Import & frais</h2>

            <Field
              label="Livraison totale"
              value={livraison}
              onChange={setLivraison}
              placeholder="Ex : 30"
            />

            <Field
              label="Douane / droits"
              value={douane}
              onChange={setDouane}
              placeholder="Ex : 15"
            />

            <Field
              label="TVA / taxes (%)"
              value={tva}
              onChange={setTva}
              placeholder="Ex : 20"
            />

            <Field
              label="Emballage / unité"
              value={emballage}
              onChange={setEmballage}
              placeholder="Ex : 0.30"
            />

            <Field
              label="Autres frais"
              value={autresFrais}
              onChange={setAutresFrais}
              placeholder="Ex : 10"
            />
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>3. Vente</h2>

            <Field
              label="Prix de vente unitaire"
              value={prixVente}
              onChange={setPrixVente}
              placeholder="Ex : 19.90"
            />

            <Field
              label="Frais plateforme (%)"
              value={fraisPlateforme}
              onChange={setFraisPlateforme}
              placeholder="Ex : 5"
            />

            <Field
              label="Frais de paiement / unité"
              value={fraisPaiement}
              onChange={setFraisPaiement}
              placeholder="Ex : 0.50"
            />

            <Field
              label="Marge cible (%)"
              value={margeCible}
              onChange={setMargeCible}
              placeholder="Ex : 30"
            />
          </div>
        </section>

        <section style={styles.resultsCard}>
          <h2 style={styles.resultsTitle}>Résultats</h2>

          <div style={styles.heroResult}>
            <span style={styles.heroLabel}>Bénéfice total</span>
            <strong style={styles.heroNumber}>
              {money(resultats.beneficeTotal)}
            </strong>
          </div>

          <div style={styles.resultGrid}>
            <Result
              title="Coût réel / unité"
              value={money(resultats.coutUnitaire)}
            />

            <Result
              title="Coût avec frais de vente"
              value={money(resultats.coutVenteUnitaire)}
            />

            <Result
              title="Bénéfice / unité"
              value={money(resultats.beneficeUnitaire)}
            />

            <Result
              title="Marge"
              value={`${resultats.margePourcentage.toFixed(1)} %`}
            />

            <Result
              title="Prix recommandé"
              value={money(resultats.prixRecommande)}
            />

            <Result
              title="Frais plateforme"
              value={money(resultats.plateformeMontant)}
            />
          </div>
        </section>

        <div style={styles.info}>
          <strong>Comment Margeo calcule :</strong>
          <br />
          Achat + livraison + douane + taxes + emballage + autres
          frais = coût réel du produit.
        </div>

        <footer style={styles.footer}>
          Margeo — Calculateur de rentabilité
        </footer>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <input
        style={styles.input}
        type="number"
        step="0.01"
        min="0"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Result({ title, value }) {
  return (
    <div style={styles.result}>
      <span style={styles.resultTitle}>{title}</span>
      <strong style={styles.resultValue}>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "24px 16px 50px",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#172033",
  },

  container: {
    maxWidth: "1050px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  logo: {
    fontSize: "38px",
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#667085",
    fontSize: "16px",
  },

  resetButton: {
    border: "1px solid #d0d5dd",
    background: "#ffffff",
    color: "#344054",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 4px 18px rgba(16,24,40,0.06)",
  },

  cardTitle: {
    margin: "0 0 18px",
    fontSize: "20px",
  },

  field: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#344054",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "16px",
    outline: "none",
    background: "#ffffff",
  },

  resultsCard: {
    marginTop: "20px",
    background: "#172033",
    color: "#ffffff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 8px 30px rgba(16,24,40,0.12)",
  },

  resultsTitle: {
    margin: "0 0 20px",
    fontSize: "23px",
  },

  heroResult: {
    textAlign: "center",
    padding: "24px",
    borderRadius: "14px",
    background: "#222d42",
    marginBottom: "18px",
  },

  heroLabel: {
    display: "block",
    fontSize: "15px",
    opacity: 0.75,
    marginBottom: "8px",
  },

  heroNumber: {
    display: "block",
    fontSize: "40px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  result: {
    background: "#222d42",
    borderRadius: "12px",
    padding: "16px",
  },

  resultTitle: {
    display: "block",
    fontSize: "13px",
    opacity: 0.7,
    marginBottom: "7px",
  },

  resultValue: {
    fontSize: "20px",
  },

  info: {
    marginTop: "18px",
    padding: "18px",
    background: "#ffffff",
    borderRadius: "14px",
    color: "#475467",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  footer: {
    textAlign: "center",
    color: "#98a2b3",
    marginTop: "25px",
    fontSize: "13px",
  },
};
