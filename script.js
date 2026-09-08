function downloadQRCode(filename) {
  const container = document.getElementById("qrcode");
  const canvas = container.querySelector("canvas");
  const img = container.querySelector("img");
  const source = canvas || img;
  if (!source) return;

  const link = document.createElement("a");
  link.download = filename || "qr-code.png";
  link.href = canvas ? canvas.toDataURL("image/png") : source.src;
  link.click();
}

function escapeVCardValue(value) {
  return (value || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}
