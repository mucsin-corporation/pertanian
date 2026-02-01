// DEMO USER
const users = {
  owner: { password: "Fall1244", role: "owner" },
  admin: { password: "Atmin12344", role: "admin" }
};

let currentUser = null;

// LOGIN
function login() {
  const u = username.value;
  const p = password.value;

  if (users[u] && users[u].password === p) {
    currentUser = users[u].role;
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    localStorage.setItem("role", currentUser);
  } else {
    loginMsg.textContent = "Login gagal";
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// FORMAT
function format(n) {
  return n.toLocaleString("id-ID");
}
function clean(v) {
  return Number(v.replace(/\./g, ""));
}

// ELEMENT
const modalInput = document.getElementById("modal");
const pendapatanInput = document.getElementById("pendapatan");

// LOAD
window.onload = () => {
  if (localStorage.getItem("theme") === "dark")
    document.body.classList.add("dark");

  const m = localStorage.getItem("modal");
  const p = localStorage.getItem("pendapatan");

  if (m) modalInput.value = format(Number(m));
  if (p) pendapatanInput.value = format(Number(p));

  hitung();
};

function hitung() {
  const modal = clean(modalInput.value || "0");
  const pendapatan = clean(pendapatanInput.value || "0");

  localStorage.setItem("modal", modal);
  localStorage.setItem("pendapatan", pendapatan);

  totalModal.textContent = format(modal);
  totalPendapatan.textContent = format(pendapatan);

  const sel = pendapatan - modal;

  if (sel > 0) {
    totalHasil.textContent = "UNTUNG";
    hasilBox.className = "card hasil untung";
  } else if (sel < 0) {
    totalHasil.textContent = "RUGI";
    hasilBox.className = "card hasil rugi";
  } else {
    totalHasil.textContent = "IMPAS";
    hasilBox.className = "card hasil impas";
  }

  hasilText.textContent = totalHasil.textContent;
  selisihText.textContent = "Selisih: " + format(Math.abs(sel));
}

function handleInput(e) {
  const v = clean(e.target.value || "0");
  e.target.value = v ? format(v) : "";
  hitung();
}

modalInput.addEventListener("input", handleInput);
pendapatanInput.addEventListener("input", handleInput);
