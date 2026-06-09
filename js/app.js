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
  const menu      = document.getElementById("menu");
  const topbar    = document.querySelector(".topbar");
  if (!hamburger || !menu) return;

  /* Set --header-h so the menu starts exactly below the header */
  function setHeaderHeight() {
    const h = topbar ? topbar.getBoundingClientRect().height : 74;
    document.documentElement.style.setProperty("--header-h", h + "px");
  }
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  /* Hamburger toggle */
  hamburger.addEventListener("click", () => {
    setHeaderHeight();          /* re-measure in case font loaded late */
    const isOpen = menu.classList.contains("show");
    if (isOpen) {
      menu.classList.remove("show");
      document.body.style.overflow = "";
      hamburger.setAttribute("aria-expanded", "false");
    } else {
      menu.classList.add("show");
      document.body.style.overflow = "hidden";
      hamburger.setAttribute("aria-expanded", "true");
    }
  });

  /* Close on nav link click */
  const close = () => {
    menu.classList.remove("show");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
  };
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));

  /* Close on Escape */
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  /* Close when clicking outside on mobile */
  document.addEventListener("click", e => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) close();
  });
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

    // Hide form, show success inside modal
    form.style.display = "none";
    const success = document.createElement("div");
    success.style.cssText = "text-align:center;padding:36px 20px;";
    success.innerHTML = `
      <div style="font-size:52px;margin-bottom:18px;">🤲</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:var(--emerald);margin-bottom:10px;direction:rtl;line-height:1.5;">
        جَزَاكَ اللَّهُ خَيْرًا فِي الدَّارَيْنِ
      </h3>
      <p style="font-size:15px;color:var(--emerald);font-weight:700;margin-bottom:10px;">
        الحمد لله — আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে।
      </p>
      <p style="font-size:14px;color:var(--muted);line-height:1.8;margin-bottom:22px;">
        আমরা আপনার তথ্য পর্যালোচনা করে <strong>২৪ ঘণ্টার মধ্যে</strong> যোগাযোগ করব, ইনশাআল্লাহ।<br>
        আল্লাহ আপনার পরিবারকে কুরআনের নূর দান করুন। 📖
      </p>
      <div style="background:#f2f7f4;border:1px solid rgba(26,92,58,.15);border-radius:12px;padding:14px 18px;font-size:15px;color:var(--emerald);font-weight:600;direction:rtl;margin-bottom:20px;">
        ﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾
      </div>
      <button class="btn primary" id="successClose" style="min-width:140px;">Close</button>`;
    form.parentNode.appendChild(success);

    // Close button inside success
    document.getElementById("successClose")?.addEventListener("click", () => {
      closeModal();
    });

    function closeModal() {
      const backdrop = document.getElementById("backdrop");
      backdrop?.classList.remove("show");
      document.body.style.overflow = "";
      setTimeout(() => {
        form.reset();
        form.style.display = "";
        success.remove();
      }, 300);
    }

    // Auto-close after 6 seconds
    setTimeout(closeModal, 6000);
  });
}

/* ── Contact form ── */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    // Replace form with success message
    const wrapper = form.closest(".formCard") || form.parentNode;
    form.style.display = "none";
    const success = document.createElement("div");
    success.style.cssText = "text-align:center;padding:40px 20px;";
    success.innerHTML = `
      <div style="font-size:48px;margin-bottom:16px;">🤲</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:var(--emerald);margin-bottom:10px;">
        جَزَاكَ اللَّهُ خَيْرًا فِي الدَّارَيْنِ
      </h3>
      <p style="font-size:15px;color:var(--text);font-weight:600;margin-bottom:8px;">
        الحمد لله — আপনার বার্তাটি সফলভাবে গৃহীত হয়েছে।
      </p>
      <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:24px;">
        আমরা <strong>২৪ ঘণ্টার মধ্যে</strong> আপনার সাথে যোগাযোগ করব, ইনশাআল্লাহ।<br>
বারাকাল্লাহু ফিকুম। 🌿
      </p>
      <div style="background:#f2f7f4;border-radius:12px;padding:14px 18px;font-size:13px;color:var(--emerald);font-weight:600;">
        ﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾
      </div>`;
    wrapper.appendChild(success);
    form.reset();

    // Restore form after 6 seconds
    setTimeout(() => {
      form.style.display = "";
      success.remove();
    }, 6000);
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
  initLangDrop();
  initModal();
  initAdmissionForm();
  initContactForm();
  initWaButtons();
  initFaq();
  setYear();
});

/* ── Language dropdown ── */
function initLangDrop() {
  const drop = document.getElementById("langDrop");
  const btn  = document.getElementById("langBtn");
  if (!drop || !btn) return;

  btn.addEventListener("click", e => {
    e.stopPropagation();
    drop.classList.toggle("open");
  });

  // Close on outside click
  document.addEventListener("click", e => {
    if (drop && !drop.contains(e.target)) drop.classList.remove("open");
  });

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") drop.classList.remove("open");
  });
}
