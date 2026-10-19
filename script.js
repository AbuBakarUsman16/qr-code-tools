function qrSourceImage() {
  const container = document.getElementById("qrcode");
  if (!container) return null;
  const canvas = container.querySelector("canvas");
  const img = container.querySelector("img");
  if (canvas) return canvas.toDataURL("image/png");
  return img ? img.src : null;
}

function downloadQRCode(filename) {
  const src = qrSourceImage();
  if (!src) return;
  const link = document.createElement("a");
  link.download = filename || "qr-code.png";
  link.href = src;
  link.click();
}

// opens the code on its own page, sized for paper, and starts printing
function printQRCode(src) {
  src = src || qrSourceImage();
  if (!src) return;
  const w = window.open("", "_blank");
  if (!w) return;
  const doc = w.document;
  doc.title = "QR code";
  const style = doc.createElement("style");
  style.textContent = "body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh}img{width:60mm;height:60mm;image-rendering:pixelated}";
  doc.head.appendChild(style);
  const img = doc.createElement("img");
  img.alt = "QR code";
  img.onload = function () { w.focus(); w.print(); };
  img.src = src;
  doc.body.appendChild(img);
}

// shares the PNG through the phone's share sheet where the browser allows it
async function shareQRCode(src, filename) {
  src = src || qrSourceImage();
  if (!src) return;
  try {
    const blob = await (await fetch(src)).blob();
    const file = new File([blob], filename || "qr-code.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "QR code" });
    } else {
      downloadQRCode(filename);
    }
  } catch (e) {
    /* the person closed the share sheet */
  }
}

function escapeVCardValue(value) {
  return (value || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

// small line icons used on the action buttons
const QR_ICONS = {
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8"/><path d="M7 14h10v7H7z"/>',
  share: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v8h14v-8"/>'
};
function qrIcon(name) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2.2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = QR_ICONS[name];
  return svg;
}

// adds Print and Share next to the download button on every generator page
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".qr-output .qr-actions").forEach(function (row) {
    const first = row.querySelector(".btn");
    if (first && !first.querySelector("svg")) first.prepend(qrIcon("download"));
    if (row.querySelector("[data-qr-print]")) return;

    const print = document.createElement("button");
    print.type = "button";
    print.className = "btn btn-outline";
    print.setAttribute("data-qr-print", "");
    print.append(qrIcon("print"), "Print");
    print.addEventListener("click", function () { printQRCode(); });
    row.appendChild(print);

    if (navigator.share) {
      const share = document.createElement("button");
      share.type = "button";
      share.className = "btn btn-outline";
      share.append(qrIcon("share"), "Share");
      share.addEventListener("click", function () { shareQRCode(); });
      row.appendChild(share);
    }
  });
});
