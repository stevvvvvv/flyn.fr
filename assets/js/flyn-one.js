// Flyn One en 3D (three.js r170, hébergé avec le site).
// Modèle procédural : dimensions du concept V0 (128 × 30 × 84 mm, 1 unité = 100 mm).
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/three/addons/RoundedBoxGeometry.js';
import { RoomEnvironment } from '../vendor/three/addons/RoomEnvironment.js';

const CYAN = new THREE.Color(0x38cbd8);
const AMBER = new THREE.Color(0xf2b33d);
const WHITE = new THREE.Color(0xe6edf5);

// Points de vue, un par étape du récit (theta : autour, phi : depuis le haut, d : distance).
const SHOTS = [
  { theta: 0.62, phi: 1.08, d: 3.1, t: [0.12, -0.02, 0.0], ptt: 0 }, // vue produit
  { theta: 0.0, phi: 1.40, d: 2.3, t: [0.0, 0.0, 0.3], ptt: 0 }, // barre d'horizon
  { theta: 0.42, phi: 0.42, d: 2.3, t: [0.12, 0.0, 0.0], ptt: 0 }, // bouton Parler
  { theta: 1.42, phi: 1.24, d: 1.85, t: [0.5, -0.02, 0.0], ptt: 0 }, // ports
  { theta: 0.48, phi: 1.0, d: 3.6, t: [0.45, -0.05, 0.25], ptt: 1 }, // avec Flyn PTT
];

const WORDMARK = [
  'M10 70 V22 A12 12 0 0 1 22 10 H31', 'M1 34.5 H27', 'M42 5.5 V70',
  'M58 25.5 V50.5 A15 15 0 0 0 88 50.5', 'M88 25.5 V75 A15 15 0 0 1 73 90 H60',
  'M104 25.5 V70', 'M104 45 A15 15 0 0 1 134 45 V70',
];

const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, k) => a + (b - a) * k;

function wordmarkTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 720;
  const g = c.getContext('2d');
  g.scale(7, 7);
  g.translate(2, 4);
  g.lineWidth = 9;
  g.strokeStyle = 'rgba(160, 182, 214, 0.22)';
  for (const d of WORDMARK) g.stroke(new Path2D(d));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  r.addColorStop(0, 'rgba(0,0,0,0.55)');
  r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function buildDevice() {
  const device = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0x1c2638, metalness: 0.78, roughness: 0.36 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x090d14, metalness: 0.0, roughness: 0.92 });
  const black = new THREE.MeshStandardMaterial({ color: 0x04060a, metalness: 0.2, roughness: 0.5 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9aa3b2, metalness: 0.9, roughness: 0.3 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x05080e, metalness: 0.3, roughness: 0.12 });
  const led = new THREE.MeshStandardMaterial({ color: 0x0a0f16, emissive: CYAN.clone(), emissiveIntensity: 1.3 });
  const ring = new THREE.MeshStandardMaterial({ color: 0x0a0f16, emissive: CYAN.clone(), emissiveIntensity: 1.8 });

  const body = new THREE.Mesh(new RoundedBoxGeometry(1.28, 0.30, 0.84, 6, 0.07), alu);
  device.add(body);
  const bumper = new THREE.Mesh(new RoundedBoxGeometry(1.30, 0.07, 0.86, 4, 0.03), rubber);
  bumper.position.y = -0.125;
  device.add(bumper);

  // Façade : bandeau fumé et barre d'horizon lumineuse (le symbole du logo)
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.006), glass);
  strip.position.set(0, 0.015, 0.421);
  device.add(strip);
  const ledGroup = new THREE.Group();
  ledGroup.position.set(0, 0.02, 0.4255);
  const bar = new THREE.BoxGeometry(0.25, 0.014, 0.004);
  const notch = new THREE.BoxGeometry(0.05, 0.013, 0.004);
  for (const s of [-1, 1]) {
    const b = new THREE.Mesh(bar, led);
    b.position.x = s * 0.255;
    const n = new THREE.Mesh(notch, led);
    n.position.set(s * 0.115, -0.012, 0);
    n.rotation.z = s * 0.72;
    ledGroup.add(b, n);
  }
  const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.004, 24), led);
  dot.rotation.x = Math.PI / 2;
  ledGroup.add(dot);
  device.add(ledGroup);
  const ledLight = new THREE.PointLight(CYAN.clone(), 0.5, 1.2, 2);
  ledLight.position.set(0, 0.0, 0.62);
  device.add(ledLight);

  // Dessus : bouton Parler et logo gravé
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.014, 64), new THREE.MeshStandardMaterial({ color: 0x141c2b, metalness: 0.4, roughness: 0.55 }));
  button.position.set(0.33, 0.152, 0.02);
  device.add(button);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.112, 0.006, 12, 72), ring);
  halo.rotation.x = -Math.PI / 2;
  halo.position.set(0.33, 0.161, 0.02);
  device.add(halo);
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.295), new THREE.MeshBasicMaterial({ map: wordmarkTexture(), transparent: true, depthWrite: false }));
  mark.rotation.x = -Math.PI / 2;
  mark.position.set(-0.24, 0.1505, 0.04);
  device.add(mark);

  // Côté droit : USB-C ×2, jack, SMA, interrupteur micro
  const side = 0.641;
  for (const z of [0.26, 0.13]) {
    const usb = new THREE.Mesh(new RoundedBoxGeometry(0.01, 0.03, 0.09, 2, 0.004), black);
    usb.position.set(side, 0.0, z);
    device.add(usb);
  }
  const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.012, 24), black);
  jack.rotation.z = Math.PI / 2;
  jack.position.set(side, 0.0, 0.0);
  device.add(jack);
  const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.05, 6), steel);
  sma.rotation.z = Math.PI / 2;
  sma.position.set(side + 0.02, 0.0, -0.14);
  device.add(sma);
  const smaCore = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.052, 16), black);
  smaCore.rotation.z = Math.PI / 2;
  smaCore.position.copy(sma.position);
  device.add(smaCore);
  const sw = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.032, 0.065), black);
  sw.position.set(side, 0.0, -0.29);
  device.add(sw);
  const swMark = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.018, 0.022), new THREE.MeshStandardMaterial({ color: 0x3a2a08, emissive: AMBER, emissiveIntensity: 0.6 }));
  swMark.position.set(side + 0.002, 0.0, -0.305);
  device.add(swMark);

  // Arrière : ailettes de dissipation
  const fin = new THREE.BoxGeometry(0.016, 0.19, 0.035);
  for (let i = 0; i < 18; i++) {
    const f = new THREE.Mesh(fin, alu);
    f.position.set(-0.53 + i * 0.0624, 0.005, -0.43);
    device.add(f);
  }

  // Flyn PTT : bouton sans fil pour le manche
  const ptt = new THREE.Group();
  const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.175, 0.075, 64), alu);
  ptt.add(puck);
  const pttRing = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.007, 12, 72), ring);
  pttRing.rotation.x = -Math.PI / 2;
  pttRing.position.y = 0.04;
  const pttDot = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.004, 24), ring);
  pttDot.position.y = 0.04;
  ptt.add(pttRing, pttDot);
  ptt.position.set(1.08, -0.12, 0.62);
  ptt.scale.setScalar(0.001);
  device.add(ptt);

  return { device, led, ledLight, ptt };
}

export function createFlynOne(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 40);
  scene.add(new THREE.HemisphereLight(0xbfd6ff, 0x0b111c, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x38cbd8, 0.9);
  rim.position.set(-4, 1.5, -3);
  scene.add(rim);

  const { device, led, ledLight, ptt } = buildDevice();
  scene.add(device);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.162;
  scene.add(shadow);

  let target = 0; // progression du récit, 0..SHOTS.length-1
  let shown = 0;
  let ledMode = 'breath';
  let dragYaw = 0;
  let dragPitch = 0;
  let visible = true;
  const clock = new THREE.Clock();

  // Glisser pour tourner
  let dragging = false; let lx = 0; let ly = 0;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dragYaw -= (e.clientX - lx) * 0.008;
    dragPitch = Math.max(-0.5, Math.min(0.5, dragPitch - (e.clientY - ly) * 0.004));
    lx = e.clientX; ly = e.clientY;
  });
  const end = () => { dragging = false; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  const resize = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(r.height, 1);
    // sur écran étroit on recule un peu pour garder le boîtier entier
    // en cadre étroit ou vertical, on dézoome pour garder le boîtier entier
    camera.zoom = Math.min(1, camera.aspect / 1.45);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.elapsedTime;
    shown = lerp(shown, target, reducedMotion ? 1 : 1 - Math.exp(-dt * 5)); // amorti indépendant du nombre d'images/s
    if (!dragging) { dragYaw *= 0.96; dragPitch *= 0.96; }

    const i = Math.min(Math.floor(shown), SHOTS.length - 2);
    const k = smooth(Math.min(Math.max(shown - i, 0), 1));
    const a = SHOTS[i]; const b = SHOTS[i + 1];
    const sway = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.12 * (1 - Math.min(shown, 1));
    const theta = lerp(a.theta, b.theta, k) + dragYaw + sway;
    const phi = Math.max(0.25, Math.min(1.5, lerp(a.phi, b.phi, k) + dragPitch));
    const d = lerp(a.d, b.d, k);
    const tx = lerp(a.t[0], b.t[0], k); const ty = lerp(a.t[1], b.t[1], k); const tz = lerp(a.t[2], b.t[2], k);
    camera.position.set(tx + d * Math.sin(phi) * Math.sin(theta), ty + d * Math.cos(phi), tz + d * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(tx, ty, tz);

    const pttK = lerp(a.ptt, b.ptt, k);
    ptt.scale.setScalar(Math.max(0.001, pttK));

    let col = CYAN; let intensity = 1.3;
    if (ledMode === 'cycle') {
      const ph = Math.floor((t % 6) / 2);
      col = ph === 0 ? WHITE : ph === 1 ? CYAN : AMBER;
      intensity = ph === 0 ? 0.9 : 1.3;
    } else if (!reducedMotion) {
      intensity = 1.1 + Math.sin(t * 1.6) * 0.3; // « respiration » de veille
    }
    led.emissive.lerp(col, 0.15);
    led.emissiveIntensity = intensity;
    ledLight.color.copy(led.emissive);
    ledLight.intensity = 0.45 * intensity;

    renderer.render(scene, camera);
  }
  frame();

  return {
    setProgress(p) { target = Math.max(0, Math.min(SHOTS.length - 1, p)); },
    setLedMode(m) { ledMode = m; },
    steps: SHOTS.length,
  };
}
