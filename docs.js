/*
 * Docs behaviour: copy buttons on code examples, the "On this page" rail
 * that follows the reader, a filter for the side menu, and docs search.
 * Everything here is an extra: the pages work without script.
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // copy button on every code example
  function addCopyButtons() {
    if (!navigator.clipboard) return;
    document.querySelectorAll("pre.payload").forEach(function (pre) {
      if (pre.parentNode.classList.contains("payload-wrap")) return;
      var wrap = document.createElement("div");
      wrap.className = "payload-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy this example");
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(pre.textContent).then(function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy"; }, 1600);
        });
      });
      wrap.appendChild(btn);
    });
  }

  // highlight the section being read in the right-hand rail
  function followSections() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".docs-rail a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var heads = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId[e.target.id];
        if (a) a.setAttribute("aria-current", "location");
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    heads.forEach(function (h) { obs.observe(h); });
  }

  // type in the side menu box to narrow the list
  function filterSide() {
    var input = document.querySelector(".docs-filter input");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll(".docs-side-nav li").forEach(function (li) {
        li.hidden = q && li.textContent.toLowerCase().indexOf(q) === -1;
      });
      document.querySelectorAll(".docs-side-nav h2").forEach(function (h) {
        var ul = h.nextElementSibling;
        var any = ul && ul.querySelector("li:not([hidden])");
        h.hidden = !any;
      });
    });
  }

  // docs home search: suggests every page in the "All docs" list
  function docsSearch() {
    var input = document.getElementById("docs-search");
    if (!input) return;
    var pages = {};
    var list = document.createElement("datalist");
    list.id = "docs-search-list";
    document.querySelectorAll(".docs-az a").forEach(function (a) {
      var name = a.textContent.trim();
      if (pages[name]) return;
      pages[name] = a.href;
      var o = document.createElement("option");
      o.value = name;
      list.appendChild(o);
    });
    input.setAttribute("list", list.id);
    input.parentNode.appendChild(list);
    function go() {
      var q = input.value.trim().toLowerCase();
      if (!q) return;
      var names = Object.keys(pages);
      var hit = names.filter(function (n) { return n.toLowerCase() === q; })[0] ||
                names.filter(function (n) { return n.toLowerCase().indexOf(q) !== -1; })[0];
      if (hit) window.location.href = pages[hit];
    }
    input.addEventListener("change", function () { if (pages[input.value]) go(); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } });
    document.addEventListener("keydown", function (e) {
      var t = e.target.tagName;
      if (e.key === "/" && t !== "INPUT" && t !== "TEXTAREA") { e.preventDefault(); input.focus(); }
    });
  }

  ready(function () {
    addCopyButtons();
    followSections();
    filterSide();
    docsSearch();
  });
})();
