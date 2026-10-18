/*
 * Small QR renderer used by every generator on this site.
 *
 * It exposes the same three calls the pages were already written against
 * (new QRCode(el, opts), .clear(), .makeCode(text)) but encodes with
 * qrcode-generator instead, for two reasons we found by testing:
 *
 *   1. The previous library prepended a byte order mark to any payload
 *      containing a non ASCII character, so "Cafe" with an accent decoded
 *      with an invisible character in front of it.
 *   2. It picked the symbol version from the string length while encoding
 *      UTF-8 bytes, so accented or non Latin text threw a length overflow
 *      and nothing rendered at all.
 *
 * Both are fixed here by switching the byte conversion to UTF-8 and letting
 * qrcode-generator size the symbol from the real byte count.
 */
(function (global) {
  if (typeof qrcode === "undefined") return;

  if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs["UTF-8"]) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
  }

  function QRCodeEngine(el, opts) {
    this.el = (typeof el === "string") ? document.getElementById(el) : el;
    opts = opts || {};
    this.size = opts.width || 1024;
    this.ec = opts.ec || "M";
    this.quiet = 4;
    if (opts.text) this.makeCode(opts.text);
  }

  QRCodeEngine.prototype.clear = function () {
    if (this.el) this.el.innerHTML = "";
    if (this.badge) this.badge.hidden = true;
  };

  /*
   * A short scan check under the code. The print width is never below the
   * 2 cm floor our sizing guide sets for any printed code. Denser codes need
   * more than that: 0.4 mm per module plus a quiet zone of 4 modules on each
   * side, the rule the stress test uses. The density bands follow the module
   * count, because a denser grid has smaller modules at any print size.
   */
  QRCodeEngine.prototype.showBadge = function (n) {
    if (!this.el || !this.el.parentNode) return;
    if (!this.badge) {
      this.badge = document.createElement("p");
      this.badge.setAttribute("aria-live", "polite");
      this.el.parentNode.insertBefore(this.badge, this.el.nextSibling);
    }
    var mm = String(Math.round(Math.max(20, (n + 8) * 0.4) * 10) / 10);
    var grid = n + " × " + n;
    var level, text;
    if (n <= 33) {
      level = "is-low";
      text = "Low density, " + grid + ". Print at least " + mm + " mm wide.";
    } else if (n <= 57) {
      level = "is-mid";
      text = "Medium density, " + grid + ". Print at least " + mm + " mm wide and test one copy first.";
    } else {
      level = "is-high";
      text = "High density, " + grid + ". Print at least " + mm + " mm wide, or shorten the content.";
    }
    this.badge.className = "qr-scan-badge " + level;
    this.badge.textContent = text;
    this.badge.hidden = false;
  };

  QRCodeEngine.prototype.makeCode = function (text) {
    if (!this.el || !text) return;

    var q = qrcode(0, this.ec);
    q.addData(text);
    q.make();

    var n = q.getModuleCount();
    var total = n + this.quiet * 2;
    var cell = Math.max(1, Math.floor(this.size / total));
    var px = cell * total;

    var cv = document.createElement("canvas");
    cv.width = px;
    cv.height = px;

    var ctx = cv.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#000000";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (q.isDark(r, c)) {
          ctx.fillRect((c + this.quiet) * cell, (r + this.quiet) * cell, cell, cell);
        }
      }
    }

    cv.setAttribute("alt", "Your QR code");
    this.el.innerHTML = "";
    this.el.appendChild(cv);
    this.showBadge(n);
  };

  global.QRCode = QRCodeEngine;
})(window);
