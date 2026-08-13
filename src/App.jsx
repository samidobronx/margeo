import React, { useState } from "react";

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
        <p style={styles.subtitle}>Calculateur de marge simple et rapide</p>

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
