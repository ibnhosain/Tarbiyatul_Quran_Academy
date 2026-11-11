/* "Look inside our books" — page galleries on books.html / bn/books.html:
   expand/collapse each gallery, full-size lightbox with prev/next, keyboard and swipe. */
(function () {
  const light = document.getElementById("bpLight");
  if (!light) return;
  const img = light.querySelector("img"), cap = light.querySelector("figcaption");
  let list = [], idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + list.length) % list.length;
    const b = list[idx];
    img.src = b.dataset.src; img.alt = b.dataset.cap;
    cap.textContent = b.dataset.cap + "  ·  " + (idx + 1) + " / " + list.length;
    // warm the next image so swiping feels instant
    const n = list[(idx + 1) % list.length]; if (n) new Image().src = n.dataset.src;
  }
  function open(btn) {
    list = [...btn.closest(".bpBook").querySelectorAll(".bpThumb")];
    lastFocus = btn; show(list.indexOf(btn));
    light.hidden = false; document.body.style.overflow = "hidden";
    light.querySelector(".bpX").focus();
  }
  function close() {
    light.hidden = true; document.body.style.overflow = ""; img.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll(".bpThumb").forEach(b => b.addEventListener("click", () => open(b)));
  light.querySelector(".bpX").addEventListener("click", close);
  light.querySelector(".bpPrev").addEventListener("click", e => { e.stopPropagation(); show(idx - 1); });
  light.querySelector(".bpNext").addEventListener("click", e => { e.stopPropagation(); show(idx + 1); });
  light.addEventListener("click", e => { if (e.target === light) close(); });
  document.addEventListener("keydown", e => {
    if (light.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "ArrowLeft") show(idx - 1);
  });
  let x0 = null;
  light.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  light.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
  });

  document.querySelectorAll(".bpMore").forEach(btn => btn.addEventListener("click", () => {
    const more = btn.previousElementSibling.querySelectorAll("[data-more]");
    const opening = more[0].hidden;
    more.forEach(t => { t.hidden = !opening; });
    btn.textContent = opening ? btn.dataset.less : btn.dataset.see;
    if (!opening) btn.closest(".bpBook").scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // CTA buttons: reuse the page's own trial modal and WhatsApp button
  document.querySelectorAll("[data-bp-trial]").forEach(b => b.addEventListener("click", () => {
    const opener = document.querySelector("[data-open-modal], #openModal");
    if (opener) { opener.click(); return; }
    const bd = document.getElementById("backdrop");
    if (bd) { bd.classList.add("show"); document.body.style.overflow = "hidden"; }
  }));
  document.querySelectorAll("[data-bp-wa]").forEach(b => b.addEventListener("click", () => {
    if (typeof window.wa === "function") { window.wa(); return; }
    const w = document.querySelector("[data-wa]"); if (w) w.click();
  }));
})();

/* Course buttons at the top of the Books page: show only the books of the chosen course
   (book cards carry data-courses; "all" = used in every course; the gallery carries data-only). */
(function () {
  const bar = document.querySelector(".ctBar");
  if (!bar) return;
  const wrap = bar.closest(".ctWrap"), now = wrap.querySelector(".ctNow"), soon = wrap.querySelector(".ctSoon");
  const btns = [...bar.querySelectorAll(".ctBtn")];
  const cards = [...document.querySelectorAll(".bookCard[data-courses]")];
  const groups = [...new Set(cards.map(c => c.parentElement))];
  const only = [...document.querySelectorAll("[data-only]")];

  function apply(course, scroll) {
    if (!btns.some(b => b.dataset.course === course)) course = "all";
    const all = course === "all";
    btns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.course === course)));
    cards.forEach(c => { const cs = c.dataset.courses.split(" "); c.hidden = !(all || cs.includes("all") || cs.includes(course)); });
    groups.forEach(g => {
      const empty = ![...g.querySelectorAll(".bookCard")].some(c => !c.hidden);
      g.hidden = empty;
      const h = g.previousElementSibling; if (h && h.tagName === "H2") h.hidden = empty;
    });
    let own = false;
    only.forEach(el => { const on = all || el.dataset.only === course; el.hidden = !on; if (on && !all) own = true; });
    now.hidden = all; now.querySelector("strong").textContent = all ? "" : btns.find(b => b.dataset.course === course).textContent;
    soon.hidden = all || own;
    if (scroll) wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  btns.forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    history.replaceState(null, "", "#course-" + b.dataset.course);
    apply(b.dataset.course, true);
  }));
  const m = location.hash.match(/^#course-([a-z-]+)$/);
  if (m) apply(m[1], true);
})();
