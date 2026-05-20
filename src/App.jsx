import { useState, useEffect } from "react";

// ─── Default Data ──────────────────────────────────────────────────────────────

const DEFAULT_CARDS = [
  {
    id: "c1",
    type: "credit",
    name: "Chase Sapphire Reserve",
    bank: "Chase",
    last4: "4521",
    color: "#1a1a2e",
    accent: "#e8b86d",
    cashback: {
      travel: 10, dining: 3, groceries: 1, gas: 1, streaming: 1,
      pharmacy: 1, amazon: 1, "home improvement": 1, entertainment: 1, other: 1,
    },
    annualFee: 550,
    balance: 2340.50,
    limit: 15000,
  },
  {
    id: "c2",
    type: "credit",
    name: "Citi Double Cash",
    bank: "Citi",
    last4: "8823",
    color: "#003087",
    accent: "#ffffff",
    cashback: {
      travel: 2, dining: 2, groceries: 2, gas: 2, streaming: 2,
      pharmacy: 2, amazon: 2, "home improvement": 2, entertainment: 2, other: 2,
    },
    annualFee: 0,
    balance: 890.20,
    limit: 8000,
  },
  {
    id: "c3",
    type: "credit",
    name: "Amazon Prime Rewards",
    bank: "Chase",
    last4: "3307",
    color: "#131921",
    accent: "#ff9900",
    cashback: {
      amazon: 5, whole_foods: 5, dining: 2, gas: 2,
      travel: 2, groceries: 2, streaming: 1, pharmacy: 1,
      "home improvement": 1, entertainment: 1, other: 1,
    },
    annualFee: 0,
    balance: 412.80,
    limit: 10000,
  },
];

const DEFAULT_ACCOUNTS = [
  {
    id: "b1",
    type: "checking",
    name: "Chase Total Checking",
    bank: "Chase",
    last4: "7791",
    color: "#117ACA",
    accent: "#ffffff",
    balance: 5240.00,
    apy: 0.01,
  },
  {
    id: "b2",
    type: "savings",
    name: "Marcus High-Yield Savings",
    bank: "Goldman Sachs",
    last4: "2209",
    color: "#2E7D32",
    accent: "#a5d6a7",
    balance: 18500.00,
    apy: 4.85,
  },
];

const STORE_CATEGORIES = {
  "Amazon": "amazon",
  "Whole Foods": "whole_foods",
  "Trader Joe's": "groceries",
  "Kroger": "groceries",
  "Costco": "groceries",
  "Target": "groceries",
  "Walmart": "groceries",
  "Shell / BP / Exxon": "gas",
  "Chevron": "gas",
  "Delta / United / AA": "travel",
  "Airbnb / Hotels": "travel",
  "Uber / Lyft": "travel",
  "Restaurants / DoorDash": "dining",
  "Starbucks": "dining",
  "Netflix / Spotify": "streaming",
  "CVS / Walgreens": "pharmacy",
  "Home Depot": "home improvement",
  "Lowe's": "home improvement",
  "AMC / Regal Theaters": "entertainment",
  "Other / General": "other",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getCashbackRate(card, category) {
  if (!card.cashback) return 1;
  return card.cashback[category] ?? card.cashback["other"] ?? 1;
}

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CardVisual({ item, onClick, selected }) {
  const isCredit = item.type === "credit";
  const usage = isCredit ? (item.balance / item.limit) * 100 : null;

  return (
    <div
      onClick={() => onClick(item)}
      style={{
        background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
        border: selected ? `2px solid ${item.accent}` : "2px solid transparent",
        borderRadius: 16,
        padding: "20px 22px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: selected ? `0 0 0 3px ${item.accent}44` : "0 4px 20px #0004",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* decorative circle */}
      <div style={{
        position: "absolute", right: -30, top: -30,
        width: 120, height: 120, borderRadius: "50%",
        background: `${item.accent}18`,
      }} />
      <div style={{
        position: "absolute", right: 20, top: 20,
        width: 60, height: 60, borderRadius: "50%",
        background: `${item.accent}22`,
      }} />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ color: item.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>
            {item.bank}
          </span>
          <span style={{
            background: `${item.accent}33`, color: item.accent,
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1,
          }}>
            {item.type}
          </span>
        </div>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginTop: 8, letterSpacing: 0.3 }}>
          {item.name}
        </div>
      </div>

      <div>
        <div style={{ color: "#ffffffaa", fontSize: 11, marginBottom: 2, fontFamily: "monospace" }}>
          •••• •••• •••• {item.last4}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ color: "#ffffff88", fontSize: 10 }}>{isCredit ? "Balance" : "Available"}</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{formatCurrency(item.balance)}</div>
          </div>
          {isCredit && (
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#ffffff88", fontSize: 10 }}>Limit</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{formatCurrency(item.limit)}</div>
              <div style={{
                width: 70, height: 4, background: "#ffffff22", borderRadius: 2, marginTop: 6,
                overflow: "hidden",
              }}>
                <div style={{ width: `${usage}%`, height: "100%", background: usage > 80 ? "#ef5350" : usage > 50 ? "#ffa726" : "#66bb6a", borderRadius: 2 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "", type: "credit", bank: "", last4: "", limit: 5000, balance: 0,
    apy: 0, color: "#1a1a2e", accent: "#e8b86d",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00000080", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: "#161b22", borderRadius: 16, padding: 32, maxWidth: 500,
        border: "1px solid #1e2235",
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: "#fff", marginBottom: 20, fontSize: 20, fontWeight: 900 }}>Add New Account</h2>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ color: "#ffffff88", fontSize: 12, fontWeight: 700 }}>Card Name</label>
            <input
              type="text" placeholder="e.g., Chase Sapphire"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%", background: "#0d1117", border: "1px solid #1e2235",
                borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ color: "#ffffff88", fontSize: 12, fontWeight: 700 }}>Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              style={{
                width: "100%", background: "#0d1117", border: "1px solid #1e2235",
                borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box",
              }}
            >
              <option value="credit">Credit Card</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <button
            onClick={() => {
              onAdd(formData);
              onClose();
            }}
            style={{
              background: "#238636", color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App Component ────────────────────────────────────────────────────────

export default function App() {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [tab, setTab] = useState("cards");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [spendAmount, setSpendAmount] = useState(100);
  const [showAdd, setShowAdd] = useState(false);

  const creditCards = [...cards].filter(c => c.type === "credit");

  const handleAdd = (formData) => {
    const newItem = {
      ...formData,
      id: Math.random().toString(36).slice(2),
      last4: formData.last4 || Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
    };
    if (formData.type === "credit") {
      setCards([...cards, newItem]);
    } else {
      setAccounts([...accounts, newItem]);
    }
  };

  const handleDelete = (id) => {
    setCards(cards.filter(c => c.id !== id));
    setAccounts(accounts.filter(a => a.id !== id));
    setSelectedCard(null);
  };

  return (
    <div style={{
      background: "#0d1117", color: "#fff", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* HEADER */}
      <header style={{ background: "#161b22", borderBottom: "1px solid #1e2235", padding: "20px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>💳 WalletIQ</h1>
            <p style={{ fontSize: 13, color: "#ffffff55", margin: "4px 0 0 0" }}>Optimize your credit cards and maximize cashback</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "#238636", color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            + Add Account
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* TAB NAVIGATION */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #1e2235", paddingBottom: 16 }}>
          {["cards", "optimizer", "accounts"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "transparent", color: tab === t ? "#fff" : "#ffffff55", border: "none",
                fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "8px 16px",
                borderBottom: tab === t ? "3px solid #238636" : "none",
                transition: "color 0.2s",
              }}
            >
              {t === "cards" ? "💳 Cards" : t === "optimizer" ? "✨ Optimizer" : "📊 Accounts"}
            </button>
          ))}
        </div>

        {/* ── CARDS TAB ── */}
        {tab === "cards" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Your Cards</div>
              <div style={{ color: "#ffffff66" }}>Click any card to see details</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginBottom: 32 }}>
              {creditCards.map(card => (
                <CardVisual key={card.id} item={card} selected={selectedCard?.id === card.id} onClick={setSelectedCard} />
              ))}
              {accounts.map(acct => (
                <CardVisual key={acct.id} item={acct} selected={selectedCard?.id === acct.id} onClick={setSelectedCard} />
              ))}
            </div>

            {selectedCard && (
              <div style={{
                background: "#161b22", border: "1px solid #1e2235", borderRadius: 16, padding: "24px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>{selectedCard.name} Details</h3>
                  <button
                    onClick={() => handleDelete(selectedCard.id)}
                    style={{
                      background: "#ef535011", color: "#ef5350", border: "1px solid #ef535033",
                      borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 700,
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#0d1117", borderRadius: 12, padding: 16 }}>
                    <div style={{ color: "#ffffff55", fontSize: 12 }}>Balance</div>
                    <div style={{ color: "#66bb6a", fontWeight: 800, fontSize: 22 }}>{formatCurrency(selectedCard.balance)}</div>
                  </div>
                  {selectedCard.type === "credit" && (
                    <>
                      <div style={{ background: "#0d1117", borderRadius: 12, padding: 16 }}>
                        <div style={{ color: "#ffffff55", fontSize: 12 }}>Limit</div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>{formatCurrency(selectedCard.limit)}</div>
                      </div>
                      <div style={{ background: "#0d1117", borderRadius: 12, padding: 16 }}>
                        <div style={{ color: "#ffffff55", fontSize: 12 }}>Annual Fee</div>
                        <div style={{ color: selectedCard.annualFee === 0 ? "#66bb6a" : "#fff", fontWeight: 800, fontSize: 22 }}>
                          {selectedCard.annualFee === 0 ? "No Fee" : `$${selectedCard.annualFee}/yr`}
                        </div>
                      </div>
                    </>
                  )}
                  {selectedCard.type !== "credit" && (
                    <div style={{ background: "#0d1117", borderRadius: 12, padding: 16 }}>
                      <div style={{ color: "#ffffff55", fontSize: 12 }}>APY</div>
                      <div style={{ color: "#64b5f6", fontWeight: 800, fontSize: 22 }}>{selectedCard.apy}%</div>
                    </div>
                  )}
                </div>

                {selectedCard.cashback && (
                  <div style={{ background: "#0f1117", border: "1px solid #1e2235", borderRadius: 12, padding: 16 }}>
                    <div style={{ color: "#ffffff55", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Cashback Rates</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
                      {Object.entries(selectedCard.cashback).map(([cat, rate]) => (
                        <div key={cat} style={{ textAlign: "center", padding: "10px 8px" }}>
                          <div style={{ textTransform: "capitalize", color: "#ffffff88", fontSize: 12, marginBottom: 4 }}>{cat}</div>
                          <div style={{ color: "#e8b86d", fontWeight: 900, fontSize: 20 }}>{rate}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── OPTIMIZER TAB ── */}
        {tab === "optimizer" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>🎯 Card Optimizer</div>
              <div style={{ color: "#ffffff66" }}>Pick a store or enter custom amount to see which card earns the most</div>
            </div>

            {/* Store / Category selector */}
            <div style={{
              background: "#161b22", border: "1px solid #1e2235", borderRadius: 16, padding: "24px",
              marginBottom: 28,
            }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: "#ffffff88", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Popular Stores</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                  {Object.entries(STORE_CATEGORIES).slice(0, 12).map(([store, cat]) => (
                    <button
                      key={store}
                      onClick={() => { setSelectedStore(store); setSelectedCategory(cat); }}
                      style={{
                        background: selectedStore === store ? "#238636" : "#0d1117",
                        color: selectedStore === store ? "#fff" : "#ffffff88",
                        border: selectedStore === store ? "1px solid #238636" : "1px solid #1e2235",
                        borderRadius: 8, padding: "10px 12px", fontSize: 13, cursor: "pointer", fontWeight: 700,
                        transition: "all 0.2s",
                      }}
                    >
                      {store}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom spend amount */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #1e2235" }}>
                <label style={{ display: "block", color: "#ffffff88", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Monthly Spend Amount</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number" placeholder="100"
                    value={spendAmount}
                    onChange={e => setSpendAmount(parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1, background: "#0d1117", border: "1px solid #1e2235", borderRadius: 8,
                      padding: "10px 14px", color: "#fff", fontSize: 14,
                    }}
                  />
                  <span style={{ padding: "10px 14px", color: "#ffffff55" }}>USD/month</span>
                </div>
              </div>
            </div>

            {/* Results */}
            {selectedStore || selectedCategory ? (
              <>
                {creditCards.length > 0 ? (
                  <>
                    <div style={{
                      background: "#161b22", border: "1px solid #1e2235",
                      borderRadius: 16, padding: "24px", marginBottom: 20,
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#ffffff55", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Ranked by Cashback</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {creditCards
                          .map(card => ({
                            card,
                            rate: getCashbackRate(card, selectedCategory || "other"),
                          }))
                          .sort((a, b) => b.rate - a.rate)
                          .map(({ card, rate }, i) => {
                            const cashbackAmt = ((spendAmount * rate) / 100).toFixed(2);
                            const isWinner = i === 0;
                            return (
                              <div key={card.id} style={{
                                background: isWinner ? "#e8b86d11" : "#0d1117",
                                border: isWinner ? "1px solid #e8b86d44" : "1px solid #1e2235",
                                borderRadius: 12, padding: "16px 20px", display: "flex",
                                justifyContent: "space-between", alignItems: "center",
                              }}>
                                <div>
                                  <div style={{
                                    fontWeight: 700, fontSize: 15,
                                    color: isWinner ? "#e8b86d" : "#fff",
                                  }}>
                                    {i === 0 ? "🏆 " : ""}{card.name}
                                  </div>
                                  <div style={{ color: "#ffffff55", fontSize: 12, marginTop: 2 }}>•••• {card.last4}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ color: isWinner ? card.accent : "#ffffff88", fontWeight: 900, fontSize: 22 }}>{rate}%</div>
                                  <div style={{ color: "#ffffff55", fontSize: 11 }}>cashback</div>
                                </div>
                                <div style={{
                                  textAlign: "right",
                                  background: "#1e2235",
                                  borderRadius: 10, padding: "8px 14px", minWidth: 90,
                                }}>
                                  <div style={{ color: "#66bb6a", fontWeight: 800, fontSize: 16 }}>+${cashbackAmt}</div>
                                  <div style={{ color: "#ffffff55", fontSize: 11 }}>earned</div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Savings comparison */}
                    <div style={{
                      marginTop: 28, background: "#0f1117", border: "1px solid #1e2235",
                      borderRadius: 16, padding: "20px 24px",
                    }}>
                      <div style={{ color: "#ffffff55", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Annual Savings Projection</div>
                      <div style={{ color: "#ffffff99", fontSize: 14 }}>
                        If you spend <strong style={{ color: "#fff" }}>{formatCurrency(spendAmount)}</strong> per month at this merchant:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginTop: 16 }}>
                        {creditCards
                          .map(card => ({
                            card,
                            rate: getCashbackRate(card, selectedCategory || "other"),
                          }))
                          .sort((a, b) => b.rate - a.rate)
                          .slice(0, 3)
                          .map(({ card, rate }) => (
                            <div key={card.id} style={{
                              background: "#1a1a2e", borderRadius: 12, padding: "14px 16px",
                              border: "1px solid #334",
                            }}>
                              <div style={{ color: "#ffffff88", fontSize: 12, marginBottom: 4 }}>{card.name}</div>
                              <div style={{ color: "#66bb6a", fontWeight: 800, fontSize: 18 }}>
                                +{formatCurrency((spendAmount * rate / 100) * 12)}/yr
                              </div>
                              <div style={{ color: "#ffffff44", fontSize: 11 }}>{rate}% · {formatCurrency(spendAmount * rate / 100)}/mo</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: "#ffffff55", textAlign: "center", padding: 40 }}>No credit cards added yet.</div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                background: "#0f1117", border: "1px solid #1e2235", borderRadius: 18,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Pick a store or category above</div>
                <div style={{ color: "#ffffff55" }}>We'll rank your cards and show you exactly how much cashback you earn</div>
              </div>
            )}
          </>
        )}

        {/* ── ACCOUNTS TAB ── */}
        {tab === "accounts" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 6 }}>All Accounts</div>
              <div style={{ color: "#ffffff66" }}>Full overview of every card and account</div>
            </div>

            <div style={{
              background: "#0f1117", border: "1px solid #1e2235",
              borderRadius: 18, overflow: "hidden",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e2235" }}>
                    {["Account", "Type", "Bank", "Balance", "Details", ""].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "14px 20px",
                        color: "#ffffff55", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...cards, ...accounts].map((item, i) => (
                    <tr key={item.id} style={{
                      borderBottom: i < cards.length + accounts.length - 1 ? "1px solid #1e2235" : "none",
                      background: i % 2 === 0 ? "#ffffff04" : "transparent",
                    }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 28, height: 18, borderRadius: 4, background: item.color, border: `2px solid ${item.accent}`, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                            <div style={{ color: "#ffffff44", fontSize: 11, fontFamily: "monospace" }}>•••• {item.last4}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: item.type === "credit" ? "#e8b86d22" : item.type === "savings" ? "#66bb6a22" : "#64b5f622",
                          color: item.type === "credit" ? "#e8b86d" : item.type === "savings" ? "#66bb6a" : "#64b5f6",
                          padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                        }}>{item.type}</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#ffffff88", fontSize: 14 }}>{item.bank}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: item.type === "credit" ? "#ef9a9a" : "#66bb6a" }}>
                          {formatCurrency(item.balance)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#ffffff55", fontSize: 13 }}>
                        {item.type === "credit" ? `Limit: ${formatCurrency(item.limit)} · Fee: $${item.annualFee}/yr` : `APY: ${item.apy}%`}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button onClick={() => handleDelete(item.id)} style={{
                          background: "#ef535011", color: "#ef5350", border: "1px solid #ef535033",
                          borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700,
                        }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cashback comparison matrix */}
            {creditCards.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <div style={{ color: "#ffffff55", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Cashback Matrix</div>
                <div style={{
                  background: "#0f1117", border: "1px solid #1e2235",
                  borderRadius: 18, overflow: "auto",
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e2235" }}>
                        <th style={{ textAlign: "left", padding: "14px 20px", color: "#ffffff55", fontSize: 11, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase" }}>Category</th>
                        {creditCards.map(c => (
                          <th key={c.id} style={{ padding: "14px 16px", color: "#ffffff88", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                            <div style={{ fontSize: 10, color: "#ffffff44", marginBottom: 2 }}>•••• {c.last4}</div>
                            {c.name.split(" ").slice(0, 2).join(" ")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["dining", "groceries", "travel", "gas", "amazon", "streaming", "pharmacy", "home improvement", "entertainment", "other"].map((cat, i) => {
                        const rates = creditCards.map(c => getCashbackRate(c, cat));
                        const maxRate = Math.max(...rates);
                        return (
                          <tr key={cat} style={{ borderBottom: i < 9 ? "1px solid #1e2235" : "none", background: i % 2 === 0 ? "#ffffff04" : "transparent" }}>
                            <td style={{ padding: "12px 20px", color: "#ffffff88", fontSize: 13, textTransform: "capitalize", fontWeight: 600 }}>{cat}</td>
                            {creditCards.map((c, ci) => {
                              const rate = rates[ci];
                              const isBest = rate === maxRate;
                              return (
                                <td key={c.id} style={{ padding: "12px 16px", textAlign: "center" }}>
                                  <span style={{
                                    background: isBest ? "#e8b86d22" : "transparent",
                                    color: isBest ? "#e8b86d" : rate > 1 ? "#ffffff88" : "#ffffff33",
                                    fontWeight: isBest ? 900 : 600,
                                    fontSize: 15, padding: "4px 10px", borderRadius: 8,
                                    border: isBest ? "1px solid #e8b86d44" : "1px solid transparent",
                                  }}>
                                    {rate}%{isBest ? " ★" : ""}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}
