import React, { useMemo, useState } from "react";

const EMPTY_FORM = {
  productName: "",
  unitPrice: "",
  quantity: "1",
  shipping: "",
  customs: "",
  vat: "",
  otherFees: "",
  sellingPrice: "",
};

const DEFAULT_PRODUCTS = [];

function App() {
  const [page, setPage] = useState("dashboard");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("€");
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("margeo_products");
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const number = (value) => {
    const n = parseFloat(String(value).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const money = (value) => {
    return `${Number(value || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  };

  const calculate = (data) => {
    const unitPrice = number(data.unitPrice);
    const quantity = Math.max(1, number(data.quantity));
    const shipping = number(data.shipping);
    const customs = number(data.customs);
    const vat = number(data.vat);
    const otherFees = number(data.otherFees);
    const sellingPrice = number(data.sellingPrice);

    const productsTotal = unitPrice * quantity;

    const totalCost =
      productsTotal +
      shipping +
      customs +
      vat +
      otherFees;

    const costPerUnit = totalCost / quantity;

    const revenue = sellingPrice * quantity;

    const profit = revenue - totalCost;

    const margin =
      revenue > 0
        ? (profit / revenue) * 100
        : 0;

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
  };

  const result = useMemo(() => {
    return calculate(form);
  }, [form]);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);

    try {
      localStorage.setItem(
        "margeo_products",
        JSON.stringify(newProducts)
      );
    } catch {
      // Le navigateur peut bloquer localStorage.
    }
  };

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage("");
  };

  const saveProduct = () => {
    if (!form.productName.trim()) {
      setMessage("⚠️ Donne un nom au produit.");
      return;
    }

    if (number(form.unitPrice) <= 0) {
      setMessage("⚠️ Ajoute un prix d'achat.");
      return;
    }

    if (number(form.sellingPrice) <= 0) {
      setMessage("⚠️ Ajoute un prix de vente.");
      return;
    }

    const calculations = calculate(form);

    const product = {
      id: editingId || Date.now(),
      name: form.productName.trim(),
      form: { ...form },
      calculations,
      updatedAt: new Date().toISOString(),
    };

    let newProducts;

    if (editingId) {
      newProducts = products.map((item) =>
        item.id === editingId ? product : item
      );

      setMessage("✅ Produit modifié.");
    } else {
      newProducts = [product, ...products];

      setMessage("✅ Produit enregistré.");
    }

    saveProducts(newProducts);

    setEditingId(null);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const editProduct = (product) => {
    setForm(product.form);
    setEditingId(product.id);
    setPage("calculator");
    setMessage("Modification du produit.");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = (id) => {
    const confirmed = window.confirm(
      "Supprimer définitivement ce produit ?"
    );

    if (!confirmed) return;

    saveProducts(
      products.filter((product) => product.id !== id)
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const dashboardStats = useMemo(() => {
    if (products.length === 0) {
      return {
        products: 0,
        revenue: 0,
        profit: 0,
        margin: 0,
      };
    }

    const revenue = products.reduce(
      (sum, product) =>
        sum + product.calculations.revenue,
      0
    );

    const profit = products.reduce(
      (sum, product) =>
        sum + product.calculations.profit,
      0
    );

    return {
      products: products.length,
      revenue,
      profit,
      margin: revenue > 0
        ? (profit / revenue) * 100
        : 0,
    };
  }, [products]);

  const openCalculator = () => {
    resetForm();
    setPage("calculator");
  };

  return (
    <>
      <style>{css}</style>

      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brandLogo">M</div>

            <div>
              <div className="brandName">Margeo</div>
              <div className="brandSub">
                Rentabilité simplifiée
              </div>
            </div>
          </div>

          <nav className="navigation">
            <NavButton
              icon="⌂"
              label="Dashboard"
              active={page === "dashboard"}
              onClick={() => setPage("dashboard")}
            />

            <NavButton
              icon="▣"
              label="Calculateur"
              active={page === "calculator"}
              onClick={openCalculator}
            />

            <NavButton
              icon="◆"
              label="Produits"
              active={page === "products"}
              onClick={() => setPage("products")}
            />

            <NavButton
              icon="◷"
              label="Historique"
              active={page === "history"}
              onClick={() => setPage("history")}
            />
          </nav>

          <div className="sidebarBottom">
            <div className="premiumBox">
              <div className="premiumIcon">♛</div>

              <strong>Margeo Premium</strong>

              <p>
                Plus tard, cette zone servira à présenter
                les fonctionnalités payantes.
              </p>

              <button>
                Bientôt disponible
              </button>
            </div>

            <div className="sidebarFooter">
              <span>V1</span>
              <span>© 2026 Margeo</span>
            </div>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div>
              <h1>
                {page === "dashboard" && "Dashboard"}
                {page === "calculator" && "Calculateur"}
                {page === "products" && "Mes produits"}
                {page === "history" && "Historique"}
              </h1>

              <p>
                {page === "dashboard" &&
                  "Vue d'ensemble de ta rentabilité"}
                {page === "calculator" &&
                  "Calcule précisément ton coût et ta marge"}
                {page === "products" &&
                  "Gère tous tes produits enregistrés"}
                {page === "history" &&
                  "Retrouve tes derniers calculs"}
              </p>
            </div>

            <div className="topRight">
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className="currencySelect"
              >
                <option value="€">EUR €</option>
                <option value="$">USD $</option>
                <option value="£">GBP £</option>
              </select>

              <div className="userAvatar">
                M
              </div>
            </div>
          </header>

          {page === "dashboard" && (
            <Dashboard
              stats={dashboardStats}
              products={products}
              money={money}
              onCalculator={openCalculator}
              onProducts={() => setPage("products")}
              onEdit={editProduct}
            />
          )}

          {page === "calculator" && (
            <Calculator
              form={form}
              update={update}
              result={result}
              money={money}
              saveProduct={saveProduct}
              reset={resetForm}
              editing={Boolean(editingId)}
              message={message}
            />
          )}

          {page === "products" && (
            <Products
              products={filteredProducts}
              search={search}
              setSearch={setSearch}
              money={money}
              onEdit={editProduct}
              onDelete={deleteProduct}
              onNew={openCalculator}
            />
          )}

          {page === "history" && (
            <History
              products={products}
              money={money}
              onEdit={editProduct}
            />
          )}
        </main>
      </div>
    </>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      className={`navButton ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function Dashboard({
  stats,
  products,
  money,
  onCalculator,
  onProducts,
  onEdit,
}) {
  const recent = products.slice(0, 5);

  return (
    <div>
      <section className="statsGrid">
        <StatCard
          icon="📦"
          label="PRODUITS"
          value={stats.products}
          detail="produits enregistrés"
        />

        <StatCard
          icon="💰"
          label="CA POTENTIEL"
          value={money(stats.revenue)}
          detail="sur tes produits"
        />

        <StatCard
          icon="📈"
          label="BÉNÉFICE"
          value={money(stats.profit)}
          detail="bénéfice potentiel"
          green={stats.profit >= 0}
        />

        <StatCard
          icon="◔"
          label="MARGE MOYENNE"
          value={`${stats.margin.toFixed(1)} %`}
          detail="marge globale"
          green={stats.margin >= 0}
        />
      </section>

      <section className="dashboardHero">
        <div>
          <span className="heroSmall">
            TON ESPACE MAR G E O
          </span>

          <h2>
            Maîtrise tes marges.
            <br />
            Protège tes bénéfices.
          </h2>

          <p>
            Enregistre tes produits et garde une vision
            claire de leur rentabilité.
          </p>
        </div>

        <button
          className="primaryButton"
          onClick={onCalculator}
        >
          + Nouveau calcul
        </button>
      </section>

      <section className="sectionHeader">
        <div>
          <h2>Produits récents</h2>
          <p>
            Les derniers produits que tu as enregistrés.
          </p>
        </div>

        <button
          className="linkButton"
          onClick={onProducts}
        >
          Voir tous les produits →
        </button>
      </section>

      {recent.length === 0 ? (
        <EmptyProducts onClick={onCalculator} />
      ) : (
        <div className="productGrid">
          {recent.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              money={money}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Calculator({
  form,
  update,
  result,
  money,
  saveProduct,
  reset,
  editing,
  message,
}) {
  return (
    <div>
      <div className="calculatorTop">
        <div>
          <h2>
            {editing
              ? "Modifier le produit"
              : "Nouveau calcul"}
          </h2>

          <p>
            Renseigne tous les coûts pour obtenir ta
            vraie rentabilité.
          </p>
        </div>

        <button
          className="secondaryButton"
          onClick={reset}
        >
          ↻ Réinitialiser
        </button>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <div className="calculatorLayout">
        <div>
          <Card title="Produit" icon="📦">
            <Field
              label="Nom du produit"
              value={form.productName}
              placeholder="Ex : T-shirt Nike"
              onChange={(v) =>
                update("productName", v)
              }
            />

            <div className="twoColumns">
              <Field
                label="Prix d'achat unitaire"
                value={form.unitPrice}
                placeholder="0,00"
                type="number"
                suffix="€"
                onChange={(v) =>
                  update("unitPrice", v)
                }
              />

              <Field
                label="Quantité"
                value={form.quantity}
                placeholder="1"
                type="number"
                suffix="pcs"
                onChange={(v) =>
                  update("quantity", v)
                }
              />
            </div>
          </Card>

          <Card title="Import & frais" icon="🚚">
            <div className="twoColumns">
              <Field
                label="Livraison"
                value={form.shipping}
                placeholder="0,00"
                type="number"
                suffix="€"
                onChange={(v) =>
                  update("shipping", v)
                }
              />

              <Field
                label="Douane"
                value={form.customs}
                placeholder="0,00"
                type="number"
                suffix="€"
                onChange={(v) =>
                  update("customs", v)
                }
              />
            </div>

            <div className="twoColumns">
              <Field
                label="TVA / taxes"
                value={form.vat}
                placeholder="0,00"
                type="number"
                suffix="€"
                onChange={(v) =>
                  update("vat", v)
                }
              />

              <Field
                label="Autres frais"
                value={form.otherFees}
                placeholder="0,00"
                type="number"
                suffix="€"
                onChange={(v) =>
                  update("otherFees", v)
                }
              />
            </div>
          </Card>

          <Card title="Prix de vente" icon="🏷️">
            <Field
              label="Prix de vente unitaire"
              value={form.sellingPrice}
              placeholder="0,00"
              type="number"
              suffix="€"
              onChange={(v) =>
                update("sellingPrice", v)
              }
            />
          </Card>

          <button
            className="saveButton"
            onClick={saveProduct}
          >
            {editing
              ? "✓ Enregistrer les modifications"
              : "✓ Enregistrer le produit"}
          </button>
        </div>

        <div>
          <ResultPanel
            result={result}
            money={money}
          />

          <div className="calculationInfo">
            <strong>Comment Margeo calcule ?</strong>

            <p>
              Coût des produits + livraison + douane +
              TVA + autres frais = coût total.
            </p>

            <p>
              Chiffre d'affaires − coût total =
              bénéfice.
            </p>

            <p>
              Bénéfice ÷ chiffre d'affaires × 100 =
              marge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Products({
  products,
  search,
  setSearch,
  money,
  onEdit,
  onDelete,
  onNew,
}) {
  return (
    <div>
      <div className="productsHeader">
        <div>
          <h2>Mes produits</h2>
          <p>
            Tous tes produits enregistrés sont stockés
            dans ce navigateur.
          </p>
        </div>

        <button
          className="primaryButton"
          onClick={onNew}
        >
          + Ajouter un produit
        </button>
      </div>

      <div className="searchBox">
        🔎
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Rechercher un produit..."
        />
      </div>

      {products.length === 0 ? (
        <EmptyProducts onClick={onNew} />
      ) : (
        <div className="productList">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              money={money}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function History({
  products,
  money,
  onEdit,
}) {
  return (
    <div>
      <div className="productsHeader">
        <div>
          <h2>Historique</h2>
          <p>
            Voici les calculs enregistrés dans Margeo.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty">
          <div className="emptyIcon">◷</div>
          <h3>Aucun calcul</h3>
          <p>
            Tes calculs apparaîtront ici après avoir
            enregistré des produits.
          </p>
        </div>
      ) : (
        <div className="historyList">
          {products.map((product) => (
            <button
              key={product.id}
              className="historyRow"
              onClick={() => onEdit(product)}
            >
              <div className="historyIcon">
                📊
              </div>

              <div className="historyInfo">
                <strong>{product.name}</strong>
                <span>
                  {product.form.quantity} unités
                  {" · "}
                  Prix de vente{" "}
                  {money(
                    numberSafe(
                      product.form.sellingPrice
                    )
                  )}
                </span>
              </div>

              <div
                className={
                  product.calculations.profit >= 0
                    ? "profitPositive"
                    : "profitNegative"
                }
              >
                {money(product.calculations.profit)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  money,
  onEdit,
}) {
  const calculation = product.calculations;

  return (
    <div className="productCard">
      <div className="productCardTop">
        <div className="productEmoji">
          📦
        </div>

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
      </div>

      <h3>{product.name}</h3>

      <div className="productDetails">
        <div>
          <span>Coût / unité</span>
          <strong>
            {money(calculation.costPerUnit)}
          </strong>
        </div>

        <div>
          <span>Prix vente</span>
          <strong>
            {money(
              numberSafe(
                product.form.sellingPrice
              )
            )}
          </strong>
        </div>

        <div>
          <span>Bénéfice</span>
          <strong>
            {money(calculation.profit)}
          </strong>
    </
