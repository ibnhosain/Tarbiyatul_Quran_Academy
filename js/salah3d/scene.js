/* Scene for one pose: lights, floor, props (prayer mat, basin, stool …) + the posed child.
   Used by render.html (book pictures) and by the website 3D page. Exposes window.TQA_SCENE.make(key). */
(function () {
  const { V, mat, capsule, frustum } = TQA3D;

  function prayerMat(g) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.012, 1.18), mat(0x1A5C3A, { roughness: 0.95 }));
    base.position.set(0, 0.006, 0.28); g.add(base);
    const gold = mat(0xC9962A, { roughness: 0.6 });
    const bar = (w, d, x, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.004, d), gold); b.position.set(x, 0.0135, z); g.add(b); };
    bar(0.6, 0.018, 0, -0.27); bar(0.6, 0.018, 0, 0.83); bar(0.018, 1.1, -0.29, 0.28); bar(0.018, 1.1, 0.29, 0.28);
    // a simple arch at the Qiblah end
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.009, 8, 40, Math.PI), gold);
    arch.rotation.x = -Math.PI / 2; arch.position.set(0, 0.0135, 0.62); g.add(arch);
    bar(0.009, 0.16, -0.16, 0.54); bar(0.009, 0.16, 0.16, 0.54);
  }

  function basin(g, waterOn) {
    const white = mat(0xF4F4F2, { roughness: 0.35 }), steel = mat(0xB9C2C8, { roughness: 0.25, metalness: 0.7 });
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.56, 28), white); stand.position.set(0, 0.28, 0.4); g.add(stand);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.14, 0.12, 40, 1, true), white); bowl.position.set(0, 0.62, 0.4); g.add(bowl);
    bowl.material = mat(0xF4F4F2, { roughness: 0.35, side: THREE.DoubleSide });
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.14, 40), white); bottom.rotation.x = -Math.PI / 2; bottom.position.set(0, 0.565, 0.4); g.add(bottom);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.012, 10, 48), white); rim.rotation.x = Math.PI / 2; rim.position.set(0, 0.68, 0.4); g.add(rim);
    // tap
    capsule(g, V(0, 0.68, 0.6), V(0, 0.8, 0.6), 0.016, 0.016, 0xB9C2C8, { roughness: 0.25, metalness: 0.7 });
    capsule(g, V(0, 0.8, 0.6), V(0, 0.8, 0.44), 0.014, 0.012, 0xB9C2C8, { roughness: 0.25, metalness: 0.7 });
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.03, 16), steel); head.position.set(0, 0.785, 0.44); g.add(head);
    if (waterOn) water(g, V(0, 0.77, 0.44), V(0, 0.6, 0.42), 0.009);
  }

  function water(g, A, B, r) {
    const d = B.clone().sub(A);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.3, d.length(), 12, 1, false),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0x7EC8F0).convertSRGBToLinear(), transparent: true, opacity: 0.55, roughness: 0.1 }));
    m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); g.add(m);
  }

  function stool(g) {
    const wood = mat(0xA0703F, { roughness: 0.7 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.035, 0.26), wood); top.position.set(0, 0.29, -0.15); g.add(top);
    for (const x of [-0.12, 0.12]) for (const z of [-0.25, -0.05]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.03), wood); l.position.set(x, 0.14, z); g.add(l);
    }
  }
  function step(g) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.2), mat(0x9AA6A0, { roughness: 0.9 })); s.position.set(-0.09, 0.07, 0.27); g.add(s);
    const drain = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.01, 0.4), mat(0xC9D3D9, { roughness: 0.5 })); drain.position.set(0, 0.005, 0.22); g.add(drain);
  }

  // things held in the hand (placed with the hand's frame)
  function inHand(g, h, what) {
    const m = h.m, P = (x, y, z) => V(x, y, z).applyMatrix4(m);
    if (what === "miswak") capsule(g, P(-0.05, -0.04, 0.02), P(0.1, -0.04, 0.02), 0.007, 0.006, 0xB08850);
    if (what === "jug") {
      const c = P(0.0, -0.05, 0.07);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 16), mat(0x2F7D6B, { roughness: 0.4 })); body.position.copy(c); g.add(body);
      const spout = P(0.0, -0.05, 0.07).add(V(0.07, -0.02, 0.04));
      capsule(g, c, spout, 0.012, 0.008, 0x2F7D6B, { roughness: 0.4 });
      water(g, spout, spout.clone().add(V(0.005, -0.12, 0.0)), 0.006);
    }
  }

  // a gold arrow along points (shows a movement: turning for salam, wiping the head)
  function arrow(g, pts) {
    const curve = new THREE.CatmullRomCurve3(pts);
    const gold = mat(0xC9962A, { roughness: 0.4, metalness: 0.2 });
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.007, 10, false), gold));
    const end = curve.getPoint(1), dir = curve.getTangent(1);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 18), gold);
    cone.position.copy(end).add(dir.clone().multiplyScalar(0.02)); cone.quaternion.setFromUnitVectors(V(0, 1, 0), dir); g.add(cone);
  }

  function make(key) {
    const pose = TQA_POSES[key];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFBF8F1);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc4b3, 0.72));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.position.set(1.4, 3.0, 2.2); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -1.2, right: 1.2, top: 1.6, bottom: -0.6, near: 0.5, far: 8 });
    sun.shadow.bias = -0.0006; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.32); fill.position.set(-2, 1.5, -2.2); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

    const props = new THREE.Group(); scene.add(props);
    const wudu = key.startsWith("wudu");
    const fig = TQA3D.build(pose.kind, pose.body, { noCap: wudu, sleeveUp: wudu });
    scene.add(fig);
    const pr = pose.props || [];
    if (pr.includes("mat")) prayerMat(props);
    if (pr.includes("basin")) basin(props, pr.includes("tapOn"));
    if (pr.includes("stool")) stool(props);
    if (pr.includes("step")) step(props);
    if (pr.includes("miswak")) inHand(props, fig.userData.hands.R, "miswak");
    if (pr.includes("jug")) inHand(props, fig.userData.hands.R, "jug");
    const arrows = new THREE.Group(); props.add(arrows);
    for (const a of pose.arrows || []) arrow(arrows, a(fig.userData.B));
    props.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return { scene, fig, props, pose, arrows };
  }

  // a stage without the doll — for the realistic child loaded from a .glb
  function stage(key) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFBF8F1);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc4b3, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(1.4, 3.0, 2.2); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -1.2, right: 1.2, top: 1.6, bottom: -0.6, near: 0.5, far: 8 });
    sun.shadow.bias = -0.0006; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35); fill.position.set(-2, 1.5, -2.2); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const props = new THREE.Group(); scene.add(props);
    if (key === "wudu-12-feet") { stool(props); step(props); }
    else if (key.startsWith("wudu")) basin(props, !["wudu-01-niyyah", "wudu-07-face", "wudu-09-head", "wudu-10-ears", "wudu-11-neck"].includes(key));
    else prayerMat(props);
    props.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return scene;
  }

  window.TQA_SCENE = { make, stage };
})();
