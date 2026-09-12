(function () {
  "use strict";

  function open(src, alt, caption) {
    var overlay = document.createElement("div");
    overlay.className = "lb-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", alt || "Enlarged image");

    var img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    overlay.appendChild(img);

    if (caption) {
      var cap = document.createElement("p");
      cap.className = "lb-cap";
      cap.textContent = caption;
      overlay.appendChild(cap);
    }

    var close = document.createElement("button");
    close.className = "lb-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = "&times;";
    overlay.appendChild(close);

    function dismiss() {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lb-open");
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    function onKey(e) {
      if (e.key === "Escape") dismiss();
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target === close || e.target === cap) dismiss();
    });
    close.addEventListener("click", dismiss);
    document.addEventListener("keydown", onKey);

    document.body.classList.add("lb-open");
    document.body.appendChild(overlay);
    close.focus();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest("figure a.zoom") : null;
    if (!link) return;
    e.preventDefault();
    var img = link.querySelector("img");
    var fig = link.closest("figure");
    var cap = fig ? fig.querySelector("figcaption") : null;
    open(link.getAttribute("href"), img ? img.alt : "", cap ? cap.textContent : "");
  });
})();
