/*
 * GitHub Pages serves every page at two addresses, /page and /page.html,
 * and Google indexed both for at least one of our tools even though the
 * canonical tag points at the clean one. Splitting a page across two URLs
 * splits its ranking signals, so this sends the .html address to the clean
 * one before anything else loads.
 *
 * Static hosting gives us no server redirect, so this runs in the browser.
 * The canonical tag remains the primary signal; this reinforces it.
 */
(function () {
  try {
    var path = window.location.pathname;
    if (path.slice(-5) !== ".html") return;
    if (path === "/404.html") return;

    var clean = path.slice(0, -5);
    if (clean.slice(-6) === "/index") clean = clean.slice(0, -5);

    window.location.replace(clean + window.location.search + window.location.hash);
  } catch (e) {
    /* never let this break the page */
  }
})();
