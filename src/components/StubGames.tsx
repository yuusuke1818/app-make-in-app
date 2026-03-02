"use client";
import { useState, useEffect } from "react";

// ====== バトルRPG ======
export function BattleGame() {
  const [s, setS] = useState({
    playerHp: 100, playerMaxHp: 100, playerMp: 50, playerMaxMp: 50,
    enemyHp: 80, enemyMaxHp: 80, level: 1, exp: 0, gold: 0,
    turn: "player" as string, log: ["魔王の手下が現れた！"], gameOver: false, victory: false,
    enemyName: "ゴブリン", combo: 0, shield: 0, enemyIdx: 0,
    skills: [
      { name: "斬撃", cost: 0, dmg: [10, 18], icon: "⚔️", heal: null as number[] | null },
      { name: "ファイア", cost: 12, dmg: [20, 30], icon: "🔥", heal: null as number[] | null },
      { name: "ヒール", cost: 15, dmg: [0, 0], icon: "💚", heal: [20, 30] },
      { name: "雷撃", cost: 20, dmg: [25, 40], icon: "⚡", heal: null as number[] | null }
    ],
    enemies: ["ゴブリン", "スケルトン", "ダークウルフ", "オーク戦士", "ドラゴン"],
    enemyIcons: ["👹", "💀", "🐺", "👿", "🐉"],
  });
  const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
  const attack = (idx: number) => {
    if (s.turn !== "player" || s.gameOver) return;
    const skill = s.skills[idx];
    if (skill.cost > s.playerMp) return;
    const ns = { ...s, playerMp: s.playerMp - skill.cost, log: [...s.log] };
    if (skill.heal) {
      const h = rand(skill.heal[0], skill.heal[1]);
      ns.playerHp = Math.min(s.playerMaxHp, s.playerHp + h);
      ns.log.push(`${skill.icon} ${skill.name}でHP${h}回復！`);
    } else {
      const crit = Math.random() < 0.15;
      let dmg = rand(skill.dmg[0], skill.dmg[1]) + s.level * 2;
      if (crit) dmg = Math.floor(dmg * 1.8);
      ns.enemyHp = Math.max(0, s.enemyHp - dmg);
      ns.combo = s.combo + 1;
      ns.log.push(`${skill.icon} ${skill.name}で${dmg}ダメージ！${crit ? " 🎯会心！" : ""}${ns.combo > 1 ? ` ${ns.combo}コンボ！` : ""}`);
    }
    if (ns.enemyHp <= 0) {
      const expG = 20 + s.enemyIdx * 15, goldG = rand(10, 30) + s.enemyIdx * 10;
      ns.exp += expG; ns.gold += goldG;
      ns.log.push(`🎉 ${s.enemyName}を倒した！ EXP+${expG} Gold+${goldG}`);
      if (ns.exp >= ns.level * 40) { ns.level += 1; ns.playerMaxHp += 15; ns.playerMaxMp += 8; ns.playerHp = ns.playerMaxHp; ns.playerMp = ns.playerMaxMp; ns.log.push(`⬆️ レベル${ns.level}！ 全回復！`); }
      if (s.enemyIdx >= s.enemies.length - 1) { ns.victory = true; ns.gameOver = true; ns.log.push("👑 全ての敵を倒した！"); }
      else { const ni = s.enemyIdx + 1; ns.enemyIdx = ni; ns.enemyName = s.enemies[ni]; ns.enemyMaxHp = 80 + ni * 40; ns.enemyHp = ns.enemyMaxHp; ns.log.push(`次の敵: ${s.enemies[ni]}が現れた！`); }
      ns.combo = 0; setS(ns); return;
    }
    ns.turn = "enemy"; setS(ns);
    setTimeout(() => setS(p => {
      const eDmg = Math.max(1, rand(8, 15) + p.enemyIdx * 5);
      const hp = Math.max(0, p.playerHp - eDmg);
      const l = [...p.log, `👹 ${p.enemyName}の攻撃！ ${eDmg}ダメージ！`];
      if (hp <= 0) l.push("💀 力尽きた...");
      return { ...p, playerHp: hp, turn: "player", log: l, gameOver: hp <= 0, combo: 0 };
    }), 700);
  };
  const reset = () => setS(p => ({ ...p, playerHp: 100, playerMaxHp: 100, playerMp: 50, playerMaxMp: 50, enemyHp: 80, enemyMaxHp: 80, level: 1, exp: 0, gold: 0, turn: "player", log: ["新たな冒険が始まる..."], gameOver: false, victory: false, enemyName: "ゴブリン", combo: 0, enemyIdx: 0 }));
  const Bar = ({ val, max, color, label }: { val: number; max: number; color: string; label: string }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span>{label}</span><span>{val}/{max}</span></div>
      <div style={{ background: "#222", borderRadius: 6, height: 12, overflow: "hidden" }}><div style={{ width: `${val/max*100}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.4s" }} /></div>
    </div>
  );
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#FF6B6B", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>⚔️ ダークファンタジー戦記</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 12 }}>
        <span>Lv.{s.level}</span><span>EXP:{s.exp}/{s.level * 40}</span><span>💰{s.gold}</span>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, background: "#111", borderRadius: 12, padding: 12 }}>
          <div style={{ textAlign: "center", fontSize: 36, marginBottom: 4 }}>🧙</div>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>勇者</div>
          <Bar val={s.playerHp} max={s.playerMaxHp} color="linear-gradient(90deg, #4CAF50, #8BC34A)" label="HP" />
          <Bar val={s.playerMp} max={s.playerMaxMp} color="linear-gradient(90deg, #2196F3, #00BCD4)" label="MP" />
        </div>
        <div style={{ alignSelf: "center", fontSize: 24, color: "#555" }}>⚡</div>
        <div style={{ flex: 1, background: "#111", borderRadius: 12, padding: 12 }}>
          <div style={{ textAlign: "center", fontSize: 36, marginBottom: 4 }}>{s.enemyIcons[s.enemyIdx]}</div>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{s.enemyName}</div>
          <Bar val={s.enemyHp} max={s.enemyMaxHp} color="linear-gradient(90deg, #f44336, #FF9800)" label="HP" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {s.skills.map((sk, i) => (
          <button key={i} onClick={() => attack(i)} disabled={s.turn !== "player" || s.gameOver || sk.cost > s.playerMp}
            style={{ padding: "10px 8px", borderRadius: 10, border: "none", background: s.turn !== "player" || s.gameOver || sk.cost > s.playerMp ? "#333" : sk.cost === 0 ? "#4488FF" : "#AA44FF", color: "#fff", cursor: s.turn === "player" && !s.gameOver && sk.cost <= s.playerMp ? "pointer" : "default", fontSize: 13, fontWeight: 700 }}>
            {sk.icon} {sk.name}{sk.cost > 0 ? ` (${sk.cost}MP)` : ""}
          </button>
        ))}
      </div>
      {s.gameOver && <div style={{ textAlign: "center", marginBottom: 12 }}><button onClick={reset} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "#4CAF50", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🔄 最初から</button></div>}
      <div style={{ background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 120, overflowY: "auto", fontSize: 12 }}>
        {s.log.slice(-6).map((l, i) => <div key={i} style={{ color: l.includes("会心") || l.includes("倒した") || l.includes("クリア") ? "#4CAF50" : l.includes("力尽") ? "#f44" : l.includes("レベル") ? "#FFD700" : "#aaa", marginBottom: 2 }}>{l}</div>)}
      </div>
    </div>
  );
}

// ====== 育成シミュレーション ======
export function NurtureGame() {
  const stages = [{ name: "タマゴ", icon: "🥚" }, { name: "ヒヨコ", icon: "🐣" }, { name: "ニワトリ", icon: "🐔" }, { name: "フェニックス", icon: "🦅" }, { name: "神鳥", icon: "🌟" }];
  const [s, setS] = useState({ level: 1, exp: 0, hunger: 80, happiness: 70, health: 90, age: 0, gold: 50, stage: 0, log: ["タマゴを手に入れた！"], sleeping: false });
  const cur = stages[Math.min(s.stage, stages.length - 1)];
  const act = (type: string) => {
    if (s.sleeping) return;
    setS(p => {
      const ns = { ...p, age: p.age + 1, log: [...p.log] };
      if (type === "feed") { ns.hunger = Math.min(100, p.hunger + 25); ns.exp += 5; ns.gold -= 5; ns.log.push("🍖 ごはんをあげた！"); }
      if (type === "play") { ns.happiness = Math.min(100, p.happiness + 20); ns.hunger = Math.max(0, p.hunger - 8); ns.exp += 10; ns.log.push("🎾 遊んであげた！"); }
      if (type === "train") { ns.exp += 20; ns.hunger = Math.max(0, p.hunger - 12); ns.health = Math.max(0, p.health - 5); ns.log.push("💪 トレーニング！ EXP+20"); }
      if (type === "heal") { ns.health = Math.min(100, p.health + 30); ns.gold -= 10; ns.log.push("💊 お薬をあげた！"); }
      if (type === "sleep") {
        ns.sleeping = true; ns.log.push("💤 おやすみ...");
        setTimeout(() => setS(pp => ({ ...pp, sleeping: false, hunger: Math.max(0, pp.hunger - 10), health: Math.min(100, pp.health + 20), happiness: Math.min(100, pp.happiness + 10), log: [...pp.log, "☀️ おはよう！ 体力回復！"] })), 2000);
      }
      if (ns.exp >= ns.level * 30) {
        ns.level += 1; ns.exp = 0; ns.gold += 20; ns.log.push(`🎉 レベル${ns.level}！`);
        const newStage = Math.min(Math.floor(ns.level / 3), stages.length - 1);
        if (newStage > p.stage) { ns.stage = newStage; ns.log.push(`✨ ${stages[newStage].name}に進化した！`); }
      }
      if (ns.hunger <= 0) { ns.health = Math.max(0, ns.health - 10); ns.log.push("⚠️ お腹ペコペコ..."); }
      return ns;
    });
  };
  const StatBar = ({ label, val, color, icon }: { label: string; val: number; color: string; icon: string }) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span>{icon} {label}</span><span>{val}%</span></div>
      <div style={{ height: 8, background: "#222", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${val}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} /></div>
    </div>
  );
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" }}>
      <h2 style={{ color: "#44BB44", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🌱 ふしぎ育成記</h2>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Lv.{s.level} | {cur.name} | 💰{s.gold} | 年齢:{s.age}</div>
      <div style={{ fontSize: 80, margin: "8px 0", filter: s.sleeping ? "brightness(0.4)" : "none", transition: "filter 0.5s" }}>{s.sleeping ? "💤" : cur.icon}</div>
      <div style={{ background: "#111", borderRadius: 12, padding: 12, marginBottom: 12, textAlign: "left" }}>
        <StatBar label="満腹度" val={s.hunger} color="#FF8844" icon="🍖" />
        <StatBar label="幸福度" val={s.happiness} color="#FF44AA" icon="💕" />
        <StatBar label="体力" val={s.health} color="#44BB44" icon="💚" />
        <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>EXP: {s.exp}/{s.level * 30}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[["🍖 ごはん", "feed", "#FF8844"], ["🎾 遊ぶ", "play", "#4488FF"], ["💪 鍛える", "train", "#AA44FF"], ["💊 お薬", "heal", "#44BB44"], ["💤 寝る", "sleep", "#666"]].map(([label, a, col]) => (
          <button key={a} onClick={() => act(a)} disabled={s.sleeping}
            style={{ padding: "8px 4px", borderRadius: 8, border: "none", background: s.sleeping ? "#333" : col, color: "#fff", cursor: s.sleeping ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>{label}</button>
        ))}
      </div>
      <div style={{ background: "#0a0a12", borderRadius: 10, padding: 8, maxHeight: 80, overflowY: "auto", fontSize: 11, textAlign: "left" }}>
        {s.log.slice(-4).map((l, i) => <div key={i} style={{ color: l.includes("進化") || l.includes("レベル") ? "#FFD700" : l.includes("⚠") ? "#f44" : "#aaa" }}>{l}</div>)}
      </div>
    </div>
  );
}

// ====== パズル ======
export function PuzzleGame() {
  const shuffle = () => { const n = [1,2,3,4,5,6,7,8,0]; for (let i = n.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [n[i],n[j]]=[n[j],n[i]]; } return n; };
  const [tiles, setTiles] = useState(shuffle);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  useEffect(() => { if (!won && moves > 0) { const t = setInterval(() => setTime(p => p + 1), 1000); return () => clearInterval(t); } }, [won, moves]);
  const move = (idx: number) => {
    if (won) return;
    const ei = tiles.indexOf(0);
    const r = Math.floor(idx/3), c = idx%3, er = Math.floor(ei/3), ec = ei%3;
    if ((Math.abs(r-er)===1&&c===ec)||(Math.abs(c-ec)===1&&r===er)) {
      const t = [...tiles]; [t[idx],t[ei]]=[t[ei],t[idx]];
      setTiles(t); setMoves(m=>m+1);
      if (t.slice(0,8).every((v,i)=>v===i+1)) setWon(true);
    }
  };
  const reset = () => { setTiles(shuffle()); setMoves(0); setWon(false); setTime(0); };
  const fmt = (t: number) => `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16, textAlign: "center" }}>
      <h2 style={{ color: "#FF8844", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🧩 スライドパズル</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 13, color: "#888", marginBottom: 16 }}>
        <span>🔢 {moves}手</span><span>⏱ {fmt(time)}</span>
      </div>
      {won && <div style={{ background: "#1a3a1a", borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 16, fontWeight: 700, color: "#4CAF50" }}>🎉 クリア！ {moves}手 / {fmt(time)}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,80px)", gap: 4, justifyContent: "center", marginBottom: 16 }}>
        {tiles.map((t, i) => <div key={i} onClick={() => move(i)} style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: t ? "linear-gradient(135deg, #FF8844, #FF6644)" : "transparent", color: "#fff", fontSize: 28, fontWeight: 800, borderRadius: 10, cursor: t ? "pointer" : "default", boxShadow: t ? "0 2px 8px rgba(255,136,68,0.3)" : "none" }}>{t || ""}</div>)}
      </div>
      <button onClick={reset} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "#555", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>🔄 リセット</button>
    </div>
  );
}

// ====== クイズ ======
export function QuizGame() {
  const questions = [
    { q: "日本で最も高い山は？", a: ["富士山","北岳","奥穂高岳","槍ヶ岳"], c: 0 },
    { q: "1バイトは何ビット？", a: ["4","8","16","32"], c: 1 },
    { q: "太陽系で最大の惑星は？", a: ["土星","木星","天王星","海王星"], c: 1 },
    { q: "人体の骨の数は約何本？", a: ["106","156","206","256"], c: 2 },
    { q: "「源氏物語」の作者は？", a: ["清少納言","紫式部","和泉式部","小野小町"], c: 1 },
    { q: "光の速さは秒速約何km？", a: ["10万","20万","30万","40万"], c: 2 },
    { q: "水の化学式は？", a: ["CO2","H2O","NaCl","O2"], c: 1 },
    { q: "世界最大の面積の国は？", a: ["カナダ","中国","アメリカ","ロシア"], c: 3 },
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finished, setFinished] = useState(false);
  useEffect(() => { if (!answered && !finished && timeLeft > 0) { const t = setTimeout(() => setTimeLeft(p => p - 1), 1000); return () => clearTimeout(t); } if (timeLeft <= 0 && !answered) { setAnswered(true); setStreak(0); } }, [timeLeft, answered, finished]);
  const answer = (i: number) => { if (answered) return; const ok = i === questions[idx].c; setAnswered(true); setSelected(i); if (ok) { setScore(p => p + 100 + streak * 20 + timeLeft * 5); setStreak(p => p + 1); } else setStreak(0); };
  const next = () => { if (idx + 1 >= questions.length) setFinished(true); else { setIdx(p => p + 1); setAnswered(false); setSelected(-1); setTimeLeft(15); } };
  const reset = () => { setIdx(0); setScore(0); setStreak(0); setAnswered(false); setSelected(-1); setTimeLeft(15); setFinished(false); };
  if (finished) return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 60 }}>{score >= 600 ? "🏆" : "📝"}</div>
      <h2 style={{ color: "#FFAA00", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>結果発表</h2>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#FFD700", marginBottom: 16 }}>{score}点</div>
      <button onClick={reset} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "#FFAA00", color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>もう一度挑戦</button>
    </div>
  );
  const cur = questions[idx];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#FFAA00", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>❓ 雑学マスター</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#888", marginBottom: 12 }}>
        <span>Q{idx+1}/{questions.length}</span><span>💯 {score}点</span><span>🔥 {streak}連続</span><span style={{ color: timeLeft <= 5 ? "#f44" : "#888" }}>⏱ {timeLeft}s</span>
      </div>
      <div style={{ background: "#1a1a2e", borderRadius: 14, padding: 20, marginBottom: 12, textAlign: "center", fontSize: 17, fontWeight: 600, lineHeight: 1.6 }}>{cur.q}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {cur.a.map((a, i) => <button key={i} onClick={() => answer(i)} disabled={answered} style={{ padding: "14px 10px", borderRadius: 10, border: `2px solid ${answered ? (i===cur.c ? "#4CAF50" : i===selected ? "#f44" : "#333") : "#444"}`, background: answered ? (i===cur.c ? "#1a3a1a" : i===selected ? "#3a1a1a" : "#111") : "#1a1a2e", color: "#fff", fontSize: 14, fontWeight: 600, cursor: answered ? "default" : "pointer" }}>{a}</button>)}
      </div>
      {answered && <div style={{ textAlign: "center", marginTop: 12 }}><button onClick={next} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "#FFAA00", color: "#000", fontWeight: 700, cursor: "pointer" }}>{idx + 1 >= questions.length ? "結果を見る" : "次の問題 →"}</button></div>}
    </div>
  );
}

// ====== 経営シミュレータ ======
export function SimulatorGame() {
  const [s, setS] = useState({ money: 5000, day: 1, staff: 1, reputation: 30, customers: 5, menu: 1, decor: 1, log: ["☕ カフェをオープン！"] });
  const act = (type: string) => {
    setS(p => {
      const ns = { ...p, day: p.day + 1, log: [...p.log] };
      if (type === "ads" && p.money >= 500) { ns.money -= 500; ns.reputation += 8; ns.customers += Math.floor(Math.random()*8)+4; ns.log.push("📢 広告を出した！"); }
      if (type === "hire" && p.money >= 800) { ns.money -= 800; ns.staff += 1; ns.log.push(`👤 スタッフ雇用！(${p.staff+1}人)`); }
      if (type === "menu" && p.money >= 1200) { ns.money -= 1200; ns.menu += 1; ns.reputation += 5; ns.log.push(`🍰 メニュー拡充！(Lv${p.menu+1})`); }
      if (type === "work") {
        const income = ns.customers * (10 + ns.menu * 5) * Math.min(ns.staff, Math.ceil(ns.customers/3));
        const cost = ns.staff * 100;
        ns.money += income - cost;
        ns.customers = Math.max(1, ns.customers + Math.floor(Math.random()*5)-2 + Math.floor(ns.reputation/20));
        ns.log.push(`💰 営業！ 売上:${income}円 人件費:${cost}円`);
        if (Math.random() < 0.2) { ns.reputation += 15; ns.customers += 5; ns.log.push("📰 雑誌に掲載！"); }
      }
      return ns;
    });
  };
  const Stat = ({ icon, label, val }: { icon: string; label: string; val: string | number }) => <div style={{ background: "#111", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}><div style={{ fontSize: 18 }}>{icon}</div><div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{label}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{val}</div></div>;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#44AAAA", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🏗️ カフェ経営シミュレータ</h2>
      <div style={{ textAlign: "center", fontSize: 12, color: "#888", marginBottom: 12 }}>📅 {s.day}日目</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 12 }}>
        <Stat icon="💰" label="資金" val={s.money.toLocaleString()} /><Stat icon="👤" label="スタッフ" val={s.staff} /><Stat icon="⭐" label="評判" val={s.reputation} /><Stat icon="🧑‍🤝‍🧑" label="客数" val={s.customers} /><Stat icon="🍰" label="メニュー" val={`Lv${s.menu}`} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[["💼 営業する","work",0,"#44AAAA"],["📢 広告(-500)","ads",500,"#FF8844"],["👤 雇用(-800)","hire",800,"#4488FF"],["🍰 メニュー拡充(-1200)","menu",1200,"#AA44FF"]].map(([l,a,cost,col]) => (
          <button key={a as string} onClick={() => act(a as string)} disabled={s.money < (cost as number)} style={{ padding: "10px 8px", borderRadius: 10, border: "none", background: s.money >= (cost as number) ? col as string : "#333", color: "#fff", cursor: s.money >= (cost as number) ? "pointer" : "default", fontSize: 12, fontWeight: 600, opacity: s.money < (cost as number) ? 0.5 : 1 }}>{l}</button>
        ))}
      </div>
      <div style={{ background: "#0a0a12", borderRadius: 10, padding: 10, maxHeight: 100, overflowY: "auto", fontSize: 11 }}>
        {s.log.slice(-5).map((l, i) => <div key={i} style={{ color: l.includes("売上") || l.includes("掲載") ? "#4CAF50" : "#aaa", marginBottom: 2 }}>{l}</div>)}
      </div>
    </div>
  );
}
