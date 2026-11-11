/* Tarbiyatul Quran Academy — faceless 3D child model for the wudu & salah book and the website 3D page.
   One model, posed by: pelvis position/turn, spine and head angles, and 2-bone IK for arms and legs
   (a target point + which way the elbow/knee points). The child faces +Z (the Qiblah), ground is y = 0,
   the child's RIGHT side is -X. Lengths in metres (a child about 1.1 m tall).
   Needs three.js r128 (global THREE). Exposes window.TQA3D = { build, LOOKS }. */
(function () {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const D = Math.PI / 180;
  const LEN = { thigh: 0.27, shin: 0.25, ankle: 0.05, upper: 0.19, fore: 0.165, spine: 0.30, hipX: 0.065, shX: 0.12, shY: 0.265 };

  const LOOKS = {
    boy: { skin: 0xE2B48C, top: 0xF6F3EA, sleeve: 0xF6F3EA, skirt: 0xF6F3EA, leg: 0xC9D3CC, hair: 0x3B2A20, cap: 0xFFFFFF, kind: "boy" },
    girl: { skin: 0xE2B48C, top: 0x6E4C8A, sleeve: 0x6E4C8A, skirt: 0x6E4C8A, leg: 0x6E4C8A, hijab: 0x5C3D77, cape: 0x7B5A97, kind: "girl" },
  };

  const matCache = {};
  function mat(c, o = {}) {
    const k = c + JSON.stringify(o);
    if (!matCache[k]) matCache[k] = new THREE.MeshStandardMaterial(Object.assign({ color: new THREE.Color(c).convertSRGBToLinear(), roughness: 0.78, metalness: 0.0 }, o));
    return matCache[k];
  }

  // ── helpers ──
  function frame(pos, e, parent) {                       // e = [pitch, yaw, roll] degrees; pitch>0 leans forward (+Y towards +Z)
    const m = new THREE.Matrix4().compose(pos || V(0, 0, 0),
      new THREE.Quaternion().setFromEuler(new THREE.Euler((e[0] || 0) * D, (e[1] || 0) * D, (e[2] || 0) * D, "YXZ")), V(1, 1, 1));
    return parent ? parent.clone().multiply(m) : m;
  }
  const at = (m, x, y, z) => V(x, y, z).applyMatrix4(m);
  const axis = (m, x, y, z) => V(x, y, z).transformDirection(m);

  function ik(root, target, a, b, pole) {
    const d = target.clone().sub(root);
    let L = d.length();
    L = Math.min(Math.max(L, Math.abs(a - b) + 1e-3), a + b - 1e-4);
    const dir = d.normalize();
    const cosA = (a * a + L * L - b * b) / (2 * a * L), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    const p = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir)));
    if (p.lengthSq() < 1e-8) p.set(0, 0, 1);
    p.normalize();
    const mid = root.clone().add(dir.clone().multiplyScalar(a * cosA)).add(p.multiplyScalar(a * sinA));
    return { mid, end: root.clone().add(dir.clone().multiplyScalar(L)) };
  }

  function capsule(g, A, B, r1, r2, color, opts) {
    const d = B.clone().sub(A), h = d.length();
    if (h > 1e-5) {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, h, 22, 1, true), mat(color, opts));
      cyl.position.copy(A).add(B).multiplyScalar(0.5);
      cyl.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
      g.add(cyl);
    }
    [[A, r1], [B, r2]].forEach(([p, r]) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(r, 22, 16), mat(color, opts)); s.position.copy(p); g.add(s);
    });
  }

  function ellipsoid(g, m, c, r, color, opts) {          // r = [rx, ry, rz] in frame m
    const s = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), mat(color, opts));
    const pos = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    m.decompose(pos, q, sc);
    s.position.copy(at(m, c[0], c[1], c[2])); s.quaternion.copy(q); s.scale.set(r[0], r[1], r[2]);
    g.add(s); return s;
  }

  // a flattened tube (frustum) from A to B; side = the direction its wide axis follows
  function frustum(g, A, B, rA, rB, flat, side, color, opts, capEnds = true) {
    const d = B.clone().sub(A), h = d.length(); if (h < 1e-5) return;
    const y = d.clone().normalize();
    const x = side.clone().sub(y.clone().multiplyScalar(side.dot(y))).normalize();
    const z = x.clone().cross(y);
    const m = new THREE.Matrix4().makeBasis(x, y, z).setPosition(A.clone().add(B).multiplyScalar(0.5));
    const geo = new THREE.CylinderGeometry(rB, rA, h, 28, 1, !capEnds);
    geo.scale(1, 1, flat);
    const mesh = new THREE.Mesh(geo, mat(color, Object.assign({ side: THREE.DoubleSide }, opts)));
    mesh.applyMatrix4(m); g.add(mesh);
  }

  // ── hand: wrist W, fingers point along F, palm faces N; style = open|together|spread|grasp|point|cup|fist|flat|ring
  function hand(g, W, F, N, right, style, skin) {
    const y = F.clone().normalize().negate();
    const z = N.clone().sub(y.clone().multiplyScalar(N.dot(y))).normalize();
    const x = y.clone().cross(z);
    const m = new THREE.Matrix4().makeBasis(x, y, z).setPosition(W);
    const ts = right ? -1 : 1;                                       // thumb side along local x (anatomical)
    const P = (px, py, pz) => V(px, py, pz).applyMatrix4(m);
    // palm
    ellipsoid(g, m, [0, -0.033, 0], [0.031, 0.037, 0.0135], skin);
    capsule(g, P(0, -0.004, 0), P(0, -0.004, 0), 0.022, 0.022, skin);
    const S = {
      open: { c: [10, 10, 10, 10], s: 4, t: "open" }, together: { c: [6, 6, 6, 6], s: 0, t: "side" },
      flat: { c: [0, 0, 0, 0], s: 0, t: "side" }, spread: { c: [14, 14, 14, 14], s: 11, t: "open" },
      grasp: { c: [55, 55, 55, 55], s: 9, t: "grasp" }, cup: { c: [35, 35, 35, 35], s: 0, t: "side" },
      fist: { c: [100, 100, 100, 100], s: 0, t: "fist" }, point: { c: [-22, 105, 110, 110], s: 0, t: "ring" },
      ring: { c: [0, 95, 100, 100], s: 0, t: "ring" }, wrist: { c: [70, 70, 70, 70], s: 0, t: "grasp" },
    }[style || "open"];
    const fx = [0.0195 * ts, 0.0065 * ts, -0.0065 * ts, -0.0195 * ts], fl = [0.046, 0.052, 0.048, 0.039];
    for (let i = 0; i < 4; i++) {
      const spread = (i - 1.5) * S.s * D * -ts;                      // fan out
      let base = V(fx[i], -0.062, 0), dir = V(Math.sin(spread), -Math.cos(spread), 0);
      const c = S.c[i] * D, seg = fl[i] / 2;
      // two phalanges, each curls by c/2·1.3 towards the palm (+z)
      let a = base.clone();
      for (let k = 0; k < 2; k++) {
        const ang = c * (k === 0 ? 0.55 : 1.0);
        const dd = V(dir.x * Math.cos(ang), dir.y * Math.cos(ang), Math.sin(ang)).normalize();
        const b = a.clone().add(dd.multiplyScalar(seg));
        capsule(g, P(a.x, a.y, a.z), P(b.x, b.y, b.z), 0.0082 - k * 0.0008, 0.0076 - k * 0.0008, skin);
        a = b;
      }
    }
    // thumb
    const tb = V(0.026 * ts, -0.014, 0.008);
    const tdir = { open: V(0.75 * ts, -0.6, 0.25), side: V(0.25 * ts, -0.95, 0.2), grasp: V(0.35 * ts, -0.55, 0.75),
      fist: V(-0.2 * ts, -0.6, 0.75), ring: V(-0.25 * ts, -0.75, 0.6) }[S.t].normalize();
    const t1 = tb.clone().add(tdir.clone().multiplyScalar(0.026)), t2 = t1.clone().add(tdir.clone().multiplyScalar(0.022));
    capsule(g, P(tb.x, tb.y, tb.z), P(t1.x, t1.y, t1.z), 0.0105, 0.0095, skin);
    capsule(g, P(t1.x, t1.y, t1.z), P(t2.x, t2.y, t2.z), 0.0095, 0.0085, skin);
    return { m, tip: P(0, -0.11, 0), index: P(fx[0], -0.11, 0) };
  }

  // ── foot: ankle A, toes point along Fw, U = up of the foot; toes = bend of the toes (deg, + = bent up)
  function foot(g, A, Fw, U, toes, skin) {
    const z = Fw.clone().normalize();
    const y = U.clone().sub(z.clone().multiplyScalar(U.dot(z))).normalize();
    const x = y.clone().cross(z);
    const m = new THREE.Matrix4().makeBasis(x, y, z).setPosition(A);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.042, 0.115), mat(skin));
    box.geometry.translate(0, -0.03, 0.03);
    box.applyMatrix4(m); g.add(box);
    ellipsoid(g, m, [0, -0.03, -0.022], [0.03, 0.024, 0.03], skin);          // heel
    ellipsoid(g, m, [0, -0.012, 0.02], [0.03, 0.03, 0.05], skin);            // instep
    const t = (toes || 0) * D, hinge = V(0, -0.034, 0.088);
    const dir = V(0, Math.sin(t), Math.cos(t));
    const tipL = hinge.clone().add(dir.clone().multiplyScalar(0.042));
    for (const ox of [-0.018, 0, 0.018]) {
      const a = hinge.clone().add(V(ox, 0, 0)), b = tipL.clone().add(V(ox * 0.9, 0, 0));
      capsule(g, a.applyMatrix4(m), b.applyMatrix4(m), 0.0115, 0.0105, skin);
    }
    return m;
  }

  // ── the figure ──
  // pose = { pelvis:[x,y,z], turn:[pitch,yaw,roll], spine:[p,y,r], head:[p,y,r],
  //          arms: { R:{to, pole, f, n, hand}, L:{…} }, legs: { R:{to, pole, f, up, toes}, L:{…} } }
  // to/pole/f/n may be functions of the body anchors B (so hands can be placed on knees, ears …).
  function build(kind, pose, opts = {}) {
    const look = LOOKS[kind];
    const g = new THREE.Group();
    const pelvisM = frame(V(...(pose.pelvis || [0, 0.565, 0])), pose.turn || [0, 0, 0]);
    const chestM = frame(V(0, 0.0, 0), pose.spine || [0, 0, 0], pelvisM);
    const neckM = frame(V(0, LEN.spine, 0), pose.neck || [0, 0, 0], chestM);
    const headM = frame(V(0, 0.05, 0), pose.head || [0, 0, 0], neckM);
    const headC = [0, 0.105, 0.005];
    const B = {
      pelvisM, chestM, headM,
      hip: s => at(pelvisM, s * LEN.hipX, 0, 0),
      sh: s => at(chestM, s * LEN.shX, LEN.shY, -0.005),
      head: (x = 0, y = 0, z = 0) => at(headM, headC[0] + x, headC[1] + y, headC[2] + z),
      ear: s => at(headM, s * 0.099, headC[1] - 0.012, -0.006),
      earlobe: s => at(headM, s * 0.101, headC[1] - 0.036, 0.0),
      chest: (x, y, z) => at(chestM, x, y, z), pelvis: (x, y, z) => at(pelvisM, x, y, z),
      fwd: () => axis(chestM, 0, 0, 1), up: () => axis(chestM, 0, 1, 0), side: () => axis(chestM, 1, 0, 0),
    };
    const val = (v, ...a) => (typeof v === "function" ? v(B, ...a) : Array.isArray(v) ? V(...v) : v);

    // legs first (the knees are anchors for the hands)
    const legs = {};
    for (const [k, s] of [["R", -1], ["L", 1]]) {
      const L = (pose.legs || {})[k] || {};
      const hip = B.hip(s);
      const to = L.to ? val(L.to, s) : V(s * LEN.hipX, LEN.ankle, 0);
      const pole = L.pole ? val(L.pole, s) : axis(pelvisM, 0, 0, 1);
      const r = ik(hip, to, LEN.thigh, LEN.shin, pole);
      legs[k] = { hip, knee: r.mid, ankle: r.end, L };
    }
    B.knee = s => legs[s < 0 ? "R" : "L"].knee.clone();
    B.ankle = s => legs[s < 0 ? "R" : "L"].ankle.clone();

    // torso
    const skinOpts = {};
    frustum(g, at(chestM, 0, -0.01, 0), at(chestM, 0, LEN.spine - 0.015, 0), 0.112, 0.115, 0.68, axis(chestM, 1, 0, 0), look.top);
    ellipsoid(g, chestM, [0, LEN.spine - 0.03, 0], [0.125, 0.045, 0.075], look.top);
    ellipsoid(g, pelvisM, [0, -0.02, -0.005], [0.108, 0.07, 0.08], look.skirt);
    // neck + head
    capsule(g, at(chestM, 0, LEN.spine - 0.03, 0), at(headM, 0, 0.035, 0), 0.034, 0.033, kind === "girl" ? look.hijab : look.skin);
    if (kind === "boy") {
      ellipsoid(g, headM, headC, [0.094, 0.104, 0.1], look.skin);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24, 0, Math.PI * 2, 0, 1.45), mat(look.hair));
      hair.scale.set(0.097, 0.107, 0.103); hair.rotation.x = -1.0;
      const hp = new THREE.Group(); hp.add(hair); hp.position.set(...headC); hp.position.z -= 0.004;
      hp.applyMatrix4(headM); g.add(hp);
      if (!opts.noCap) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, 1.05), mat(look.cap));
      cap.scale.set(0.1, 0.108, 0.106); cap.rotation.x = -0.12;
      const cp = new THREE.Group(); cp.add(cap); cp.position.set(headC[0], headC[1] + 0.004, headC[2] - 0.004);
      cp.applyMatrix4(headM); g.add(cp);
      }
      for (const s of [-1, 1]) ellipsoid(g, headM, [s * 0.093, headC[1] - 0.018, -0.006], [0.016, 0.026, 0.014], look.skin);
    } else {
      ellipsoid(g, headM, headC, [0.104, 0.116, 0.104], look.hijab);
      ellipsoid(g, headM, [0, headC[1] - 0.01, headC[2] + 0.05], [0.07, 0.088, 0.066], look.skin);   // face (no features)
      // the hijab's cape over the shoulders
      frustum(g, at(chestM, 0, LEN.spine + 0.05, -0.005), at(chestM, 0, LEN.spine - 0.14, 0.0), 0.075, 0.165, 0.72,
        axis(chestM, 1, 0, 0), look.cape);
      frustum(g, at(chestM, 0, LEN.spine + 0.075, -0.01), at(chestM, 0, LEN.spine + 0.02, 0), 0.07, 0.085, 0.95,
        axis(chestM, 1, 0, 0), look.hijab);
    }

    // legs (meshes)
    const kneeMid = legs.R.knee.clone().add(legs.L.knee).multiplyScalar(0.5);
    const ankMid = legs.R.ankle.clone().add(legs.L.ankle).multiplyScalar(0.5);
    for (const [k, s] of [["R", -1], ["L", 1]]) {
      const { hip, knee, ankle, L } = legs[k];
      capsule(g, hip, knee, kind === "girl" ? 0.066 : 0.058, kind === "girl" ? 0.058 : 0.047, look.skirt);
      capsule(g, knee, ankle.clone().add(knee.clone().sub(ankle).normalize().multiplyScalar(0.03)), kind === "girl" ? 0.06 : 0.046,
        kind === "girl" ? 0.052 : 0.037, look.leg);
      const fw = L.f ? val(L.f, s) : axis(pelvisM, 0, 0, 1).setY(0).normalize();
      const up = L.up ? val(L.up, s) : V(0, 1, 0);
      foot(g, ankle, fw, up, L.toes || 0, look.skin);
    }
    // the kurta / dress skirt: from the hips to the knees (and down to the ankles for a girl standing)
    const hipC = at(pelvisM, 0, -0.03, 0);
    const kneeW = legs.R.knee.distanceTo(legs.L.knee) / 2;
    const sitting = kneeMid.y < hipC.y + 0.12 && kneeMid.y > hipC.y - 0.12;     // thighs about level → no hanging skirt
    const standingGirl = kind === "girl" && ankMid.y < kneeMid.y - 0.15 && kneeMid.y < hipC.y - 0.15;
    if (standingGirl) {                                         // the long dress, one A-line from the hips to the ankles
      const ankW = legs.R.ankle.distanceTo(legs.L.ankle) / 2;
      frustum(g, hipC.clone().add(V(0, 0.03, 0)), ankMid.clone().add(V(0, -0.012, 0)), 0.125, ankW + 0.12, 0.82,
        axis(pelvisM, 1, 0, 0), look.skirt, {}, false);
    } else if (!sitting && pose.skirt !== false) {
      const skEnd = kneeMid.clone().add(kneeMid.clone().sub(hipC).normalize().multiplyScalar(kind === "girl" ? 0.07 : 0.05));
      if (skEnd.y < 0.035) skEnd.y = 0.035;
      frustum(g, hipC, skEnd, 0.125, kneeW + (kind === "girl" ? 0.085 : 0.07), 0.78, axis(pelvisM, 1, 0, 0), look.skirt, {}, false);
    }

    // arms
    const hands = {};
    for (const [k, s] of [["R", -1], ["L", 1]]) {
      const A = (pose.arms || {})[k] || {};
      const sh = B.sh(s);
      const to = A.to ? val(A.to, s) : sh.clone().add(V(s * 0.035, -0.345, 0.01));
      const pole = A.pole ? val(A.pole, s) : V(s * 0.3, 0, -1);
      const r = ik(sh, to, LEN.upper, LEN.fore, pole);
      capsule(g, sh, r.mid, 0.04, 0.034, look.sleeve);
      if (opts.sleeveUp) { capsule(g, r.mid, r.mid.clone().lerp(r.end, 0.18), 0.037, 0.035, look.sleeve); capsule(g, r.mid, r.end, 0.03, 0.026, look.skin); }
      else capsule(g, r.mid, r.end, 0.033, 0.029, look.sleeve);
      const F = A.f ? val(A.f, s) : r.end.clone().sub(r.mid).normalize();
      const N = A.n ? val(A.n, s) : V(-s, 0, 0);
      hands[k] = hand(g, r.end.clone().add(F.clone().normalize().multiplyScalar(0.012)), F, N, s < 0, A.hand, look.skin);
      if (kind === "girl") capsule(g, r.mid, r.end.clone().add(r.mid.clone().sub(r.end).normalize().multiplyScalar(-0.004)), 0.036, 0.036, look.sleeve);
    }
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.userData = { B, hands, legs };
    return g;
  }

  window.TQA3D = { build, LOOKS, V, D, LEN, mat, capsule, frustum, ellipsoid };
})();
