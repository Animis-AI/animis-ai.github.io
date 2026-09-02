/* Interactive mesh × collision inspector.
 *
 * Builds the kinematic tree from inspect.json (URDF links/joints), loads the
 * per-link visual GLBs and the packed collision.glb into the SAME link groups,
 * so visual meshes and convex hulls articulate together. Modes: visual /
 * collision / overlay; one slider per movable joint. */
import * as THREE from "three";
import { OrbitControls } from "../vendor/three/OrbitControls.js";
import { GLTFLoader } from "../vendor/three/GLTFLoader.js";

const HULL_HUES = [210, 25, 130, 270, 55, 175, 330, 95, 240, 15, 300, 150];

// URDF rpy is fixed-axis XYZ: R = Rz(yaw) * Ry(pitch) * Rx(roll)
function rpyQuaternion(rpy) {
  const m = new THREE.Matrix4().makeRotationZ(rpy[2]);
  m.multiply(new THREE.Matrix4().makeRotationY(rpy[1]));
  m.multiply(new THREE.Matrix4().makeRotationX(rpy[0]));
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

export async function createInspector(container, base, labels) {
  const spec = await fetch(base + "inspect.json").then((r) => r.json());

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x998f7d, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2.5, 4, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff4e0, 0.5);
  fill.position.set(-3, 1.5, -2);
  scene.add(fill);

  const root = new THREE.Group();
  root.rotation.x = -Math.PI / 2; // URDF z-up -> three y-up
  scene.add(root);

  // -- kinematic tree ------------------------------------------------------
  const linkGroups = {};
  const visualHolders = {};
  const collisionHolders = {};
  for (const link of spec.links) {
    const g = new THREE.Group();
    g.name = link.name;
    const vh = new THREE.Group();
    const ch = new THREE.Group();
    g.add(vh, ch);
    linkGroups[link.name] = g;
    visualHolders[link.name] = vh;
    collisionHolders[link.name] = ch;
  }
  const childLinks = new Set();
  const movable = [];
  for (const j of spec.joints) {
    const pivot = new THREE.Group();
    pivot.position.fromArray(j.xyz);
    pivot.quaternion.copy(rpyQuaternion(j.rpy));
    const motion = new THREE.Group();
    pivot.add(motion);
    motion.add(linkGroups[j.child]);
    linkGroups[j.parent].add(pivot);
    childLinks.add(j.child);
    if (j.type === "revolute" || j.type === "prismatic" || j.type === "continuous") {
      movable.push({ ...j, motion, value: 0 });
    }
  }
  for (const link of spec.links) {
    if (!childLinks.has(link.name)) root.add(linkGroups[link.name]);
  }

  const setJoint = (j, q) => {
    j.value = q;
    if (j.type === "prismatic") {
      j.motion.position.set(j.axis[0] * q, j.axis[1] * q, j.axis[2] * q);
    } else {
      j.motion.quaternion.setFromAxisAngle(
        new THREE.Vector3().fromArray(j.axis).normalize(), q);
    }
  };

  // -- geometry ------------------------------------------------------------
  const loader = new GLTFLoader();
  const loadGlb = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));

  const jobs = [];
  for (const link of spec.links) {
    for (const vis of link.visuals) {
      jobs.push(loadGlb(base + vis.file).then((gltf) => {
        const holder = new THREE.Group();
        holder.position.fromArray(vis.xyz);
        holder.quaternion.copy(rpyQuaternion(vis.rpy));
        holder.add(gltf.scene);
        visualHolders[link.name].add(holder);
      }));
    }
  }
  const collisionMats = [];
  let hullTotal = 0;
  jobs.push(loadGlb(base + "collision.glb").then((gltf) => {
    for (const linkNode of [...gltf.scene.children]) {
      const holder = collisionHolders[linkNode.name];
      if (!holder) continue;
      for (const hull of [...linkNode.children]) {
        hull.traverse((n) => {
          if (!n.isMesh) return;
          n.geometry.computeVertexNormals();
          const hue = HULL_HUES[hullTotal % HULL_HUES.length];
          const mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${hue}, 62%, 58%)`),
            flatShading: true,
            transparent: true,
            opacity: 1,
            shininess: 18,
          });
          n.material = mat;
          collisionMats.push(mat);
          hullTotal += 1;
        });
        holder.add(hull);
      }
    }
  }));
  await Promise.all(jobs);

  // -- camera framing ------------------------------------------------------
  const frame = () => {
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    controls.target.copy(center);
    camera.near = size / 100;
    camera.far = size * 20;
    camera.position.set(center.x + size * 0.85, center.y + size * 0.45, center.z + size * 0.85);
    camera.updateProjectionMatrix();
    controls.update();
  };
  frame();

  // -- modes ---------------------------------------------------------------
  let mode = "both";
  const setMode = (m) => {
    mode = m;
    const showV = m !== "collision";
    const showC = m !== "visual";
    for (const n of Object.values(visualHolders)) n.visible = showV;
    for (const n of Object.values(collisionHolders)) n.visible = showC;
    const overlay = m === "both";
    for (const mat of collisionMats) {
      mat.opacity = overlay ? 0.42 : 1;
      mat.depthWrite = !overlay;
    }
  };

  // -- ui ------------------------------------------------------------------
  const ui = document.createElement("div");
  ui.className = "insp-ui";
  const fmtVal = (j) => j.type === "prismatic"
    ? `${(j.value * 100).toFixed(0)} cm`
    : `${Math.round(j.value * 180 / Math.PI)}°`;
  ui.innerHTML = `
    <div class="insp-joints">
      ${movable.map((j, i) => `
        <label class="insp-joint">
          <span class="insp-joint-name">${j.name}</span>
          <input type="range" min="0" max="1000" value="0" data-j="${i}">
          <span class="insp-joint-val" data-jv="${i}">${fmtVal(j)}</span>
        </label>`).join("")}
    </div>
    <span class="insp-count">${labels.hulls(hullTotal)}</span>`;
  container.appendChild(ui);

  ui.querySelectorAll("input[data-j]").forEach((inp) =>
    inp.addEventListener("input", () => {
      const j = movable[+inp.dataset.j];
      setJoint(j, j.lower + (inp.value / 1000) * (j.upper - j.lower));
      ui.querySelector(`[data-jv="${inp.dataset.j}"]`).textContent = fmtVal(j);
    }));
  setMode("both");

  // -- loop / resize / dispose --------------------------------------------
  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    setMode,
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((n) => {
        n.geometry?.dispose?.();
        (Array.isArray(n.material) ? n.material : n.material ? [n.material] : [])
          .forEach((m) => m.dispose?.());
      });
      container.replaceChildren();
    },
  };
}
