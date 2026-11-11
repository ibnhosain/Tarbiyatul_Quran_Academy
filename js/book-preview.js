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
