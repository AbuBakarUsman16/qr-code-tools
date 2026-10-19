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

  // header search: suggests every tool in the menu, opens the one picked
  function addSearch() {
    var wrap = document.querySelector(".nav-wrap");
    var logo = wrap && wrap.querySelector(".logo");
    if (!wrap || !logo || wrap.querySelector(".site-search")) return;
    var links = Array.prototype.slice.call(document.querySelectorAll(".tool-nav a"));
    if (!links.length) return;

    var label = document.createElement("label");
    label.className = "site-search";
    label.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    var input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search tools";
    input.setAttribute("aria-label", "Search tools");
    input.setAttribute("list", "site-search-list");
    input.setAttribute("autocomplete", "off");
    var list = document.createElement("datalist");
    list.id = "site-search-list";
    var seen = {};
    links.forEach(function (a) {
      var name = a.textContent.trim();
      if (!name || seen[name]) return;
      seen[name] = a.href;
      var opt = document.createElement("option");
      opt.value = name;
      list.appendChild(opt);
    });
    function go() {
      var q = input.value.trim().toLowerCase();
      if (!q) return;
      var names = Object.keys(seen);
      var hit = names.filter(function (n) { return n.toLowerCase() === q; })[0] ||
                names.filter(function (n) { return n.toLowerCase().indexOf(q) !== -1; })[0];
      if (hit) window.location.href = seen[hit];
    }
    input.addEventListener("change", function () {
      if (seen[input.value]) go();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); go(); }
    });
    label.appendChild(input);
    label.appendChild(list);
    logo.insertAdjacentElement("afterend", label);
  }

  ready(function () {
    addSearch();
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
