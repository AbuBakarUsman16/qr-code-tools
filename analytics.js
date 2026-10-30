/* Google Analytics 4
 *
 * Measurement ID yahan daalein, jaise "G-ABC1234XYZ".
 * Khali chhorne par analytics load hi nahi hoti, koi request nahi jati.
 * ID analytics.google.com > Admin > Data streams > web stream se milti hai.
 */
var GA_MEASUREMENT_ID = "G-LG2VQCRFXN";

// Sirf asli site par gino: localhost ke test aur apne visits bahar.
// Apne browser ko bahar karne ke liye ek dafa qrotto.com/?internal=1 kholein
// (wapas ginti ke liye ?internal=0).
var QROTTO_TRACK = (function () {
  try {
    var m = location.search.match(/[?&]internal=([01])/);
    if (m) localStorage.setItem("qrottoInternal", m[1]);
    if (localStorage.getItem("qrottoInternal") === "1") return false;
  } catch (e) {}
  return /(^|\.)qrotto\.com$/.test(location.hostname);
})();

(function () {
  "use strict";
  if (!QROTTO_TRACK || !GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("G-") !== 0) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

  // Har download ek "qr_download" event bhejta hai. Tools file ko <a download>
  // se save karte hain: kuch user ke click se, kuch a.click() ya jsPDF ke
  // dispatchEvent se, is liye teeno raaste pakde hain. Sirf file ka naam
  // jata hai, us ke andar ka data nahi.
  function track(a) {
    if (!a || a.qrTracked || !a.hasAttribute || !a.hasAttribute("download")) return;
    a.qrTracked = true;
    setTimeout(function () { a.qrTracked = false; }, 0);
    var name = a.getAttribute("download") || "";
    gtag("event", "qr_download", {
      file_name: name,
      file_extension: (name.split(".").pop() || "").toLowerCase()
    });
  }
  var click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { track(this); return click.apply(this, arguments); };
  var dispatch = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function (e) {
    if (e && e.type === "click" && this instanceof HTMLAnchorElement) track(this);
    return dispatch.apply(this, arguments);
  };
  document.addEventListener("click", function (e) {
    track(e.target && e.target.closest && e.target.closest("a[download]"));
  }, true);
})();

/* Microsoft Clarity
 *
 * Heatmaps and session recordings of on-page actions (clicks, scrolls,
 * mouse movement). Text typed into the generators is masked by default.
 * Project ID clarity.microsoft.com > Settings > Overview se milti hai.
 * Khali chhorne par Clarity load hi nahi hoti.
 */
var CLARITY_PROJECT_ID = "yzhjzovyrp";

(function () {
  "use strict";
  if (!QROTTO_TRACK || !CLARITY_PROJECT_ID) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
})();
