const modalInput = document.getElementById("modal");
const pendapatanInput = document.getElementById("pendapatan");
const hasilText = document.getElementById("hasilText");
const selisihText = document.getElementById("selisihText");
const hasilBox = document.getElementById("hasilBox");

function hitung() {
  const modal = Number(modalInput.value);
  const pendapatan = Number(pendapatanInput.value);

  if (!modal || !pendapatan) {
    hasilText.textContent = "Masukkan angka";
    selisihText.textContent = "";
    hasilBox.className = "card hasil";
    return;
  }

  const selisih = pendapatan - modal;

  if (selisih > 0) {
    hasilText.textContent = "UNTUNG";
    hasilBox.className = "card hasil untung";
  } else if (selisih < 0) {
    hasilText.textContent = "RUGI";
    hasilBox.className = "card hasil rugi";
  } else {
    hasilText.textContent = "IMPAS";
    hasilBox.className = "card hasil impas";
  }

  selisihText.textContent = "Selisih: " + selisih;
}

modalInput.addEventListener("input", hitung);
pendapatanInput.addEventListener("input", hitung);
