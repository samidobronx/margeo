import React, { useMemo, useState } from "react";

const initialForm = {
  purchase: 8,
  quantity: 50,
  shipping: 30,
  customs: 15,
  tax: 20,
  packaging: 0.3,
  otherImport: 10,
  platform: 5,
  payment: 0.5,
  otherSale: 0,
  salePrice: 19.9,
  targetMargin: 30,
};

const recentCalculations = [
  { name: "Casque Bluetooth", price: "19,90 €", quantity: 50, margin: "52,7 %", time: "Il y a 2 min" },
  { name: "Montre connectée", price: "29,90 €", quantity: 30, margin: "41,2 %", time: "Il y a 1 h" },
  { name: "Chargeur sans fil", price: "15,90 €", quantity: 100, margin: "28,4 %", time: "Il y a 3 h" },
  { name: "Support téléphone", price: "9,90 €", quantity: 200, margin: "18,7 %", time: "Il y a 1 j" },
];

function money(value) {
  return Number(value || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " €";
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [form, setForm] = useState(initialForm);
  const [dark, setDark] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    const purchaseTotal = Number(form.purchase) * Number(form.quantity);
    const importFees =
      Number(form.shipping) +
      Number(form.customs) +
      Number(form.otherImport);

    const packagingTotal = Number(form.packaging) * Number(form.quantity);

    const taxAmount =
      ((purchaseTotal + importFees) * Number(form.tax)) / 100;

    const platformFees =
      (Number(form.salePrice) *
        Number(form.quantity) *
        Number(form.platform)) /
      100;

    const paymentFees =
      Number(form.payment) * Number(form.quantity);

    const otherSale = Number(form.otherSale);

    const totalCost =
      purchaseTotal +
      importFees +
      packagingTotal +
      taxAmount +
      platformFees +
      paymentFees +
      otherSale;

    const revenue = Number(form.salePrice) * Number(form.quantity);
    const profit = revenue - totalCost;

    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    const costPerUnit =
      Number(form.quantity) > 0
        ? totalCost / Number(form.quantity)
        : 0;

    const recommendedPrice =
      Number(form.targetMargin) >= 100
        ? 0
        : costPerUnit / (1 - Number(form.targetMargin) / 100);

    const roi =
      totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return {
      purchaseTotal,
      importFees,
      packagingTotal,
      taxAmount,
      platformFees,
      paymentFees,
      totalCost,
      revenue,
      profit,
      margin,
      costPerUnit,
      recommendedPrice,
      roi,
    };
  }, [form]);

  function update(name, value) {
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  function calculate() {
    setCalculated(true);
  }

  function reset() {
    setForm(initialForm);
    setCalculated(false);
  }

  const darkMode = dark ? "dark" : "";

  return (
    <div className={`app ${darkMode}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">M</div>
          <div>
            <div className="brandName">Margeo</div>
            <div className="brandSub">Calcule. Analyse. Développe.</div>
          </div>
        </div>

        <nav>
          {[
            ["⌂", "Dashboard"],
            ["▣", "Calculateur"],
            ["◆", "Produits"],
            ["◷", "Historique"],
            ["⚙", "Paramètres"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className={`navItem ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => setActivePage(label)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="premium">
          <div className="premiumIcon">♛</div>
          <strong>Passez à Premium</strong>
          <p>
            Débloquez les fonctionnalités avancées et boostez votre
            rentabilité.
          </p>
          <button>Découvrir</button>
        </div>

        <div className="theme">
          <span>Thème</span>
          <button
            className="themeButton"
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="copyright">
          © 2026 Margeo
          <br />
          Tous droits réservés.
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>
              {activePage === "Dashboard"
                ? "Vue d'ensemble de votre activité"
                : "Gérez votre activité avec Margeo"}
            </p>
          </div>

          <div className="topActions">
            <button>☾</button>
            <button className="notification">♢<b>3</b></button>
            <div className="avatar">S</div>
            <span className="username">Samy⌄</span>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="stats">
              <StatCard
                icon="🛍️"
                title="CA POTENTIEL"
                value={money(result.revenue + 11455.8)}
                change="+18,5 %"
              />
              <StatCard
                icon="▥"
                title="BÉNÉFICE TOTAL"
                value={money(result.profit + 3756.45)}
                change="+23,1 %"
              />
              <StatCard
                icon="◔"
                title="MARGE MOYENNE"
                value="34,4 %"
                change="+5,2 %"
              />
              <StatCard
                icon="◇"
                title="PRODUITS ANALYSÉS"
                value="24"
                change="+1 nouveau produit"
              />
            </section>

            <section className="contentGrid">
              <div className="calculatorCard">
                <div className="tabs">
                  <button className="selected">Calculateur rapide</button>
                  <button>Calculateur avancé</button>
                </div>

                <div className="calculatorGrid">
                  <div>
                    <InputSection title="1  Achat du produit">
                      <Field
                        label="Prix d'achat unitaire"
                        value={form.purchase}
                        onChange={(v) => update("purchase", v)}
                        suffix="€"
                      />
                      <Field
                        label="Quantité"
                        value={form.quantity}
                        onChange={(v) => update("quantity", v)}
                        suffix="pcs"
                      />
                    </InputSection>

                    <InputSection title="2  Import & Frais">
                      <Field
                        label="Frais de livraison"
                        value={form.shipping}
                        onChange={(v) => update("shipping", v)}
                        suffix="€"
                      />
                      <Field
                        label="Frais de douane"
                        value={form.customs}
                        onChange={(v) => update("customs", v)}
                        suffix="€"
                      />
                      <Field
                        label="TVA / Taxes"
                        value={form.tax}
                        onChange={(v) => update("tax", v)}
                        suffix="%"
                      />
                      <Field
                        label="Emballage / unité"
                        value={form.packaging}
                        onChange={(v) => update("packaging", v)}
                        suffix="€"
                      />
                      <Field
                        label="Autres frais"
                        value={form.otherImport}
                        onChange={(v) => update("otherImport", v)}
                        suffix="€"
                      />
                    </InputSection>
                  </div>

                  <div>
                    <InputSection title="3  Frais de vente">
                      <Field
                        label="Frais plateforme"
                        value={form.platform}
                        onChange={(v) => update("platform", v)}
                        suffix="%"
                      />
                      <Field
                        label="Frais de paiement / unité"
                        value={form.payment}
                        onChange={(v) => update("payment", v)}
                        suffix="€"
                      />
                      <Field
                        label="Autres frais / unité"
                        value={form.otherSale}
                        onChange={(v) => update("otherSale", v)}
                        suffix="€"
                      />
                    </InputSection>

                    <InputSection title="4  Vente">
                      <Field
                        label="Prix de vente unitaire"
                        value={form.salePrice}
                        onChange={(v) => update("salePrice", v)}
                        suffix="€"
                      />

                      <Field
                        label="Marge cible"
                        value={form.targetMargin}
                        onChange={(v) => update("targetMargin", v)}
                        suffix="%"
                      />

                      <button
                        className="calculate"
                        onClick={calculate}
                      >
                        Calculer　▣
                      </button>

                      <button
                        className="reset"
                        onClick={reset}
                      >
                        ↻　Réinitialiser
                      </button>
                    </InputSection>
                  </div>

                  <div className="resultPanel">
                    <div className="resultHeader">
                      <h2>Résultats</h2>
                      <span
                        className={
                          result.profit >= 0
                            ? "badge green"
                            : "badge red"
                        }
                      >
                        {result.profit >= 0
                          ? "Rentable"
                          : "Perte"}
                      </span>
                    </div>

                    <div className="profitTitle">
                      BÉNÉFICE TOTAL
                    </div>

                    <div
                      className={`profit ${
                        result.profit < 0 ? "negative" : ""
                      }`}
                    >
                      {money(result.profit)}
                    </div>

                    <div className="forUnits">
                      Pour {form.quantity} unités vendues
                    </div>

                    <div className="resultList">
                      <ResultRow
                        label="Coût réel / unité"
                        value={money(result.costPerUnit)}
                      />
                      <ResultRow
                        label="Chiffre d'affaires"
                        value={money(result.revenue)}
                      />
                      <ResultRow
                        label="Bénéfice / unité"
                        value={money(
                          result.revenue / Number(form.quantity || 1) -
                            result.costPerUnit
                        )}
                      />
                      <ResultRow
                        label="Marge"
                        value={`${result.margin.toFixed(1)} %`}
                      />
                      <ResultRow
                        label="Prix recommandé"
                        value={money(result.recommendedPrice)}
                        highlight
                      />
                      <ResultRow
                        label="Retour sur investissement"
                        value={`${result.roi.toFixed(1)} %`}
                      />
                    </div>

                    <div className="miniChart">
                      <div
                        className="chartBar blue"
                        style={{
                          height: `${Math.min(
                            100,
                            Math.max(15, (result.purchaseTotal / result.totalCost) * 100)
                          )}%`,
                        }}
                      />
                      <div
                        className="chartBar orange"
                        style={{
                          height: `${Math.min(
                            100,
                            Math.max(15, (result.importFees / result.totalCost) * 100)
                          )}%`,
                        }}
                      />
                      <div
                        className="chartBar purple"
                        style={{
                          height: `${Math.min(
                            100,
                            Math.max(15, (result.platformFees / result.totalCost) * 100)
                          )}%`,
                        }}
                      />
                      <div
                        className="chartBar greenBar"
                        style={{
                          height: `${Math.min(
                            100,
                            Math.max(15, (Math.max(result.profit, 0) / Math.max(result.revenue, 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="legend">
                      <span>● Coût produit</span>
                      <span>● Import & taxes</span>
                      <span>● Frais vente</span>
                      <span>● Bénéfice</span>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rightColumn">
                <div className="sideCard">
                  <h3>Résumé du calcul actuel</h3>
                  <SummaryRow
                    label="Investissement total"
                    value={money(result.totalCost)}
                  />
                  <SummaryRow
                    label="Chiffre d'affaires potentiel"
                    value={money(result.revenue)}
                  />
                  <SummaryRow
                    label="Bénéfice total"
                    value={money(result.profit)}
                    green
                  />
                  <SummaryRow
                    label="Marge"
                    value={`${result.margin.toFixed(1)} %`}
                    green
                  />
                  <button className="details">
                    Voir le détail complet　→
                  </button>
                </div>

                <div className="sideCard">
                  <div className="sideTitle">
                    <h3>Derniers calculs</h3>
                    <a href="#recent">Voir tout</a>
                  </div>

                  {recentCalculations.map((item) => (
                    <div className="recent" key={item.name}>
                      <div className="productIcon">◉</div>
                      <div className="recentInfo">
                        <strong>{item.name}</strong>
                        <span>
                          {item.price} • {item.quantity} unités
                        </span>
                        <small>{item.time}</small>
                      </div>
                      <b>{item.margin}</b>
                    </div>
                  ))}
                </div>

                <div className="sideCard tip">
                  <h3>💡 Conseil du jour</h3>
                  <p>
                    Augmentez votre marge en négociant vos frais de
                    livraison ou en optimisant votre prix de vente.
                  </p>
                  <div className="rocket">🚀</div>
                </div>
              </aside>
            </section>

            <section className="bottomTip">
              <div className="tipIcon">♙</div>
              <div>
                <strong>Astuce Margeo</strong>
                <p>
                  Pour améliorer votre rentabilité, essayez de négocier
                  vos frais de livraison ou d'augmenter votre prix de
                  vente de 0,50 €.
                </p>
              </div>
              <button>En savoir plus</button>
            </section>
          </>
        )}

        {activePage !== "Dashboard" && (
          <div className="emptyPage">
            <div className="emptyIcon">🚀</div>
            <h2>{activePage}</h2>
            <p>
              Cette section est prête à être développée dans la prochaine
              version de Margeo.
            </p>
            <button
              onClick={() => setActivePage("Dashboard")}
              className="calculate"
            >
              Retour au Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, change }) {
  return (
    <div className="statCard">
      <div className="statIcon">{icon}</div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>↑ {change} vs mois dernier</small>
      </div>
    </div>
  );
}

function InputSection({ title, children }) {
  return (
    <div className="inputSection">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, suffix }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="inputWrapper">
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <em>{suffix}</em>
      </div>
    </label>
  );
}

function ResultRow({ label, value, highlight }) {
  return (
    <div className="resultRow">
      <span>{label}</span>
      <strong className={highlight ? "highlight" : ""}>
        {value}
      </strong>
    </div>
  );
}

function SummaryRow({ label, value, green }) {
  return (
    <div className="summaryRow">
      <span>{label}</span>
      <strong className={green ? "greenText" : ""}>
        {value}
      </strong>
    </div>
  );
}

const css = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: #f5f7fb;
  color: #172033;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 245px;
  min-height: 100vh;
  background: linear-gradient(180deg, #101d35, #0b162a);
  color: white;
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 35px;
}

.brandIcon {
  width: 39px;
  height: 39px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2478ff, #7447dc);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  font-weight: 900;
}

.brandName {
  font-size: 23px;
  font-weight: 800;
}

.brandSub {
  font-size: 10px;
  color: #aeb9cb;
  margin-top: 3px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.navItem {
  border: 0;
  background: transparent;
  color: #d5dbea;
  padding: 13px 12px;
  border-radius: 10px;
  text-align: left;
  font-weight:
