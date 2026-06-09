/* ====================================================
   TARBIYATUL QURAN ACADEMY — Global JS
   ==================================================== */

const WA_NUMBER = "8801402499027";
const ACADEMY_NAME = "Tarbiyatul Quran Academy";

function openWhatsApp(msg) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

const DEFAULT_MSG = `Assalamu Alaikum. I would like to book a free trial class at ${ACADEMY_NAME}. Please let me know the next available slot. JazakAllahu Khairan.`;

/* ── Active nav link ── */
function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    const href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("active");
  });
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  if (!hamburger || !menu) return;

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "menuClose";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "Close menu");
  menu.prepend(closeBtn);

  hamburger.addEventListener("click", () => {
    menu.classList.add("show");
    document.body.style.overflow = "hidden";
  });
  const close = () => {
    menu.classList.remove("show");
    document.body.style.overflow = "";
  };
  closeBtn.addEventListener("click", close);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ── Modal ── */
function initModal() {
  const backdrop = document.getElementById("backdrop");
  if (!backdrop) return;

  const open = () => {
    backdrop.classList.add("show");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    backdrop.classList.remove("show");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-open-modal]").forEach(btn => btn.addEventListener("click", open));
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", close));
  backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ── Admission form ── */
function initAdmissionForm() {
  const form = document.getElementById("admissionForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = `Assalamu Alaikum,

I would like to register for a FREE trial class at ${ACADEMY_NAME}.

👤 Student Name : ${d.get("name")}
📅 Age          : ${d.get("age")}
🌍 Country      : ${d.get("country")}
📚 Course       : ${d.get("course")}
⏰ Preferred Time: ${d.get("time")}
📱 WhatsApp     : ${d.get("whatsapp")}
💬 Note         : ${d.get("message") || "N/A"}

JazakAllahu Khairan.`;
    openWhatsApp(msg);
    document.getElementById("backdrop")?.classList.remove("show");
    document.body.style.overflow = "";
    form.reset();
    showToast("Request sent via WhatsApp! ✓");
  });
}

/* ── Contact form ── */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = `Assalamu Alaikum,

New enquiry from ${ACADEMY_NAME} website:

👤 Name    : ${d.get("name")}
📧 Email   : ${d.get("email") || "N/A"}
🌍 Country : ${d.get("country")}
💬 Message : ${d.get("message")}

${ACADEMY_NAME}`;
    openWhatsApp(msg);
    form.reset();
    showToast("Message sent via WhatsApp! ✓");
  });
}

/* ── WhatsApp buttons ── */
function initWaButtons() {
  document.querySelectorAll("[data-wa]").forEach(btn => {
    btn.addEventListener("click", () => openWhatsApp(DEFAULT_MSG));
  });
}

/* ── FAQ accordion ── */
function initFaq() {
  document.querySelectorAll(".faqItem").forEach(item => {
    const q = item.querySelector(".faqQ");
    if (!q) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faqItem").forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

/* ── Toast ── */
function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast";
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ── Footer year ── */
function setYear() {
  document.querySelectorAll(".footerYear").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initMobileMenu();
  initModal();
  initAdmissionForm();
  initContactForm();
  initWaButtons();
  initFaq();
  setYear();
});
