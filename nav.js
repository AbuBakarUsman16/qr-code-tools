/*
 * Header behaviour.
 *
 * The nav is plain links and a <details> element, so it works with no
 * JavaScript at all: every link is in the markup and the dropdown opens
 * natively. This file only adds the things that need script, which are the
 * mobile toggle, closing the dropdown on outside click or Escape, and
 * collapsing the dropdown again when the layout goes back to desktop.
 *
 * The "js" class is set immediately so CSS can hide the mobile menu only
 * when there is something available to open it again.
 */
document.documentElement.classList.add("js");

(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("sitenav");
    var drop = document.querySelector(".nav-drop");
    if (!header || !toggle || !nav) return;

    function setOpen(open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });

    document.addEventListener("click", function (e) {
      if (drop && drop.open && !drop.contains(e.target)) drop.open = false;
      if (window.innerWidth <= 900 && header.classList.contains("nav-open") && !header.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (drop && drop.open) { drop.open = false; return; }
      if (header.classList.contains("nav-open")) { setOpen(false); toggle.focus(); }
    });

    var wide = window.matchMedia("(min-width: 901px)");
    function onChange() {
      if (wide.matches) { setOpen(false); if (drop) drop.open = false; }
    }
    if (wide.addEventListener) wide.addEventListener("change", onChange);
    else if (wide.addListener) wide.addListener(onChange);
  });
})();
