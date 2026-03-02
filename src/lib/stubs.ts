// ====== 全ジャンルのスタブ（ダミー）ゲームコード ======
// API消費なしでプロトタイプの品質確認が可能

export const STUB_GAMES: Record<string, string> = {

battle: `export default function Game() {
  const [state, setState] = React.useState({
    playerHp: 100, playerMaxHp: 100, playerMp: 50, playerMaxMp: 50,
    enemyHp: 80, enemyMaxHp: 80, level: 1, exp: 0, gold: 0,
    turn: "player", log: ["魔王の手下が現れた！"], gameOver: false, victory: false,
    enemyName: "ゴブリン", combo: 0, shield: 0,
    skills: [
      { name: "斬撃", cost: 0, dmg: [10, 18], icon: "⚔️" },
      { name: "ファイア", cost: 12, dmg: [20, 30], icon: "🔥" },
      { name: "ヒール", cost: 15, dmg: [0, 0], heal: [20, 30], icon: "💚" },
      { name: "雷撃", cost: 20, dmg: [25, 40], icon: "⚡" }
    ],
    enemies: ["ゴブリン", "スケルトン", "ダークウルフ", "オーク戦士", "ドラゴン"],
    enemyIdx: 0
  });
  const s = state;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const attack = (skill) => {
    if (s.turn !== "player" || s.gameOver) return;
    if (skill.cost > s.playerMp) return;
    let ns = { ...s, playerMp: s.playerMp - skill.cost };
    let newLog = [...s.log];
    if (skill.heal) {
      const h = rand(skill.heal[0], skill.heal[1]);
      ns.playerHp = Math.min(s.playerMaxHp, s.playerHp + h);
      newLog.push(skill.icon + " " + skill.name + "でHP" + h + "回復！");
    } else {
      const crit = Math.random() < 0.15;
      let dmg = rand(skill.dmg[0], skill.dmg[1]) + s.level * 2;
      if (crit) dmg = Math.floor(dmg * 1.8);
      ns.enemyHp = Math.max(0, s.enemyHp - dmg);
      ns.combo = s.combo + 1;
      newLog.push(skill.icon + " " + skill.name + "で" + dmg + "ダメージ！" + (crit ? " 🎯会心！" : "") + (ns.combo > 1 ? " " + ns.combo + "コンボ！" : ""));
    }
    if (ns.enemyHp <= 0) {
      const expGain = 20 + s.enemyIdx * 15;
      const goldGain = rand(10, 30) + s.enemyIdx * 10;
      ns.exp = s.exp + expGain;
      ns.gold = s.gold + goldGain;
      newLog.push("🎉 " + s.enemyName + "を倒した！ EXP+" + expGain + " Gold+" + goldGain);
      if (ns.exp >= ns.level * 40) {
        ns.level += 1;
        ns.playerMaxHp += 15;
        ns.playerMaxMp += 8;
        ns.playerHp = ns.playerMaxHp;
        ns.playerMp = ns.playerMaxMp;
        newLog.push("⬆️ レベル" + ns.level + "に上がった！ 全回復！");
      }
      if (s.enemyIdx >= s.enemies.length - 1) {
        ns.victory = true; ns.gameOver = true;
        newLog.push("👑 全ての敵を倒した！ クリア！");
      } else {
        const nextIdx = s.enemyIdx + 1;
        ns.enemyIdx = nextIdx;
        ns.enemyName = s.enemies[nextIdx];
        ns.enemyMaxHp = 80 + nextIdx * 40;
        ns.enemyHp = ns.enemyMaxHp;
        newLog.push("次の敵: " + s.enemies[nextIdx] + "が現れた！");
      }
      ns.log = newLog; ns.combo = 0;
      setState(ns);
      return;
    }
    ns.turn = "enemy"; ns.log = newLog;
    setState(ns);
    setTimeout(() => {
      setState(prev => {
        const eDmg = rand(8, 15) + prev.enemyIdx * 5 - prev.shield;
        const realDmg = Math.max(1, eDmg);
        const newHp = Math.max(0, prev.playerHp - realDmg);
        const eLog = [...prev.log, "👹 " + prev.enemyName + "の攻撃！ " + realDmg + "ダメージ！"];
        if (newHp <= 0) eLog.push("💀 力尽きた...");
        return { ...prev, playerHp: newHp, turn: "player", log: eLog, gameOver: newHp <= 0, shield: 0, combo: 0 };
      });
    }, 700);
  };
  const reset = () => setState({
    playerHp: 100, playerMaxHp: 100, playerMp: 50, playerMaxMp: 50,
    enemyHp: 80, enemyMaxHp: 80, level: 1, exp: 0, gold: 0,
    turn: "player", log: ["新たな冒険が始まる..."], gameOver: false, victory: false,
    enemyName: "ゴブリン", combo: 0, shield: 0,
    skills: s.skills, enemies: s.enemies, enemyIdx: 0
  });
  const Bar = ({ val, max, color, label }) => React.createElement("div", { style: { marginBottom: 4 } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 } },
      React.createElement("span", null, label),
      React.createElement("span", null, val + "/" + max)
    ),
    React.createElement("div", { style: { background: "#222", borderRadius: 6, height: 12, overflow: "hidden" } },
      React.createElement("div", { style: { width: (val / max * 100) + "%", height: "100%", background: color, borderRadius: 6, transition: "width 0.4s ease" } })
    )
  );
  return React.createElement("div", { style: { maxWidth: 500, margin: "0 auto", padding: 16 } },
    React.createElement("h2", { style: { textAlign: "center", color: "#FF6B6B", fontSize: 20, fontWeight: 800, marginBottom: 12 } }, "⚔️ ダークファンタジー戦記"),
    React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 12 } },
      React.createElement("span", null, "Lv." + s.level), React.createElement("span", null, "EXP:" + s.exp + "/" + (s.level * 40)), React.createElement("span", null, "💰" + s.gold)
    ),
    React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 16 } },
      React.createElement("div", { style: { flex: 1, background: "#111", borderRadius: 12, padding: 12 } },
        React.createElement("div", { style: { textAlign: "center", fontSize: 36, marginBottom: 4 } }, "🧙"),
        React.createElement("div", { style: { textAlign: "center", fontSize: 12, fontWeight: 700, marginBottom: 6 } }, "勇者"),
        Bar({ val: s.playerHp, max: s.playerMaxHp, color: "linear-gradient(90deg, #4CAF50, #8BC34A)", label: "HP" }),
        Bar({ val: s.playerMp, max: s.playerMaxMp, color: "linear-gradient(90deg, #2196F3, #00BCD4)", label: "MP" })
      ),
      React.createElement("div", { style: { alignSelf: "center", fontSize: 24, color: "#555" } }, "⚡"),
      React.createElement("div", { style: { flex: 1, background: "#111", borderRadius: 12, padding: 12 } },
        React.createElement("div", { style: { textAlign: "center", fontSize: 36, marginBottom: 4 } }, ["👹","💀","🐺","👿","🐉"][s.enemyIdx]),
        React.createElement("div", { style: { textAlign: "center", fontSize: 12, fontWeight: 700, marginBottom: 6 } }, s.enemyName),
        Bar({ val: s.enemyHp, max: s.enemyMaxHp, color: "linear-gradient(90deg, #f44336, #FF9800)", label: "HP" })
      )
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 } },
      ...s.skills.map((sk, i) => React.createElement("button", {
        key: i, onClick: () => attack(sk),
        disabled: s.turn !== "player" || s.gameOver || sk.cost > s.playerMp,
        style: { padding: "10px 8px", borderRadius: 10, border: "none", background: s.turn !== "player" || s.gameOver || sk.cost > s.playerMp ? "#333" : (sk.cost === 0 ? "#4488FF" : "#AA44FF"), color: "#fff", cursor: s.turn === "player" && !s.gameOver && sk.cost <= s.playerMp ? "pointer" : "default", fontSize: 13, fontWeight: 700 }
      }, sk.icon + " " + sk.name + (sk.cost > 0 ? " (" + sk.cost + "MP)" : "")))
    ),
    s.gameOver && React.createElement("div", { style: { textAlign: "center", marginBottom: 12 } },
      React.createElement("button", { onClick: reset, style: { padding: "10px 28px", borderRadius: 10, border: "none", background: "#4CAF50", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" } }, "🔄 最初から")
    ),
    React.createElement("div", { style: { background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 120, overflowY: "auto", fontSize: 12 } },
      ...s.log.slice(-6).map((l, i) => React.createElement("div", { key: i, style: { color: l.includes("会心") || l.includes("倒した") || l.includes("クリア") ? "#4CAF50" : l.includes("力尽") ? "#f44" : l.includes("レベル") ? "#FFD700" : "#aaa", marginBottom: 2 } }, l))
    )
  );
}`,

card: `export default function Game() {
  const allCards = [
    { name: "炎の剣士", atk: 7, def: 3, cost: 3, icon: "🔥", type: "fire" },
    { name: "氷の魔女", atk: 5, def: 6, cost: 4, icon: "❄️", type: "ice" },
    { name: "雷の龍", atk: 9, def: 2, cost: 5, icon: "⚡", type: "thunder" },
    { name: "大地の盾", atk: 2, def: 9, cost: 3, icon: "🪨", type: "earth" },
    { name: "風の精霊", atk: 6, def: 4, cost: 2, icon: "🌪️", type: "wind" },
    { name: "闇の騎士", atk: 8, def: 5, cost: 5, icon: "🌙", type: "dark" },
    { name: "光の天使", atk: 4, def: 8, cost: 4, icon: "✨", type: "light" },
    { name: "森の守人", atk: 3, def: 7, cost: 2, icon: "🌿", type: "earth" },
  ];
  const drawCards = (n) => Array.from({ length: n }, () => allCards[Math.floor(Math.random() * allCards.length)]);
  const [s, setS] = React.useState({ hand: drawCards(4), enemyHand: 3, playerHp: 30, enemyHp: 30, mana: 5, maxMana: 5, round: 1, log: ["カードバトル開始！"], field: null, enemyField: null, phase: "select" });
  const playCard = (idx) => {
    if (s.phase !== "select") return;
    const card = s.hand[idx];
    if (card.cost > s.mana) return;
    const newHand = s.hand.filter((_, i) => i !== idx);
    const eCard = allCards[Math.floor(Math.random() * allCards.length)];
    setS(p => ({ ...p, field: card, enemyField: eCard, hand: newHand, mana: p.mana - card.cost, phase: "battle" }));
    setTimeout(() => {
      setS(prev => {
        const pDmg = Math.max(0, prev.field.atk - prev.enemyField.def);
        const eDmg = Math.max(0, prev.enemyField.atk - prev.field.def);
        const nEHp = Math.max(0, prev.enemyHp - pDmg);
        const nPHp = Math.max(0, prev.playerHp - eDmg);
        const newLog = [...prev.log, prev.field.icon + prev.field.name + "(" + pDmg + "dmg) vs " + prev.enemyField.icon + prev.enemyField.name + "(" + eDmg + "dmg)"];
        if (nEHp <= 0) newLog.push("🎉 勝利！");
        if (nPHp <= 0) newLog.push("💀 敗北...");
        const newMana = Math.min(prev.maxMana + 1, 10);
        const drawn = drawCards(1);
        return { ...prev, playerHp: nPHp, enemyHp: nEHp, field: null, enemyField: null, phase: nEHp <= 0 || nPHp <= 0 ? "end" : "select", round: prev.round + 1, log: newLog, mana: newMana, maxMana: newMana, hand: [...prev.hand, ...drawn].slice(0, 6) };
      });
    }, 1500);
  };
  const reset = () => setS({ hand: drawCards(4), enemyHand: 3, playerHp: 30, enemyHp: 30, mana: 5, maxMana: 5, round: 1, log: ["新しいバトル開始！"], field: null, enemyField: null, phase: "select" });
  const HpBar = ({ val, max, col, label }) => React.createElement("div", null,
    React.createElement("div", { style: { fontSize: 11, display: "flex", justifyContent: "space-between" } }, React.createElement("span", null, label), React.createElement("span", null, val + "/" + max)),
    React.createElement("div", { style: { height: 10, background: "#222", borderRadius: 5, overflow: "hidden" } }, React.createElement("div", { style: { width: (val/max*100)+"%", height: "100%", background: col, transition: "width 0.5s", borderRadius: 5 } }))
  );
  return React.createElement("div", { style: { maxWidth: 500, margin: "0 auto", padding: 16 } },
    React.createElement("h2", { style: { textAlign: "center", color: "#4488FF", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "🃏 エレメントカードバトル"),
    React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 12 } }, React.createElement("span", null, "R" + s.round), React.createElement("span", null, "💎 " + s.mana + "/" + s.maxMana)),
    React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 12 } },
      React.createElement("div", { style: { flex: 1 } }, HpBar({ val: s.playerHp, max: 30, col: "#4CAF50", label: "あなた" })),
      React.createElement("div", { style: { flex: 1 } }, HpBar({ val: s.enemyHp, max: 30, col: "#f44", label: "相手" }))
    ),
    s.field && s.enemyField && React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 20, marginBottom: 12, padding: 12, background: "#111", borderRadius: 12 } },
      React.createElement("div", { style: { textAlign: "center" } }, React.createElement("div", { style: { fontSize: 36 } }, s.field.icon), React.createElement("div", { style: { fontSize: 11 } }, s.field.name)),
      React.createElement("div", { style: { alignSelf: "center", fontSize: 20 } }, "⚔️"),
      React.createElement("div", { style: { textAlign: "center" } }, React.createElement("div", { style: { fontSize: 36 } }, s.enemyField.icon), React.createElement("div", { style: { fontSize: 11 } }, s.enemyField.name))
    ),
    React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 } },
      ...s.hand.map((c, i) => React.createElement("button", { key: i, onClick: () => playCard(i), disabled: s.phase !== "select" || c.cost > s.mana,
        style: { width: 90, padding: "8px 4px", borderRadius: 10, border: "2px solid " + (c.cost <= s.mana && s.phase === "select" ? "#4488FF" : "#333"), background: "#111", color: "#fff", cursor: s.phase === "select" && c.cost <= s.mana ? "pointer" : "default", textAlign: "center", fontSize: 11, transition: "transform 0.2s" },
        onMouseEnter: e => { if(s.phase==="select"&&c.cost<=s.mana) e.currentTarget.style.transform="translateY(-4px)"; },
        onMouseLeave: e => { e.currentTarget.style.transform="translateY(0)"; }
      },
        React.createElement("div", { style: { fontSize: 24 } }, c.icon),
        React.createElement("div", { style: { fontWeight: 700, marginTop: 2 } }, c.name),
        React.createElement("div", { style: { color: "#888", marginTop: 2 } }, "⚔" + c.atk + " 🛡" + c.def + " 💎" + c.cost)
      ))
    ),
    s.phase === "end" && React.createElement("div", { style: { textAlign: "center", marginBottom: 12 } }, React.createElement("button", { onClick: reset, style: { padding: "10px 28px", borderRadius: 10, border: "none", background: "#4488FF", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" } }, "🔄 もう一度")),
    React.createElement("div", { style: { background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 100, overflowY: "auto", fontSize: 11 } },
      ...s.log.slice(-5).map((l, i) => React.createElement("div", { key: i, style: { color: l.includes("勝利") ? "#4CAF50" : l.includes("敗北") ? "#f44" : "#aaa", marginBottom: 2 } }, l))
    )
  );
}`,

nurture: `export default function Game() {
  const stages = [{ name: "タマゴ", icon: "🥚", req: 0 }, { name: "ヒヨコ", icon: "🐣", req: 3 }, { name: "ニワトリ", icon: "🐔", req: 6 }, { name: "フェニックス", icon: "🦅", req: 10 }, { name: "神鳥", icon: "🌟", req: 15 }];
  const [s, setS] = React.useState({ level: 1, exp: 0, hunger: 80, happiness: 70, health: 90, age: 0, gold: 50, stage: 0, log: ["タマゴを手に入れた！"], inventory: ["りんご", "おもちゃ"], sleeping: false });
  const getStage = () => { let st = 0; for (let i = stages.length - 1; i >= 0; i--) { if (s.level >= stages[i].req) { st = i; break; } } return stages[st]; };
  const act = (type) => {
    if (s.sleeping) return;
    setS(prev => {
      let ns = { ...prev, age: prev.age + 1 };
      let newLog = [...prev.log];
      if (type === "feed") { ns.hunger = Math.min(100, prev.hunger + 25); ns.exp += 5; ns.gold -= 5; newLog.push("🍖 ごはんをあげた！ 満腹度+25"); }
      if (type === "play") { ns.happiness = Math.min(100, prev.happiness + 20); ns.hunger = Math.max(0, prev.hunger - 8); ns.exp += 10; newLog.push("🎾 遊んであげた！ 幸福度+20"); }
      if (type === "train") { ns.exp += 20; ns.hunger = Math.max(0, prev.hunger - 12); ns.health = Math.max(0, prev.health - 5); newLog.push("💪 トレーニング！ EXP+20"); }
      if (type === "heal") { ns.health = Math.min(100, prev.health + 30); ns.gold -= 10; newLog.push("💊 お薬をあげた！ 体力+30"); }
      if (type === "sleep") { ns.sleeping = true; newLog.push("💤 おやすみ..."); setTimeout(() => setS(p => ({ ...p, sleeping: false, hunger: Math.max(0, p.hunger - 10), health: Math.min(100, p.health + 20), happiness: Math.min(100, p.happiness + 10), log: [...p.log, "☀️ おはよう！ 体力回復！"] })), 2000); }
      if (ns.exp >= ns.level * 30) { ns.level += 1; ns.exp = 0; ns.gold += 20; newLog.push("🎉 レベル" + ns.level + "！ 20ゴールド獲得！"); const newStage = stages.findIndex(st => ns.level >= st.req); if (newStage > prev.stage) { ns.stage = newStage; newLog.push("✨ " + stages[newStage].name + "に進化した！"); } }
      if (ns.hunger <= 0) { ns.health = Math.max(0, ns.health - 10); newLog.push("⚠️ お腹ペコペコ...体力-10"); }
      ns.log = newLog;
      return ns;
    });
  };
  const cur = getStage();
  const StatBar = ({ label, val, color, icon }) => React.createElement("div", { style: { marginBottom: 6 } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 } }, React.createElement("span", null, icon + " " + label), React.createElement("span", null, val + "%")),
    React.createElement("div", { style: { height: 8, background: "#222", borderRadius: 4, overflow: "hidden" } }, React.createElement("div", { style: { width: val + "%", height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" } }))
  );
  return React.createElement("div", { style: { maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" } },
    React.createElement("h2", { style: { color: "#44BB44", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "🌱 ふしぎ育成記"),
    React.createElement("div", { style: { fontSize: 12, color: "#888", marginBottom: 12 } }, "Lv." + s.level + " | " + cur.name + " | 💰" + s.gold + " | 年齢:" + s.age),
    React.createElement("div", { style: { fontSize: 80, margin: "8px 0", filter: s.sleeping ? "brightness(0.4)" : "none", transition: "filter 0.5s" } }, s.sleeping ? "💤" : cur.icon),
    React.createElement("div", { style: { background: "#111", borderRadius: 12, padding: 12, marginBottom: 12, textAlign: "left" } },
      StatBar({ label: "満腹度", val: s.hunger, color: "#FF8844", icon: "🍖" }),
      StatBar({ label: "幸福度", val: s.happiness, color: "#FF44AA", icon: "💕" }),
      StatBar({ label: "体力", val: s.health, color: "#44BB44", icon: "💚" }),
      React.createElement("div", { style: { fontSize: 11, color: "#888", marginTop: 4 } }, "EXP: " + s.exp + "/" + (s.level * 30))
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 } },
      ...[["🍖 ごはん", "feed", "#FF8844"], ["🎾 遊ぶ", "play", "#4488FF"], ["💪 鍛える", "train", "#AA44FF"], ["💊 お薬", "heal", "#44BB44"], ["💤 寝る", "sleep", "#666"]].map(([label, act2, col]) =>
        React.createElement("button", { key: act2, onClick: () => act(act2), disabled: s.sleeping,
          style: { padding: "8px 4px", borderRadius: 8, border: "none", background: s.sleeping ? "#333" : col, color: "#fff", cursor: s.sleeping ? "default" : "pointer", fontSize: 12, fontWeight: 600 } }, label))
    ),
    React.createElement("div", { style: { background: "#0a0a12", borderRadius: 10, padding: 8, maxHeight: 80, overflowY: "auto", fontSize: 11, textAlign: "left" } },
      ...s.log.slice(-4).map((l, i) => React.createElement("div", { key: i, style: { color: l.includes("進化") || l.includes("レベル") ? "#FFD700" : l.includes("⚠") ? "#f44" : "#aaa" } }, l))
    )
  );
}`,

puzzle: `export default function Game() {
  const init = () => { const nums = [1,2,3,4,5,6,7,8,null]; for (let i = nums.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [nums[i],nums[j]]=[nums[j],nums[i]]; } return { tiles: nums, moves: 0, won: false, time: 0, best: null }; };
  const [s, setS] = React.useState(init());
  const [timer, setTimer] = React.useState(null);
  React.useEffect(() => { if (!s.won && s.moves > 0) { const t = setInterval(() => setS(p => ({...p, time: p.time+1})), 1000); setTimer(t); return () => clearInterval(t); } if (s.won && timer) clearInterval(timer); }, [s.won, s.moves > 0]);
  const move = (idx) => {
    if (s.won) return;
    const empty = s.tiles.indexOf(null);
    const r = Math.floor(idx/3), c = idx%3, er = Math.floor(empty/3), ec = empty%3;
    if ((Math.abs(r-er)===1&&c===ec)||(Math.abs(c-ec)===1&&r===er)) {
      const t = [...s.tiles]; [t[idx],t[empty]]=[t[empty],t[idx]];
      const won = t.slice(0,8).every((v,i)=>v===i+1);
      setS(p => ({...p, tiles: t, moves: p.moves+1, won, best: won ? (p.best ? Math.min(p.best, p.moves+1) : p.moves+1) : p.best}));
    }
  };
  const fmt = (t) => Math.floor(t/60) + ":" + String(t%60).padStart(2,"0");
  return React.createElement("div", { style: { maxWidth: 400, margin: "0 auto", padding: 16, textAlign: "center" } },
    React.createElement("h2", { style: { color: "#FF8844", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "🧩 スライドパズル"),
    React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, fontSize: 13, color: "#888", marginBottom: 16 } },
      React.createElement("span", null, "🔢 " + s.moves + "手"), React.createElement("span", null, "⏱ " + fmt(s.time)), s.best && React.createElement("span", null, "🏆 最高:" + s.best + "手")
    ),
    s.won && React.createElement("div", { style: { background: "#1a3a1a", borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 16, fontWeight: 700, color: "#4CAF50" } }, "🎉 クリア！ " + s.moves + "手 / " + fmt(s.time)),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,80px)", gap: 4, justifyContent: "center", marginBottom: 16 } },
      ...s.tiles.map((t, i) => React.createElement("div", { key: i, onClick: () => move(i),
        style: { width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center",
          background: t ? "linear-gradient(135deg, #FF8844, #FF6644)" : "transparent", color: "#fff", fontSize: 28, fontWeight: 800, borderRadius: 10,
          cursor: t ? "pointer" : "default", transition: "all 0.15s", boxShadow: t ? "0 2px 8px rgba(255,136,68,0.3)" : "none",
          transform: s.won && t ? "scale(1.05)" : "scale(1)" } }, t))
    ),
    React.createElement("button", { onClick: () => setS(init()), style: { padding: "10px 28px", borderRadius: 10, border: "none", background: "#555", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, "🔄 リセット")
  );
}`,

rpg: `export default function Game() {
  const [s, setS] = React.useState({ hp: 100, maxHp: 100, mp: 40, maxMp: 40, atk: 12, def: 5, gold: 0, level: 1, exp: 0, floor: 1, log: ["ダンジョンに足を踏み入れた..."], inBattle: false, enemy: null, enemyHp: 0, enemyMaxHp: 0, inventory: ["ポーション x2"], potions: 2, gameOver: false });
  const enemies = [
    { name: "スライム", icon: "🟢", hp: 25, atk: 5, exp: 10, gold: 8 },
    { name: "コウモリ", icon: "🦇", hp: 30, atk: 8, exp: 15, gold: 12 },
    { name: "ゴブリン", icon: "👺", hp: 45, atk: 12, exp: 25, gold: 20 },
    { name: "ミノタウロス", icon: "🐂", hp: 70, atk: 18, exp: 40, gold: 35 },
    { name: "ドラゴン", icon: "🐉", hp: 120, atk: 25, exp: 80, gold: 60 },
  ];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const explore = () => {
    const r = Math.random();
    setS(prev => {
      if (r < 0.5) { const eIdx = Math.min(Math.floor(prev.floor / 2), enemies.length - 1); const e = enemies[eIdx]; return { ...prev, inBattle: true, enemy: e, enemyHp: e.hp + prev.floor * 5, enemyMaxHp: e.hp + prev.floor * 5, log: [...prev.log, e.icon + " " + e.name + "が現れた！"] }; }
      if (r < 0.7) { const g = rand(5, 15) + prev.floor * 3; return { ...prev, gold: prev.gold + g, log: [...prev.log, "💰 宝箱発見！ " + g + "ゴールド！"] }; }
      if (r < 0.85) { const h = rand(15, 25); return { ...prev, hp: Math.min(prev.maxHp, prev.hp + h), log: [...prev.log, "⛲ 癒しの泉！ HP+" + h] }; }
      return { ...prev, potions: prev.potions + 1, log: [...prev.log, "🧪 ポーションを見つけた！"] };
    });
  };
  const fight = () => {
    setS(prev => {
      const dmg = rand(prev.atk - 2, prev.atk + 5);
      const newEHp = Math.max(0, prev.enemyHp - dmg);
      let ns = { ...prev, enemyHp: newEHp, log: [...prev.log, "⚔️ " + dmg + "ダメージ！"] };
      if (newEHp <= 0) {
        ns.inBattle = false; ns.exp = prev.exp + prev.enemy.exp; ns.gold = prev.gold + prev.enemy.gold; ns.floor = prev.floor + 1;
        ns.log = [...ns.log, "🎉 " + prev.enemy.name + "を倒した！ EXP+" + prev.enemy.exp + " Gold+" + prev.enemy.gold + " → B" + (prev.floor + 1) + "F"];
        if (ns.exp >= ns.level * 35) { ns.level += 1; ns.exp = 0; ns.maxHp += 12; ns.maxMp += 5; ns.atk += 3; ns.def += 2; ns.hp = ns.maxHp; ns.mp = ns.maxMp; ns.log = [...ns.log, "⬆️ Lv" + ns.level + "！全回復！ATK+" + 3]; }
        return ns;
      }
      const eDmg = Math.max(1, rand(prev.enemy.atk - 3, prev.enemy.atk + 2) - prev.def);
      ns.hp = Math.max(0, prev.hp - eDmg); ns.log = [...ns.log, prev.enemy.icon + " " + eDmg + "ダメージ受けた！"];
      if (ns.hp <= 0) { ns.gameOver = true; ns.log = [...ns.log, "💀 力尽きた... B" + prev.floor + "Fで倒れた"]; }
      return ns;
    });
  };
  const usePotion = () => { setS(prev => prev.potions <= 0 ? prev : { ...prev, hp: Math.min(prev.maxHp, prev.hp + 30), potions: prev.potions - 1, log: [...prev.log, "🧪 ポーション使用！ HP+30"] }); };
  const reset = () => setS({ hp: 100, maxHp: 100, mp: 40, maxMp: 40, atk: 12, def: 5, gold: 0, level: 1, exp: 0, floor: 1, log: ["再び冒険へ..."], inBattle: false, enemy: null, enemyHp: 0, enemyMaxHp: 0, inventory: ["ポーション x2"], potions: 2, gameOver: false });
  const Bar = ({ v, m, c, l }) => React.createElement("div", { style: { marginBottom: 3 } }, React.createElement("div", { style: { fontSize: 10, display: "flex", justifyContent: "space-between" } }, React.createElement("span",null,l), React.createElement("span",null,v+"/"+m)), React.createElement("div", { style: { height: 8, background: "#222", borderRadius: 4, overflow: "hidden" } }, React.createElement("div", { style: { width: (v/m*100)+"%", height: "100%", background: c, borderRadius: 4, transition: "width 0.3s" } })));
  return React.createElement("div", { style: { maxWidth: 460, margin: "0 auto", padding: 16 } },
    React.createElement("h2", { style: { textAlign: "center", color: "#AA44FF", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "🗡️ 深淵のダンジョン"),
    React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 10, fontSize: 11, color: "#888", marginBottom: 10 } }, React.createElement("span",null,"Lv."+s.level), React.createElement("span",null,"B"+s.floor+"F"), React.createElement("span",null,"⚔️"+s.atk), React.createElement("span",null,"🛡"+s.def), React.createElement("span",null,"💰"+s.gold), React.createElement("span",null,"🧪"+s.potions)),
    React.createElement("div", { style: { background: "#111", borderRadius: 12, padding: 12, marginBottom: 12 } },
      Bar({v:s.hp,m:s.maxHp,c:"linear-gradient(90deg,#4CAF50,#8BC34A)",l:"HP"}), Bar({v:s.mp,m:s.maxMp,c:"linear-gradient(90deg,#2196F3,#00BCD4)",l:"MP"}),
      React.createElement("div",{style:{fontSize:10,color:"#666",marginTop:4}},"EXP: "+s.exp+"/"+(s.level*35))
    ),
    s.inBattle && React.createElement("div", { style: { background: "#1a0a1a", borderRadius: 12, padding: 16, marginBottom: 12, textAlign: "center" } },
      React.createElement("div",{style:{fontSize:48}}, s.enemy.icon), React.createElement("div",{style:{fontWeight:700,fontSize:14,margin:"4px 0"}}, s.enemy.name),
      Bar({v:s.enemyHp,m:s.enemyMaxHp,c:"linear-gradient(90deg,#f44,#FF9800)",l:"Enemy HP"})
    ),
    React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 } },
      !s.inBattle && !s.gameOver && React.createElement("button", { onClick: explore, style: { padding: "10px 24px", borderRadius: 10, border: "none", background: "#AA44FF", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 } }, "🚶 探索する"),
      s.inBattle && React.createElement("button", { onClick: fight, style: { padding: "10px 24px", borderRadius: 10, border: "none", background: "#f44", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 } }, "⚔️ 攻撃"),
      (s.inBattle || !s.gameOver) && React.createElement("button", { onClick: usePotion, disabled: s.potions<=0, style: { padding: "10px 20px", borderRadius: 10, border: "none", background: s.potions>0?"#4CAF50":"#333", color: "#fff", cursor: s.potions>0?"pointer":"default", fontWeight: 700, fontSize: 14 } }, "🧪 回復"),
      s.gameOver && React.createElement("button", { onClick: reset, style: { padding: "10px 24px", borderRadius: 10, border: "none", background: "#4CAF50", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 } }, "🔄 リスタート")
    ),
    React.createElement("div", { style: { background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 100, overflowY: "auto", fontSize: 11 } },
      ...s.log.slice(-5).map((l, i) => React.createElement("div", { key: i, style: { color: l.includes("倒した")||l.includes("Lv")?"#4CAF50":l.includes("力尽")?"#f44":l.includes("💰")||l.includes("⛲")?"#FFD700":"#aaa", marginBottom: 2 } }, l))
    )
  );
}`,

quiz: `export default function Game() {
  const questions = [
    { q: "日本で最も高い山は？", a: ["富士山","北岳","奥穂高岳","槍ヶ岳"], c: 0 },
    { q: "1バイトは何ビット？", a: ["4","8","16","32"], c: 1 },
    { q: "太陽系で最大の惑星は？", a: ["土星","木星","天王星","海王星"], c: 1 },
    { q: "人体の骨の数は約何本？", a: ["106","156","206","256"], c: 2 },
    { q: "「源氏物語」の作者は？", a: ["清少納言","紫式部","和泉式部","小野小町"], c: 1 },
    { q: "光の速さは秒速約何km？", a: ["10万","20万","30万","40万"], c: 2 },
    { q: "水の化学式は？", a: ["CO2","H2O","NaCl","O2"], c: 1 },
    { q: "世界で最も面積が大きい国は？", a: ["カナダ","中国","アメリカ","ロシア"], c: 3 },
  ];
  const [s, setS] = React.useState({ idx: 0, score: 0, streak: 0, maxStreak: 0, answered: false, selected: -1, timeLeft: 15, finished: false });
  React.useEffect(() => { if (!s.answered && !s.finished && s.timeLeft > 0) { const t = setTimeout(() => setS(p => p.timeLeft <= 1 ? {...p, answered: true, selected: -1, timeLeft: 0} : {...p, timeLeft: p.timeLeft - 1}), 1000); return () => clearTimeout(t); } }, [s.timeLeft, s.answered, s.finished]);
  const answer = (i) => { if (s.answered) return; const correct = i === questions[s.idx].c; setS(p => ({...p, answered: true, selected: i, score: p.score + (correct ? 100 + p.streak * 20 + p.timeLeft * 5 : 0), streak: correct ? p.streak + 1 : 0, maxStreak: correct ? Math.max(p.maxStreak, p.streak + 1) : p.maxStreak})); };
  const next = () => { if (s.idx + 1 >= questions.length) { setS(p => ({...p, finished: true})); } else { setS(p => ({...p, idx: p.idx + 1, answered: false, selected: -1, timeLeft: 15})); } };
  const reset = () => setS({ idx: 0, score: 0, streak: 0, maxStreak: 0, answered: false, selected: -1, timeLeft: 15, finished: false });
  const cur = questions[s.idx];
  if (s.finished) return React.createElement("div", { style: { maxWidth: 420, margin: "0 auto", padding: 20, textAlign: "center" } },
    React.createElement("div", { style: { fontSize: 60, marginBottom: 12 } }, s.score >= 600 ? "🏆" : s.score >= 400 ? "🎉" : "📝"),
    React.createElement("h2", { style: { color: "#FFAA00", fontSize: 22, fontWeight: 800, marginBottom: 8 } }, "結果発表"),
    React.createElement("div", { style: { fontSize: 32, fontWeight: 900, color: "#FFD700", marginBottom: 8 } }, s.score + "点"),
    React.createElement("div", { style: { fontSize: 13, color: "#888", marginBottom: 16 } }, "最大連続正解: " + s.maxStreak + "問"),
    React.createElement("button", { onClick: reset, style: { padding: "12px 32px", borderRadius: 10, border: "none", background: "#FFAA00", color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer" } }, "もう一度挑戦")
  );
  return React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", padding: 16 } },
    React.createElement("h2", { style: { textAlign: "center", color: "#FFAA00", fontSize: 20, fontWeight: 800, marginBottom: 4 } }, "❓ 雑学マスター"),
    React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 12 } }, React.createElement("span",null,"Q"+(s.idx+1)+"/"+questions.length), React.createElement("span",null,"💯 "+s.score+"点"), React.createElement("span",null,"🔥 "+s.streak+"連続"), React.createElement("span",{style:{color:s.timeLeft<=5?"#f44":"#888"}},"⏱ "+s.timeLeft+"s")),
    React.createElement("div", { style: { background: "#1a1a2e", borderRadius: 14, padding: 20, marginBottom: 12, textAlign: "center", fontSize: 17, fontWeight: 600, lineHeight: 1.6 } }, cur.q),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
      ...cur.a.map((a, i) => React.createElement("button", { key: i, onClick: () => answer(i), disabled: s.answered,
        style: { padding: "14px 10px", borderRadius: 10, border: "2px solid " + (s.answered ? (i===cur.c ? "#4CAF50" : i===s.selected ? "#f44" : "#333") : "#444"), background: s.answered ? (i===cur.c ? "#1a3a1a" : i===s.selected ? "#3a1a1a" : "#111") : "#1a1a2e", color: "#fff", fontSize: 14, fontWeight: 600, cursor: s.answered ? "default" : "pointer", transition: "all 0.2s" } }, a))
    ),
    s.answered && React.createElement("div", { style: { textAlign: "center", marginTop: 12 } }, React.createElement("button", { onClick: next, style: { padding: "10px 28px", borderRadius: 10, border: "none", background: "#FFAA00", color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer" } }, s.idx + 1 >= questions.length ? "結果を見る" : "次の問題 →"))
  );
}`,

rhythm: `export default function Game() {
  const lanes = ["🔴","🔵","🟢","🟡"];
  const [s, setS] = React.useState({ score: 0, combo: 0, maxCombo: 0, notes: [], round: 0, total: 12, active: false, result: "", streak: [] });
  const start = () => { const pattern = Array.from({length: 12}, () => Math.floor(Math.random()*4)); setS({score: 0, combo: 0, maxCombo: 0, notes: pattern, round: 0, total: 12, active: true, result: "", streak: []}); };
  const hit = (lane) => { if (!s.active || s.round >= s.notes.length) return; const correct = lane === s.notes[s.round]; const combo = correct ? s.combo + 1 : 0; const points = correct ? 100 * Math.min(combo + 1, 5) : 0; const ns = {
    ...s, round: s.round + 1, score: s.score + points, combo, maxCombo: Math.max(s.maxCombo, combo),
    result: correct ? (combo >= 3 ? "🔥 PERFECT!" : "✨ GOOD!") : "💨 MISS...",
    streak: [...s.streak, correct]
  }; if (ns.round >= ns.notes.length) ns.active = false; setS(ns); };
  const grade = s.score >= 4000 ? "S" : s.score >= 2500 ? "A" : s.score >= 1500 ? "B" : "C";
  return React.createElement("div", { style: { maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" } },
    React.createElement("h2", { style: { color: "#FF44AA", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "🎵 リズムチャレンジ"),
    React.createElement("div", { style: { fontSize: 12, color: "#888", marginBottom: 12 } }, "Score: " + s.score + " | Combo: " + s.combo + " | Max: " + s.maxCombo),
    s.active ? React.createElement("div", null,
      React.createElement("div", { style: { fontSize: 13, marginBottom: 4, color: "#666" } }, "ノート " + (s.round + 1) + "/" + s.total),
      React.createElement("div", { style: { fontSize: 48, marginBottom: 8, background: "#111", borderRadius: 16, padding: 16, display: "inline-block" } }, lanes[s.notes[s.round]]),
      React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: s.result.includes("PERFECT") ? "#FFD700" : s.result.includes("GOOD") ? "#4CAF50" : "#f44", marginBottom: 12, minHeight: 28 } }, s.result),
      React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", marginBottom: 12 } },
        ...lanes.map((l, i) => React.createElement("button", { key: i, onClick: () => hit(i), style: { fontSize: 36, width: 64, height: 64, borderRadius: "50%", border: "3px solid #333", background: "#111", cursor: "pointer", transition: "transform 0.1s, border-color 0.1s" }, onMouseDown: e => { e.currentTarget.style.transform="scale(0.9)"; e.currentTarget.style.borderColor="#fff"; }, onMouseUp: e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.borderColor="#333"; } }, l))
      ),
      React.createElement("div", { style: { display: "flex", gap: 3, justifyContent: "center" } }, ...s.streak.map((ok, i) => React.createElement("div", { key: i, style: { width: 8, height: 8, borderRadius: "50%", background: ok ? "#4CAF50" : "#f44" } })))
    ) : s.round > 0 ? React.createElement("div", null,
      React.createElement("div", { style: { fontSize: 64, marginBottom: 8 } }, grade === "S" ? "🏆" : grade === "A" ? "🎉" : "🎵"),
      React.createElement("div", { style: { fontSize: 36, fontWeight: 900, color: "#FFD700" } }, grade + "ランク"),
      React.createElement("div", { style: { fontSize: 24, fontWeight: 700, margin: "8px 0" } }, s.score + "pt"),
      React.createElement("div", { style: { fontSize: 13, color: "#888", marginBottom: 16 } }, "最大コンボ: " + s.maxCombo),
      React.createElement("button", { onClick: start, style: { padding: "12px 32px", borderRadius: 10, border: "none", background: "#FF44AA", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" } }, "🔄 もう一度")
    ) : React.createElement("div", null,
      React.createElement("div", { style: { fontSize: 60, marginBottom: 16 } }, "🎵"),
      React.createElement("p", { style: { color: "#888", fontSize: 13, marginBottom: 16 } }, "表示される色と同じボタンをタップしよう！"),
      React.createElement("button", { onClick: start, style: { padding: "14px 36px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #FF44AA, #AA44FF)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" } }, "🎵 スタート")
    )
  );
}`,

simulator: `export default function Game() {
  const [s, setS] = React.useState({ money: 5000, day: 1, staff: 1, reputation: 30, customers: 5, menu: 1, decor: 1, log: ["☕ カフェをオープン！"], events: [] });
  const act = (type) => {
    setS(prev => {
      let ns = { ...prev, day: prev.day + 1, log: [...prev.log] };
      if (type === "ads") { ns.money -= 500; ns.reputation += 8; ns.customers += Math.floor(Math.random() * 8) + 4; ns.log.push("📢 広告を出した！ 知名度UP"); }
      if (type === "hire") { ns.money -= 800; ns.staff += 1; ns.log.push("👤 スタッフを雇った！ (" + (prev.staff+1) + "人)"); }
      if (type === "menu") { ns.money -= 1200; ns.menu += 1; ns.reputation += 5; ns.log.push("🍰 メニューを拡充！ (Lv" + (prev.menu+1) + ")"); }
      if (type === "decor") { ns.money -= 2000; ns.decor += 1; ns.reputation += 10; ns.log.push("🎨 内装をリニューアル！ (Lv" + (prev.decor+1) + ")"); }
      if (type === "work") {
        const income = ns.customers * (10 + ns.menu * 5) * Math.min(ns.staff, Math.ceil(ns.customers / 3));
        const cost = ns.staff * 100;
        ns.money += income - cost;
        ns.customers = Math.max(1, ns.customers + Math.floor(Math.random() * 5) - 2 + Math.floor(ns.reputation / 20));
        ns.log.push("💰 営業！ 売上:" + income + "円 人件費:" + cost + "円");
        if (Math.random() < 0.2) { const events = ["📰 雑誌に掲載！ 知名度+15", "🌧 雨で客足減少...", "⭐ 常連客が友達を連れてきた！"]; const ev = events[Math.floor(Math.random() * events.length)]; ns.log.push(ev); if (ev.includes("掲載")) { ns.reputation += 15; ns.customers += 5; } if (ev.includes("雨")) ns.customers = Math.max(1, ns.customers - 3); if (ev.includes("常連")) ns.customers += 3; }
      }
      return ns;
    });
  };
  const Stat = ({ icon, label, val }) => React.createElement("div", { style: { background: "#111", borderRadius: 8, padding: "8px 10px", textAlign: "center" } }, React.createElement("div", { style: { fontSize: 18 } }, icon), React.createElement("div", { style: { fontSize: 10, color: "#888", marginTop: 2 } }, label), React.createElement("div", { style: { fontSize: 14, fontWeight: 700 } }, val));
  return React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", padding: 16 } },
    React.createElement("h2", { style: { textAlign: "center", color: "#44AAAA", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "🏗️ カフェ経営シミュレータ"),
    React.createElement("div", { style: { textAlign: "center", fontSize: 12, color: "#888", marginBottom: 12 } }, "📅 " + s.day + "日目"),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 12 } },
      Stat({ icon: "💰", label: "資金", val: s.money.toLocaleString() }),
      Stat({ icon: "👤", label: "スタッフ", val: s.staff }),
      Stat({ icon: "⭐", label: "評判", val: s.reputation }),
      Stat({ icon: "🧑‍🤝‍🧑", label: "客数", val: s.customers }),
      Stat({ icon: "🍰", label: "メニュー", val: "Lv" + s.menu })
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 } },
      ...[["💼 営業する", "work", 0, "#44AAAA"], ["📢 広告(-500)", "ads", 500, "#FF8844"], ["👤 雇用(-800)", "hire", 800, "#4488FF"], ["🍰 メニュー拡充(-1200)", "menu", 1200, "#AA44FF"], ["🎨 内装改装(-2000)", "decor", 2000, "#FF44AA"]].map(([label, act2, cost, col]) =>
        React.createElement("button", { key: act2, onClick: () => act(act2), disabled: s.money < cost,
          style: { padding: "10px 8px", borderRadius: 10, border: "none", background: s.money >= cost ? col : "#333", color: "#fff", cursor: s.money >= cost ? "pointer" : "default", fontSize: 12, fontWeight: 600, opacity: s.money < cost ? 0.5 : 1 } }, label))
    ),
    React.createElement("div", { style: { background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 100, overflowY: "auto", fontSize: 11 } },
      ...s.log.slice(-5).map((l, i) => React.createElement("div", { key: i, style: { color: l.includes("売上")||l.includes("掲載")?"#4CAF50":l.includes("雨")?"#888":"#aaa", marginBottom: 2 } }, l))
    )
  );
}`,

custom: `export default function Game() {
  const [s, setS] = React.useState({ x: 5, y: 5, hp: 100, score: 0, items: 0, map: [], enemies: [], turn: 0 });
  React.useEffect(() => {
    const map = Array(10).fill(null).map(() => Array(10).fill("."));
    const enemies = []; const items = [];
    for (let i = 0; i < 5; i++) { let ex, ey; do { ex = Math.floor(Math.random()*10); ey = Math.floor(Math.random()*10); } while (ex===5&&ey===5); enemies.push({x:ex,y:ey,hp:20}); map[ey][ex]="E"; }
    for (let i = 0; i < 3; i++) { let ix, iy; do { ix = Math.floor(Math.random()*10); iy = Math.floor(Math.random()*10); } while (map[iy][ix]!=="."); map[iy][ix]="I"; }
    map[5][5]="@";
    setS(p => ({...p, map, enemies}));
  }, []);
  const move = (dx, dy) => {
    setS(prev => {
      const nx = Math.max(0, Math.min(9, prev.x+dx));
      const ny = Math.max(0, Math.min(9, prev.y+dy));
      const map = prev.map.map(r => [...r]);
      let ns = {...prev, turn: prev.turn+1};
      map[prev.y][prev.x] = ".";
      if (map[ny][nx]==="I") { ns.items++; ns.score+=50; ns.hp=Math.min(100,ns.hp+20); }
      if (map[ny][nx]==="E") { const dmg = Math.floor(Math.random()*15)+5; ns.hp-=dmg; ns.score+=100; ns.enemies=prev.enemies.filter(e=>!(e.x===nx&&e.y===ny)); }
      map[ny][nx]="@"; ns.x=nx; ns.y=ny; ns.map=map;
      return ns;
    });
  };
  return React.createElement("div", { style: { maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" } },
    React.createElement("h2", { style: { color: "#4ECDC4", fontSize: 20, fontWeight: 800, marginBottom: 8 } }, "✨ ローグライクアドベンチャー"),
    React.createElement("div", { style: { fontSize: 12, color: "#888", marginBottom: 8 } }, "HP:" + s.hp + " | Score:" + s.score + " | Items:" + s.items + " | Turn:" + s.turn),
    s.hp <= 0 ? React.createElement("div", null, React.createElement("div", { style: { fontSize: 48 } }, "💀"), React.createElement("p", null, "ゲームオーバー Score:" + s.score), React.createElement("button", { onClick: () => window.location.reload(), style: { padding: "10px 24px", borderRadius: 10, border: "none", background: "#4ECDC4", color: "#fff", cursor: "pointer", fontWeight: 700 } }, "リトライ")) :
    React.createElement("div", null,
      React.createElement("div", { style: { display: "inline-grid", gridTemplateColumns: "repeat(10, 28px)", gap: 1, background: "#111", borderRadius: 8, padding: 4, marginBottom: 12 } },
        ...s.map.flat().map((c, i) => React.createElement("div", { key: i, style: { width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: c==="@"?"#4ECDC433":c==="E"?"#f4433633":c==="I"?"#FFD70033":"#0a0a1a", borderRadius: 3 } }, c==="@"?"🧙":c==="E"?"👹":c==="I"?"💎":""))
      ),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, maxWidth: 150, margin: "0 auto" } },
        React.createElement("div",null), React.createElement("button",{onClick:()=>move(0,-1),style:{padding:8,borderRadius:6,border:"none",background:"#333",color:"#fff",cursor:"pointer",fontSize:14}},"⬆"), React.createElement("div",null),
        React.createElement("button",{onClick:()=>move(-1,0),style:{padding:8,borderRadius:6,border:"none",background:"#333",color:"#fff",cursor:"pointer",fontSize:14}},"⬅"),
        React.createElement("div",null),
        React.createElement("button",{onClick:()=>move(1,0),style:{padding:8,borderRadius:6,border:"none",background:"#333",color:"#fff",cursor:"pointer",fontSize:14}},"➡"),
        React.createElement("div",null), React.createElement("button",{onClick:()=>move(0,1),style:{padding:8,borderRadius:6,border:"none",background:"#333",color:"#fff",cursor:"pointer",fontSize:14}},"⬇"), React.createElement("div",null)
      )
    )
  );
}`,

};
