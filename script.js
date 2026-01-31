let modal = 0;
let panen = 0;

function jawab(tanya) {
  let laba = panen - modal;

  if (tanya === "modal") {
    document.getElementById("jawaban").innerText =
      "Total modal: Rp " + modal;
  }

  if (tanya === "panen") {
    document.getElementById("jawaban").innerText =
      "Total panen: Rp " + panen;
  }

  if (tanya === "laba") {
    document.getElementById("jawaban").innerText =
      "Laba / Rugi: Rp " + laba;
  }
}
