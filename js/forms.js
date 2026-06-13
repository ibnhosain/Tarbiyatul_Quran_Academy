/* ====================================================
   TARBIYATUL QURAN ACADEMY — Forms → Management Backend
   ----------------------------------------------------
   এই ফাইল ওয়েবসাইটের ফরমগুলোকে সরাসরি ম্যানেজমেন্ট
   সফটওয়্যারের (Render backend) সাথে যুক্ত করে।

   • ফ্রি ট্রায়াল ফরম  → kind="trial"  (পেমেন্ট লাগে না)
   • ভর্তি ফরম         → kind="enroll" (৫ ডলার + ১ মাস অগ্রিম, পেমেন্ট রেফ লাগে)

   দুটোর জন্য আলাদা প্রফেশনাল কনফার্মেশন বার্তা দেখায়।
   ==================================================== */

const TQA_API = "https://api.tarbiyatulquran.org/api";

/* ভর্তি ফি — চাইলে এখানে বদলান */
const ENROLL_FEE_USD = 5;          // এককালীন ভর্তি ফি
const ENROLL_NOTE_BN = "এককালীন ভর্তি ফি ৫ ডলার + প্রথম মাসের অগ্রিম বেতন";
const ENROLL_NOTE_EN = "One-time admission fee $5 + first month advance tuition";

/* পেমেন্ট তথ্য (একাডেমির) */
const PAY_INFO = {
  bank: {
    name: "Islami Bank Bangladesh Ltd.",
    lines: [
      ["Account Name", "FARIDUR RAHMAN"],
      ["Account No.", "20501400203811511"],
      ["Branch", "Mymensingh (Code 140)"],
      ["Routing No.", "125611758"],
      ["SWIFT", "IBBLBDDH140"],
    ],
  },
  mobile: { bkash: "+8801402499027", nagad: "+8801402499027", rocket: "+8801402499027" },
};

/* ছোট সহায়ক */
function tqaIsBn() { return location.pathname.includes("/bn/"); }

async function tqaSubmit(payload) {
  const res = await fetch(TQA_API + "/admissions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("submit failed " + res.status);
  return res.json();
}

/* ── সফল বার্তা: ট্রায়াল ── */
function tqaTrialSuccess() {
  const bn = tqaIsBn();
  return `
    <div style="text-align:center;padding:30px 18px;">
      <div style="font-size:50px;margin-bottom:14px;">📖</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:21px;font-weight:800;color:var(--emerald);margin-bottom:10px;direction:rtl;">جَزَاكُمُ اللَّهُ خَيْرًا</h3>
      <p style="font-size:15px;color:var(--emerald);font-weight:700;margin-bottom:10px;">
        ${bn ? "আলহামদুলিল্লাহ — আপনার ফ্রি ট্রায়াল অনুরোধ গৃহীত হয়েছে।" : "Alhamdulillah — your free trial request has been received."}
      </p>
      <p style="font-size:14px;color:var(--muted);line-height:1.8;margin-bottom:20px;">
        ${bn
          ? "আমাদের একাডেমিক টিম শীঘ্রই আপনার WhatsApp নম্বরে যোগাযোগ করে ট্রায়াল ক্লাসের সময় ঠিক করবে, ইনশাআল্লাহ।"
          : "Our academic team will contact you on WhatsApp shortly to arrange your trial class time, InshaAllah."}
      </p>
      <div style="background:#f2f7f4;border:1px solid rgba(26,92,58,.15);border-radius:12px;padding:13px 16px;font-size:14px;color:var(--emerald);font-weight:600;direction:rtl;margin-bottom:18px;">﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</div>
      <button class="btn primary" data-tqa-close style="min-width:140px;">${bn ? "ঠিক আছে" : "Close"}</button>
    </div>`;
}

/* ── সফল বার্তা: ভর্তি (পেমেন্টসহ) ── */
function tqaEnrollSuccess(name) {
  const bn = tqaIsBn();
  return `
    <div style="text-align:center;padding:28px 18px;">
      <div style="font-size:50px;margin-bottom:12px;">🎓</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:21px;font-weight:800;color:var(--emerald);margin-bottom:10px;direction:rtl;">بَارَكَ اللَّهُ فِيكُمْ</h3>
      <p style="font-size:15px;color:var(--emerald);font-weight:700;margin-bottom:10px;">
        ${bn ? "আলহামদুলিল্লাহ — আপনার ভর্তি আবেদন ও পেমেন্ট তথ্য গৃহীত হয়েছে।" : "Alhamdulillah — your enrollment & payment details have been received."}
      </p>
      <p style="font-size:14px;color:var(--muted);line-height:1.85;margin-bottom:18px;text-align:left;">
        ${bn ? `
          <b>পরবর্তী ধাপ:</b><br>
          ১. পরিচালক আপনার পেমেন্ট যাচাই করবেন।<br>
          ২. নিশ্চিত হলে আপনার WhatsApp নম্বরে <b>ম্যানেজমেন্ট পোর্টালের আইডি ও পাসওয়ার্ড</b> পাঠানো হবে।<br>
          ৩. সেই আইডি দিয়ে <b>app.tarbiyatulquran.org</b>-এ লগইন করে নিয়মিত ক্লাস, রুটিন ও অগ্রগতি দেখতে পারবেন।
        ` : `
          <b>Next steps:</b><br>
          1. The director will verify your payment.<br>
          2. Once confirmed, your <b>portal ID & password</b> will be sent to your WhatsApp.<br>
          3. Log in at <b>app.tarbiyatulquran.org</b> to access your regular classes, schedule & progress.
        `}
      </p>
      <div style="background:#f2f7f4;border:1px solid rgba(26,92,58,.15);border-radius:12px;padding:13px 16px;font-size:14px;color:var(--emerald);font-weight:600;direction:rtl;margin-bottom:18px;">﴿ رَبَّنَا تَقَبَّلْ مِنَّا ﴾</div>
      <button class="btn primary" data-tqa-close style="min-width:140px;">${bn ? "ঠিক আছে" : "Close"}</button>
    </div>`;
}

/* ── ত্রুটি বার্তা ── */
function tqaErrorBox() {
  const bn = tqaIsBn();
  return `<div style="margin-top:10px;padding:10px 12px;background:#fef2ee;border:1px solid #f3c2b3;border-radius:10px;color:#c2410c;font-size:13px;">
    ${bn ? "⚠️ পাঠানো যায়নি — ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।" : "⚠️ Could not submit — please check your connection and try again."}
  </div>`;
}

/* ── একটি form কে success-state এ নেওয়া ── */
function tqaShowSuccess(form, html) {
  form.style.display = "none";
  const box = document.createElement("div");
  box.innerHTML = html;
  form.parentNode.appendChild(box);
  const closeAll = () => {
    const bd = document.getElementById("backdrop");
    if (bd) { bd.classList.remove("show"); bd.setAttribute("aria-hidden", "true"); }
    document.body.style.overflow = "";
    setTimeout(() => { form.reset(); form.style.display = ""; box.remove(); }, 300);
  };
  box.querySelector("[data-tqa-close]")?.addEventListener("click", closeAll);
}

/* ════════════════════════════════════════════════
   ট্রায়াল ফরম — পেজে থাকা admissionForm
   ════════════════════════════════════════════════ */
function tqaInitTrialForms() {
  document.querySelectorAll("#admissionForm").forEach((oldForm) => {
    if (oldForm.dataset.tqaBound) return;
    // পুরনো inline listener (bn পেজে fake success) সরাতে form ক্লোন করি
    const form = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(form, oldForm);
    form.dataset.tqaBound = "1";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const submitBtn = form.querySelector('[type="submit"]');
      const oldErr = form.parentNode.querySelector(".tqa-err"); if (oldErr) oldErr.remove();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.old = submitBtn.textContent; submitBtn.textContent = tqaIsBn() ? "পাঠানো হচ্ছে…" : "Sending…"; }
      try {
        await tqaSubmit({
          kind: "trial",
          name: fd.get("name") || "",
          age: parseInt(fd.get("age")) || null,
          guardian: fd.get("guardian") || fd.get("name") || "",
          country: fd.get("country") || "",
          contact: fd.get("whatsapp") || fd.get("contact") || "",
          course_name: fd.get("course") || "",
          preferred_time: fd.get("time") || "",
          message: fd.get("message") || "",
        });
        tqaShowSuccess(form, tqaTrialSuccess());
      } catch (err) {
        const box = document.createElement("div");
        box.className = "tqa-err"; box.innerHTML = tqaErrorBox();
        form.appendChild(box);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.old || "Submit"; }
      }
    });
  });
}

/* ════════════════════════════════════════════════
   ভর্তি ফরম — আলাদা modal (JS দিয়ে ইনজেক্ট)
   data-enroll-modal বাটনে চাপলে খুলবে
   ════════════════════════════════════════════════ */
function tqaBuildEnrollModal() {
  if (document.getElementById("tqaEnrollBackdrop")) return;
  const bn = tqaIsBn();
  const courses = ["Noorani Qaida", "Quran Reading", "Quran with Tajweed", "Deen & Adab", "Hifz Support"];
  const countries = ["United States (USA)", "Canada", "United Kingdom (UK)", "Germany", "France", "Netherlands", "Australia", "Saudi Arabia", "UAE", "Other"];

  const bankRows = PAY_INFO.bank.lines.map(([k, v]) =>
    `<div style="display:flex;justify-content:space-between;gap:10px;padding:3px 0;font-size:12.5px;"><span style="color:var(--muted)">${k}</span><b style="text-align:right">${v}</b></div>`
  ).join("");

  const html = `
  <div class="backdrop" id="tqaEnrollBackdrop" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal">
      <div class="modalHead">
        <h2>${bn ? "ভর্তি আবেদন" : "Enrollment Application"}</h2>
        <button class="btnClose" data-tqa-enroll-close>✕</button>
      </div>
      <div class="modalBody">
        <!-- ফি ব্যানার -->
        <div style="background:linear-gradient(135deg,var(--emerald-d),var(--emerald));color:#fff;border-radius:12px;padding:14px 16px;margin-bottom:16px;">
          <div style="font-size:13px;opacity:.9;">${bn ? "ভর্তি ফি" : "Admission Fee"}</div>
          <div style="font-size:24px;font-weight:800;">$${ENROLL_FEE_USD} <span style="font-size:13px;font-weight:600;opacity:.9;">${bn ? "এককালীন" : "one-time"}</span></div>
          <div style="font-size:12px;opacity:.92;margin-top:3px;">${bn ? ENROLL_NOTE_BN : ENROLL_NOTE_EN}</div>
        </div>

        <form id="tqaEnrollForm">
          <div class="formRow">
            <div class="field"><label class="fieldRequired">${bn ? "শিক্ষার্থীর নাম" : "Student Name"}</label><input name="name" required placeholder="${bn ? "নাম" : "Name"}"/></div>
            <div class="field"><label class="fieldRequired">${bn ? "বয়স" : "Age"}</label><input name="age" required placeholder="${bn ? "যেমন ৭" : "e.g. 7"}"/></div>
          </div>
          <div class="formRow">
            <div class="field"><label class="fieldRequired">${bn ? "অভিভাবকের নাম" : "Guardian Name"}</label><input name="guardian" required placeholder="${bn ? "অভিভাবক" : "Guardian"}"/></div>
            <div class="field"><label class="fieldRequired">${bn ? "দেশ" : "Country"}</label><select name="country" required><option value="">${bn ? "নির্বাচন করুন" : "Select"}</option>${countries.map(c => `<option>${c}</option>`).join("")}</select></div>
          </div>
          <div class="formRow">
            <div class="field"><label class="fieldRequired">${bn ? "কোর্স" : "Course"}</label><select name="course" required><option value="">${bn ? "নির্বাচন করুন" : "Select"}</option>${courses.map(c => `<option>${c}</option>`).join("")}</select></div>
            <div class="field"><label class="fieldRequired">WhatsApp</label><input name="whatsapp" required placeholder="+1 / +44..."/></div>
          </div>
          <div class="field"><label>${bn ? "পছন্দের সময়" : "Preferred Time"}</label><input name="time" placeholder="${bn ? "যেমন সন্ধ্যা ৬টার পর" : "e.g. Evenings after 6pm"}"/></div>

          <!-- পেমেন্ট নির্দেশনা -->
          <div style="border:1px solid var(--line,#e5e9e5);border-radius:12px;padding:14px;margin:14px 0;background:#fafcfb;">
            <div style="font-weight:800;font-size:13.5px;margin-bottom:8px;color:var(--emerald);">${bn ? "💳 পেমেন্ট নির্দেশনা" : "💳 Payment Instructions"}</div>
            <div style="font-size:12.5px;color:var(--muted);margin-bottom:8px;">${bn ? "নিচের যেকোনো মাধ্যমে পরিশোধ করে রেফারেন্স/ট্রানজেকশন আইডি দিন:" : "Pay via any method below, then enter the reference / transaction ID:"}</div>
            <div style="background:#fff;border-radius:10px;padding:10px 12px;margin-bottom:8px;">
              <div style="font-weight:700;font-size:12.5px;margin-bottom:4px;">🏦 ${PAY_INFO.bank.name}</div>
              ${bankRows}
            </div>
            <div style="background:#fff;border-radius:10px;padding:10px 12px;">
              <div style="font-weight:700;font-size:12.5px;margin-bottom:4px;">📱 ${bn ? "মোবাইল ব্যাংকিং" : "Mobile Banking"}</div>
              <div style="font-size:12.5px;">bKash / Nagad / Rocket: <b>${PAY_INFO.mobile.bkash}</b></div>
            </div>
          </div>

          <div class="formRow">
            <div class="field"><label class="fieldRequired">${bn ? "পেমেন্ট মাধ্যম" : "Payment Method"}</label>
              <select name="payment_method" required><option value="">${bn ? "নির্বাচন করুন" : "Select"}</option>
                <option value="Islami Bank">Islami Bank</option><option value="bKash">bKash</option><option value="Nagad">Nagad</option><option value="Rocket">Rocket</option>
              </select></div>
            <div class="field"><label class="fieldRequired">${bn ? "ট্রানজেকশন আইডি / রেফারেন্স" : "Transaction ID / Reference"}</label><input name="payment_ref" required placeholder="${bn ? "যেমন TXN123ABC" : "e.g. TXN123ABC"}"/></div>
          </div>
          <div class="field"><label>${bn ? "বার্তা (ঐচ্ছিক)" : "Note (optional)"}</label><textarea name="message" rows="2"></textarea></div>

          <div class="flex-gap8">
            <button class="btn" type="button" data-tqa-enroll-close>${bn ? "বাতিল" : "Cancel"}</button>
            <button class="btn primary flex-1" type="submit">${bn ? "আবেদন ও পেমেন্ট জমা দিন" : "Submit Application & Payment"}</button>
          </div>
          <p class="formNote">${bn ? "পেমেন্ট যাচাইয়ের পর পোর্টালের লগইন তথ্য WhatsApp এ পাঠানো হবে, ইনশাআল্লাহ।" : "After payment verification, portal login details will be sent via WhatsApp, InshaAllah."}</p>
        </form>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  const bd = document.getElementById("tqaEnrollBackdrop");
  const closeEnroll = () => { bd.classList.remove("show"); bd.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  bd.querySelectorAll("[data-tqa-enroll-close]").forEach(b => b.addEventListener("click", closeEnroll));
  bd.addEventListener("click", e => { if (e.target === bd) closeEnroll(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeEnroll(); });

  // ভর্তি ফরম submit
  const form = document.getElementById("tqaEnrollForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    const oldErr = form.querySelector(".tqa-err"); if (oldErr) oldErr.remove();
    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.old = submitBtn.textContent; submitBtn.textContent = tqaIsBn() ? "জমা হচ্ছে…" : "Submitting…"; }
    try {
      await tqaSubmit({
        kind: "enroll",
        name: fd.get("name") || "",
        age: parseInt(fd.get("age")) || null,
        guardian: fd.get("guardian") || "",
        country: fd.get("country") || "",
        contact: fd.get("whatsapp") || "",
        course_name: fd.get("course") || "",
        preferred_time: fd.get("time") || "",
        payment_method: fd.get("payment_method") || "",
        payment_ref: fd.get("payment_ref") || "",
        message: fd.get("message") || "",
      });
      tqaShowSuccess(form, tqaEnrollSuccess(fd.get("name")));
    } catch (err) {
      const box = document.createElement("div");
      box.className = "tqa-err"; box.innerHTML = tqaErrorBox();
      form.appendChild(box);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.old || "Submit"; }
    }
  });
}

function tqaInitEnroll() {
  tqaBuildEnrollModal();
  document.querySelectorAll("[data-enroll-modal]").forEach((btn) => {
    if (btn.dataset.tqaBound) return;
    btn.dataset.tqaBound = "1";
    btn.addEventListener("click", () => {
      const bd = document.getElementById("tqaEnrollBackdrop");
      if (bd) { bd.classList.add("show"); bd.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
    });
  });
}

/* ════════════════════════════════════════════════
   যোগাযোগ ফরম — contactForm → kind="contact"
   ════════════════════════════════════════════════ */
function tqaInitContactForm() {
  const oldForm = document.getElementById("contactForm");
  if (!oldForm || oldForm.dataset.tqaBound) return;
  // app.js এর fake-success listener সরাতে ক্লোন
  const form = oldForm.cloneNode(true);
  oldForm.parentNode.replaceChild(form, oldForm);
  form.dataset.tqaBound = "1";
  const bn = tqaIsBn();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    const oldErr = form.parentNode.querySelector(".tqa-err"); if (oldErr) oldErr.remove();
    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.old = submitBtn.textContent; submitBtn.textContent = bn ? "পাঠানো হচ্ছে…" : "Sending…"; }
    try {
      await tqaSubmit({
        kind: "contact",
        name: fd.get("name") || fd.get("fullname") || "",
        contact: fd.get("whatsapp") || fd.get("phone") || fd.get("email") || fd.get("contact") || "",
        email: fd.get("email") || "",
        country: fd.get("country") || "",
        message: fd.get("message") || fd.get("msg") || fd.get("subject") || "",
      });
      const html = `
        <div style="text-align:center;padding:38px 20px;">
          <div style="font-size:48px;margin-bottom:14px;">🤲</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:21px;font-weight:800;color:var(--emerald);margin-bottom:10px;direction:rtl;">جَزَاكَ اللَّهُ خَيْرًا</h3>
          <p style="font-size:15px;color:var(--emerald);font-weight:700;margin-bottom:10px;">${bn ? "আলহামদুলিল্লাহ — আপনার বার্তাটি গৃহীত হয়েছে।" : "Alhamdulillah — your message has been received."}</p>
          <p style="font-size:14px;color:var(--muted);line-height:1.8;margin-bottom:20px;">${bn ? "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব, ইনশাআল্লাহ।" : "We will get back to you shortly, InshaAllah."}</p>
          <button class="btn primary" data-tqa-close style="min-width:140px;">${bn ? "ঠিক আছে" : "Close"}</button>
        </div>`;
      tqaShowSuccess(form, html);
    } catch (err) {
      const box = document.createElement("div");
      box.className = "tqa-err"; box.innerHTML = tqaErrorBox();
      form.appendChild(box);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.old || "Submit"; }
    }
  });
}

/* ── INIT ── inline handler গুলোর পরে চালাতে সামান্য বিলম্ব ── */
function tqaInitAll() { tqaInitTrialForms(); tqaInitEnroll(); tqaInitContactForm(); }
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(tqaInitAll, 0));
} else {
  setTimeout(tqaInitAll, 0);
}
