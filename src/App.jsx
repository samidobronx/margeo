<strong>
            {money(calculation.profit)}
          </strong>
        </div>
      </div>

      <button
        className="cardEditButton"
        onClick={() => onEdit(product)}
      >
        Modifier
      </button>
    </div>
  );
}

function ProductRow({ product, money, onEdit, onDelete }) {
  const calculation = product.calculations;

  return (
    <div className="productRow">
      <div className="productRowInfo">
        <div className="productEmoji">📦</div>
        <div>
          <strong>{product.name}</strong>
          <span>
            {product.form.quantity} unités · Coût {money(calculation.costPerUnit)}
          </span>
        </div>
      </div>

      <div className="productRowStats">
        <span
          className={
            calculation.margin >= 30
              ? "marginBadge good"
              : calculation.margin >= 0
              ? "marginBadge medium"
              : "marginBadge bad"
          }
        >
          {calculation.margin.toFixed(1)} %
        </span>

        <strong className={calculation.profit >= 0 ? "profitPositive" : "profitNegative"}>
          {money(calculation.profit)}
        </strong>
      </div>

      <div className="productRowActions">
        <button onClick={() => onEdit(product)}>✎</button>
        <button onClick={() => onDelete(product.id)}>🗑</button>
      </div>
    </div>
  );
}

function EmptyProducts({ onClick }) {
  return (
    <div className="empty">
      <div className="emptyIcon">📦</div>
      <h3>Aucun produit</h3>
      <p>Ajoute ton premier produit pour voir apparaître tes statistiques ici.</p>
      <button className="primaryButton" onClick={onClick}>+ Nouveau calcul</button>
    </div>
  );
}

function StatCard({ icon, label, value, detail, green }) {
  return (
    <div className="statCard">
      <div className="statTop">
        <span className="statIcon">{icon}</span>
        <span className="statLabel">{label}</span>
      </div>
      <div className={green === undefined ? "statValue" : green ? "statValue positive" : "statValue negative"}>
        {value}
      </div>
      <div className="statDetail">{detail}</div>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="card">
      <div className="cardTitle">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, placeholder, type = "text", suffix, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="fieldInput">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className="fieldSuffix">{suffix}</span>}
      </div>
    </label>
  );
}

function ResultPanel({ result, money }) {
  return (
    <div className="resultPanel">
      <div className="resultTop">
        <span>Bénéfice</span>
        <strong className={result.profit >= 0 ? "profitPositive" : "profitNegative"}>
          {money(result.profit)}
        </strong>
      </div>
      <div className="resultRow"><span>Coût total</span><strong>{money(result.totalCost)}</strong></div>
      <div className="resultRow"><span>Coût par unité</span><strong>{money(result.costPerUnit)}</strong></div>
      <div className="resultRow"><span>Chiffre d'affaires</span><strong>{money(result.revenue)}</strong></div>
      <div className="resultRow"><span>Marge</span><strong>{result.margin.toFixed(1)} %</strong></div>
    </div>
  );
}

function numberSafe(value) {
  const n = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, sans-serif; }
  .app { display: flex; min-height: 100vh; background: #f6f7fb; }
  .sidebar { width: 240px; background: #111827; color: #fff; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
  .brandLogo { width: 36px; height: 36px; border-radius: 8px; background: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: bold; }
  .brandName { font-weight: 700; }
  .brandSub { font-size: 12px; opacity: 0.6; }
  .navigation { display: flex; flex-direction: column; gap: 4px; }
  .navButton { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: none; border: none; color: #d1d5db; border-radius: 8px; cursor: pointer; text-align: left; font-size: 14px; }
  .navButton.active, .navButton:hover { background: #1f2937; color: #fff; }
  .premiumBox { background: #1f2937; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .premiumBox button { width: 100%; margin-top: 10px; padding: 8px; border-radius: 6px; border: none; background: #374151; color: #9ca3af; cursor: not-allowed; }
  .sidebarFooter { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.5; }
  .main { flex: 1; padding: 32px; max-width: 1100px; }
  .topbar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .topRight { display: flex; align-items: center; gap: 12px; }
  .userAvatar { width: 36px; height: 36px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; }
  .statsGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .statCard, .card, .resultPanel, .productCard, .calculationInfo { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .statValue { font-size: 24px; font-weight: 700; margin: 6px 0; }
  .statValue.positive { color: #16a34a; }
  .statValue.negative { color: #dc2626; }
  .dashboardHero { background: #111827; color: #fff; border-radius: 16px; padding: 28px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .primaryButton { background: #6366f1; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
  .secondaryButton { background: #e5e7eb; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
  .sectionHeader { display: flex; justify-content: space-between; align-items: center; margin: 24px 0 12px; }
  .productGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .marginBadge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .marginBadge.good { background: #dcfce7; color: #16a34a; }
  .marginBadge.medium { background: #fef9c3; color: #ca8a04; }
  .marginBadge.bad { background: #fee2e2; color: #dc2626; }
  .profitPositive { color: #16a34a; }
  .profitNegative { color: #dc2626; }
  .empty { text-align: center; padding: 40px; background: #fff; border-radius: 12px; }
  .calculatorLayout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
  .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; font-size: 13px; }
  .fieldInput { display: flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; }
  .fieldInput input { border: none; outline: none; flex: 1; font-size: 14px; }
  .twoColumns { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cardTitle { display: flex; gap: 8px; align-items: center; font-weight: 600; margin-bottom: 14px; }
  .saveButton { width: 100%; padding: 12px; background: #16a34a; color: #fff; border: none; border-radius: 8px; cursor: pointer; margin-top: 8px; }
  .productRow { display: flex; justify-content: space-between; align-items: center; background: #fff; border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .historyRow { display: flex; align-items: center; gap: 12px; width: 100%; background: #fff; border: none; border-radius: 10px; padding: 14px; margin-bottom: 10px; cursor: pointer; text-align: left; }
  .message { background: #eef2ff; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; font-size: 14px; }
`;

export default App;
