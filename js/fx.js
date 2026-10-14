/* ফি টেবিল — USD মূল ফি থেকে অন্যান্য মুদ্রায় লাইভ রূপান্তর।
   প্রতিটি .price[data-usd][data-cur] এ HTML-এ আনুমানিক মান আগে থেকেই আছে;
   লাইভ রেট পেলে সেটি আপডেট হয়, না পেলে আগের মানই থাকে। */
(function () {
  var cells = document.querySelectorAll(".price[data-usd][data-cur]");
  if (!cells.length || !window.fetch) return;
  var bn = document.documentElement.lang === "bn";
  var bnDigits = "০১২৩৪৫৬৭৮৯";
  function fmt(n) {
    var s = Math.round(n).toLocaleString("en-US");
    return bn ? s.replace(/\d/g, function (d) { return bnDigits[d]; }) : s;
  }
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d || d.result !== "success" || !d.rates) return;
      cells.forEach(function (el) {
        var rate = d.rates[el.getAttribute("data-cur")];
        var usd = parseFloat(el.getAttribute("data-usd"));
        if (rate && usd) el.textContent = "≈" + fmt(usd * rate);
      });
    })
    .catch(function () {});
})();
