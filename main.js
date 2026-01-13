
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut, getIdTokenResult, sendPasswordResetEmail, sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc,
  query, where, orderBy, limit, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIaroNs2VsMamnnNJV1cP9LdXqIDhl3Ig",
  authDomain: "giiiddd-36340523-3f595.firebaseapp.com",
  projectId: "giiiddd-36340523-3f595",
  storageBucket: "giiiddd-36340523-3f595.firebasestorage.app",
  messagingSenderId: "698901018936",
  appId: "1:698901018936:web:2fb12a7a03cbd844c1e9cd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Constants
const STICKERS = ["🍎","💊","📚","🎸","💎","👑","🚀","🦄","🦖","🍕","🌈","🔥","💧","⭐","🍀","🍄"];
const themeData = {
  survival: ["🛌 밤 11시 폰 끄기", "💧 공복 물 한 잔", "💊 영양제 챙겨먹기", "🐢 거북목 스트레칭", "👁️ 먼 산 보기", "🧹 책상 위 리셋"],
  godsaeng: ["📅 주간 계획", "🛏️ 이불 정리", "💰 가계부", "📚 독서 2p", "🗣️ 영단어 1개", "📝 감사일기"],
  detox: ["📝 손기록", "📵 기상후 노폰", "🍽️ 밥먹을때 폰X", "🎧 이어폰 빼기", "🧘 명상 5분"],
  custom: []
};

const ADMIN_EMAIL_ALLOWLIST = ["test@gmail.com"];

// State
let _isAdminUser = false;
let _adminEmail = "";
let _selectedUid = "";
let isDeleteMode = false;
let dragCtx = null;

// --- Helpers ---
function safeText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function dateKeyFromOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function fmtDate(ts) {
  try {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toISOString().slice(0, 10);
  } catch { return "—"; }
}

async function getConsecutiveStreak(uid) {
  let count = 0;
  let date = new Date();
  while (true) {
    const key = date.toISOString().slice(0, 10);
    const snap = await getDoc(doc(db, "users", uid, "habits", key));
    if (!snap.exists()) break;
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

// --- Auth Functions ---
window.scrollToAuth = () => {
  const el = document.getElementById("authSection");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const signinBtn = document.getElementById("signinBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (signinBtn) {
  signinBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      alert("로그인 실패: " + e.message);
    }
  };
}

if (signupBtn) {
  signupBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(cred.user);
      alert("인증 메일이 발송되었습니다. 확인 후 로그인해주세요.");
    } catch (e) {
      alert("회원가입 실패: " + e.message);
    }
  };
}

if (logoutBtn) {
  logoutBtn.onclick = () => signOut(auth);
}

// --- App Logic ---
async function updateLevelUI(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  const d = snap.data() || {};
  
  safeText("levelBadge", `Lv.${d.level || 1}`);
  safeText("xpText", `${d.xp || 0} / 100 XP`);
  const xpBar = document.getElementById("xpBar");
  if (xpBar) xpBar.style.width = `${(d.xp || 0)}%`;
  
  const coinDisplay = document.getElementById("coinDisplay");
  if (coinDisplay) coinDisplay.style.display = 'flex';
  safeText("coinCount", d.coins || 0);
  safeText("shopCoinCount", d.coins || 0);

  const petContainer = document.getElementById("petContainer");
  if (petContainer) {
    if (d.isMaster) petContainer.classList.add("aura-effect");
    else petContainer.classList.remove("aura-effect");
  }

  const petEmoji = document.getElementById("petEmoji");
  if (petEmoji) {
    let emoji = "🥚";
    const lvl = d.level || 1;
    if (lvl >= 16) emoji = "👑";
    else if (lvl >= 8) emoji = "🐲";
    else if (lvl >= 4) emoji = "🐥";
    else if (lvl >= 2) emoji = "🐣";
    petEmoji.innerText = emoji;
  }
}

window.selectTheme = async (el, themeType) => {
  const user = auth.currentUser;
  if (!user) return alert("로그인이 필요합니다.");

  const tokenResult = await getIdTokenResult(user);
  const isPro = tokenResult.claims.pro === true || user.email === "test@gmail.com";
  const habitInput = document.getElementById("habitName");
  
  document.querySelectorAll('.theme-tag').forEach(tag => tag.classList.remove('active'));

  if (themeType === 'custom') {
    if (!isPro) {
      alert("🔒 커스텀 습관은 PRO 전용입니다.");
      return;
    }
    habitInput.readOnly = false;
    habitInput.value = "";
    habitInput.placeholder = "원하는 습관을 입력하세요";
    habitInput.focus();
  } else {
    habitInput.readOnly = true;
    const pool = themeData[themeType];
    habitInput.value = pool[Math.floor(Math.random() * pool.length)];
  }
  if (el) el.classList.add('active');
};

const habitBtn = document.getElementById("habitBtn");
if (habitBtn) {
  habitBtn.onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const name = document.getElementById("habitName").value;
    if (!name || name === "테마를 선택하세요") return alert("습관을 선택하거나 입력해주세요.");

    const today = dateKeyFromOffset(0);
    await setDoc(doc(db, "users", user.uid, "habits", today), { done: true, name, timestamp: new Date() }, { merge: true });

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    let { level = 1, xp = 0, coins = 0, isUltra, isMaster } = snap.data() || {};
    if (user.email === "test@gmail.com") { isUltra = true; isMaster = true; }

    xp += 20;
    coins += isMaster ? 3 : (isUltra ? 2 : 1);

    let lvlUp = false;
    if (xp >= 100) { level++; xp -= 100; lvlUp = true; }

    await setDoc(ref, { level, xp, coins, email: user.email, lastActiveAt: new Date() }, { merge: true });
    updateLevelUI(user.uid);

    habitBtn.innerHTML = "완료함 ✨";
    habitBtn.disabled = true;
    confetti({ particleCount: lvlUp ? 200 : 100, origin: { y: 0.7 } });
    
    const audioUrl = lvlUp ? "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7368884964.mp3" : "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3";
    new Audio(audioUrl).play().catch(() => {});
  };
}

// --- Sticker Logic ---
const trashBtn = document.getElementById("trashModeBtn");
if (trashBtn) {
  trashBtn.onclick = () => {
    isDeleteMode = !isDeleteMode;
    trashBtn.style.background = isDeleteMode ? "#ef4444" : "var(--accent)";
    document.body.classList.toggle("is-delete-mode");
    alert(isDeleteMode ? "🗑️ 삭제 모드 ON: 스티커를 클릭해서 지우세요." : "✨ 삭제 모드 OFF");
  };
}

async function loadInventory(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  const d = snap.data() || {};
  const list = document.getElementById("inventoryList");
  if (!list) return;
  list.innerHTML = "";
  (d.inventory || []).forEach(s => {
    const div = document.createElement("div");
    div.innerText = s;
    div.style.cssText = "font-size:30px; cursor:grab; background:white; border-radius:8px; text-align:center;";
    div.onmousedown = (e) => startDrag(e, s, uid, true);
    div.ontouchstart = (e) => startDrag(e, s, uid, true);
    list.appendChild(div);
  });
}

function createStickerEl(data, uid) {
  const el = document.createElement("div");
  el.className = "sticker";
  el.innerText = data.char;
  el.style.left = data.x + "%";
  el.style.top = data.y + "%";
  el.id = data.id;

  const dragStart = (e) => {
    if (isDeleteMode) return;
    startDrag(e, el, uid, false);
  };
  el.addEventListener('mousedown', dragStart);
  el.addEventListener('touchstart', dragStart, { passive: false });

  el.addEventListener('click', async (e) => {
    if (!isDeleteMode) return;
    e.stopPropagation(); e.preventDefault();
    if (confirm("이 스티커를 삭제할까요?")) {
      el.remove();
      const r = doc(db, "users", uid);
      const snap = await getDoc(r);
      const p = snap.data().placedStickers || [];
      await updateDoc(r, { placedStickers: p.filter(s => s.id !== data.id) });
    }
  });
  const layer = document.getElementById("stickerLayer");
  if (layer) layer.appendChild(el);
}

function startDrag(e, target, uid, isNew) {
  if (isDeleteMode) return;
  e.preventDefault();
  const el = isNew ? document.createElement("div") : target;
  if (isNew) {
    el.className = "sticker";
    el.innerText = target;
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
  }

  dragCtx = { el, isNew, char: isNew ? target : null, uid };
  const cx = e.clientX || e.touches[0].clientX;
  const cy = e.clientY || e.touches[0].clientY;

  if (!isNew) {
    const r = el.getBoundingClientRect();
    dragCtx.ox = cx - r.left;
    dragCtx.oy = cy - r.top;
    el.style.zIndex = 1000;
  } else {
    el.style.left = (cx - 20) + "px";
    el.style.top = (cy - 20) + "px";
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

function onMove(e) {
  if (!dragCtx) return;
  e.preventDefault();
  const cx = e.clientX || e.touches[0].clientX;
  const cy = e.clientY || e.touches[0].clientY;
  if (dragCtx.isNew) {
    dragCtx.el.style.left = (cx - 20) + "px";
    dragCtx.el.style.top = (cy - 20) + "px";
  } else {
    dragCtx.el.style.left = (cx - dragCtx.ox) + "px";
    dragCtx.el.style.top = (cy - dragCtx.oy) + "px";
  }
}

async function onEnd(e) {
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('mouseup', onEnd);
  document.removeEventListener('touchmove', onMove);
  document.removeEventListener('touchend', onEnd);
  if (!dragCtx) return;

  const layer = document.getElementById("stickerLayer");
  if (!layer) return;
  const r = layer.getBoundingClientRect();
  const cx = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0);
  const cy = e.clientY || (e.changedTouches ? e.changedTouches[0].clientY : 0);

  let x, y;
  if (dragCtx.isNew) {
    x = ((cx - r.left) / r.width) * 100;
    y = ((cy - r.top) / r.height) * 100;
    dragCtx.el.remove();
  } else {
    const er = dragCtx.el.getBoundingClientRect();
    x = ((er.left - r.left) / r.width) * 100;
    y = ((er.top - r.top) / r.height) * 100;
    dragCtx.el.style.zIndex = "";
  }

  const ref = doc(db, "users", dragCtx.uid);
  const snap = await getDoc(ref);
  const placed = snap.data().placedStickers || [];

  if (dragCtx.isNew) {
    const s = { id: Date.now().toString(), char: dragCtx.char, x, y };
    placed.push(s);
    createStickerEl(s, dragCtx.uid);
  } else {
    const i = placed.findIndex(s => s.id === dragCtx.el.id);
    if (i > -1) {
      placed[i].x = x;
      placed[i].y = y;
      dragCtx.el.style.left = x + "%";
      dragCtx.el.style.top = y + "%";
    }
  }
  await updateDoc(ref, { placedStickers: placed });
  dragCtx = null;
}

const gachaBtn = document.getElementById("gachaBtn");
if (gachaBtn) {
  gachaBtn.onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    let coins = snap.data().coins || 0;
    if (coins < 1) return alert("코인이 부족합니다.");

    coins--;
    const p = STICKERS[Math.floor(Math.random() * STICKERS.length)];
    await updateDoc(ref, { coins, inventory: arrayUnion(p) });

    alert(`🎉 [${p}] 획득!`);
    updateLevelUI(user.uid);
    loadInventory(user.uid);
  };
}

// --- Admin Logic ---
function setAdminAccess(user, tokenResult) {
  const isAdminClaim = tokenResult?.claims?.admin === true;
  const isAllowlisted = ADMIN_EMAIL_ALLOWLIST.includes(user.email);

  _isAdminUser = isAdminClaim || isAllowlisted;
  _adminEmail = user.email || "";

  const adminFab = document.getElementById("adminFab");
  const adminMe = document.getElementById("adminMe");
  const adminOpenBtn = document.getElementById("adminOpenBtn");

  if (adminFab) adminFab.style.display = _isAdminUser ? "block" : "none";
  if (adminMe) adminMe.textContent = _isAdminUser ? _adminEmail : "접근 권한 없음";
  if (adminOpenBtn) adminOpenBtn.style.display = _isAdminUser ? "block" : "none";
}

// --- Auth Observer ---
onAuthStateChanged(auth, async user => {
  const authDiv = document.getElementById("auth");
  const dashboardLayout = document.getElementById("dashboardLayout");
  const welcome = document.getElementById("welcome");
  const coinDisplay = document.getElementById("coinDisplay");

  if (!user) {
    if (authDiv) authDiv.style.display = 'block';
    if (dashboardLayout) dashboardLayout.style.display = 'none';
    if (coinDisplay) coinDisplay.style.display = 'none';
    ['adminOpenBtn', 'rankOpenBtn', 'shopOpenBtn', 'trashModeBtn', 'bgmOpenBtn', 'themeBtn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    return;
  }

  if (!user.emailVerified && !ADMIN_EMAIL_ALLOWLIST.includes(user.email)) {
    alert("이메일 인증이 필요합니다.");
    await signOut(auth);
    return;
  }

  const tokenResult = await getIdTokenResult(user);
  setAdminAccess(user, tokenResult);

  if (authDiv) authDiv.style.display = 'none';
  if (dashboardLayout) dashboardLayout.style.display = 'flex';
  if (welcome) welcome.textContent = `👋 ${user.email.split('@')[0]}님`;

  ['rankOpenBtn', 'shopOpenBtn', 'trashModeBtn', 'bgmOpenBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  });

  const uSnap = await getDoc(doc(db, "users", user.uid));
  const userData = uSnap.data() || {};
  let { isPro, isUltra, isMaster } = userData;

  if (isUltra || isMaster || _isAdminUser) {
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.style.display = 'block';
  }

  if (isMaster || _isAdminUser) {
    const workoutSidePanel = document.getElementById("workoutSidePanel");
    if (workoutSidePanel) workoutSidePanel.style.display = 'block';
    const timerBtn = document.getElementById("timerBtn");
    if (timerBtn) timerBtn.style.display = 'block';
  }

  updateLevelUI(user.uid);
  const layer = document.getElementById("stickerLayer");
  if (layer) {
    layer.innerHTML = "";
    (userData.placedStickers || []).forEach(s => createStickerEl(s, user.uid));
  }
  
  const streak = await getConsecutiveStreak(user.uid);
  safeText("streakCount", `${streak}일 연속 성공 중!`);
});

// BGM & Theme Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  darkModeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "on" : "off");
  };
}
if (localStorage.getItem("darkMode") === "on") document.body.classList.add("dark-mode");
