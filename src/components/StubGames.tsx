"use client";
import { useState, useEffect } from "react";

const Bar = ({ val, max, color, label }: { val: number; max: number; color: string; label: string }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span>{label}</span><span>{val}/{max}</span></div>
    <div style={{ background: "#222", borderRadius: 6, height: 12, overflow: "hidden" }}><div style={{ width: `${val / max * 100}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.4s" }} /></div>
  </div>
);

export function BattleGame() {
  const [s, setS] = useState({ hp: 100, mhp: 100, mp: 50, mmp: 50, ehp: 80, emhp: 80, lv: 1, exp: 0, gold: 0, turn: "p", log: ["魔王の手下が現れた！"], over: false, eName: "ゴブリン", eIdx: 0, combo: 0 });
  const enemies = ["ゴブリン", "スケルトン", "ダークウルフ", "オーク戦士", "ドラゴン"];
  const icons = ["👹", "💀", "🐺", "👿", "🐉"];
  const skills = [{ n: "斬撃", c: 0, d: [10, 18], i: "⚔️", h: false }, { n: "ファイア", c: 12, d: [20, 30], i: "🔥", h: false }, { n: "ヒール", c: 15, d: [0, 0], i: "💚", h: true }, { n: "雷撃", c: 20, d: [25, 40], i: "⚡", h: false }];
  const r = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  const atk = (si: number) => {
    if (s.turn !== "p" || s.over) return;
    const sk = skills[si]; if (sk.c > s.mp) return;
    const ns = { ...s, mp: s.mp - sk.c, log: [...s.log] };
    if (sk.h) { const h = r(20, 30); ns.hp = Math.min(s.mhp, s.hp + h); ns.log.push(`${sk.i} ${sk.n}でHP${h}回復！`); }
    else { const cr = Math.random() < 0.15; let d = r(sk.d[0], sk.d[1]) + s.lv * 2; if (cr) d = Math.floor(d * 1.8); ns.ehp = Math.max(0, s.ehp - d); ns.combo = s.combo + 1; ns.log.push(`${sk.i} ${sk.n}で${d}ダメージ！${cr ? " 🎯会心！" : ""}${ns.combo > 1 ? ` ${ns.combo}コンボ！` : ""}`); }
    if (ns.ehp <= 0) { const xp = 20 + s.eIdx * 15; ns.exp += xp; ns.gold += r(10, 30); ns.log.push(`🎉 ${s.eName}を倒した！`);
      if (ns.exp >= ns.lv * 40) { ns.lv++; ns.mhp += 15; ns.mmp += 8; ns.hp = ns.mhp; ns.mp = ns.mmp; ns.log.push(`⬆️ Lv${ns.lv}！全回復！`); }
      if (s.eIdx >= 4) { ns.over = true; ns.log.push("👑 全クリア！"); } else { const ni = s.eIdx + 1; ns.eIdx = ni; ns.eName = enemies[ni]; ns.emhp = 80 + ni * 40; ns.ehp = ns.emhp; ns.log.push(`${enemies[ni]}が現れた！`); }
      ns.combo = 0; setS(ns); return;
    }
    ns.turn = "e"; setS(ns);
    setTimeout(() => setS(p => { const ed = Math.max(1, r(8, 15) + p.eIdx * 5); const hp = Math.max(0, p.hp - ed); const l = [...p.log, `👹 ${p.eName}の攻撃！ ${ed}ダメージ！`]; if (hp <= 0) l.push("💀 力尽きた..."); return { ...p, hp, turn: "p", log: l, over: hp <= 0, combo: 0 }; }), 700);
  };
  const reset = () => setS({ hp: 100, mhp: 100, mp: 50, mmp: 50, ehp: 80, emhp: 80, lv: 1, exp: 0, gold: 0, turn: "p", log: ["再び冒険へ..."], over: false, eName: "ゴブリン", eIdx: 0, combo: 0 });
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#FF6B6B", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>⚔️ ダークファンタジー戦記</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 10 }}><span>Lv.{s.lv}</span><span>EXP:{s.exp}/{s.lv * 40}</span><span>💰{s.gold}</span></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, background: "#111", borderRadius: 12, padding: 12 }}><div style={{ textAlign: "center", fontSize: 36 }}>🧙</div><div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>勇者</div><Bar val={s.hp} max={s.mhp} color="linear-gradient(90deg,#4CAF50,#8BC34A)" label="HP" /><Bar val={s.mp} max={s.mmp} color="linear-gradient(90deg,#2196F3,#00BCD4)" label="MP" /></div>
        <div style={{ alignSelf: "center", fontSize: 24, color: "#555" }}>⚡</div>
        <div style={{ flex: 1, background: "#111", borderRadius: 12, padding: 12 }}><div style={{ textAlign: "center", fontSize: 36 }}>{icons[s.eIdx]}</div><div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{s.eName}</div><Bar val={s.ehp} max={s.emhp} color="linear-gradient(90deg,#f44,#FF9800)" label="HP" /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
        {skills.map((sk, i) => <button key={i} onClick={() => atk(i)} disabled={s.turn !== "p" || s.over || sk.c > s.mp} style={{ padding: "10px 8px", borderRadius: 10, border: "none", background: s.turn !== "p" || s.over || sk.c > s.mp ? "#333" : sk.c === 0 ? "#4488FF" : "#AA44FF", color: "#fff", cursor: s.turn === "p" && !s.over && sk.c <= s.mp ? "pointer" : "default", fontSize: 13, fontWeight: 700 }}>{sk.i} {sk.n}{sk.c > 0 ? ` (${sk.c}MP)` : ""}</button>)}
      </div>
      {s.over && <div style={{ textAlign: "center", marginBottom: 10 }}><button onClick={reset} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "#4CAF50", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🔄 最初から</button></div>}
      <div style={{ background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 100, overflowY: "auto", fontSize: 12 }}>{s.log.slice(-6).map((l, i) => <div key={i} style={{ color: l.includes("倒した") || l.includes("クリア") ? "#4CAF50" : l.includes("力尽") ? "#f44" : l.includes("Lv") ? "#FFD700" : "#aaa", marginBottom: 2 }}>{l}</div>)}</div>
    </div>
  );
}

export function NurtureGame() {
  const stages = [{ n: "タマゴ", i: "🥚" }, { n: "ヒヨコ", i: "🐣" }, { n: "ニワトリ", i: "🐔" }, { n: "フェニックス", i: "🦅" }, { n: "神鳥", i: "🌟" }];
  const [s, setS] = useState({ lv: 1, exp: 0, hunger: 80, happy: 70, health: 90, age: 0, gold: 50, stage: 0, log: ["タマゴを手に入れた！"], sleep: false });
  const cur = stages[Math.min(s.stage, 4)];
  const act = (t: string) => { if (s.sleep) return; setS(p => { const n = { ...p, age: p.age + 1, log: [...p.log] };
    if (t === "feed") { n.hunger = Math.min(100, p.hunger + 25); n.exp += 5; n.gold -= 5; n.log.push("🍖 ごはん！"); }
    if (t === "play") { n.happy = Math.min(100, p.happy + 20); n.hunger = Math.max(0, p.hunger - 8); n.exp += 10; n.log.push("🎾 遊んだ！"); }
    if (t === "train") { n.exp += 20; n.hunger = Math.max(0, p.hunger - 12); n.health = Math.max(0, p.health - 5); n.log.push("💪 訓練！ EXP+20"); }
    if (t === "heal") { n.health = Math.min(100, p.health + 30); n.gold -= 10; n.log.push("💊 回復！"); }
    if (t === "sleep") { n.sleep = true; n.log.push("💤 おやすみ..."); setTimeout(() => setS(pp => ({ ...pp, sleep: false, health: Math.min(100, pp.health + 20), log: [...pp.log, "☀️ おはよう！"] })), 2000); }
    if (n.exp >= n.lv * 30) { n.lv++; n.exp = 0; n.gold += 20; n.log.push(`🎉 Lv${n.lv}！`); const ns = Math.min(Math.floor(n.lv / 3), 4); if (ns > p.stage) { n.stage = ns; n.log.push(`✨ ${stages[ns].n}に進化！`); } }
    return n; }); };
  const SB = ({ label, val, color, icon }: { label: string; val: number; color: string; icon: string }) => <div style={{ marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span>{icon} {label}</span><span>{val}%</span></div><div style={{ height: 8, background: "#222", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${val}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} /></div></div>;
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" }}>
      <h2 style={{ color: "#44BB44", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🌱 ふしぎ育成記</h2>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Lv.{s.lv} | {cur.n} | 💰{s.gold}</div>
      <div style={{ fontSize: 80, margin: "8px 0", filter: s.sleep ? "brightness(0.4)" : "none", transition: "filter 0.5s" }}>{s.sleep ? "💤" : cur.i}</div>
      <div style={{ background: "#111", borderRadius: 12, padding: 12, marginBottom: 12, textAlign: "left" }}>
        <SB label="満腹度" val={s.hunger} color="#FF8844" icon="🍖" /><SB label="幸福度" val={s.happy} color="#FF44AA" icon="💕" /><SB label="体力" val={s.health} color="#44BB44" icon="💚" />
        <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>EXP: {s.exp}/{s.lv * 30}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
        {([["🍖 ごはん", "feed", "#FF8844"], ["🎾 遊ぶ", "play", "#4488FF"], ["💪 鍛える", "train", "#AA44FF"], ["💊 お薬", "heal", "#44BB44"], ["💤 寝る", "sleep", "#666"]] as const).map(([l, a, c]) => <button key={a} onClick={() => act(a)} disabled={s.sleep} style={{ padding: "8px 4px", borderRadius: 8, border: "none", background: s.sleep ? "#333" : c, color: "#fff", cursor: s.sleep ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>{l}</button>)}
      </div>
      <div style={{ background: "#0a0a12", borderRadius: 10, padding: 8, maxHeight: 80, overflowY: "auto", fontSize: 11, textAlign: "left" }}>{s.log.slice(-4).map((l, i) => <div key={i} style={{ color: l.includes("進化") || l.includes("Lv") ? "#FFD700" : "#aaa" }}>{l}</div>)}</div>
    </div>
  );
}

export function PuzzleGame() {
  const shuffle = () => { const n = [1, 2, 3, 4, 5, 6, 7, 8, 0]; for (let i = n.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [n[i], n[j]] = [n[j], n[i]]; } return n; };
  const [tiles, setTiles] = useState(shuffle); const [moves, setMoves] = useState(0); const [won, setWon] = useState(false); const [time, setTime] = useState(0);
  useEffect(() => { if (!won && moves > 0) { const t = setInterval(() => setTime(p => p + 1), 1000); return () => clearInterval(t); } }, [won, moves]);
  const move = (idx: number) => { if (won) return; const ei = tiles.indexOf(0); const r = Math.floor(idx / 3), c = idx % 3, er = Math.floor(ei / 3), ec = ei % 3;
    if ((Math.abs(r - er) === 1 && c === ec) || (Math.abs(c - ec) === 1 && r === er)) { const t = [...tiles]; [t[idx], t[ei]] = [t[ei], t[idx]]; setTiles(t); setMoves(m => m + 1); if (t.slice(0, 8).every((v, i) => v === i + 1)) setWon(true); } };
  const reset = () => { setTiles(shuffle()); setMoves(0); setWon(false); setTime(0); };
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16, textAlign: "center" }}>
      <h2 style={{ color: "#FF8844", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🧩 スライドパズル</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 13, color: "#888", marginBottom: 14 }}><span>🔢 {moves}手</span><span>⏱ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span></div>
      {won && <div style={{ background: "#1a3a1a", borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 16, fontWeight: 700, color: "#4CAF50" }}>🎉 クリア！ {moves}手</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,80px)", gap: 4, justifyContent: "center", marginBottom: 14 }}>{tiles.map((t, i) => <div key={i} onClick={() => move(i)} style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: t ? "linear-gradient(135deg,#FF8844,#FF6644)" : "transparent", color: "#fff", fontSize: 28, fontWeight: 800, borderRadius: 10, cursor: t ? "pointer" : "default", boxShadow: t ? "0 2px 8px rgba(255,136,68,0.3)" : "none" }}>{t || ""}</div>)}</div>
      <button onClick={reset} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "#555", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>🔄 リセット</button>
    </div>
  );
}

export function QuizGame() {
  const qs = [{ q: "日本で最も高い山は？", a: ["富士山", "北岳", "奥穂高岳", "槍ヶ岳"], c: 0 }, { q: "1バイトは何ビット？", a: ["4", "8", "16", "32"], c: 1 }, { q: "太陽系で最大の惑星は？", a: ["土星", "木星", "天王星", "海王星"], c: 1 }, { q: "人体の骨の数は約何本？", a: ["106", "156", "206", "256"], c: 2 }, { q: "「源氏物語」の作者は？", a: ["清少納言", "紫式部", "和泉式部", "小野小町"], c: 1 }, { q: "光の速さは秒速約何km？", a: ["10万", "20万", "30万", "40万"], c: 2 }, { q: "水の化学式は？", a: ["CO2", "H2O", "NaCl", "O2"], c: 1 }, { q: "世界最大面積の国は？", a: ["カナダ", "中国", "アメリカ", "ロシア"], c: 3 }];
  const [idx, setIdx] = useState(0); const [score, setScore] = useState(0); const [streak, setStreak] = useState(0); const [ans, setAns] = useState(false); const [sel, setSel] = useState(-1); const [tl, setTl] = useState(15); const [fin, setFin] = useState(false);
  useEffect(() => { if (!ans && !fin && tl > 0) { const t = setTimeout(() => setTl(p => p - 1), 1000); return () => clearTimeout(t); } if (tl <= 0 && !ans) { setAns(true); setStreak(0); } }, [tl, ans, fin]);
  const answer = (i: number) => { if (ans) return; const ok = i === qs[idx].c; setAns(true); setSel(i); if (ok) { setScore(p => p + 100 + streak * 20 + tl * 5); setStreak(p => p + 1); } else setStreak(0); };
  const next = () => { if (idx + 1 >= qs.length) setFin(true); else { setIdx(p => p + 1); setAns(false); setSel(-1); setTl(15); } };
  const reset = () => { setIdx(0); setScore(0); setStreak(0); setAns(false); setSel(-1); setTl(15); setFin(false); };
  if (fin) return <div style={{ maxWidth: 420, margin: "0 auto", padding: 20, textAlign: "center" }}><div style={{ fontSize: 60 }}>{score >= 600 ? "🏆" : "📝"}</div><h2 style={{ color: "#FFAA00", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>結果発表</h2><div style={{ fontSize: 32, fontWeight: 900, color: "#FFD700", marginBottom: 16 }}>{score}点</div><button onClick={reset} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "#FFAA00", color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>もう一度</button></div>;
  const cur = qs[idx];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#FFAA00", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>❓ 雑学マスター</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 12 }}><span>Q{idx + 1}/{qs.length}</span><span>💯{score}点</span><span>🔥{streak}連続</span><span style={{ color: tl <= 5 ? "#f44" : "#888" }}>⏱{tl}s</span></div>
      <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 20, marginBottom: 12, textAlign: "center", fontSize: 17, fontWeight: 600, lineHeight: 1.6 }}>{cur.q}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{cur.a.map((a, i) => <button key={i} onClick={() => answer(i)} disabled={ans} style={{ padding: "14px 10px", borderRadius: 10, border: `2px solid ${ans ? (i === cur.c ? "#4CAF50" : i === sel ? "#f44" : "#333") : "#444"}`, background: ans ? (i === cur.c ? "#1a3a1a" : i === sel ? "#3a1a1a" : "#111") : "#1a1a2e", color: "#fff", fontSize: 14, fontWeight: 600, cursor: ans ? "default" : "pointer" }}>{a}</button>)}</div>
      {ans && <div style={{ textAlign: "center", marginTop: 12 }}><button onClick={next} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "#FFAA00", color: "#000", fontWeight: 700, cursor: "pointer" }}>{idx + 1 >= qs.length ? "結果を見る" : "次の問題 →"}</button></div>}
    </div>
  );
}

export function SimulatorGame() {
  const [s, setS] = useState({ money: 5000, day: 1, staff: 1, rep: 30, cust: 5, menu: 1, log: ["☕ カフェをオープン！"] });
  const act = (t: string) => { setS(p => { const n = { ...p, day: p.day + 1, log: [...p.log] };
    if (t === "ads" && p.money >= 500) { n.money -= 500; n.rep += 8; n.cust += Math.floor(Math.random() * 8) + 4; n.log.push("📢 広告！"); }
    if (t === "hire" && p.money >= 800) { n.money -= 800; n.staff++; n.log.push(`👤 雇用！(${p.staff + 1}人)`); }
    if (t === "menu" && p.money >= 1200) { n.money -= 1200; n.menu++; n.rep += 5; n.log.push(`🍰 メニュー拡充！`); }
    if (t === "work") { const inc = n.cust * (10 + n.menu * 5) * Math.min(n.staff, Math.ceil(n.cust / 3)); const cost = n.staff * 100; n.money += inc - cost; n.cust = Math.max(1, n.cust + Math.floor(Math.random() * 5) - 2 + Math.floor(n.rep / 20)); n.log.push(`💰 売上:${inc} 人件費:${cost}`); if (Math.random() < 0.2) { n.rep += 15; n.cust += 5; n.log.push("📰 雑誌掲載！"); } }
    return n; }); };
  const St = ({ icon, label, val }: { icon: string; label: string; val: string | number }) => <div style={{ background: "#111", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}><div style={{ fontSize: 16 }}>{icon}</div><div style={{ fontSize: 9, color: "#888" }}>{label}</div><div style={{ fontSize: 13, fontWeight: 700 }}>{val}</div></div>;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#44AAAA", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🏗️ カフェ経営</h2>
      <div style={{ textAlign: "center", fontSize: 12, color: "#888", marginBottom: 10 }}>📅 {s.day}日目</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 10 }}><St icon="💰" label="資金" val={s.money.toLocaleString()} /><St icon="👤" label="Staff" val={s.staff} /><St icon="⭐" label="評判" val={s.rep} /><St icon="🧑‍🤝‍🧑" label="客数" val={s.cust} /><St icon="🍰" label="Menu" val={`Lv${s.menu}`} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
        {([["💼 営業", "work", 0, "#44AAAA"], ["📢 広告(-500)", "ads", 500, "#FF8844"], ["👤 雇用(-800)", "hire", 800, "#4488FF"], ["🍰 メニュー(-1200)", "menu", 1200, "#AA44FF"]] as const).map(([l, a, c, col]) => <button key={a} onClick={() => act(a)} disabled={s.money < c} style={{ padding: "10px 8px", borderRadius: 10, border: "none", background: s.money >= c ? col : "#333", color: "#fff", cursor: s.money >= c ? "pointer" : "default", fontSize: 12, fontWeight: 600, opacity: s.money < c ? 0.5 : 1 }}>{l}</button>)}
      </div>
      <div style={{ background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 100, overflowY: "auto", fontSize: 11 }}>{s.log.slice(-5).map((l, i) => <div key={i} style={{ color: l.includes("売上") || l.includes("掲載") ? "#4CAF50" : "#aaa", marginBottom: 2 }}>{l}</div>)}</div>
    </div>
  );
}
