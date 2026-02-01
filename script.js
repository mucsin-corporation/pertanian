/* ================= CONFIG ================= */
const SESSION_LIMIT = 8 * 60 * 1000; // 8 menit

/* ================= USERS ================= */
let users = JSON.parse(localStorage.getItem("users")) || {
  owner: { password: "Fall1244", role: "owner" },
  admin: { password: "Atmin12344", role: "admin" }
};
localStorage.setItem("users", JSON.stringify(users));

let currentUserRole = null;
let currentProduk = null;

/* ================= DATABASE ================= */
let db = JSON.parse(localStorage.getItem("db")) || {
  produk: {},
  log: []
};

const $ = id => document.getElementById(id);
const saveDB = () => localStorage.setItem("db", JSON.stringify(db));
const now = () => new Date().toLocaleString("id-ID");

/* ================= SESSION ================= */
function saveSession(role) {
  localStorage.setItem("sessionRole", role);
  localStorage.setItem("lastActive", Date.now());
}

function checkSession() {
  const role = localStorage.getItem("sessionRole");
  const last = localStorage.getItem("lastActive");

  if (!role || !last) return;

  if (Date.now() - last < SESSION_LIMIT) {
    currentUserRole = role;
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    init();
  } else {
    logout();
  }
}

/* ================= LOGIN ================= */
function login() {
  const u = loginUser.value;
  const p = loginPass.value;

  if (users[u] && users[u].password === p) {
    currentUserRole = users[u].role;
    saveSession(currentUserRole);
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    init();
  } else {
    loginMsg.textContent = "Login gagal";
  }
}

function logout() {
  localStorage.removeItem("sessionRole");
  localStorage.removeItem("lastActive");
  location.reload();
}

/* ================= INIT ================= */
function init() {
  renderProduk();
  renderAdmin();
  renderLog();
  hitungDashboard();
}

/* ================= PRODUK ================= */
function tambahProduk() {
  if (currentUserRole !== "owner") return alert("Owner saja");
  const nama = prompt("Nama produk?");
  if (!nama) return;

  const id = "p" + Date.now();
  db.produk[id] = { nama, modal: 0, pendapatan: 0 };
  db.log.unshift(`[${now()}] Owner tambah produk: ${nama}`);
  saveDB();
  renderProduk();
}

function renderProduk() {
  produkSelect.innerHTML = "";
  Object.keys(db.produk).forEach(id => {
    const o = document.createElement("option");
    o.value = id;
    o.textContent = db.produk[id].nama;
    produkSelect.appendChild(o);
  });
  currentProduk = produkSelect.value;
  loadProduk();
}

function loadProduk() {
  if (!currentProduk) return;
  const p = db.produk[currentProduk];
  namaProduk.value = p.nama;
  modal.value = format(p.modal);
  pendapatan.value = format(p.pendapatan);
}

function simpanData() {
  const p = db.produk[currentProduk];
  if (!p) return;

  if (currentUserRole === "owner") {
    p.nama = namaProduk.value;
  }

  p.modal = clean(modal.value);
  p.pendapatan = clean(pendapatan.value);

  db.log.unshift(
    `[${now()}] ${currentUserRole} update ${p.nama}: ${catatan.value}`
  );

  saveDB();
  hitungStatus(p);
  hitungDashboard();
  renderLog();
}

/* ================= HITUNG ================= */
function clean(v) {
  return Number((v || "").replace(/\./g, "")) || 0;
}
function format(n) {
  return n.toLocaleString("id-ID");
}

function hitungStatus(p) {
  const s = p.pendapatan - p.modal;
  statusBox.className = "";

  if (s > 0) {
    statusBox.classList.add("untung");
    statusBox.textContent = "UNTUNG";
  } else if (s < 0) {
    statusBox.classList.add("rugi");
    statusBox.textContent = "RUGI";
  } else {
    statusBox.classList.add("impas");
    statusBox.textContent = "IMPAS";
  }
}

function hitungDashboard() {
  let totalModal = 0;
  let totalPend = 0;

  Object.values(db.produk).forEach(p => {
    totalModal += p.modal;
    totalPend += p.pendapatan;
  });

  tModal.textContent = format(totalModal);
  tPendapatan.textContent = format(totalPend);

  const s = totalPend - totalModal;
  tHasil.textContent = s > 0 ? "UNTUNG" : s < 0 ? "RUGI" : "IMPAS";
}

/* ================= ADMIN ================= */
function tambahAdmin() {
  if (currentUserRole !== "owner") return;
  users[adminUser.value] = {
    password: adminPass.value,
    role: "admin"
  };
  localStorage.setItem("users", JSON.stringify(users));
  renderAdmin();
}

function renderAdmin() {
  adminList.innerHTML = "";
  Object.keys(users).forEach(u => {
    if (users[u].role === "admin") {
      const d = document.createElement("div");
      d.textContent = u;
      adminList.appendChild(d);
    }
  });
}

/* ================= LOG ================= */
function renderLog() {
  logList.innerHTML = db.log.map(l => `<div>${l}</div>`).join("");
}

/* ================= UI ================= */
function showPage(id) {
  ["dashboard", "produk", "admin", "log"].forEach(p =>
    $(p).classList.add("hidden")
  );
  $(id).classList.remove("hidden");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ================= ACTIVITY TRACK ================= */
["click", "mousemove", "keydown"].forEach(e => {
  document.addEventListener(e, () => {
    if (currentUserRole) {
      localStorage.setItem("lastActive", Date.now());
    }
  });
});

/* ================= AUTO CHECK ================= */
checkSession();
