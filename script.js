/* ===== USERS ===== */
let users = JSON.parse(localStorage.getItem("users")) || {
  owner:{password:"Fall1244", role:"owner"},
  admin:{password:"Atmin12344", role:"admin"}
};
let role=null,currentProduct=null;

/* ===== UTIL ===== */
const $=id=>document.getElementById(id);
const fmt=n=>n.toLocaleString("id-ID");
const clean=v=>Number((v||"").toString().replace(/\./g,""));
const now=()=>new Date().toLocaleString("id-ID");

/* ===== AUTH ===== */
function login(){
  const u=username.value,p=password.value;
  if(users[u]&&users[u].password===p){
    role=users[u].role;
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    init();
  }else loginMsg.textContent="Login gagal";
}
function logout(){location.reload()}

/* ===== THEME ===== */
function toggleTheme(){
  document.body.classList.toggle("dark");
}

/* ===== DB ===== */
function db(){return JSON.parse(localStorage.getItem("db")||'{"products":{},"logs":[]}')}
function saveDB(d){localStorage.setItem("db",JSON.stringify(d))}

/* ===== INIT ===== */
function init(){
  renderProducts();renderAdmins();renderLogs();calc();
}

/* ===== PRODUK ===== */
function addProduct(){
  if(role!=="owner") return alert("Owner saja");
  const name=prompt("Nama produk?");
  if(!name)return;
  const d=db(),id="p"+Date.now();
  d.products[id]={name,modal:0,pend:0};
  d.logs.unshift(`[${now()}] owner tambah produk ${name}`);
  saveDB(d);renderProducts();
}
function renderProducts(){
  const d=db(),s=productSelect;
  s.innerHTML="";
  Object.keys(d.products).forEach(id=>{
    const o=document.createElement("option");
    o.value=id;o.textContent=d.products[id].name;s.appendChild(o);
  });
  currentProduct=s.value;loadProduct();
}
function loadProduct(){
  const p=db().products[currentProduct];
  if(!p)return;
  productName.value=p.name;
  modal.value=fmt(p.modal);
  pendapatan.value=fmt(p.pend);
}
function saveTx(){
  const d=db(),p=d.products[currentProduct];
  if(role==="owner") p.name=productName.value;
  p.modal=clean(modal.value);
  p.pend=clean(pendapatan.value);
  d.logs.unshift(`[${now()}] ${role} transaksi ${p.name}: ${note.value}`);
  saveDB(d);calc();renderLogs();
}

/* ===== ADMIN ===== */
function addAdmin(){
  if(role!=="owner")return;
  users[newAdmin.value]={password:newPass.value,role:"admin"};
  localStorage.setItem("users",JSON.stringify(users));
  renderAdmins();
}
function renderAdmins(){
  adminList.innerHTML="";
  Object.keys(users).forEach(u=>{
    if(users[u].role==="admin"){
      const d=document.createElement("div");
      d.textContent=u;
      adminList.appendChild(d);
    }
  });
}

/* ===== CALC ===== */
function calc(){
  const d=db();let sm=0,sp=0;
  Object.values(d.products).forEach(p=>{sm+=p.modal;sp+=p.pend});
  sumModal.textContent=fmt(sm);
  sumPendapatan.textContent=fmt(sp);
  const s=sp-sm;
  sumHasil.textContent=s>0?"UNTUNG":s<0?"RUGI":"IMPAS";
}

/* ===== LOG ===== */
function renderLogs(){
  logList.innerHTML=db().logs.map(l=>`<div>${l}</div>`).join("");
}

/* ===== NAV ===== */
function show(id){
  ["dashboard","products","admins","logs"].forEach(s=>$(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}
