/* Website sample of "Wudu & Salah in 3D" (salah-3d.html, bn/salah-3d.html).
   A realistic child does each sample step, moving in a loop (pause / play). Only the sample steps are in the
   public files (js/salah3d/*_sample.glb); the other steps are shown locked — the full course is in our app after admission.
   Needs three.min.js, OrbitControls.js, GLTFLoader.js, model.js, scene.js and window.TQA_STEPS / TQA_SAMPLE. */
(function () {
  const box = document.getElementById("s3View");
  if (!box || !window.THREE) return;
  const STEPS = window.TQA_STEPS, SAMPLE = new Set(window.TQA_SAMPLE), LANG = document.documentElement.lang === "bn" ? "bn" : "en";
  const BASE = (document.currentScript && document.currentScript.src.replace(/viewer\.js.*$/, "")) || "js/salah3d/";
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  box.appendChild(renderer.domElement);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
  const ctl = new THREE.OrbitControls(cam, renderer.domElement);
  Object.assign(ctl, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 0.6, maxDistance: 5, maxPolarAngle: Math.PI * 0.49 });
  const clock = new THREE.Clock();
  let scene = null, mixer = null, action = null, idx = 0, playing = true, viewed = false;
  const center = new THREE.Vector3(0, 0.5, 0.1); let radius = 0.75;
  const models = {};
  const $ = s => document.querySelector(s);
  const chips = [...document.querySelectorAll(".s3Chip")], tabs = [...document.querySelectorAll(".s3Tab")];
  const lock = $("#s3Lock"), wait = $("#s3Wait");

  function size() { const w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  new ResizeObserver(size).observe(box);

  function view(dir) {
    const d = { front: [0.35, 0.25, 1], side: [-1, 0.2, 0.1], back: [-0.35, 0.3, -1] }[dir];
    const v = new THREE.Vector3(...d).normalize();
    cam.position.copy(center).add(v.multiplyScalar(radius / Math.sin(15 * Math.PI / 180) * 0.95)); ctl.target.copy(center); ctl.update();
  }

  function load(kind) {
    if (!models[kind]) models[kind] = new Promise((ok, bad) => new THREE.GLTFLoader().load(BASE + kind + "_sample.glb", g => {
      g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
      ok(g);
    }, undefined, bad));
    return models[kind];
  }

  async function show(i) {
    idx = (i + STEPS.length) % STEPS.length;
    const st = STEPS[idx], open = SAMPLE.has(st.key);
    chips.forEach(c => c.setAttribute("aria-current", String(c.dataset.key === st.key)));
    tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.group === st.group)));
    document.querySelectorAll(".s3Chips").forEach(g => { g.hidden = g.dataset.group !== st.group; });
    $("#s3Title").textContent = st[LANG].title;
    $("#s3Text").innerHTML = st[LANG].text;
    $("#s3Rule").textContent = st[LANG].rule || ""; $("#s3Rule").hidden = !st[LANG].rule;
    $("#s3Count").textContent = (idx + 1) + " / " + STEPS.length;
    lock.hidden = open;
    history.replaceState(null, "", "#" + st.key);
    if (!open) return;
    wait.hidden = false;
    const kind = st.group === "girl" ? "girl" : "boy";
    const g = await load(kind);
    if (STEPS[idx].key !== st.key) return;
    scene = TQA_SCENE.stage(st.key); scene.add(g.scene);
    const wudu = st.key.startsWith("wudu");
    g.scene.traverse(o => {
      if (o.name.startsWith("kufi") || o.name.startsWith("hair_cap")) o.visible = !wudu;
      if (o.name.startsWith("hair_full")) o.visible = wudu;
    });
    if (!mixer || mixer.getRoot() !== g.scene) mixer = new THREE.AnimationMixer(g.scene);
    mixer.stopAllAction();
    const clip = g.animations.find(a => a.name === st.key);
    if (clip) { action = mixer.clipAction(clip); action.reset().setLoop(THREE.LoopRepeat).play(); action.paused = !playing; }
    center.set(0, wudu ? 0.55 : 0.45, wudu ? 0.15 : 0.12); radius = wudu ? 0.72 : 0.78;
    if (!viewed) { view("front"); viewed = true; } else { ctl.target.copy(center); ctl.update(); }
    wait.hidden = true;
  }

  (function loop() {
    requestAnimationFrame(loop);
    const dt = clock.getDelta();
    if (mixer && lock.hidden) mixer.update(dt);
    ctl.update(); if (scene && lock.hidden) renderer.render(scene, cam);
  })();

  chips.forEach(c => c.addEventListener("click", () => show(STEPS.findIndex(s => s.key === c.dataset.key))));
  tabs.forEach(t => t.addEventListener("click", () => show(STEPS.findIndex(s => s.group === t.dataset.group))));
  $("#s3Prev").addEventListener("click", () => show(idx - 1));
  $("#s3Next").addEventListener("click", () => show(idx + 1));
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => view(b.dataset.view)));
  const pb = $("#s3Play");
  function syncPlay() { pb.textContent = playing ? pb.dataset.pause : pb.dataset.play; pb.setAttribute("aria-pressed", String(!playing)); if (action) action.paused = !playing; }
  pb.addEventListener("click", () => { playing = !playing; syncPlay(); });
  document.addEventListener("keydown", e => {
    if (e.target.closest("input,textarea,select")) return;
    if (e.key === "ArrowRight") show(idx + 1); else if (e.key === "ArrowLeft") show(idx - 1); else if (e.key === " ") { e.preventDefault(); playing = !playing; syncPlay(); }
  });
  size(); syncPlay();
  const start = STEPS.findIndex(s => "#" + s.key === location.hash);
  show(start >= 0 ? start : STEPS.findIndex(s => SAMPLE.has(s.key)));
})();
