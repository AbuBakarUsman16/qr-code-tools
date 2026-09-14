/* Google Analytics 4
 *
 * Measurement ID yahan daalein, jaise "G-ABC1234XYZ".
 * Khali chhorne par analytics load hi nahi hoti, koi request nahi jati.
 * ID analytics.google.com > Admin > Data streams > web stream se milti hai.
 */
var GA_MEASUREMENT_ID = "G-LG2VQCRFXN";

(function () {
  "use strict";
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("G-") !== 0) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
})();
