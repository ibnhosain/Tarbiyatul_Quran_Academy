/* ============================================================
   TARBIYATUL QURAN ACADEMY — Analytics & Conversion Tracking
   ------------------------------------------------------------
   নিচের দুটো আইডি একবার বসান — পুরো সাইটে (১৬টা পেজ) কাজ করবে।
   আইডি না বসালে ট্র্যাকিং নিজে থেকেই বন্ধ থাকবে (সাইট ভাঙবে না)।
   ============================================================ */

const GA4_ID        = "G-EVG880GWPV";    // ← GA4 Measurement ID (Tarbiyatul Quran Academy)
const META_PIXEL_ID = "1340096414749261";   // ← Meta Pixel ID (Tarbiyatul Quran Academy)

/* ---------- Google Analytics 4 ---------- */
(function () {
  if (!GA4_ID || GA4_ID.indexOf("XXXX") !== -1) return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA4_ID);
})();

/* ---------- Meta (Facebook) Pixel ---------- */
(function () {
  if (!META_PIXEL_ID || META_PIXEL_ID.indexOf("YOUR_") !== -1) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
})();

/* ---------- কনভার্সন হেল্পার (forms.js থেকে ডাকা হয়) ---------- */
window.tqaTrack = function (eventName, params) {
  params = params || {};
  try { if (window.gtag) gtag("event", eventName, params); } catch (e) {}
  try {
    if (window.fbq) {
      var map = {
        trial_booked:     "Lead",
        enroll_submitted: "CompleteRegistration",
        contact_sent:     "Contact",
        whatsapp_click:   "Contact"
      };
      fbq("track", map[eventName] || "Lead", params);
    }
  } catch (e) {}
};

/* ---------- WhatsApp বাটন ক্লিক (সব পেজে কাজ করে) ---------- */
document.addEventListener("click", function (e) {
  var el = e.target.closest && e.target.closest("[data-wa]");
  if (el) window.tqaTrack && tqaTrack("whatsapp_click");
});
