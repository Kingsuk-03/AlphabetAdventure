import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import {
  Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight, Sparkles,
  Sun, Moon as MoonIcon, Trophy, X, Music, Keyboard, Heart, Shuffle,
  HelpCircle, Award, Star as StarIcon, Flame, Gift, Zap, Filter, PartyPopper
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════
// LETTER DATA
// ═══════════════════════════════════════════════════════════════════════
const LETTER_DATA = {
  A: { word: "Apple",      phonetic: "ah",   fact: "An apple a day keeps the doctor away!",     bg: ["#ffe5d9","#ffb4a2"], accent: "#e63946", emoji: "🍎", cat: "food",   sound: "crunch"  },
  B: { word: "Ball",       phonetic: "buh",  fact: "Balls bounce because they're full of air!", bg: ["#e0f7fa","#b3e5fc"], accent: "#0077b6", emoji: "⚽", cat: "thing",  sound: "boing"   },
  C: { word: "Cat",        phonetic: "kuh",  fact: "Cats have five toes on their front paws!",  bg: ["#fff3e0","#ffd8a8"], accent: "#f77f00", emoji: "🐱", cat: "animal", sound: "meow"    },
  D: { word: "Dog",        phonetic: "duh",  fact: "Dogs can understand up to 250 words!",      bg: ["#f5e6d3","#d4a373"], accent: "#8b5a2b", emoji: "🐶", cat: "animal", sound: "woof"    },
  E: { word: "Elephant",   phonetic: "eh",   fact: "Elephants are the largest land animals!",   bg: ["#e8eaf6","#b0bec5"], accent: "#546e7a", emoji: "🐘", cat: "animal", sound: "trumpet" },
  F: { word: "Fish",       phonetic: "fuh",  fact: "Fish have been on Earth for 450 million years!", bg: ["#e1f5fe","#81d4fa"], accent: "#0288d1", emoji: "🐟", cat: "animal", sound: "bubble"  },
  G: { word: "Guitar",     phonetic: "guh",  fact: "Guitars usually have six strings!",          bg: ["#fff8e1","#ffe082"], accent: "#c9721b", emoji: "🎸", cat: "music",  sound: "strum"   },
  H: { word: "House",      phonetic: "huh",  fact: "The oldest houses are over 10,000 years old!", bg: ["#e8f5e9","#c8e6c9"], accent: "#d62828", emoji: "🏠", cat: "thing",  sound: "knock"   },
  I: { word: "Igloo",      phonetic: "ih",   fact: "Igloos stay warm with just body heat!",      bg: ["#e1f5fe","#b3e5fc"], accent: "#4fc3f7", emoji: "🏔️", cat: "thing",  sound: "wind"    },
  J: { word: "Jellyfish",  phonetic: "juh",  fact: "Jellyfish have no brain or heart!",          bg: ["#f3e5f5","#ce93d8"], accent: "#ab47bc", emoji: "🪼", cat: "animal", sound: "wobble"  },
  K: { word: "Kite",       phonetic: "kuh",  fact: "Kites were invented over 2,800 years ago!", bg: ["#e3f2fd","#90caf9"], accent: "#ef476f", emoji: "🪁", cat: "thing",  sound: "whoosh"  },
  L: { word: "Lion",       phonetic: "luh",  fact: "A lion's roar can be heard 5 miles away!",  bg: ["#fff3e0","#ffcc80"], accent: "#d97706", emoji: "🦁", cat: "animal", sound: "roar"    },
  M: { word: "Moon",       phonetic: "muh",  fact: "The Moon is Earth's only natural satellite!", bg: ["#1a1a2e","#0f3460"], accent: "#fff8dc", emoji: "🌙", cat: "nature", sound: "chime"   },
  N: { word: "Nest",       phonetic: "nuh",  fact: "Birds build nests to keep their eggs safe!",  bg: ["#f1f8e9","#c5e1a5"], accent: "#795548", emoji: "🪹", cat: "nature", sound: "chirp"   },
  O: { word: "Orange",     phonetic: "oh",   fact: "Oranges are packed with vitamin C!",         bg: ["#fff3e0","#ffcc80"], accent: "#fb8c00", emoji: "🍊", cat: "food",   sound: "pop"     },
  P: { word: "Pizza",      phonetic: "puh",  fact: "Pizza was invented in Italy!",               bg: ["#fff8e1","#ffe082"], accent: "#c62828", emoji: "🍕", cat: "food",   sound: "sizzle"  },
  Q: { word: "Queen",      phonetic: "kwuh", fact: "Queens often wear jeweled crowns!",          bg: ["#f3e5f5","#ce93d8"], accent: "#ffd700", emoji: "👑", cat: "thing",  sound: "fanfare" },
  R: { word: "Rainbow",    phonetic: "ruh",  fact: "Rainbows have seven beautiful colors!",      bg: ["#e3f2fd","#bbdefb"], accent: "#ff5722", emoji: "🌈", cat: "nature", sound: "twinkle" },
  S: { word: "Star",       phonetic: "sss",  fact: "Stars are giant balls of glowing gas!",      bg: ["#1a1a3a","#2d2d5f"], accent: "#ffd60a", emoji: "⭐", cat: "nature", sound: "sparkle" },
  T: { word: "Tree",       phonetic: "tuh",  fact: "Trees give us the oxygen we breathe!",       bg: ["#e8f5e9","#a5d6a7"], accent: "#2e7d32", emoji: "🌳", cat: "nature", sound: "rustle"  },
  U: { word: "Umbrella",   phonetic: "uh",   fact: "Umbrellas keep us dry in the rain!",         bg: ["#eceff1","#b0bec5"], accent: "#5e35b1", emoji: "☂️", cat: "thing",  sound: "rain"    },
  V: { word: "Violin",     phonetic: "vuh",  fact: "Violins have four strings!",                 bg: ["#fff3e0","#ffcc80"], accent: "#8d4e2a", emoji: "🎻", cat: "music",  sound: "violin"  },
  W: { word: "Watermelon", phonetic: "wuh",  fact: "Watermelons are 92 percent water!",          bg: ["#e8f5e9","#a5d6a7"], accent: "#e63946", emoji: "🍉", cat: "food",   sound: "slurp"   },
  X: { word: "Xylophone",  phonetic: "zzz",  fact: "Each bar on a xylophone makes a note!",      bg: ["#fce4ec","#f8bbd0"], accent: "#7b1fa2", emoji: "🎶", cat: "music",  sound: "xylo"    },
  Y: { word: "Yo-yo",      phonetic: "yuh",  fact: "Yo-yos are over 2,500 years old!",           bg: ["#fffde7","#fff59d"], accent: "#d81b60", emoji: "🪀", cat: "thing",  sound: "zip"     },
  Z: { word: "Zebra",      phonetic: "zuh",  fact: "No two zebras have the exact same stripes!", bg: ["#fafafa","#e0e0e0"], accent: "#212121", emoji: "🦓", cat: "animal", sound: "neigh"   },
};

const ALPHABET = Object.keys(LETTER_DATA);

const CATEGORIES = [
  { id: "all",    label: "All",     emoji: "✨", color: "#8b5cf6" },
  { id: "animal", label: "Animals", emoji: "🐾", color: "#f59e0b" },
  { id: "food",   label: "Food",    emoji: "🍎", color: "#ef4444" },
  { id: "music",  label: "Music",   emoji: "🎵", color: "#ec4899" },
  { id: "nature", label: "Nature",  emoji: "🌿", color: "#10b981" },
  { id: "thing",  label: "Things",  emoji: "🎁", color: "#3b82f6" },
];

// ═══════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════
const ACHIEVEMENTS = [
  { id: "first",    title: "First Discovery",  desc: "Unlock your very first letter", icon: "🌱", check: (s) => s.size >= 1 },
  { id: "five",     title: "Getting Started",  desc: "Unlock 5 letters",              icon: "⭐", check: (s) => s.size >= 5 },
  { id: "ten",      title: "On a Roll",        desc: "Unlock 10 letters",             icon: "🔥", check: (s) => s.size >= 10 },
  { id: "half",     title: "Halfway Hero",     desc: "Unlock 13 letters",             icon: "🎯", check: (s) => s.size >= 13 },
  { id: "twenty",   title: "Almost There",     desc: "Unlock 20 letters",             icon: "🚀", check: (s) => s.size >= 20 },
  { id: "master",   title: "Alphabet Master",  desc: "Unlock all 26 letters",         icon: "🏆", check: (s) => s.size >= 26 },
  { id: "animals",  title: "Animal Friend",    desc: "Meet all the animals",          icon: "🐾", check: (s) => ["C","D","E","F","J","L","Z"].every(l => s.has(l)) },
  { id: "foodie",   title: "Little Foodie",    desc: "Taste every food",              icon: "🍴", check: (s) => ["A","O","P","W"].every(l => s.has(l)) },
  { id: "musician", title: "Music Maker",      desc: "Play every instrument",         icon: "🎵", check: (s) => ["G","V","X"].every(l => s.has(l)) },
  { id: "nature",   title: "Nature Explorer",  desc: "Discover all nature letters",   icon: "🌿", check: (s) => ["M","N","R","S","T"].every(l => s.has(l)) },
];

// ═══════════════════════════════════════════════════════════════════════
// 3D OBJECT BUILDERS — each returns a THREE.Group with enhanced detail
// ═══════════════════════════════════════════════════════════════════════
const mat = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.05, ...opts });
const glossy = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.18, metalness: 0.15, ...opts });
const matte = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
const metal = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.9, ...opts });

const addIdle = (g, type = "bob") => { g.userData.idle = type; return g; };
const castShadows = (g) => { g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };

// ─── A : APPLE ──────────────────────────────────────────────────────────
function buildApple() {
  const g = new THREE.Group();
  // Body with subtle vertex displacement for organic shape
  const bodyGeo = new THREE.SphereGeometry(1, 64, 64);
  const pos = bodyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const s = 1 + Math.sin(pos.getX(i) * 3) * 0.015 + Math.cos(pos.getZ(i) * 2) * 0.01;
    pos.setX(i, pos.getX(i) * s);
    pos.setZ(i, pos.getZ(i) * s);
    // Slight flattening top and bottom
    if (y > 0.7) pos.setY(i, y - (y - 0.7) * 0.5);
    if (y < -0.7) pos.setY(i, y - (y + 0.7) * -0.3);
  }
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, glossy(0xe63946));
  body.scale.set(1.08, 1.02, 1.08);

  // Deep red accents at poles
  const topDent = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), glossy(0xa11021));
  topDent.position.y = 0.92; topDent.scale.y = 0.25;
  const botDent = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), glossy(0x7a0e18));
  botDent.position.y = -0.95; botDent.scale.y = 0.2;

  // Specular highlight
  const hl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), mat(0xffeaea, { emissive: 0x442222, transparent: true, opacity: 0.85 }));
  hl.position.set(-0.5, 0.3, 0.75); hl.scale.set(1, 1.4, 0.15);

  // Stem with slight taper
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.55, 16), matte(0x5d3e2a));
  stem.position.y = 1.15; stem.rotation.z = 0.18;

  // Leaf — elongated ellipsoid with central vein
  const leafGeo = new THREE.SphereGeometry(0.28, 24, 16);
  const leaf = new THREE.Mesh(leafGeo, matte(0x4caf50));
  leaf.scale.set(1.4, 0.18, 0.55);
  leaf.position.set(0.3, 1.32, 0); leaf.rotation.set(0.2, 0, -0.55);
  // Lighter highlight on leaf
  const leafHl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), matte(0x81c784));
  leafHl.scale.set(1.3, 0.1, 0.4);
  leafHl.position.set(0.3, 1.35, 0.02); leafHl.rotation.set(0.2, 0, -0.55);
  // Central vein
  const vein = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.6, 6), matte(0x2e7d32));
  vein.position.set(0.3, 1.33, 0.005); vein.rotation.set(0, 0, Math.PI / 2 - 0.55);

  g.add(body, topDent, botDent, hl, stem, leaf, leafHl, vein);
  return castShadows(addIdle(g, "bob"));
}

// ─── B : BALL ───────────────────────────────────────────────────────────
function buildBall() {
  const g = new THREE.Group();
  const colors = [0xef476f, 0xffd166, 0x06d6a0, 0x118ab2, 0xf78c6b, 0x9b5de5];
  // Base white core with glossy finish
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), glossy(0xfafafa));
  g.add(core);
  // Vibrant spherical wedges
  colors.forEach((c, i) => {
    const seg = new THREE.Mesh(
      new THREE.SphereGeometry(1.008, 48, 48,
        (i * Math.PI * 2) / colors.length,
        (Math.PI * 2) / colors.length,
        0.12, Math.PI - 0.24),
      glossy(c)
    );
    g.add(seg);
  });
  // Stitching-style thin torus rings at poles
  const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 48), matte(0xffffff));
  ringTop.position.y = 0.92; ringTop.rotation.x = Math.PI / 2;
  const ringBot = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 48), matte(0xffffff));
  ringBot.position.y = -0.92; ringBot.rotation.x = Math.PI / 2;
  g.add(ringTop, ringBot);
  // Shine highlight
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), mat(0xffffff, { emissive: 0x666666, transparent: true, opacity: 0.6 }));
  shine.position.set(-0.45, 0.45, 0.7); shine.scale.set(1, 1.5, 0.1);
  g.add(shine);
  return castShadows(addIdle(g, "spin"));
}

// ─── C : CAT ────────────────────────────────────────────────────────────
function buildCat() {
  const g = new THREE.Group();
  const fur = 0xff9d4d, belly = 0xffcfa8, dark = 0xd97724;

  // Rounded body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), matte(fur));
  body.scale.set(1.2, 0.95, 1);
  body.position.set(0, -0.1, 0);

  // Belly fur patch
  const bellyM = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), matte(belly));
  bellyM.scale.set(1.1, 0.8, 0.7);
  bellyM.position.set(0, -0.3, 0.45);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 40), matte(fur));
  head.position.set(0.75, 0.5, 0); head.scale.set(1.05, 1, 1);

  // Face lighter patch
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), matte(belly));
  face.position.set(0.95, 0.42, 0); face.scale.set(0.9, 0.95, 0.5);

  // Ears with pink inner
  const earGeo = new THREE.ConeGeometry(0.2, 0.38, 6);
  const earL = new THREE.Mesh(earGeo, matte(fur));
  earL.position.set(0.55, 1.0, 0.25); earL.rotation.set(-0.2, 0, -0.18);
  const earR = earL.clone(); earR.position.z = -0.25; earR.rotation.x = 0.2;
  const earInL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 6), matte(0xffb3c1));
  earInL.position.set(0.55, 0.95, 0.25); earInL.rotation.copy(earL.rotation);
  const earInR = earInL.clone(); earInR.position.z = -0.25; earInR.rotation.x = 0.2;

  // Eyes — sclera + pupil + highlight
  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matte(0xf4e04d));
  eyeW.position.set(1.15, 0.58, 0.22);
  const eyeWR = eyeW.clone(); eyeWR.position.z = -0.22;
  const pup = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), matte(0x111111));
  pup.position.set(1.24, 0.58, 0.22); pup.scale.x = 0.35;
  const pupR = pup.clone(); pupR.position.z = -0.22;
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matte(0xffffff));
  sh.position.set(1.28, 0.62, 0.24);
  const shR = sh.clone(); shR.position.z = -0.2;

  // Nose (pink triangular)
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.08, 3), matte(0xff8fa3));
  nose.position.set(1.32, 0.4, 0); nose.rotation.z = -Math.PI / 2;

  // Mouth (tiny dark curve via cylinder)
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 12, Math.PI), matte(0x3a2a1f));
  mouth.position.set(1.3, 0.28, 0); mouth.rotation.set(Math.PI / 2, 0, 0);

  // Whiskers (thin cylinders)
  const whiskerMat = matte(0xfaf3e0);
  [[0.22, 0.05], [0.18, -0.02], [0.22, -0.1]].forEach(([l, y]) => {
    [0.12, -0.12].forEach(zsign => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, l, 4), whiskerMat);
      w.position.set(1.35 + Math.abs(zsign) * 0.5, 0.35 + y, zsign);
      w.rotation.set(0, 0, Math.PI / 2 - (zsign > 0 ? 0.15 : -0.15));
      g.add(w);
    });
  });

  // Tail — curved via multiple segments
  const tailPts = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    tailPts.push(new THREE.Vector3(
      -0.8 - t * 0.6,
      -0.2 + Math.sin(t * 2) * 0.8,
      Math.sin(t * 4) * 0.15
    ));
  }
  const tailCurve = new THREE.CatmullRomCurve3(tailPts);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 40, 0.09, 12, false), matte(fur));
  // Tail tip lighter
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), matte(belly));
  tailTip.position.copy(tailPts[tailPts.length - 1]);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.5, 16);
  [[0.35, -0.7, 0.3], [0.35, -0.7, -0.3], [-0.35, -0.7, 0.3], [-0.35, -0.7, -0.3]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(legGeo, matte(fur));
    l.position.set(x, y, z);
    g.add(l);
    // Paws
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), matte(fur));
    paw.position.set(x, y - 0.28, z); paw.scale.y = 0.6;
    // Paw pad
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), matte(0xff8fa3));
    pad.position.set(x, y - 0.39, z + 0.05); pad.scale.y = 0.4;
    g.add(paw, pad);
  });

  // Stripes on body (tabby effect via thin toruses)
  [0, 0.3, -0.3].forEach((xo) => {
    const st = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 6, 24, Math.PI), matte(dark));
    st.position.set(xo, 0, 0); st.rotation.set(0, Math.PI / 2, Math.PI / 2);
    g.add(st);
  });

  g.add(body, bellyM, head, face, earL, earR, earInL, earInR,
        eyeW, eyeWR, pup, pupR, sh, shR, nose, mouth, tail, tailTip);
  g.scale.setScalar(1);
  return castShadows(addIdle(g, "bob"));
}

// ─── D : DOG ────────────────────────────────────────────────────────────
function buildDog() {
  const g = new THREE.Group();
  const fur = 0xc89f6b, dark = 0x8b5a2b, light = 0xe6cfa0;

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), matte(fur));
  body.scale.set(1.3, 0.95, 1); body.position.y = -0.05;
  // Belly patch
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), matte(light));
  belly.scale.set(1.2, 0.75, 0.7); belly.position.set(0, -0.3, 0.4);

  // Head — longer snout area
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 40), matte(fur));
  head.position.set(0.78, 0.5, 0); head.scale.set(1, 1, 1);
  // Snout
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), matte(light));
  snout.position.set(1.2, 0.32, 0); snout.scale.set(1.2, 0.75, 0.9);
  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), glossy(0x1a1a1a));
  nose.position.set(1.42, 0.42, 0);
  // Nose highlight
  const noseHl = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), matte(0xffffff));
  noseHl.position.set(1.47, 0.47, 0.04);
  // Mouth line
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 6, 12, Math.PI), matte(0x3a2a1f));
  mouth.position.set(1.35, 0.22, 0); mouth.rotation.x = Math.PI / 2;
  // Tongue
  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), matte(0xff6b9a));
  tongue.position.set(1.32, 0.15, 0); tongue.scale.set(0.8, 0.3, 1);

  // Floppy ears
  const earGeo = new THREE.SphereGeometry(0.2, 20, 20);
  const earL = new THREE.Mesh(earGeo, matte(dark));
  earL.scale.set(0.4, 1.1, 0.9);
  earL.position.set(0.6, 0.6, 0.4); earL.rotation.z = -0.3;
  const earR = earL.clone(); earR.position.z = -0.4;

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const eyeL = new THREE.Mesh(eyeGeo, matte(0x2c1810));
  eyeL.position.set(1.08, 0.62, 0.22);
  const eyeR = eyeL.clone(); eyeR.position.z = -0.22;
  const shineL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), matte(0xffffff));
  shineL.position.set(1.13, 0.67, 0.24);
  const shineR = shineL.clone(); shineR.position.z = -0.2;

  // Collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 12, 32), glossy(0xe63946));
  collar.position.set(0.3, 0.25, 0); collar.rotation.set(0, 0, Math.PI / 2);
  // Collar tag
  const tag = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 20), metal(0xffd166));
  tag.position.set(0.3, -0.05, 0.45); tag.rotation.x = Math.PI / 2;

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.55, 16);
  [[0.4, -0.72, 0.3], [0.4, -0.72, -0.3], [-0.45, -0.72, 0.3], [-0.45, -0.72, -0.3]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(legGeo, matte(fur));
    l.position.set(x, y, z);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matte(dark));
    paw.position.set(x, y - 0.3, z); paw.scale.y = 0.55;
    g.add(l, paw);
  });

  // Tail — wagging curve
  const tailPts = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    tailPts.push(new THREE.Vector3(-0.95 - t * 0.2, 0.2 + t * 0.6, Math.sin(t * 3) * 0.2));
  }
  const tail = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tailPts), 32, 0.09, 12, false),
    matte(fur)
  );
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), matte(light));
  tailTip.position.copy(tailPts[tailPts.length - 1]);

  // Spots
  [[0.1, 0.1, 0.7], [-0.3, 0.3, 0.65], [-0.5, -0.1, 0.5], [0.2, -0.3, 0.6]].forEach(([x,y,z]) => {
    const spot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), matte(dark));
    spot.position.set(x, y, z); spot.scale.z = 0.1;
    g.add(spot);
  });

  g.add(body, belly, head, snout, nose, noseHl, mouth, tongue,
        earL, earR, eyeL, eyeR, shineL, shineR, collar, tag, tail, tailTip);
  return castShadows(addIdle(g, "bob"));
}

// ─── E : ELEPHANT ───────────────────────────────────────────────────────
function buildElephant() {
  const g = new THREE.Group();
  const gray = 0x9ea7ad, darkgray = 0x6d7a82, belly = 0xc9d0d4;

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 40), matte(gray));
  body.scale.set(1.3, 1, 1.1); body.position.y = 0.1;

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 36, 36), matte(gray));
  head.position.set(1.3, 0.35, 0); head.scale.set(1, 1, 0.95);

  // Trunk — curved tube with rings
  const trunkPts = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    trunkPts.push(new THREE.Vector3(
      1.9 + t * 0.3,
      0.2 - t * 1.3,
      Math.sin(t * 2) * 0.15
    ));
  }
  const trunkCurve = new THREE.CatmullRomCurve3(trunkPts);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 40, 0.22, 16, false), matte(gray));
  // Trunk rings
  for (let i = 1; i < 6; i++) {
    const pt = trunkCurve.getPoint(i / 6);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 16), matte(darkgray));
    ring.position.copy(pt); ring.rotation.x = Math.PI / 2;
    g.add(ring);
  }
  // Trunk tip
  const trunkTip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matte(darkgray));
  trunkTip.position.copy(trunkPts[trunkPts.length - 1]);

  // Tusks
  const tuskGeo = new THREE.ConeGeometry(0.06, 0.5, 12);
  const tuskL = new THREE.Mesh(tuskGeo, matte(0xfff8dc));
  tuskL.position.set(1.85, -0.15, 0.15); tuskL.rotation.set(0, 0, -Math.PI / 2 - 0.3);
  const tuskR = tuskL.clone(); tuskR.position.z = -0.15;

  // Ears — large flat disks
  const earGeo = new THREE.SphereGeometry(0.55, 24, 24);
  const earL = new THREE.Mesh(earGeo, matte(gray));
  earL.scale.set(0.15, 1.2, 1); earL.position.set(1.1, 0.5, 0.75); earL.rotation.y = -0.4;
  const earInL = new THREE.Mesh(earGeo, matte(0xeab8c8));
  earInL.scale.set(0.14, 1.0, 0.85); earInL.position.set(1.08, 0.5, 0.75); earInL.rotation.y = -0.4;
  const earR = earL.clone(); earR.position.z = -0.75; earR.rotation.y = 0.4;
  const earInR = earInL.clone(); earInR.position.z = -0.75; earInR.rotation.y = 0.4;

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const eyeL = new THREE.Mesh(eyeGeo, matte(0x1a1a1a));
  eyeL.position.set(1.7, 0.5, 0.32);
  const eyeR = eyeL.clone(); eyeR.position.z = -0.32;
  const shineL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matte(0xffffff));
  shineL.position.set(1.74, 0.54, 0.34);
  const shineR = shineL.clone(); shineR.position.z = -0.3;

  // Legs with toenails
  const legGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.7, 20);
  [[0.55, -0.8, 0.45], [0.55, -0.8, -0.45], [-0.55, -0.8, 0.45], [-0.55, -0.8, -0.45]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(legGeo, matte(gray));
    l.position.set(x, y, z);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.24, 0.15, 20), matte(darkgray));
    foot.position.set(x, y - 0.42, z);
    // Toenails
    for (let i = 0; i < 3; i++) {
      const nail = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), matte(0xfff8dc));
      const ang = -0.4 + i * 0.4;
      nail.position.set(x + Math.cos(ang) * 0.22 * (x > 0 ? 1 : -1), y - 0.48, z + Math.sin(ang) * 0.12);
      nail.scale.y = 0.4;
      g.add(nail);
    }
    g.add(l, foot);
  });

  // Tail
  const tailPts = [
    new THREE.Vector3(-1.15, 0.2, 0),
    new THREE.Vector3(-1.45, -0.1, 0),
    new THREE.Vector3(-1.55, -0.4, 0.05),
  ];
  const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tailPts), 16, 0.06, 10, false), matte(gray));
  const tailTuft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), matte(darkgray));
  tailTuft.position.copy(tailPts[2]);

  g.add(body, head, trunk, trunkTip, tuskL, tuskR, earL, earInL, earR, earInR,
        eyeL, eyeR, shineL, shineR, tail, tailTuft);
  g.scale.setScalar(0.85);
  return castShadows(addIdle(g, "sway"));
}

// ─── F : FISH ───────────────────────────────────────────────────────────
function buildFish() {
  const g = new THREE.Group();
  const c1 = 0xffa94d, c2 = 0xff7849, c3 = 0xffe8d4;

  // Body — flattened ellipsoid
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), glossy(c1));
  body.scale.set(1.4, 0.85, 0.6);

  // Belly gradient patch
  const bellyM = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), glossy(c3));
  bellyM.scale.set(1.35, 0.55, 0.5); bellyM.position.y = -0.25;

  // Stripes (vertical thin bands)
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.4 - i * 0.05, 0.05, 8, 32), glossy(c2));
    stripe.position.set(0.2 - i * 0.35, 0, 0);
    stripe.rotation.set(0, Math.PI / 2, Math.PI / 2);
    stripe.scale.set(1, 1.3, 0.8);
    g.add(stripe);
  }

  // Scales — tiny overlapping domes on upper body
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const scale = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), glossy(c2));
      const x = -0.6 + col * 0.22 + (row % 2) * 0.11;
      const y = 0.05 + row * 0.15;
      const z = Math.sqrt(Math.max(0, 0.33 - (x * x) / 2)) * 0.58;
      scale.position.set(x, y, z);
      scale.rotation.x = -0.4;
      g.add(scale);
    }
  }

  // Tail fin — triangular flat
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0);
  tailShape.lineTo(0.7, 0.55);
  tailShape.lineTo(0.65, -0.1);
  tailShape.lineTo(0.7, -0.55);
  tailShape.lineTo(0, 0);
  const tail = new THREE.Mesh(new THREE.ExtrudeGeometry(tailShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.01, bevelSegments: 3 }), glossy(c2));
  tail.position.set(-1.3, 0, -0.03);

  // Dorsal + ventral fin
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0); finShape.lineTo(0.3, 0.35); finShape.lineTo(0.45, 0.05); finShape.lineTo(0, 0);
  const dorsal = new THREE.Mesh(new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }), glossy(c2));
  dorsal.position.set(-0.1, 0.7, -0.025);
  const ventral = dorsal.clone(); ventral.scale.y = -0.6; ventral.position.y = -0.65;

  // Side fins
  const sideFin = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.32, 4), glossy(c2));
  sideFin.position.set(0.25, -0.15, 0.55); sideFin.rotation.set(Math.PI / 2, 0, -0.4);
  sideFin.scale.set(1, 1, 0.2);
  const sideFinR = sideFin.clone(); sideFinR.position.z = -0.55; sideFinR.rotation.x = -Math.PI / 2;

  // Eye — big cartoonish
  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), matte(0xffffff));
  eyeW.position.set(0.95, 0.15, 0.5);
  const eyeWR = eyeW.clone(); eyeWR.position.z = -0.5;
  const pup = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matte(0x1a1a1a));
  pup.position.set(1.05, 0.15, 0.57);
  const pupR = pup.clone(); pupR.position.z = -0.57;
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), matte(0xffffff));
  sh.position.set(1.1, 0.2, 0.62);
  const shR = sh.clone(); shR.position.z = -0.52;

  // Lips / mouth
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16), matte(0xd14848));
  mouth.position.set(1.35, -0.1, 0); mouth.rotation.y = Math.PI / 2;

  // Bubbles
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.05 + i * 0.02, 12, 12), mat(0xffffff, { transparent: true, opacity: 0.55 }));
    b.position.set(1.7 + i * 0.15, 0.4 + i * 0.25, 0); g.add(b);
  }

  g.add(body, bellyM, tail, dorsal, ventral, sideFin, sideFinR,
        eyeW, eyeWR, pup, pupR, sh, shR, mouth);
  g.scale.setScalar(0.95);
  return castShadows(addIdle(g, "swim"));
}

// ─── G : GUITAR ─────────────────────────────────────────────────────────
function buildGuitar() {
  const g = new THREE.Group();
  const wood = 0xc9721b, darkwood = 0x8b4a14, soundhole = 0x2a1810;

  // Body — figure-8 shape approximated by two overlapping spheres flattened
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.75, 40, 40), glossy(wood));
  upper.scale.set(1, 1.05, 0.18); upper.position.y = 0.3;
  const lower = new THREE.Mesh(new THREE.SphereGeometry(0.9, 40, 40), glossy(wood));
  lower.scale.set(1, 1.15, 0.18); lower.position.y = -0.5;
  // Darker edging rim
  const rimU = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.04, 8, 48), matte(darkwood));
  rimU.scale.set(1, 1.05, 0.3); rimU.position.y = 0.3;
  const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 48), matte(darkwood));
  rimL.scale.set(1, 1.15, 0.3); rimL.position.y = -0.5;

  // Sound hole with rosette
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 40), matte(soundhole));
  sh.rotation.x = Math.PI / 2; sh.position.set(0, -0.15, 0.18);
  const rosette = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.018, 8, 40), metal(0xd4af37));
  rosette.position.set(0, -0.15, 0.19);

  // Bridge (behind sound hole)
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.07, 0.06), matte(darkwood));
  bridge.position.set(0, -0.7, 0.18);
  // Bridge pins
  for (let i = 0; i < 6; i++) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 8), matte(0xfaf3e0));
    pin.position.set(-0.13 + i * 0.052, -0.68, 0.21);
    g.add(pin);
  }

  // Neck
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.4, 0.13), matte(darkwood));
  neck.position.y = 1.3;
  // Fretboard
  const fb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 0.02), matte(0x1a0f08));
  fb.position.set(0, 1.3, 0.075);
  // Frets
  for (let i = 0; i < 8; i++) {
    const fret = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 0.035), metal(0xcccccc));
    fret.position.set(0, 0.7 + i * 0.16, 0.085);
    g.add(fret);
  }
  // Fret dot markers
  [0.86, 1.18, 1.5, 1.82].forEach((y) => {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.005, 12), matte(0xf7e9c6));
    d.position.set(0, y, 0.088); d.rotation.x = Math.PI / 2;
    g.add(d);
  });

  // Headstock
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.1), matte(darkwood));
  head.position.y = 2.15;
  // Tuning pegs
  for (let i = 0; i < 3; i++) {
    const pegL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.15, 12), metal(0xe0e0e0));
    pegL.position.set(-0.18, 2.05 + i * 0.08, 0);
    pegL.rotation.z = Math.PI / 2;
    const pegR = pegL.clone(); pegR.position.x = 0.18;
    g.add(pegL, pegR);
  }

  // Strings
  for (let i = 0; i < 6; i++) {
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 2.9, 8), metal(0xf0f0f0));
    str.position.set(-0.075 + i * 0.03, 0.65, 0.12);
    g.add(str);
  }

  g.add(upper, lower, rimU, rimL, sh, rosette, bridge, neck, fb, head);
  g.rotation.z = -0.15;
  g.scale.setScalar(0.8);
  return castShadows(addIdle(g, "sway"));
}

// ─── H : HOUSE ──────────────────────────────────────────────────────────
function buildHouse() {
  const g = new THREE.Group();
  const wall = 0xfff8e1, roof = 0xd62828, door = 0x6d4c41, window = 0x81d4fa;

  // Walls
  const walls = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.4), matte(wall));
  // Wall trim
  const trim = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 1.45), matte(0xe8d5a8));
  trim.position.y = -0.55;

  // Roof — pyramid
  const roofG = new THREE.Mesh(new THREE.ConeGeometry(1.25, 0.9, 4), matte(roof));
  roofG.position.y = 1.05; roofG.rotation.y = Math.PI / 4;
  // Roof trim ring
  const roofRim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 4), matte(0x8b1a1a));
  roofRim.position.y = 0.63; roofRim.rotation.y = Math.PI / 4;
  roofRim.scale.set(1.02, 1.02, 1.02);

  // Door with frame
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.72, 0.04), matte(0x4a2f1a));
  doorFrame.position.set(0, -0.25, 0.71);
  const doorM = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.67, 0.06), matte(door));
  doorM.position.set(0, -0.25, 0.72);
  // Door knob
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), metal(0xd4af37));
  knob.position.set(0.13, -0.27, 0.76);
  // Doorstep
  const step = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.12), matte(0x7a6352));
  step.position.set(0, -0.6, 0.76);

  // Windows with cross mullions + shutters
  [[-0.5, 0.72], [0.5, 0.72]].forEach(([x, z]) => {
    const wf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.04), matte(0xffffff));
    wf.position.set(x, 0.15, z);
    const wg = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.05), glossy(window, { emissive: 0x1a5d7a, emissiveIntensity: 0.25 }));
    wg.position.set(x, 0.15, z + 0.01);
    // Cross mullions
    const mh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.06), matte(0xffffff));
    mh.position.set(x, 0.15, z + 0.03);
    const mv = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.34, 0.06), matte(0xffffff));
    mv.position.set(x, 0.15, z + 0.03);
    // Shutters
    const shL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.18), matte(0x2e7d32));
    shL.position.set(x - 0.21, 0.15, z);
    const shR = shL.clone(); shR.position.x = x + 0.21;
    // Flower box
    const fb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.12), matte(0x6d4c41));
    fb.position.set(x, -0.08, z + 0.05);
    g.add(wf, wg, mh, mv, shL, shR, fb);
    // Flowers
    [-0.12, 0, 0.12].forEach((dx, i) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), matte([0xe63946, 0xffd166, 0xef476f][i]));
      f.position.set(x + dx, -0.03, z + 0.1);
      g.add(f);
    });
  });

  // Chimney
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.22), matte(0x8b4513));
  chimney.position.set(0.45, 1.15, 0);
  // Chimney cap
  const chCap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.28), matte(0x5a2d0c));
  chCap.position.set(0.45, 1.42, 0);
  // Smoke puffs
  [[0.45, 1.6, 0, 0.1], [0.5, 1.78, 0.05, 0.13], [0.45, 2.0, 0, 0.15]].forEach(([x,y,z,r]) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat(0xe8e8e8, { transparent: true, opacity: 0.8 }));
    s.position.set(x, y, z); g.add(s);
  });

  // Path stones
  for (let i = 0; i < 3; i++) {
    const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 16), matte(0xb0a090));
    stone.position.set((i - 1) * 0.01, -0.62, 0.95 + i * 0.2);
    g.add(stone);
  }

  g.add(walls, trim, roofG, roofRim, doorFrame, doorM, knob, step, chimney, chCap);
  g.position.y = -0.1;
  g.scale.setScalar(0.9);
  return castShadows(addIdle(g, "bob"));
}

// ─── I : IGLOO ──────────────────────────────────────────────────────────
function buildIgloo() {
  const g = new THREE.Group();
  const ice = 0xe8f4ff, shadow = 0xb0d4e8, snow = 0xffffff;

  // Main dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 48, 36, 0, Math.PI * 2, 0, Math.PI / 2),
    glossy(ice)
  );
  dome.position.y = -0.1;
  // Dome base ring
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.12, 0.1, 40), matte(shadow));
  base.position.y = -0.15;

  // Ice block rings — visible brick courses
  for (let row = 0; row < 5; row++) {
    const y = -0.08 + row * 0.22;
    const rad = Math.sqrt(Math.max(0.05, 1.21 - y * y));
    const blockCount = Math.max(6, Math.floor(rad * 16));
    for (let b = 0; b < blockCount; b++) {
      const a = (b / blockCount) * Math.PI * 2 + row * 0.15;
      if (Math.abs(a - Math.PI * 1.5) < 0.5 && y < 0.25) continue; // skip entrance
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.22), matte(shadow));
      block.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad);
      block.lookAt(0, y, 0);
      g.add(block);
    }
  }

  // Entrance tunnel
  const tunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.4, 0.7, 24, 1, false, 0, Math.PI),
    glossy(ice)
  );
  tunnel.rotation.z = Math.PI / 2; tunnel.rotation.y = Math.PI / 2;
  tunnel.position.set(0, -0.05, 0.95);
  // Entrance arch darker
  const arch = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 8, 24, Math.PI), matte(shadow));
  arch.position.set(0, -0.05, 1.3);

  // Snow pile at side
  const snowPile1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 20), matte(snow));
  snowPile1.position.set(-0.95, -0.35, 0.5); snowPile1.scale.set(1.3, 0.5, 1.2);
  const snowPile2 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), matte(snow));
  snowPile2.position.set(1.05, -0.35, -0.3); snowPile2.scale.set(1.2, 0.5, 1.1);

  // Penguin friend
  const pengBody = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), matte(0x1a1a1a));
  pengBody.position.set(1.2, -0.1, 0.65); pengBody.scale.set(1, 1.3, 1);
  const pengBelly = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), matte(0xffffff));
  pengBelly.position.set(1.28, -0.1, 0.65); pengBelly.scale.set(0.7, 1.1, 0.8);
  const pengBeak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 8), matte(0xffa726));
  pengBeak.position.set(1.39, 0.07, 0.65); pengBeak.rotation.z = -Math.PI / 2;
  const pengEye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matte(0xffffff));
  pengEye.position.set(1.35, 0.12, 0.72);
  const pengPup = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), matte(0x000000));
  pengPup.position.set(1.37, 0.12, 0.735);

  // Snowflakes around
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const sf = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), mat(0xffffff, { emissive: 0xcccccc }));
    sf.position.set(Math.cos(a) * 1.7, 0.8 + Math.sin(i) * 0.3, Math.sin(a) * 1.7);
    g.add(sf);
  }

  g.add(dome, base, tunnel, arch, snowPile1, snowPile2, pengBody, pengBelly, pengBeak, pengEye, pengPup);
  return castShadows(addIdle(g, "bob"));
}

// ─── J : JELLYFISH ──────────────────────────────────────────────────────
function buildJellyfish() {
  const g = new THREE.Group();
  const body = 0xe1bee7, inner = 0xf3e5f5, glow = 0xce93d8;

  // Outer translucent bell
  const bell = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.9),
    new THREE.MeshStandardMaterial({ color: body, roughness: 0.3, metalness: 0, transparent: true, opacity: 0.65, emissive: glow, emissiveIntensity: 0.3 })
  );
  bell.scale.set(1.1, 0.85, 1.1);

  // Inner bright core
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: inner, roughness: 0.4, transparent: true, opacity: 0.5, emissive: 0xffd9ff, emissiveIntensity: 0.5 })
  );
  core.scale.set(1, 0.75, 1);

  // Bell edge frill — ring of small spheres
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const frill = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), matte(glow));
    frill.position.set(Math.cos(a) * 1.08, -0.1, Math.sin(a) * 1.08);
    g.add(frill);
  }

  // Inner spots (ring of 4 darker dots)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const spot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), matte(0xba68c8));
    spot.position.set(Math.cos(a) * 0.4, 0.2, Math.sin(a) * 0.4);
    g.add(spot);
  }

  // Eyes (cute)
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), matte(0x4a148c));
  eyeL.position.set(0.25, 0.05, 0.82);
  const eyeR = eyeL.clone(); eyeR.position.x = -0.25;
  const shL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), matte(0xffffff));
  shL.position.set(0.28, 0.1, 0.88);
  const shR = shL.clone(); shR.position.x = -0.22;
  // Smile
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 6, 16, Math.PI), matte(0x4a148c));
  smile.position.set(0, -0.08, 0.85); smile.rotation.x = Math.PI / 2;

  // Tentacles — many curved tubes
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const px = Math.cos(a) * 0.9, pz = Math.sin(a) * 0.9;
    const pts = [];
    for (let j = 0; j <= 14; j++) {
      const t = j / 14;
      pts.push(new THREE.Vector3(
        px * (1 + t * 0.2) + Math.sin(t * 6 + i) * 0.08,
        -t * 2.2 - 0.15,
        pz * (1 + t * 0.2) + Math.cos(t * 6 + i) * 0.08
      ));
    }
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.05, 8, false),
      new THREE.MeshStandardMaterial({ color: glow, roughness: 0.4, transparent: true, opacity: 0.75, emissive: 0xce93d8, emissiveIntensity: 0.35 })
    );
    g.add(tube);
  }

  // Short inner tentacles (fatter)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const pts = [];
    for (let j = 0; j <= 8; j++) {
      const t = j / 8;
      pts.push(new THREE.Vector3(
        Math.cos(a) * 0.3 * (1 + t * 0.3),
        -t * 0.9 - 0.1,
        Math.sin(a) * 0.3 * (1 + t * 0.3)
      ));
    }
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.09, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xe1bee7, roughness: 0.4, transparent: true, opacity: 0.8 })
    );
    g.add(tube);
  }

  g.add(bell, core, eyeL, eyeR, shL, shR, smile);
  g.position.y = 0.3;
  return castShadows(addIdle(g, "float"));
}

// ─── K : KITE ───────────────────────────────────────────────────────────
function buildKite() {
  const g = new THREE.Group();
  // Diamond shape as custom geometry with quad split
  const pts = [
    new THREE.Vector3(0, 1.2, 0),   // top
    new THREE.Vector3(0.9, 0, 0),   // right
    new THREE.Vector3(0, -1.2, 0),  // bottom
    new THREE.Vector3(-0.9, 0, 0),  // left
    new THREE.Vector3(0, 0, 0),     // center
  ];
  // Four colored triangular panels
  const colors = [0xef476f, 0xffd166, 0x06d6a0, 0x118ab2];
  const tris = [[0,1,4],[1,2,4],[2,3,4],[3,0,4]];
  tris.forEach((tri, i) => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      pts[tri[0]].x, pts[tri[0]].y, pts[tri[0]].z,
      pts[tri[1]].x, pts[tri[1]].y, pts[tri[1]].z,
      pts[tri[2]].x, pts[tri[2]].y, pts[tri[2]].z,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    const panel = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colors[i], side: THREE.DoubleSide, roughness: 0.4, metalness: 0.1 }));
    g.add(panel);
  });
  // Cross struts
  const sv = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.4, 8), matte(0x5d4037));
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8), matte(0x5d4037));
  sh.rotation.z = Math.PI / 2;
  // Frame edges
  const frame1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 6), matte(0x5d4037));
  frame1.rotation.z = -Math.PI / 2 - Math.atan(0.9 / 1.2); frame1.position.set(0.45, 0.6, 0);
  const frame2 = frame1.clone(); frame2.rotation.z = Math.PI / 2 + Math.atan(0.9 / 1.2); frame2.position.set(-0.45, 0.6, 0);
  const frame3 = frame1.clone(); frame3.rotation.z = Math.PI / 2 + Math.atan(0.9 / 1.2); frame3.position.set(0.45, -0.6, 0);
  const frame4 = frame1.clone(); frame4.rotation.z = -Math.PI / 2 - Math.atan(0.9 / 1.2); frame4.position.set(-0.45, -0.6, 0);

  // Tail with bows
  const tailPts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    tailPts.push(new THREE.Vector3(Math.sin(t * 8) * 0.18, -1.2 - t * 2, t * 0.1));
  }
  const tailC = new THREE.CatmullRomCurve3(tailPts);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailC, 50, 0.018, 6, false), matte(0xef476f));
  // Tail bows (ribbons)
  for (let i = 1; i < 5; i++) {
    const t = tailC.getPoint(i / 5);
    const bowColor = [0xef476f, 0xffd166, 0x06d6a0, 0x118ab2][i - 1];
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.03, 6, 12), matte(bowColor));
    bow.position.copy(t); bow.rotation.set(0, 0, t.x > 0 ? 0.5 : -0.5);
    bow.scale.y = 0.5;
    g.add(bow);
  }

  g.add(sv, sh, frame1, frame2, frame3, frame4, tail);
  g.rotation.set(0.15, -0.3, 0.1);
  return castShadows(addIdle(g, "sway"));
}

// ─── L : LION ───────────────────────────────────────────────────────────
function buildLion() {
  const g = new THREE.Group();
  const fur = 0xf4c57b, maneC = 0xd97706, dark = 0x8a4f0e;

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.82, 32, 32), matte(fur));
  body.scale.set(1.25, 0.95, 1); body.position.y = -0.1;
  // Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), matte(0xfadfa8));
  belly.scale.set(1.1, 0.75, 0.7); belly.position.set(0, -0.3, 0.4);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 40), matte(fur));
  head.position.set(0.9, 0.4, 0);

  // Mane — layered spiky coronet
  for (let layer = 0; layer < 3; layer++) {
    const count = 16 + layer * 2;
    const rad = 0.78 + layer * 0.05;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 6), matte(layer === 0 ? maneC : (layer === 1 ? 0xb8600a : dark)));
      spike.position.set(0.9 + Math.cos(a) * rad * 0.5, 0.4 + Math.sin(a) * rad, Math.cos(a) * 0.05 + Math.sin(a * 2) * 0.1);
      spike.lookAt(new THREE.Vector3(0.9, 0.4, 0));
      spike.rotateX(Math.PI / 2);
      spike.scale.y = 1 + Math.sin(i) * 0.2;
      g.add(spike);
    }
  }
  // Inner mane ring
  const innerMane = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.22, 16, 32), matte(maneC));
  innerMane.position.set(0.87, 0.4, 0); innerMane.rotation.y = Math.PI / 2;

  // Snout
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), matte(0xfadfa8));
  snout.position.set(1.3, 0.28, 0); snout.scale.set(1.1, 0.85, 0.95);
  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), glossy(0x2a1a14));
  nose.position.set(1.47, 0.42, 0); nose.scale.y = 0.8;
  // Mouth
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 6, 12, Math.PI), matte(0x3a2214));
  mouth.position.set(1.4, 0.22, 0); mouth.rotation.x = Math.PI / 2;

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const eyeL = new THREE.Mesh(eyeGeo, matte(0xfff8e1));
  eyeL.position.set(1.22, 0.55, 0.2);
  const eyeR = eyeL.clone(); eyeR.position.z = -0.2;
  const pupL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), matte(0x1a1a1a));
  pupL.position.set(1.29, 0.55, 0.22);
  const pupR = pupL.clone(); pupR.position.z = -0.22;
  const shL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matte(0xffffff));
  shL.position.set(1.32, 0.58, 0.24);
  const shR = shL.clone(); shR.position.z = -0.2;

  // Ears
  const earGeo = new THREE.SphereGeometry(0.13, 16, 16);
  const earL = new THREE.Mesh(earGeo, matte(dark));
  earL.scale.set(0.8, 1, 0.4); earL.position.set(0.85, 0.95, 0.35);
  const earR = earL.clone(); earR.position.z = -0.35;

  // Whiskers
  [-0.04, 0.03, 0.1].forEach((y) => {
    [0.1, -0.1].forEach((z) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.25, 4), matte(0xfff8dc));
      w.position.set(1.55, 0.3 + y, z);
      w.rotation.set(0, 0, Math.PI / 2 + (z > 0 ? 0.1 : -0.1));
      g.add(w);
    });
  });

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.55, 16);
  [[0.4, -0.72, 0.3], [0.4, -0.72, -0.3], [-0.4, -0.72, 0.3], [-0.4, -0.72, -0.3]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(legGeo, matte(fur));
    l.position.set(x, y, z);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), matte(fur));
    paw.position.set(x, y - 0.3, z); paw.scale.y = 0.55;
    // Toes
    for (let i = 0; i < 3; i++) {
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), matte(0x3a2214));
      toe.position.set(x + (i-1) * 0.05, y - 0.4, z + 0.15); toe.scale.y = 0.3;
      g.add(toe);
    }
    g.add(l, paw);
  });

  // Tail
  const tailPts = [
    new THREE.Vector3(-1.05, -0.1, 0),
    new THREE.Vector3(-1.35, 0.1, 0.05),
    new THREE.Vector3(-1.55, 0.4, 0.1),
    new THREE.Vector3(-1.55, 0.7, 0),
  ];
  const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tailPts), 20, 0.06, 10, false), matte(fur));
  // Tail tuft
  const tuft1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), matte(dark));
  tuft1.position.copy(tailPts[3]);
  const tuft2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), matte(maneC));
  tuft2.position.set(-1.5, 0.8, 0.05);

  g.add(body, belly, head, innerMane, snout, nose, mouth, eyeL, eyeR, pupL, pupR, shL, shR, earL, earR, tail, tuft1, tuft2);
  g.scale.setScalar(0.95);
  return castShadows(addIdle(g, "bob"));
}

// ─── M : MOON ───────────────────────────────────────────────────────────
function buildMoon() {
  const g = new THREE.Group();
  // Main moon body with vertex displacement for cratery feel
  const moonGeo = new THREE.SphereGeometry(1, 64, 64);
  const pos = moonGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const n = Math.sin(x * 4) * Math.cos(y * 3) * 0.02 + Math.sin(z * 5) * 0.015;
    const len = Math.sqrt(x*x + y*y + z*z);
    const s = (len + n) / len;
    pos.setX(i, x * s); pos.setY(i, y * s); pos.setZ(i, z * s);
  }
  moonGeo.computeVertexNormals();
  const moon = new THREE.Mesh(moonGeo, new THREE.MeshStandardMaterial({
    color: 0xfff8dc, roughness: 0.85, metalness: 0, emissive: 0xfff4c0, emissiveIntensity: 0.35
  }));

  // Craters — recessed dark patches
  const craterSpots = [
    [0.5, 0.3, 0.75, 0.15], [-0.4, 0.5, 0.7, 0.1], [0.1, -0.6, 0.75, 0.2],
    [-0.6, -0.1, 0.75, 0.12], [0.7, -0.2, 0.6, 0.08], [-0.2, 0.15, 0.95, 0.1],
    [0.35, 0.65, 0.6, 0.08], [-0.5, -0.5, 0.7, 0.1]
  ];
  craterSpots.forEach(([x, y, z, r]) => {
    const crater = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), matte(0xd4c99a));
    crater.position.set(x, y, z); crater.scale.z = 0.35;
    g.add(crater);
    const craterRim = new THREE.Mesh(new THREE.TorusGeometry(r * 1.05, r * 0.08, 8, 16), matte(0xfff8dc));
    craterRim.position.set(x, y, z * 1.02); craterRim.lookAt(0, 0, 0);
    g.add(craterRim);
  });

  // Cute sleepy face
  const eyeL = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 16, Math.PI), matte(0x3d2f1a));
  eyeL.position.set(0.28, 0.15, 0.96); eyeL.rotation.set(0, 0, Math.PI);
  const eyeR = eyeL.clone(); eyeR.position.x = -0.28;
  const mouthM = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 16, Math.PI), matte(0x3d2f1a));
  mouthM.position.set(0, -0.15, 0.96); mouthM.rotation.x = Math.PI;

  // Surrounding tiny stars
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const d = 1.8 + Math.random() * 0.3;
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshStandardMaterial({ color: 0xffe082, emissive: 0xffc107, emissiveIntensity: 1 }));
    star.position.set(Math.cos(a) * d, Math.sin(a) * d, 0.2);
    g.add(star);
  }

  // Glow ring
  const glow = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.03, 8, 48),
    new THREE.MeshStandardMaterial({ color: 0xfff8dc, emissive: 0xfff8dc, emissiveIntensity: 0.8, transparent: true, opacity: 0.4 }));

  g.add(moon, eyeL, eyeR, mouthM, glow);
  return castShadows(addIdle(g, "float"));
}

// ─── N : NEST ───────────────────────────────────────────────────────────
function buildNest() {
  const g = new THREE.Group();
  const twig1 = 0x8b5a3c, twig2 = 0x6d4327, twig3 = 0xa0724a;

  // Bowl form (torus base + flattened sphere bottom)
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matte(twig2));
  bowl.position.y = -0.2; bowl.scale.set(1.1, 0.8, 1.1);

  // Twig rings built from many rotated toruses
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const y = -0.2 + Math.sin(i * 0.4) * 0.2;
    const rad = 0.95 + Math.sin(i * 0.3) * 0.1;
    const twig = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.45, 6), matte([twig1, twig2, twig3][i % 3]));
    twig.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad);
    twig.rotation.set(Math.sin(i) * 0.3, -a + Math.PI / 2, Math.cos(i) * 0.3);
    g.add(twig);
  }
  // Upper rim twigs
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2;
    const rad = 1.0 + Math.sin(i) * 0.05;
    const twig = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.5, 6), matte([twig1, twig3][i % 2]));
    twig.position.set(Math.cos(a) * rad, 0.15, Math.sin(a) * rad);
    twig.rotation.set(Math.sin(i * 2) * 0.4, -a + Math.PI / 2 + 0.2, 0.3);
    g.add(twig);
  }

  // Soft inner lining (moss)
  const moss = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24, 0, Math.PI * 2, Math.PI / 2.3, Math.PI / 2.3), matte(0x6b8e23));
  moss.position.y = -0.15; moss.scale.set(1, 0.7, 1);

  // Eggs — speckled
  const eggPositions = [[0, -0.05, 0.2], [0.32, -0.1, -0.1], [-0.28, -0.05, -0.2]];
  const eggColors = [0xf5f0e0, 0xe8f0ff, 0xfff0f0];
  eggPositions.forEach((p, i) => {
    const egg = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), glossy(eggColors[i]));
    egg.position.set(...p); egg.scale.set(0.85, 1.15, 0.85);
    egg.rotation.z = (i - 1) * 0.3;
    g.add(egg);
    // Speckles
    for (let s = 0; s < 8; s++) {
      const spec = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), matte(0x8b5a3c));
      const sa = Math.random() * Math.PI * 2;
      const sb = Math.random() * Math.PI;
      spec.position.set(
        p[0] + Math.cos(sa) * Math.sin(sb) * 0.2,
        p[1] + Math.cos(sb) * 0.24,
        p[2] + Math.sin(sa) * Math.sin(sb) * 0.2
      );
      g.add(spec);
    }
  });

  // Single leaf
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), matte(0x66bb6a));
  leaf.scale.set(1.3, 0.15, 0.6); leaf.position.set(0.7, 0.25, 0.4); leaf.rotation.z = -0.4;

  g.add(bowl, moss, leaf);
  return castShadows(addIdle(g, "bob"));
}

// ─── O : ORANGE ─────────────────────────────────────────────────────────
function buildOrange() {
  const g = new THREE.Group();
  // Body with dimpled surface
  const geo = new THREE.SphereGeometry(1, 96, 96);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const d = Math.sin(x * 15) * Math.cos(y * 15) * Math.sin(z * 15) * 0.015;
    const len = Math.sqrt(x*x + y*y + z*z);
    const s = (len + d) / len;
    pos.setX(i, x * s); pos.setY(i, y * s); pos.setZ(i, z * s);
  }
  geo.computeVertexNormals();
  const body = new THREE.Mesh(geo, glossy(0xfb8c00));
  body.scale.set(1.02, 0.96, 1.02);

  // Darker top/bottom dimples
  const dimpleT = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), matte(0xc65100));
  dimpleT.position.y = 0.95; dimpleT.scale.y = 0.4;
  const dimpleB = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matte(0xa34100));
  dimpleB.position.y = -0.95; dimpleB.scale.y = 0.35;

  // Highlight
  const hl = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 20), mat(0xffe0b2, { emissive: 0x663311, transparent: true, opacity: 0.7 }));
  hl.position.set(-0.45, 0.35, 0.78); hl.scale.set(1.2, 1.4, 0.15);

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.12, 12), matte(0x6d4c41));
  stem.position.y = 1.02;

  // Leaf with vein
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), matte(0x388e3c));
  leaf.scale.set(1.3, 0.18, 0.6); leaf.position.set(0.3, 1.1, 0); leaf.rotation.set(0.15, 0, -0.5);
  const leafShine = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), matte(0x66bb6a));
  leafShine.scale.set(1.25, 0.1, 0.45); leafShine.position.set(0.32, 1.13, 0.02); leafShine.rotation.copy(leaf.rotation);
  const vein = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.65, 6), matte(0x1b5e20));
  vein.position.copy(leaf.position); vein.rotation.set(0, 0, Math.PI / 2 - 0.5);

  // Second small leaf
  const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 12), matte(0x2e7d32));
  leaf2.scale.set(1.2, 0.15, 0.55); leaf2.position.set(-0.15, 1.12, 0.05); leaf2.rotation.set(0.1, 0.5, 0.5);

  g.add(body, dimpleT, dimpleB, hl, stem, leaf, leafShine, vein, leaf2);
  return castShadows(addIdle(g, "bob"));
}

// ─── P : PIZZA ──────────────────────────────────────────────────────────
function buildPizza() {
  const g = new THREE.Group();
  const crust = 0xd4a87a, cheese = 0xffd166, sauce = 0xc62828;

  // Base crust (thick cylinder)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.05, 0.15, 48), matte(crust));
  // Crust edge (torus on top rim)
  const edge = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.12, 12, 48), matte(0xb8824d));
  edge.position.y = 0.08; edge.rotation.x = Math.PI / 2;
  // Sauce layer
  const sauceL = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.03, 48), matte(sauce));
  sauceL.position.y = 0.085;
  // Cheese layer (bubbly)
  const cheeseL = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.05, 48), glossy(cheese));
  cheeseL.position.y = 0.11;
  // Cheese bubbles
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.78;
    const bub = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 14, 14), glossy(0xfff8b0));
    bub.position.set(Math.cos(a) * r, 0.14, Math.sin(a) * r);
    bub.scale.y = 0.6;
    g.add(bub);
  }

  // Pepperoni — darker red cylinders
  const pepPositions = [[0.55, 0], [-0.4, 0.5], [0.1, -0.55], [-0.55, -0.25], [0.35, 0.4], [0, 0.15], [-0.2, -0.15]];
  pepPositions.forEach(([x, z]) => {
    const pep = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 24), matte(0xa01020));
    pep.position.set(x, 0.14, z);
    // Pepperoni highlight spots
    for (let i = 0; i < 3; i++) {
      const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.005, 10), matte(0x7a0812));
      const a = (i / 3) * Math.PI * 2;
      spot.position.set(x + Math.cos(a) * 0.07, 0.157, z + Math.sin(a) * 0.07);
      g.add(spot);
    }
    g.add(pep);
  });

  // Basil leaves
  [[0.25, -0.25], [-0.4, 0.1], [0.45, 0.55]].forEach(([x, z]) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), matte(0x2e7d32));
    leaf.position.set(x, 0.16, z); leaf.scale.set(1.2, 0.15, 0.5);
    leaf.rotation.y = Math.random() * Math.PI;
    g.add(leaf);
  });

  // Cheese drip on side
  const drip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), glossy(cheese));
  drip.position.set(0.9, 0, 0.4); drip.scale.set(0.5, 1.8, 0.5);

  g.add(base, edge, sauceL, cheeseL, drip);
  g.rotation.x = -0.15;
  return castShadows(addIdle(g, "spin"));
}

// ─── Q : QUEEN CROWN ────────────────────────────────────────────────────
function buildQueenCrown() {
  const g = new THREE.Group();
  const gold = 0xffd700, deepgold = 0xb8860b;

  // Base ring
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1, 0.35, 40), metal(gold));
  // Inner band (velvet)
  const velvet = new THREE.Mesh(new THREE.CylinderGeometry(0.87, 0.92, 0.28, 40), matte(0x8e1a3a));
  // Decorative bands
  const topBand = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.04, 8, 48), metal(deepgold));
  topBand.position.y = 0.17; topBand.rotation.x = Math.PI / 2;
  const botBand = new THREE.Mesh(new THREE.TorusGeometry(1, 0.04, 8, 48), metal(deepgold));
  botBand.position.y = -0.17; botBand.rotation.x = Math.PI / 2;

  // Points — 8 around the rim, with a taller one at the front
  const gemColors = [0xe63946, 0x06d6a0, 0x118ab2, 0x9b5de5, 0xef476f, 0xffd166, 0xf78c6b, 0x4dd0e1];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const isFront = i === 0;
    const height = isFront ? 0.7 : 0.5;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.13, height, 6), metal(gold));
    spike.position.set(Math.cos(a) * 0.98, 0.22 + height / 2, Math.sin(a) * 0.98);
    // Gem at tip
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), new THREE.MeshStandardMaterial({
      color: gemColors[i], metalness: 0.4, roughness: 0.1, emissive: gemColors[i], emissiveIntensity: 0.4
    }));
    gem.position.set(Math.cos(a) * 0.98, 0.22 + height + 0.08, Math.sin(a) * 0.98);
    g.add(spike, gem);
  }

  // Front center gem (big heart-ish)
  const bigGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshStandardMaterial({
    color: 0xe63946, metalness: 0.4, roughness: 0.1, emissive: 0xe63946, emissiveIntensity: 0.6
  }));
  bigGem.position.set(0.8, 0.05, 0); bigGem.rotation.z = Math.PI / 4;

  // Arches on top (cross-band)
  const archCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.92, 0.95),
    new THREE.Vector3(0, 1.35, 0.3),
    new THREE.Vector3(0, 1.45, 0),
    new THREE.Vector3(0, 1.35, -0.3),
    new THREE.Vector3(0, 0.92, -0.95),
  ]);
  const arch1 = new THREE.Mesh(new THREE.TubeGeometry(archCurve1, 30, 0.05, 10, false), metal(gold));
  const archCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.95, 0.92, 0),
    new THREE.Vector3(0.3, 1.35, 0),
    new THREE.Vector3(0, 1.45, 0),
    new THREE.Vector3(-0.3, 1.35, 0),
    new THREE.Vector3(-0.95, 0.92, 0),
  ]);
  const arch2 = new THREE.Mesh(new THREE.TubeGeometry(archCurve2, 30, 0.05, 10, false), metal(gold));

  // Orb on top
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), metal(gold));
  orb.position.y = 1.52;
  // Tiny cross on orb
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.03), metal(gold));
  crossV.position.y = 1.7;
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.03), metal(gold));
  crossH.position.y = 1.71;

  // Pearls on the rim
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.1;
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), glossy(0xfdf5e6));
    pearl.position.set(Math.cos(a) * 1.02, 0, Math.sin(a) * 1.02);
    g.add(pearl);
  }

  g.add(base, velvet, topBand, botBand, bigGem, arch1, arch2, orb, crossV, crossH);
  return castShadows(addIdle(g, "spin"));
}

// ─── R : RAINBOW ────────────────────────────────────────────────────────
function buildRainbow() {
  const g = new THREE.Group();
  const colors = [0xe63946, 0xff9800, 0xffd700, 0x4caf50, 0x2196f3, 0x3f51b5, 0x9c27b0];
  colors.forEach((c, i) => {
    const outer = 1.6 - i * 0.13;
    const tube = 0.06;
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(outer, tube, 16, 64, Math.PI),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0.1, emissive: c, emissiveIntensity: 0.25 })
    );
    arc.rotation.z = 0;
    arc.position.y = -0.1;
    g.add(arc);
  });

  // Clouds at base
  const cloudGroup = (x, scale) => {
    const cg = new THREE.Group();
    const pts = [[0,0,0,0.42], [0.35,0.15,0,0.3], [-0.4,0.1,0,0.32], [0.15,-0.1,0.2,0.3], [0.2,0.15,-0.15,0.28], [-0.15,-0.05,0.15,0.25]];
    pts.forEach(([cx,cy,cz,r]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), glossy(0xffffff));
      puff.position.set(cx, cy, cz);
      cg.add(puff);
    });
    cg.position.set(x, -0.4, 0); cg.scale.setScalar(scale);
    return cg;
  };
  g.add(cloudGroup(1.7, 1));
  g.add(cloudGroup(-1.7, 1));

  // Sparkles
  for (let i = 0; i < 10; i++) {
    const a = Math.random() * Math.PI;
    const r = 1.7 + Math.random() * 0.3;
    const sp = new THREE.Mesh(new THREE.OctahedronGeometry(0.05 + Math.random() * 0.04),
      new THREE.MeshStandardMaterial({ color: 0xfff8dc, emissive: 0xffeb3b, emissiveIntensity: 1 }));
    sp.position.set(Math.cos(a) * r, Math.sin(a) * r - 0.1, (Math.random() - 0.5) * 0.4);
    g.add(sp);
  }

  // Pot of gold
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.4, 24), metal(0x3e2723));
  pot.position.set(-1.7, -0.45, 0);
  const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 24), metal(0x1a0d08));
  potRim.position.set(-1.7, -0.25, 0); potRim.rotation.x = Math.PI / 2;
  // Gold coins
  for (let i = 0; i < 6; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 20), metal(0xffd700));
    coin.position.set(-1.7 + (Math.random() - 0.5) * 0.2, -0.22 + i * 0.025, (Math.random() - 0.5) * 0.25);
    coin.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    coin.rotation.z = Math.random() * Math.PI;
    g.add(coin);
  }

  g.position.y = 0.1;
  return castShadows(addIdle(g, "bob"));
}

// ─── S : STAR ───────────────────────────────────────────────────────────
function buildStar() {
  const g = new THREE.Group();
  // 5-pointed star shape
  const shape = new THREE.Shape();
  const outer = 1, inner = 0.4;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.25, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.08, bevelSegments: 4, curveSegments: 24 });
  const star = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: 0xffd60a, metalness: 0.3, roughness: 0.15,
    emissive: 0xffd60a, emissiveIntensity: 0.6
  }));
  star.position.z = -0.12;

  // Inner glow face plate (slightly smaller)
  const shape2 = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = (i % 2 === 0 ? outer : inner) * 0.8;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) shape2.moveTo(x, y); else shape2.lineTo(x, y);
  }
  shape2.closePath();
  const front = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape2, { depth: 0.05, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 24 }),
    new THREE.MeshStandardMaterial({ color: 0xfff8b0, emissive: 0xffeb3b, emissiveIntensity: 1, metalness: 0.3, roughness: 0.15 })
  );
  front.position.z = 0.15;

  // Face
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), matte(0x2a1810));
  eyeL.position.set(-0.2, 0.1, 0.25);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.2;
  const shL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matte(0xffffff));
  shL.position.set(-0.17, 0.13, 0.28);
  const shR = shL.clone(); shR.position.x = 0.23;
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 6, 16, Math.PI), matte(0x2a1810));
  mouth.position.set(0, -0.1, 0.25); mouth.rotation.x = Math.PI / 2;

  // Sparkle halo
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeb3b, emissiveIntensity: 1 }));
    sp.position.set(Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0.05);
    g.add(sp);
  }

  g.add(star, front, eyeL, eyeR, shL, shR, mouth);
  return castShadows(addIdle(g, "spin-z"));
}

// ─── T : TREE ───────────────────────────────────────────────────────────
function buildTree() {
  const g = new THREE.Group();
  // Textured trunk (bark effect via vertex displacement)
  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.4, 1.4, 32, 4);
  const tpos = trunkGeo.attributes.position;
  for (let i = 0; i < tpos.count; i++) {
    const y = tpos.getY(i);
    const n = Math.sin(tpos.getX(i) * 8 + y * 3) * 0.02;
    const len = Math.sqrt(tpos.getX(i) ** 2 + tpos.getZ(i) ** 2);
    if (len > 0.01) {
      tpos.setX(i, tpos.getX(i) * (1 + n / len));
      tpos.setZ(i, tpos.getZ(i) * (1 + n / len));
    }
  }
  trunkGeo.computeVertexNormals();
  const trunk = new THREE.Mesh(trunkGeo, matte(0x6b4226));
  trunk.position.y = -0.2;
  // Bark rings
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33 - i * 0.02, 0.015, 6, 16), matte(0x3d2a17));
    ring.position.y = -0.7 + i * 0.25; ring.rotation.x = Math.PI / 2;
    ring.scale.set(1, 1, 0.4);
    g.add(ring);
  }

  // Three layered leafy crowns (spheres grouped as blobby mass)
  const leafColors = [0x4caf50, 0x388e3c, 0x66bb6a, 0x81c784];
  const crownPoints = [
    [0, 0.8, 0, 0.65], [0.5, 1.1, 0, 0.5], [-0.5, 1, 0.2, 0.55], [0, 1.4, -0.1, 0.6],
    [0.3, 1.5, 0.3, 0.45], [-0.3, 1.4, -0.4, 0.5], [0, 1.7, 0.4, 0.45], [-0.4, 1.65, 0.15, 0.4],
    [0.45, 0.95, -0.4, 0.4], [0.15, 1.25, 0.55, 0.4]
  ];
  crownPoints.forEach(([x, y, z, r], i) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), matte(leafColors[i % 4]));
    leaf.position.set(x, y, z);
    g.add(leaf);
  });

  // Fruits/apples
  [[0.5, 1.15, 0.4], [-0.4, 0.9, 0.5], [0.2, 1.55, 0.4], [-0.3, 1.4, -0.55]].forEach(([x, y, z]) => {
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), glossy(0xe63946));
    fruit.position.set(x, y, z);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 6), matte(0x3d2a17));
    stem.position.set(x, y + 0.1, z);
    g.add(fruit, stem);
  });

  // Small flowers
  [[0.3, 0.85, 0.55], [-0.2, 1.55, 0.2]].forEach(([x, y, z]) => {
    for (let p = 0; p < 5; p++) {
      const pa = (p / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), matte(0xff80ab));
      petal.position.set(x + Math.cos(pa) * 0.04, y, z + Math.sin(pa) * 0.04);
      g.add(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), matte(0xfff176));
    center.position.set(x, y, z);
    g.add(center);
  });

  // Grass tufts at base
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 5), matte(0x66bb6a));
    tuft.position.set(Math.cos(a) * 0.45, -0.88, Math.sin(a) * 0.45);
    g.add(tuft);
  }

  g.add(trunk);
  g.scale.setScalar(0.92);
  return castShadows(addIdle(g, "sway"));
}

// ─── U : UMBRELLA ───────────────────────────────────────────────────────
function buildUmbrella() {
  const g = new THREE.Group();
  const panelColors = [0x5e35b1, 0xab47bc, 0x7b1fa2, 0xba68c8, 0x4527a0, 0x9575cd, 0x673ab7, 0x8e24aa];

  // 8 panels forming the canopy
  for (let i = 0; i < 8; i++) {
    const panel = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 8, (i * Math.PI * 2) / 8, Math.PI * 2 / 8, 0, Math.PI / 2),
      matte(panelColors[i])
    );
    panel.scale.y = 0.85;
    g.add(panel);
    // Panel seam line (bright rib)
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 6), metal(0xe0e0e0));
    const a = (i * Math.PI * 2) / 8;
    rib.position.set(Math.cos(a) * 0.5, 0.32, Math.sin(a) * 0.5);
    rib.rotation.set(0, -a, -Math.PI / 4);
    g.add(rib);
  }

  // Scalloped edge — ring of small bumps
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const bump = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), matte(panelColors[i % 8]));
    bump.position.set(Math.cos(a) * 1, -0.03, Math.sin(a) * 1);
    bump.scale.y = 0.6;
    g.add(bump);
  }

  // Tip on top
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 16), metal(0xbfa94c));
  tip.position.y = 0.93;

  // Center pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16), metal(0x8d6e63));
  pole.position.y = -0.3;

  // Handle (curved J)
  const handlePts = [
    new THREE.Vector3(0, -1.4, 0),
    new THREE.Vector3(0, -1.65, 0),
    new THREE.Vector3(0.2, -1.78, 0),
    new THREE.Vector3(0.35, -1.65, 0),
    new THREE.Vector3(0.3, -1.4, 0),
  ];
  const handle = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(handlePts), 30, 0.05, 12, false),
    matte(0x6d4c41)
  );
  // Handle tip cap
  const handleTip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), matte(0x5d4037));
  handleTip.position.set(0.3, -1.4, 0);

  // Raindrops falling
  for (let i = 0; i < 8; i++) {
    const x = (Math.random() - 0.5) * 3;
    const z = (Math.random() - 0.5) * 3;
    const y = -0.3 - Math.random() * 1.5;
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.85, emissive: 0x4fc3f7, emissiveIntensity: 0.4 }));
    drop.position.set(x, y, z);
    drop.scale.y = 1.8;
    g.add(drop);
  }

  g.add(tip, pole, handle, handleTip);
  g.scale.setScalar(0.9);
  return castShadows(addIdle(g, "sway"));
}

// ─── V : VIOLIN ─────────────────────────────────────────────────────────
function buildViolin() {
  const g = new THREE.Group();
  const wood = 0x8d4e2a, darkwood = 0x5a2e14;

  // Body — hourglass via two ellipsoids + middle
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), glossy(wood));
  upper.scale.set(1, 0.95, 0.2); upper.position.y = 0.6;
  const lower = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), glossy(wood));
  lower.scale.set(1, 1.1, 0.2); lower.position.y = -0.3;
  const mid = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), glossy(wood));
  mid.scale.set(1, 0.7, 0.2); mid.position.y = 0.15;
  // Body edges (darker outline)
  const rimU = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.025, 6, 48), matte(darkwood));
  rimU.scale.set(1, 0.95, 0.3); rimU.position.y = 0.6;
  const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.025, 6, 48), matte(darkwood));
  rimL.scale.set(1, 1.1, 0.3); rimL.position.y = -0.3;

  // F-holes
  [-1, 1].forEach((s) => {
    const fhole = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 6, 12), matte(0x1a0d08));
    fhole.position.set(s * 0.22, 0.05, 0.12); fhole.rotation.x = Math.PI / 2; fhole.scale.y = 3;
    g.add(fhole);
    const fhole2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), matte(0x1a0d08));
    fhole2.position.set(s * 0.22, 0.2, 0.12); fhole2.scale.y = 0.5;
    const fhole3 = fhole2.clone(); fhole3.position.y = -0.1;
    g.add(fhole2, fhole3);
  });

  // Bridge
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 0.1), matte(0xe8d5a8));
  bridge.position.set(0, -0.05, 0.2);
  // Tailpiece
  const tp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.06), matte(0x2a1810));
  tp.position.set(0, -0.65, 0.18);
  // Chin rest
  const chin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.1), matte(0x1a0d08));
  chin.position.set(-0.35, -0.55, 0.18); chin.rotation.z = 0.2;

  // Neck
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.85, 0.11), matte(darkwood));
  neck.position.y = 1.4;
  // Fingerboard
  const fb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.03), matte(0x1a0d08));
  fb.position.set(0, 1.35, 0.075);

  // Scroll (spiral top)
  const scrollBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.2, 16), matte(darkwood));
  scrollBase.position.y = 1.95;
  const scroll = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.05, 8, 20, Math.PI * 1.5), matte(darkwood));
  scroll.position.set(0, 2.05, 0); scroll.rotation.y = Math.PI / 2;
  const scrollEnd = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), matte(darkwood));
  scrollEnd.position.set(0, 2.05, -0.05);

  // Pegs (4)
  for (let i = 0; i < 4; i++) {
    const pegL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.12, 10), matte(0x1a0d08));
    pegL.position.set(-0.12, 1.68 + i * 0.08, 0);
    pegL.rotation.z = Math.PI / 2;
    if (i % 2 === 0) { pegL.position.x = -0.12; } else { pegL.position.x = 0.12; }
    g.add(pegL);
  }

  // Strings (4)
  for (let i = 0; i < 4; i++) {
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 2.65, 6), metal(0xe8e8e8));
    str.position.set(-0.045 + i * 0.03, 0.7, 0.12);
    g.add(str);
  }

  // Bow (above)
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.2, 8), matte(0x3d2a17));
  bow.position.set(0.35, 0.4, 0.55); bow.rotation.z = -0.3;
  const bowHair = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.15, 6), matte(0xfaf3e0));
  bowHair.position.set(0.35, 0.36, 0.55); bowHair.rotation.z = -0.3;

  g.add(upper, lower, mid, rimU, rimL, bridge, tp, chin, neck, fb, scrollBase, scroll, scrollEnd, bow, bowHair);
  g.rotation.z = 0.1;
  g.scale.setScalar(0.85);
  return castShadows(addIdle(g, "sway"));
}

// ─── W : WATERMELON ─────────────────────────────────────────────────────
function buildWatermelon() {
  const g = new THREE.Group();
  // Triangular slice
  const shape = new THREE.Shape();
  shape.moveTo(-1, -0.5);
  shape.lineTo(1, -0.5);
  shape.absarc(0, -0.5, 1, 0, Math.PI, false);
  const sliceGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 48 });
  const slice = new THREE.Mesh(sliceGeo, matte(0xff5773));
  slice.position.z = -0.2;

  // White rind layer inside the dark rind
  const shapeWhite = new THREE.Shape();
  shapeWhite.moveTo(-0.96, -0.5);
  shapeWhite.lineTo(0.96, -0.5);
  shapeWhite.absarc(0, -0.5, 0.96, 0, Math.PI, false);
  const rindGeo = new THREE.ExtrudeGeometry(shapeWhite, { depth: 0.42, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 48 });
  const rind = new THREE.Mesh(rindGeo, matte(0xf0e6d2));
  rind.position.z = -0.21;

  // Green rind (outer curved back)
  const shapeGreen = new THREE.Shape();
  shapeGreen.moveTo(-1.12, -0.45);
  shapeGreen.lineTo(1.12, -0.45);
  shapeGreen.absarc(0, -0.45, 1.12, 0, Math.PI, false);
  const greenGeo = new THREE.ExtrudeGeometry(shapeGreen, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 48 });
  const green = new THREE.Mesh(greenGeo, matte(0x2e7d32));
  green.position.z = -0.15;
  const greenBack = green.clone(); greenBack.position.z = 0.25;

  // Stripes on rind
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.52), matte(0x1b5e20));
    const r = 1.1;
    stripe.position.set(Math.cos(a) * r, Math.sin(a) * r - 0.45, 0);
    stripe.rotation.z = a + Math.PI / 2;
    g.add(stripe);
  }

  // Pink flesh layer (slightly inset, redder)
  const shapePink = new THREE.Shape();
  shapePink.moveTo(-0.92, -0.5);
  shapePink.lineTo(0.92, -0.5);
  shapePink.absarc(0, -0.5, 0.92, 0, Math.PI, false);
  const flesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shapePink, { depth: 0.01, bevelEnabled: false, curveSegments: 48 }),
    glossy(0xff4060, { emissive: 0x661020, emissiveIntensity: 0.2 })
  );
  flesh.position.z = 0.21;

  // Seeds (front face)
  const seedPositions = [];
  for (let ring = 0; ring < 3; ring++) {
    const radius = 0.3 + ring * 0.22;
    const count = 5 + ring * 3;
    for (let i = 0; i < count; i++) {
      const a = Math.PI * (0.1 + (i / count) * 0.8) + ring * 0.1;
      seedPositions.push([Math.cos(a) * radius, Math.sin(a) * radius - 0.3]);
    }
  }
  seedPositions.forEach(([x, y]) => {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), glossy(0x1a1a1a));
    seed.position.set(x, y, 0.23); seed.scale.set(0.9, 1.5, 0.3);
    g.add(seed);
    // Seeds on back too
    const seedB = seed.clone(); seedB.position.z = -0.23;
    g.add(seedB);
  });

  // Cute face
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), matte(0x1a0d08));
  eyeL.position.set(-0.3, 0.2, 0.24);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.3;
  const shL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matte(0xffffff));
  shL.position.set(-0.27, 0.23, 0.25);
  const shR = shL.clone(); shR.position.x = 0.33;
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 6, 16, Math.PI), matte(0x5a1520));
  smile.position.set(0, 0.02, 0.24); smile.rotation.x = Math.PI;

  g.add(slice, rind, green, greenBack, flesh, eyeL, eyeR, shL, shR, smile);
  g.scale.setScalar(0.9);
  g.position.y = 0.2;
  return castShadows(addIdle(g, "bob"));
}

// ─── X : XYLOPHONE ──────────────────────────────────────────────────────
function buildXylophone() {
  const g = new THREE.Group();
  const barColors = [0xef476f, 0xff9e00, 0xffd166, 0x06d6a0, 0x118ab2, 0x5e60ce, 0x9b5de5, 0xf15bb5];
  // Bars
  barColors.forEach((c, i) => {
    const len = 1.6 - i * 0.08;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, len), glossy(c));
    bar.position.set(-0.9 + i * 0.25, 0.08, 0);
    g.add(bar);
    // Bar shine
    const shine = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.005, len * 0.95),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, emissive: 0xffffff, emissiveIntensity: 0.3 }));
    shine.position.set(-0.9 + i * 0.25, 0.115, 0);
    g.add(shine);
    // Mounting holes + screws
    [-0.3, 0.3].forEach((z) => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 12), metal(0xbfbfbf));
      screw.position.set(-0.9 + i * 0.25, 0.115, z * (len / 1.6));
      g.add(screw);
    });
  });

  // Base frame (two side rails)
  const railL = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 0.15), matte(0x8d4e2a));
  railL.position.set(0.1, -0.05, -0.7);
  const railR = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 0.15), matte(0x8d4e2a));
  railR.position.set(0.1, -0.05, 0.7);
  // Rail ends with rounded caps
  [[-1.05, -0.7], [1.25, -0.7], [-1.05, 0.7], [1.25, 0.7]].forEach(([x, z]) => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), matte(0x5a2e14));
    cap.position.set(x, -0.05, z);
    g.add(cap);
  });
  // Front darker strip
  const front = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.05), matte(0x5a2e14));
  front.position.set(0.1, 0.05, 0.7);

  // Support ribbons connecting bars
  [-0.3, 0.3].forEach((z) => {
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.02, 0.04), matte(0x3d2a17));
    ribbon.position.set(0.1, 0.06, z);
    g.add(ribbon);
  });

  // Mallets (two)
  [[-1.2, 0.35, 0.9], [1.5, 0.3, -0.9]].forEach(([x, y, z], i) => {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 12), matte(0xb08a63));
    stick.position.set(x, y, z); stick.rotation.z = i === 0 ? 0.4 : -0.4;
    const mhead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), matte(i === 0 ? 0xef476f : 0x06d6a0));
    mhead.position.set(x - (i === 0 ? 0.5 : -0.5), y + (i === 0 ? 0.1 : 0.1), z);
    g.add(stick, mhead);
  });

  // Feet
  [[-1, -0.2, -0.7], [1.2, -0.2, -0.7], [-1, -0.2, 0.7], [1.2, -0.2, 0.7]].forEach(([x,y,z]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 12), matte(0x5a2e14));
    foot.position.set(x, y, z);
    g.add(foot);
  });

  // Music notes floating
  for (let i = 0; i < 4; i++) {
    const note = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x9c27b0, emissive: 0x9c27b0, emissiveIntensity: 0.6 }));
    note.position.set(-0.6 + i * 0.4, 0.6 + Math.sin(i) * 0.2, 0);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x9c27b0, emissive: 0x9c27b0, emissiveIntensity: 0.6 }));
    stem.position.set(-0.6 + i * 0.4 + 0.07, 0.7 + Math.sin(i) * 0.2, 0);
    g.add(note, stem);
  }

  g.scale.setScalar(0.85);
  return castShadows(addIdle(g, "bob"));
}

// ─── Y : YO-YO ──────────────────────────────────────────────────────────
function buildYoyo() {
  const g = new THREE.Group();
  const c1 = 0xd81b60, c2 = 0xf06292, c3 = 0xffd166;

  // Two halves (flattened cylinders) with groove between
  const half1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.85, 0.18, 64, 1), glossy(c1));
  half1.position.z = -0.14; half1.rotation.x = Math.PI / 2;
  const half2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.85, 0.18, 64, 1), glossy(c1));
  half2.position.z = 0.14; half2.rotation.x = Math.PI / 2;

  // Rim accents (darker)
  const rim1 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.05, 16, 48), metal(0x9a0d3b));
  rim1.position.z = -0.22;
  const rim2 = rim1.clone(); rim2.position.z = 0.22;

  // Spiral swirls on each face
  for (let face = 0; face < 2; face++) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const swirlPts = [];
      for (let j = 0; j <= 16; j++) {
        const t = j / 16;
        const ang = a + t * Math.PI * 1.2;
        const r = t * 0.7;
        swirlPts.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, (face ? 0.23 : -0.23)));
      }
      const swirl = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(swirlPts), 30, 0.025, 6, false),
        glossy(c2)
      );
      g.add(swirl);
    }
  }

  // Center gem on each face
  const gem1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0),
    new THREE.MeshStandardMaterial({ color: c3, metalness: 0.4, roughness: 0.1, emissive: c3, emissiveIntensity: 0.6 }));
  gem1.position.z = -0.25;
  const gem2 = gem1.clone(); gem2.position.z = 0.25;

  // Axle + string start
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.25, 24), metal(0xcccccc));
  axle.rotation.x = Math.PI / 2;

  // String going up
  const stringPts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    stringPts.push(new THREE.Vector3(Math.sin(t * 4) * 0.05, t * 2, 0));
  }
  const str = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stringPts), 40, 0.012, 6, false),
    matte(0xffffff)
  );

  // Finger loop at top
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.015, 8, 24), matte(0xffffff));
  loop.position.set(0, 2, 0); loop.rotation.x = Math.PI / 2;

  g.add(half1, half2, rim1, rim2, gem1, gem2, axle, str, loop);
  g.position.y = -0.3;
  return castShadows(addIdle(g, "spin-z"));
}

// ─── Z : ZEBRA ──────────────────────────────────────────────────────────
function buildZebra() {
  const g = new THREE.Group();
  const white = 0xfafafa, black = 0x1a1a1a;

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.82, 36, 36), matte(white));
  body.scale.set(1.35, 0.9, 0.95); body.position.set(0.05, -0.05, 0);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), matte(white));
  head.position.set(1.2, 0.55, 0); head.scale.set(1, 1.1, 1);

  // Snout
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), matte(white));
  snout.position.set(1.55, 0.35, 0); snout.scale.set(1.1, 0.8, 0.85);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.7, 20), matte(white));
  neck.position.set(0.85, 0.3, 0); neck.rotation.z = -0.5;

  // Stripes on body (many thin vertical bands)
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const x = -0.9 + t * 2.1;
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.07, 6, 20, Math.PI * 1.3), matte(black));
    stripe.position.set(x, -0.05, 0);
    stripe.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    stripe.scale.set(1.35 + Math.sin(t * Math.PI) * 0.2, 0.92, 1);
    // skew
    stripe.rotation.y = (t - 0.5) * 0.2;
    g.add(stripe);
  }
  // Neck stripes
  for (let i = 0; i < 4; i++) {
    const t = i / 4;
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.28 - t * 0.02, 0.04, 6, 16, Math.PI), matte(black));
    stripe.position.set(0.6 + t * 0.4, 0.25 + t * 0.1, 0);
    stripe.rotation.set(0.4, Math.PI / 2, Math.PI / 2);
    g.add(stripe);
  }
  // Head stripes
  for (let i = 0; i < 4; i++) {
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 6, 16, Math.PI / 2), matte(black));
    stripe.position.set(1.1 + i * 0.1, 0.55, 0);
    stripe.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    stripe.scale.y = 0.7;
    g.add(stripe);
  }

  // Mane — row of black spikes
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 5), matte(black));
    spike.position.set(0.5 + t * 0.7, 0.75 + Math.sin(t * 3) * 0.05, 0);
    spike.rotation.z = -0.1;
    g.add(spike);
  }

  // Ears
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 8), matte(white));
  earL.position.set(1.0, 0.95, 0.18);
  const earR = earL.clone(); earR.position.z = -0.18;
  const earInL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), matte(0xeab8c8));
  earInL.position.set(1.0, 0.93, 0.18);
  const earInR = earInL.clone(); earInR.position.z = -0.18;

  // Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), matte(black));
  eyeL.position.set(1.4, 0.65, 0.28);
  const eyeR = eyeL.clone(); eyeR.position.z = -0.28;
  const shL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matte(0xffffff));
  shL.position.set(1.43, 0.68, 0.3);
  const shR = shL.clone(); shR.position.z = -0.26;

  // Nostrils + mouth
  const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), matte(0x3a2a1f));
  nostrilL.position.set(1.82, 0.3, 0.08);
  const nostrilR = nostrilL.clone(); nostrilR.position.z = -0.08;
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 12, Math.PI), matte(0x3a2a1f));
  mouth.position.set(1.78, 0.2, 0); mouth.rotation.x = Math.PI / 2;

  // Legs + stripes
  const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.7, 14);
  [[0.5, -0.75, 0.35], [0.5, -0.75, -0.35], [-0.55, -0.75, 0.35], [-0.55, -0.75, -0.35]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(legGeo, matte(white));
    l.position.set(x, y, z);
    g.add(l);
    // Leg stripes
    for (let j = 0; j < 3; j++) {
      const ls = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 12), matte(black));
      ls.position.set(x, y - 0.2 + j * 0.2, z); ls.rotation.x = Math.PI / 2;
      g.add(ls);
    }
    // Hoof
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.12, 12), matte(0x2a1810));
    hoof.position.set(x, y - 0.42, z);
    g.add(hoof);
  });

  // Tail
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 10), matte(white));
  tail.position.set(-1.2, 0.05, 0); tail.rotation.z = 1.2;
  // Tail tuft
  const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), matte(black));
  tuft.position.set(-1.45, -0.1, 0); tuft.scale.set(1, 1.5, 1);

  g.add(body, head, snout, neck, earL, earR, earInL, earInR, eyeL, eyeR, shL, shR, nostrilL, nostrilR, mouth, tail, tuft);
  g.scale.setScalar(0.82);
  return castShadows(addIdle(g, "bob"));
}

// ═══════════════════════════════════════════════════════════════════════
// BUILDER LOOKUP
// ═══════════════════════════════════════════════════════════════════════
const BUILDERS = {
  A: buildApple, B: buildBall, C: buildCat, D: buildDog, E: buildElephant,
  F: buildFish, G: buildGuitar, H: buildHouse, I: buildIgloo, J: buildJellyfish,
  K: buildKite, L: buildLion, M: buildMoon, N: buildNest, O: buildOrange,
  P: buildPizza, Q: buildQueenCrown, R: buildRainbow, S: buildStar, T: buildTree,
  U: buildUmbrella, V: buildViolin, W: buildWatermelon, X: buildXylophone,
  Y: buildYoyo, Z: buildZebra,
};

// ═══════════════════════════════════════════════════════════════════════
// EASING & UTILS
// ═══════════════════════════════════════════════════════════════════════
const elasticOut = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

// ═══════════════════════════════════════════════════════════════════════
// PROFESSIONAL LOGO COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function AlphabetLogo({ size = "md", animated = true }) {
  const scale = size === "sm" ? 0.6 : size === "lg" ? 1.3 : 1;
  const w = 320 * scale, h = 80 * scale;
  return (
    <svg viewBox="0 0 320 80" style={{ width: w, height: h, overflow: "visible" }}>
      <defs>
        <linearGradient id="logoRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef476f" />
          <stop offset="20%" stopColor="#ff9e00" />
          <stop offset="40%" stopColor="#ffd166" />
          <stop offset="60%" stopColor="#06d6a0" />
          <stop offset="80%" stopColor="#118ab2" />
          <stop offset="100%" stopColor="#9b5de5" />
        </linearGradient>
        <linearGradient id="blockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#f77f00" />
        </linearGradient>
        <linearGradient id="blockSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c86b00" />
          <stop offset="100%" stopColor="#f77f00" />
        </linearGradient>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.25"/>
        </filter>
      </defs>

      {/* 3D alphabet block with "A" */}
      <g filter="url(#logoShadow)" className={animated ? "aa-logo-block" : ""}>
        {/* Side face */}
        <path d="M 10 18 L 18 10 L 68 10 L 60 18 Z" fill="url(#blockGrad)" opacity="0.95" />
        {/* Right face */}
        <path d="M 60 18 L 68 10 L 68 60 L 60 68 Z" fill="url(#blockSide)" />
        {/* Front face */}
        <rect x="10" y="18" width="50" height="50" rx="6" fill="url(#blockGrad)" stroke="#b85b00" strokeWidth="1.2"/>
        {/* Letter A on block */}
        <text x="35" y="55" fontFamily="Fredoka, sans-serif" fontSize="38" fontWeight="700" fill="#fff" textAnchor="middle" stroke="#b85b00" strokeWidth="1.2">A</text>
        {/* Shine highlight */}
        <path d="M 14 22 L 56 22 L 54 26 L 16 26 Z" fill="#fff" opacity="0.35"/>
      </g>

      {/* Rainbow arc accent */}
      <g className={animated ? "aa-logo-arc" : ""}>
        <path d="M 80 40 Q 160 -10 240 40" stroke="url(#logoRainbow)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 85 40 Q 160 -3 235 40" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
      </g>

      {/* Title text */}
      <text x="82" y="52" fontFamily="Fredoka, sans-serif" fontSize="24" fontWeight="600" fill="#2d1b69" letterSpacing="-0.5">
        Alphabet
      </text>
      <text x="175" y="52" fontFamily="Fredoka, sans-serif" fontSize="24" fontWeight="600" fill="url(#logoRainbow)" letterSpacing="-0.5">
        Adventure
      </text>
      <text x="82" y="70" fontFamily="Nunito, sans-serif" fontSize="10" fontWeight="700" fill="#6d4c7d" letterSpacing="3">
        ✦ LEARN · PLAY · DISCOVER ✦
      </text>

      {/* Decorative stars */}
      <g className={animated ? "aa-logo-stars" : ""}>
        <path d="M 290 20 L 292 26 L 298 26 L 293 30 L 295 36 L 290 32 L 285 36 L 287 30 L 282 26 L 288 26 Z" fill="#ffd166" stroke="#f77f00" strokeWidth="0.8"/>
        <circle cx="78" cy="18" r="2" fill="#ef476f"/>
        <circle cx="312" cy="55" r="2.5" fill="#06d6a0"/>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND — floating bokeh particles + shifting gradient
// ═══════════════════════════════════════════════════════════════════════
function AnimatedBackground({ colors, isDark }) {
  // Stable set of particles
  const particles = useMemo(() => (
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 30 + Math.random() * 80,
      dur: 18 + Math.random() * 22,
      delay: Math.random() * -20,
      hue: Math.floor(Math.random() * 360),
    }))
  ), []);
  const [c1, c2] = colors;
  return (
    <div aria-hidden className="aa-bg" style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}>
      <div className="aa-bg-shift" style={{ opacity: isDark ? 0.3 : 0.6 }} />
      <div className="aa-bg-particles">
        {particles.map(p => (
          <div key={p.id} className="aa-bokeh" style={{
            left: `${p.left}%`, top: `${p.top}%`,
            width: p.size, height: p.size,
            background: `radial-gradient(circle, hsla(${p.hue}, 80%, 70%, 0.55) 0%, hsla(${p.hue}, 80%, 70%, 0) 70%)`,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CURSOR SPARKLE TRAIL
// ═══════════════════════════════════════════════════════════════════════
function CursorTrail() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dots = Array.from(el.children);
    const trail = dots.map(() => ({ x: 0, y: 0 }));
    let mx = -100, my = -100;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("pointermove", onMove);
    let raf = 0;
    const tick = () => {
      let px = mx, py = my;
      trail.forEach((t, i) => {
        t.x += (px - t.x) * 0.28;
        t.y += (py - t.y) * 0.28;
        px = t.x; py = t.y;
        const d = dots[i];
        d.style.transform = `translate(${t.x - 6}px, ${t.y - 6}px) scale(${1 - i * 0.085})`;
        d.style.opacity = String(1 - i * 0.11);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);
  return (
    <div ref={ref} className="aa-cursor-trail" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aa-cursor-dot" style={{
          background: `radial-gradient(circle, hsla(${(i * 45) % 360}, 90%, 70%, 0.9) 0%, hsla(${(i * 45) % 360}, 90%, 70%, 0) 70%)`,
        }}/>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CONFETTI BURST
// ═══════════════════════════════════════════════════════════════════════
function Confetti({ tick, variant = "normal" }) {
  const pieces = useMemo(() => {
    if (!tick) return [];
    const count = variant === "mega" ? 60 : 36;
    const palette = variant === "gold"
      ? ["#ffd700", "#ffb300", "#fff59d", "#ffecb3", "#ff8f00"]
      : ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5", "#f78c6b", "#ff9e00", "#f15bb5"];
    return Array.from({ length: count }, (_, i) => ({
      id: `${tick}-${i}`,
      color: palette[Math.floor(Math.random() * palette.length)],
      left: 50 + (Math.random() - 0.5) * 30,
      xTravel: (Math.random() - 0.5) * 700,
      yTravel: -200 - Math.random() * 400,
      size: 6 + Math.random() * 8,
      rot: Math.random() * 720 - 360,
      dur: 1.3 + Math.random() * 1.5,
      delay: Math.random() * 0.2,
      shape: ["square", "circle", "tri"][Math.floor(Math.random() * 3)],
    }));
  }, [tick, variant]);
  if (!pieces.length) return null;
  return (
    <div className="aa-confetti" aria-hidden>
      {pieces.map(p => (
        <span key={p.id} className={`aa-conf aa-conf-${p.shape}`} style={{
          left: `${p.left}%`,
          background: p.shape === "tri" ? "transparent" : p.color,
          borderBottomColor: p.shape === "tri" ? p.color : "transparent",
          width: p.size, height: p.size,
          animation: `aa-conf-fall ${p.dur}s cubic-bezier(.25,.46,.45,.94) ${p.delay}s forwards`,
          "--tx": `${p.xTravel}px`, "--ty": `${p.yTravel}px`, "--rot": `${p.rot}deg`,
        }}/>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function AlphabetAdventure() {
  // Core state
  const [currentLetter, setCurrentLetter] = useState(null);
  const [unlocked, setUnlocked] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [muted, setMuted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiTick, setConfettiTick] = useState(0);
  const [confettiVariant, setConfettiVariant] = useState("normal");
  const [pulseKey, setPulseKey] = useState(0);
  // Feature state
  const [activeCategory, setActiveCategory] = useState("all");
  const [quizMode, setQuizMode] = useState(false);
  const [quizChoices, setQuizChoices] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);  // "correct" | "wrong" | null
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());
  const [achievementToast, setAchievementToast] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Three.js refs
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const currentObjectRef = useRef(null);
  const animationRef = useRef(null);
  const dragRef = useRef({ isDown: false, lastX: 0, lastY: 0, rotY: 0, rotX: 0 });
  const entranceRef = useRef({ start: 0, duration: 900 });
  const audioCtxRef = useRef(null);
  const speechQueueRef = useRef([]);

  const data = currentLetter ? LETTER_DATA[currentLetter] : null;
  const bgColors = data ? data.bg : (isDark ? ["#1a1a2e", "#16213e"] : ["#f3e8ff", "#e0e7ff"]);

  // ── Audio helpers ───────────────────────────────────────────────────
  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try { audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)(); }
      catch { audioCtxRef.current = null; }
    }
    return audioCtxRef.current;
  }, []);

  const playPop = useCallback(() => {
    if (muted) return;
    const ctx = getAudio(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(400, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.3);
  }, [muted, getAudio]);

  const playSparkle = useCallback(() => {
    if (muted) return;
    const ctx = getAudio(); if (!ctx) return;
    [660, 880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.3);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.08); o.stop(ctx.currentTime + i * 0.08 + 0.35);
    });
  }, [muted, getAudio]);

  // Synthesized object sounds — characteristic audio per letter
  const playObjectSound = useCallback((soundId) => {
    if (muted) return;
    const ctx = getAudio(); if (!ctx) return;
    const now = ctx.currentTime;
    const tone = (freq, dur, type = "sine", gain = 0.2, slide = 0, delay = 0) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, now + delay);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), now + delay + dur);
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.exponentialRampToValueAtTime(gain, now + delay + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(now + delay); o.stop(now + delay + dur + 0.05);
    };
    switch (soundId) {
      case "meow":   tone(700, 0.25, "triangle", 0.2, 300); tone(900, 0.35, "triangle", 0.15, -500, 0.2); break;
      case "woof":   tone(180, 0.15, "sawtooth", 0.3, -40); tone(160, 0.2, "sawtooth", 0.25, -50, 0.2); break;
      case "roar":   tone(140, 0.5, "sawtooth", 0.3, -60); tone(90, 0.4, "sawtooth", 0.25, 20, 0.1); break;
      case "trumpet":tone(220, 0.15, "square", 0.2, 0); tone(330, 0.35, "square", 0.22, 200, 0.12); break;
      case "bubble": [0, 0.1, 0.2].forEach((d, i) => tone(400 + i * 150, 0.15, "sine", 0.2, 300, d)); break;
      case "strum":  [330, 415, 494, 587].forEach((f, i) => tone(f, 0.6, "triangle", 0.15, -20, i * 0.04)); break;
      case "knock":  tone(180, 0.08, "square", 0.35, -60); tone(180, 0.08, "square", 0.35, -60, 0.18); break;
      case "wind":   tone(200, 0.8, "sawtooth", 0.08, 100); tone(300, 0.6, "sine", 0.1, -100, 0.2); break;
      case "wobble": [0, 0.1, 0.2, 0.3].forEach((d, i) => tone(500 + Math.sin(i) * 200, 0.2, "sine", 0.15, 0, d)); break;
      case "whoosh": tone(500, 0.5, "sawtooth", 0.12, -450); break;
      case "chime":  [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.6, "sine", 0.18, 0, i * 0.1)); break;
      case "chirp":  [0, 0.1, 0.22].forEach((d, i) => { tone(1200, 0.08, "sine", 0.18, 600, d); tone(1800, 0.08, "sine", 0.15, -400, d + 0.04); }); break;
      case "pop":    tone(800, 0.1, "sine", 0.25, 400); break;
      case "sizzle": tone(3000, 0.6, "sawtooth", 0.05); tone(2000, 0.5, "sawtooth", 0.06, 0, 0.1); break;
      case "fanfare":[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, "square", 0.15, 0, i * 0.12)); break;
      case "twinkle":[784, 988, 1174, 1568].forEach((f, i) => tone(f, 0.4, "sine", 0.14, 0, i * 0.08)); break;
      case "sparkle":[1046, 1318, 1568, 2093].forEach((f, i) => tone(f, 0.3, "triangle", 0.13, 200, i * 0.06)); break;
      case "rustle": tone(400, 0.5, "sawtooth", 0.06); tone(500, 0.4, "sawtooth", 0.05, -200, 0.15); break;
      case "rain":   for (let i = 0; i < 8; i++) tone(300 + Math.random() * 600, 0.1, "sine", 0.08, -200, i * 0.08); break;
      case "violin": [440, 554].forEach((f, i) => tone(f, 0.8, "sawtooth", 0.12, 0, i * 0.05)); break;
      case "slurp":  tone(600, 0.3, "sawtooth", 0.15, -400); tone(300, 0.2, "sine", 0.2, 200, 0.25); break;
      case "xylo":   [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.25, "sine", 0.2, 0, i * 0.1)); break;
      case "zip":    tone(200, 0.4, "sawtooth", 0.15, 800); break;
      case "neigh":  tone(400, 0.2, "sawtooth", 0.2, 200); tone(300, 0.35, "sawtooth", 0.2, -150, 0.2); break;
      case "crunch": [0, 0.08, 0.18].forEach((d) => tone(150 + Math.random() * 200, 0.1, "square", 0.2, -80, d)); break;
      case "boing":  tone(200, 0.3, "sine", 0.22, 400); tone(600, 0.25, "sine", 0.15, -400, 0.15); break;
      default:       playPop();
    }
  }, [muted, getAudio, playPop]);

  // ── Speech ──────────────────────────────────────────────────────────
  const selectedVoiceRef = useRef(null);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      selectedVoiceRef.current =
        voices.find(v => /samantha/i.test(v.name)) ||
        voices.find(v => /google us english/i.test(v.name)) ||
        voices.find(v => v.lang === "en-US" && /female|zira|karen/i.test(v.name)) ||
        voices.find(v => v.lang === "en-US") || voices[0] || null;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }, []);

  const speak = useCallback((text, rate = 0.95, pitch = 1.1) => {
    if (muted || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoiceRef.current) u.voice = selectedVoiceRef.current;
    u.rate = rate; u.pitch = pitch; u.volume = 1;
    window.speechSynthesis.speak(u);
  }, [muted]);

  const speakLetterSequence = useCallback((letter) => {
    if (muted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const ld = LETTER_DATA[letter];
    const steps = [
      { text: letter, rate: 0.8, pitch: 1.2 },
      { text: ld.phonetic, rate: 0.7, pitch: 1.1 },
      { text: ld.word, rate: 0.9, pitch: 1.15 },
      { text: `${letter} is for ${ld.word}`, rate: 0.88, pitch: 1.1 },
    ];
    let acc = 0;
    steps.forEach((s, i) => {
      setTimeout(() => speak(s.text, s.rate, s.pitch), acc);
      acc += i === 0 ? 650 : i === 1 ? 650 : 900;
    });
    setTimeout(() => playObjectSound(ld.sound), acc + 200);
  }, [muted, speak, playObjectSound]);

  // ── Three.js scene setup ────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const scene = new THREE.Scene(); scene.background = null;
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 3.8);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.55);
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(4, 6, 4); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 20;
    key.shadow.camera.left = -5; key.shadow.camera.right = 5;
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -5;
    const fill = new THREE.DirectionalLight(0xffe0ad, 0.35);
    fill.position.set(-5, 3, -2);
    const rim = new THREE.DirectionalLight(0xc2a0ff, 0.4);
    rim.position.set(0, 3, -5);
    scene.add(amb, key, fill, rim);

    // Shadow-catcher ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.25 })
    );
    ground.rotation.x = -Math.PI / 2; ground.position.y = -2.2;
    ground.receiveShadow = true;
    scene.add(ground);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Render loop
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      const obj = currentObjectRef.current;
      if (obj) {
        const now = performance.now();
        const { start, duration } = entranceRef.current;
        const t = Math.min(1, (now - start) / duration);
        const e = elasticOut(t);
        const targetScale = obj.userData.targetScale || 1;
        obj.scale.setScalar(e * targetScale);
        obj.position.y = (1 - e) * 2.5 + (obj.userData.yOffset || 0);

        // Idle animations
        if (t >= 1) {
          const idle = obj.userData.idle;
          if (idle === "bob") {
            obj.position.y = (obj.userData.yOffset || 0) + Math.sin(elapsed * 2) * 0.08;
            obj.rotation.y = dragRef.current.rotY + Math.sin(elapsed * 0.5) * 0.1;
          } else if (idle === "spin") {
            obj.rotation.y = dragRef.current.rotY + elapsed * 0.5;
          } else if (idle === "spin-z") {
            obj.rotation.z = elapsed * 0.4;
            obj.rotation.y = dragRef.current.rotY;
          } else if (idle === "swim") {
            obj.position.y = (obj.userData.yOffset || 0) + Math.sin(elapsed * 1.5) * 0.15;
            obj.rotation.z = Math.sin(elapsed * 2) * 0.08;
            obj.rotation.y = dragRef.current.rotY + Math.sin(elapsed * 0.7) * 0.15;
          } else if (idle === "float") {
            obj.position.y = (obj.userData.yOffset || 0) + Math.sin(elapsed * 1.2) * 0.2;
            obj.rotation.y = dragRef.current.rotY + elapsed * 0.2;
            obj.rotation.z = Math.sin(elapsed * 0.8) * 0.08;
          } else if (idle === "sway") {
            obj.rotation.z = (obj.userData.baseRotZ || 0) + Math.sin(elapsed * 1.3) * 0.08;
            obj.rotation.y = dragRef.current.rotY + Math.sin(elapsed * 0.6) * 0.2;
            obj.position.y = (obj.userData.yOffset || 0) + Math.sin(elapsed * 1.5) * 0.05;
          }
          obj.rotation.x = dragRef.current.rotX;
        }
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // ── Swap 3D object when letter changes ──────────────────────────────
  useEffect(() => {
    if (!currentLetter || !sceneRef.current) return;
    const scene = sceneRef.current;
    if (currentObjectRef.current) scene.remove(currentObjectRef.current);
    const builder = BUILDERS[currentLetter];
    if (!builder) return;
    const obj = builder();
    obj.userData.baseRotZ = obj.rotation.z;
    obj.userData.targetScale = obj.scale.x || 1;
    obj.userData.yOffset = obj.position.y || 0;
    scene.add(obj);
    currentObjectRef.current = obj;
    dragRef.current.rotY = 0; dragRef.current.rotX = 0;
    entranceRef.current = { start: performance.now(), duration: 900 };
  }, [currentLetter]);

  // ── Drag rotation + wheel zoom ──────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const onDown = (e) => {
      dragRef.current.isDown = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      mount.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!dragRef.current.isDown) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.rotY += dx * 0.01;
      dragRef.current.rotX = Math.max(-0.8, Math.min(0.8, dragRef.current.rotX + dy * 0.008));
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };
    const onUp = () => { dragRef.current.isDown = false; mount.style.cursor = "grab"; };
    const onWheel = (e) => {
      if (!cameraRef.current) return;
      e.preventDefault();
      cameraRef.current.position.z = Math.max(2, Math.min(8, cameraRef.current.position.z + e.deltaY * 0.005));
    };
    mount.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    mount.style.cursor = "grab";
    return () => {
      mount.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      mount.removeEventListener("wheel", onWheel);
    };
  }, []);

  // ── Letter selection ────────────────────────────────────────────────
  const chooseLetter = useCallback((letter, opts = {}) => {
    if (!BUILDERS[letter]) return;
    setCurrentLetter(letter);
    setUnlocked(prev => {
      if (prev.has(letter)) return prev;
      const next = new Set(prev); next.add(letter);
      return next;
    });
    setShowHelp(false);
    setPulseKey(k => k + 1);
    if (!opts.silent) {
      playPop();
      setTimeout(() => speakLetterSequence(letter), 250);
    }
  }, [playPop, speakLetterSequence]);

  // ── Quiz mode logic ─────────────────────────────────────────────────
  const visibleLetters = useMemo(() => {
    if (activeCategory === "all") return ALPHABET;
    return ALPHABET.filter(l => LETTER_DATA[l].cat === activeCategory);
  }, [activeCategory]);

  const startQuizRound = useCallback(() => {
    const pool = visibleLetters.length >= 4 ? visibleLetters : ALPHABET;
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const others = ALPHABET.filter(l => l !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [...others, correct].sort(() => Math.random() - 0.5);
    setCurrentLetter(correct);
    setQuizChoices(choices);
    setQuizAnswer(null);
    entranceRef.current = { start: performance.now(), duration: 900 };
  }, [visibleLetters]);

  const enterQuizMode = useCallback(() => {
    setQuizMode(true); setShowHelp(false);
    setQuizScore(0); setQuizStreak(0);
    startQuizRound();
  }, [startQuizRound]);

  const exitQuizMode = useCallback(() => {
    setQuizMode(false); setQuizAnswer(null); setQuizChoices([]);
  }, []);

  const handleQuizGuess = useCallback((letter) => {
    if (quizAnswer) return;
    if (letter === currentLetter) {
      setQuizAnswer("correct");
      setQuizScore(s => s + 1);
      setQuizStreak(s => s + 1);
      playSparkle();
      setConfettiVariant("normal"); setConfettiTick(t => t + 1);
      setUnlocked(prev => { const n = new Set(prev); n.add(letter); return n; });
      setTimeout(() => startQuizRound(), 1400);
    } else {
      setQuizAnswer(letter);
      setQuizStreak(0);
      playPop();
    }
  }, [quizAnswer, currentLetter, playSparkle, playPop, startQuizRound]);

  // ── Surprise me: random unseen letter ──────────────────────────────
  const surpriseMe = useCallback(() => {
    const unseen = visibleLetters.filter(l => !unlocked.has(l));
    const pool = unseen.length ? unseen : visibleLetters;
    const letter = pool[Math.floor(Math.random() * pool.length)];
    chooseLetter(letter);
  }, [visibleLetters, unlocked, chooseLetter]);

  // ── Category selection — jumps to first letter of the group ──────
  const selectCategory = useCallback((catId) => {
    setActiveCategory(catId);
    if (catId === "all") return;
    const pool = ALPHABET.filter(l => LETTER_DATA[l].cat === catId);
    if (!pool.length) return;
    // Prefer current letter if it's already in the category
    if (currentLetter && LETTER_DATA[currentLetter].cat === catId) return;
    // Else prefer first unseen, falling back to first
    const target = pool.find(l => !unlocked.has(l)) || pool[0];
    chooseLetter(target);
  }, [currentLetter, unlocked, chooseLetter]);

  // ── Favorites ──────────────────────────────────────────────────────
  const toggleFavorite = useCallback((letter) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter); else next.add(letter);
      return next;
    });
    playPop();
  }, [playPop]);

  // ── Achievements ───────────────────────────────────────────────────
  useEffect(() => {
    ACHIEVEMENTS.forEach(a => {
      if (!earnedAchievements.has(a.id) && a.check(unlocked)) {
        setEarnedAchievements(prev => { const n = new Set(prev); n.add(a.id); return n; });
        setAchievementToast(a);
        setTimeout(() => setAchievementToast(null), 3800);
        setConfettiVariant("gold"); setConfettiTick(t => t + 1);
        playSparkle();
      }
    });
  }, [unlocked, earnedAchievements, playSparkle]);

  // ── Celebration when all letters unlocked (fires once per session) ───
  const celebratedRef = useRef(false);
  useEffect(() => {
    if (unlocked.size === 26 && !celebratedRef.current) {
      celebratedRef.current = true;
      setTimeout(() => {
        setShowCelebration(true);
        setConfettiVariant("mega"); setConfettiTick(t => t + 1);
        playSparkle();
      }, 500);
    }
  }, [unlocked, playSparkle]);

  // ── Keyboard ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k)) {
        if (quizMode) { handleQuizGuess(k); }
        else {
          // If user presses a letter outside current filter, reset to All so the strip reflects reality
          if (activeCategory !== "all" && LETTER_DATA[k].cat !== activeCategory) {
            setActiveCategory("all");
          }
          chooseLetter(k);
        }
      } else if (e.key === " ") {
        e.preventDefault(); surpriseMe();
      } else if (e.key === "Escape") {
        if (quizMode) exitQuizMode();
        if (showCelebration) setShowCelebration(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chooseLetter, quizMode, handleQuizGuess, surpriseMe, exitQuizMode, showCelebration, activeCategory]);

  // ── Prev / next ────────────────────────────────────────────────────
  const navigate = useCallback((dir) => {
    if (!currentLetter) { chooseLetter("A"); return; }
    const pool = visibleLetters.length ? visibleLetters : ALPHABET;
    const idx = pool.indexOf(currentLetter);
    const next = pool[(idx + dir + pool.length) % pool.length];
    chooseLetter(next);
  }, [currentLetter, visibleLetters, chooseLetter]);

  const replayAudio = useCallback(() => {
    if (!currentLetter) return;
    speakLetterSequence(currentLetter);
  }, [currentLetter, speakLetterSequence]);

  const progress = Math.round((unlocked.size / 26) * 100);

  // ── RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="aa-root" style={{
      minHeight: "100vh",
      color: isDark ? "#f5f3ff" : "#2d1b69",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Nunito, system-ui, sans-serif",
    }}>
      <AaStyles />
      <AnimatedBackground colors={bgColors} isDark={isDark} />
      <CursorTrail />

      {/* HEADER ================================================== */}
      <header style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        flexWrap: "wrap", gap: 12,
      }}>
        <div className="aa-logo-wrap" key={pulseKey}>
          <AlphabetLogo size="md" />
        </div>

        {/* Progress pill */}
        <div className="aa-progress-pill">
          <div className="aa-progress-track">
            <div className="aa-progress-fill" style={{ width: `${progress}%` }}/>
            <div className="aa-progress-shimmer"/>
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>
            <Trophy size={14} style={{ display: "inline", marginRight: 4, verticalAlign: "-2px" }}/>
            {unlocked.size} / 26
          </span>
        </div>
      </header>

      {/* CATEGORY FILTER ========================================= */}
      <div className="aa-category-row">
        {CATEGORIES.map(cat => {
          const count = cat.id === "all" ? 26 : ALPHABET.filter(l => LETTER_DATA[l].cat === cat.id).length;
          const isActive = activeCategory === cat.id;
          return (
            <button key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className="aa-cat-btn"
              style={{
                background: isActive ? cat.color : "rgba(255,255,255,0.75)",
                color: isActive ? "#fff" : "#4a3070",
                boxShadow: isActive ? `0 6px 20px ${cat.color}60` : "0 2px 8px rgba(0,0,0,0.08)",
                transform: isActive ? "scale(1.06)" : "scale(1)",
              }}>
              <span style={{ fontSize: 16 }}>{cat.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{cat.label}</span>
              <span className="aa-cat-count" style={{
                background: isActive ? "rgba(255,255,255,0.28)" : `${cat.color}22`,
                color: isActive ? "#fff" : cat.color,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN STAGE ============================================== */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 24px", flex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 340px)",
          gap: 24,
          alignItems: "start",
          maxWidth: 1400, margin: "0 auto",
        }} className="aa-stage-grid">
          {/* 3D canvas */}
          <div ref={mountRef} className="aa-canvas" aria-label="3D letter viewer" />

          {/* Info / quiz card */}
          <aside className="aa-info-card" style={{
            background: isDark ? "rgba(30,20,60,0.85)" : "rgba(255,255,255,0.92)",
            color: isDark ? "#f5f3ff" : "#2d1b69",
            borderColor: data ? data.accent : "#a78bfa",
          }}>
            {quizMode ? (
              <QuizCard
                currentLetter={currentLetter}
                quizChoices={quizChoices}
                quizAnswer={quizAnswer}
                quizScore={quizScore}
                quizStreak={quizStreak}
                onGuess={handleQuizGuess}
                onExit={exitQuizMode}
              />
            ) : data ? (
              <LetterInfoCard
                letter={currentLetter} data={data}
                isFavorite={favorites.has(currentLetter)}
                onToggleFav={() => toggleFavorite(currentLetter)}
                onReplay={replayAudio}
                onPlaySound={() => playObjectSound(data.sound)}
              />
            ) : (
              <OnboardCard onStart={() => chooseLetter("A")} />
            )}
          </aside>
        </div>

        {/* ALPHABET STRIP ========================================== */}
        <div className="aa-strip-wrap">
          <div className="aa-strip">
            {ALPHABET.map(l => {
              const inCat = activeCategory === "all" || LETTER_DATA[l].cat === activeCategory;
              const isActive = l === currentLetter;
              const isUnlocked = unlocked.has(l);
              const isFav = favorites.has(l);
              return (
                <button key={l}
                  onClick={() => inCat && chooseLetter(l)}
                  disabled={!inCat}
                  className={`aa-strip-btn ${isActive ? "is-active" : ""} ${isUnlocked ? "is-unlocked" : ""} ${!inCat ? "is-dim" : ""}`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${LETTER_DATA[l].accent}, ${LETTER_DATA[l].bg[1]})`
                      : isUnlocked ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                    color: isActive ? "#fff" : "#2d1b69",
                  }}>
                  {l}
                  {isUnlocked && !isActive && <span className="aa-strip-star">✨</span>}
                  {isFav && <span className="aa-strip-heart">♥</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTROLS ================================================= */}
      <div className="aa-controls">
        <ControlBtn onClick={() => navigate(-1)} title="Previous"><ChevronLeft size={22}/></ControlBtn>
        <ControlBtn onClick={() => navigate(1)} title="Next"><ChevronRight size={22}/></ControlBtn>
        <ControlBtn onClick={surpriseMe} title="Surprise me" accent="#ef476f"><Shuffle size={22}/></ControlBtn>
        <ControlBtn onClick={quizMode ? exitQuizMode : enterQuizMode}
          title={quizMode ? "Exit quiz" : "Quiz mode"}
          accent={quizMode ? "#ef476f" : "#06d6a0"}>
          {quizMode ? <X size={22}/> : <HelpCircle size={22}/>}
        </ControlBtn>
        <ControlBtn onClick={() => setShowAchievements(true)} title="Achievements" accent="#ffd700">
          <Award size={22}/>
          {earnedAchievements.size > 0 && (
            <span className="aa-badge-count">{earnedAchievements.size}</span>
          )}
        </ControlBtn>
        <ControlBtn onClick={() => setShowFavorites(true)} title="Favorites" accent="#ec4899">
          <Heart size={22}/>
          {favorites.size > 0 && (
            <span className="aa-badge-count">{favorites.size}</span>
          )}
        </ControlBtn>
        <ControlBtn onClick={() => setMuted(m => !m)} title={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
        </ControlBtn>
        <ControlBtn onClick={() => setIsDark(d => !d)} title="Theme">
          {isDark ? <Sun size={22}/> : <MoonIcon size={22}/>}
        </ControlBtn>
      </div>

      {/* Confetti + toasts + modals */}
      <Confetti tick={confettiTick} variant={confettiVariant} />

      {achievementToast && (
        <div className="aa-achievement-toast">
          <div style={{ fontSize: 44, marginRight: 14, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>{achievementToast.icon}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 2, opacity: 0.7, color: "#ffd700" }}>🏆 ACHIEVEMENT UNLOCKED</div>
            <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{achievementToast.title}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{achievementToast.desc}</div>
          </div>
        </div>
      )}

      {showAchievements && (
        <AchievementPanel
          achievements={ACHIEVEMENTS}
          earned={earnedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showFavorites && (
        <FavoritesPanel
          favorites={favorites}
          onPick={(l) => { chooseLetter(l); setShowFavorites(false); }}
          onToggleFav={toggleFavorite}
          onClose={() => setShowFavorites(false)}
        />
      )}

      {showCelebration && (
        <CelebrationModal onClose={() => setShowCelebration(false)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function ControlBtn({ onClick, children, title, accent }) {
  return (
    <button onClick={onClick} title={title} className="aa-ctl-btn" style={accent ? { borderColor: accent } : undefined}>
      <span className="aa-ctl-inner" style={accent ? { color: accent } : undefined}>{children}</span>
      <span className="aa-ctl-ring" style={accent ? { background: accent } : undefined}/>
    </button>
  );
}

function LetterInfoCard({ letter, data, isFavorite, onToggleFav, onReplay, onPlaySound }) {
  return (
    <div className="aa-info-inner">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 76, fontWeight: 700, lineHeight: 0.9, color: data.accent, textShadow: `0 4px 12px ${data.accent}40` }}>
            {letter}
            <span style={{ fontSize: 38, fontWeight: 500, marginLeft: 6, color: data.accent, opacity: 0.65 }}>
              {letter.toLowerCase()}
            </span>
          </div>
        </div>
        <button onClick={onToggleFav} className="aa-fav-btn" style={{ color: isFavorite ? "#ef476f" : "#cbd5e1" }} title={isFavorite ? "Unfavorite" : "Favorite"}>
          <Heart size={26} fill={isFavorite ? "#ef476f" : "none"} />
        </button>
      </div>
      <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 28, fontWeight: 600, color: data.accent, marginTop: -4 }}>
        {data.emoji}  {data.word}
      </div>
      <div className="aa-cat-chip" style={{ background: `${data.accent}22`, color: data.accent }}>
        {CATEGORIES.find(c => c.id === data.cat)?.emoji} {CATEGORIES.find(c => c.id === data.cat)?.label}
      </div>
      <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.45, opacity: 0.9 }}>
        {data.fact}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button onClick={onReplay} className="aa-action-btn" style={{ background: data.accent, color: "#fff" }}>
          <Volume2 size={16}/> Hear Again
        </button>
        <button onClick={onPlaySound} className="aa-action-btn" style={{ background: "#fff", color: data.accent, border: `2px solid ${data.accent}` }}>
          <Zap size={16}/> Play Sound
        </button>
      </div>
      <div className="aa-tip" style={{ marginTop: 12 }}>
        <Keyboard size={14}/> Tap any letter • Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

function OnboardCard({ onStart }) {
  return (
    <div className="aa-info-inner" style={{ textAlign: "center" }}>
      <div className="aa-owl">
        <div className="aa-owl-wing aa-owl-wing-l"/>
        <div className="aa-owl-wing aa-owl-wing-r"/>
        <div className="aa-owl-body">
          <div className="aa-owl-eye aa-owl-eye-l"><div className="aa-owl-pupil"/></div>
          <div className="aa-owl-eye aa-owl-eye-r"><div className="aa-owl-pupil"/></div>
          <div className="aa-owl-beak"/>
        </div>
        <div className="aa-owl-foot aa-owl-foot-l"/>
        <div className="aa-owl-foot aa-owl-foot-r"/>
      </div>
      <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 30, fontWeight: 700, margin: "10px 0 4px", background: "linear-gradient(90deg, #ef476f, #ffd166, #06d6a0, #118ab2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Hello, friend!
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.85, margin: "4px 0 12px" }}>
        Press any letter key <kbd className="aa-kbd">A</kbd>–<kbd className="aa-kbd">Z</kbd> on your keyboard, or tap a letter below, to discover its 3D friend!
      </p>
      <button onClick={onStart} className="aa-start-btn">
        <Sparkles size={18}/> Start with A
      </button>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", fontSize: 12, opacity: 0.7 }}>
        <span><kbd className="aa-kbd">Space</kbd> Random</span>
        <span><kbd className="aa-kbd">Esc</kbd> Back</span>
      </div>
    </div>
  );
}

function QuizCard({ currentLetter, quizChoices, quizAnswer, quizScore, quizStreak, onGuess, onExit }) {
  return (
    <div className="aa-info-inner">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="aa-quiz-tag">QUIZ</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#06d6a0" }}>
            <Trophy size={13} style={{ verticalAlign: "-1px" }}/> {quizScore}
          </span>
          {quizStreak > 1 && (
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ef476f" }}>
              <Flame size={13} style={{ verticalAlign: "-1px" }}/> {quizStreak}
            </span>
          )}
        </div>
        <button onClick={onExit} className="aa-fav-btn" title="Exit quiz"><X size={20}/></button>
      </div>
      <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 22, fontWeight: 700, margin: "8px 0 14px" }}>
        What letter does this start with?
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {quizChoices.map(l => {
          const isCorrect = quizAnswer === "correct" && l === currentLetter;
          const isWrong = quizAnswer === l && l !== currentLetter;
          const reveal = quizAnswer && l === currentLetter;
          return (
            <button key={l}
              onClick={() => onGuess(l)}
              disabled={quizAnswer === "correct"}
              className={`aa-quiz-btn ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""} ${reveal ? "is-correct" : ""}`}>
              {l}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 13, textAlign: "center", minHeight: 20, fontWeight: 700 }}>
        {quizAnswer === "correct" && <span style={{ color: "#06d6a0" }}>✨ Correct! Well done!</span>}
        {quizAnswer && quizAnswer !== "correct" && <span style={{ color: "#ef476f" }}>Try again! 💫</span>}
      </div>
    </div>
  );
}

function AchievementPanel({ achievements, earned, onClose }) {
  return (
    <div className="aa-modal-overlay" onClick={onClose}>
      <div className="aa-modal-card" onClick={e => e.stopPropagation()}>
        <button className="aa-modal-close" onClick={onClose}><X size={22}/></button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 44 }}>🏆</div>
          <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 28, fontWeight: 700, margin: "4px 0", background: "linear-gradient(90deg, #ffd700, #ff9e00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Achievements
          </h2>
          <p style={{ fontSize: 14, opacity: 0.7 }}>{earned.size} of {achievements.length} earned</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {achievements.map(a => {
            const got = earned.has(a.id);
            return (
              <div key={a.id} className={`aa-achievement ${got ? "is-earned" : ""}`}>
                <div className="aa-ach-icon" style={{ filter: got ? "none" : "grayscale(1) opacity(0.4)" }}>{a.icon}</div>
                <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 15, fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{a.desc}</div>
                {got && <div className="aa-ach-ribbon">EARNED</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FavoritesPanel({ favorites, onPick, onToggleFav, onClose }) {
  const favs = [...favorites].sort();
  return (
    <div className="aa-modal-overlay" onClick={onClose}>
      <div className="aa-modal-card" onClick={e => e.stopPropagation()}>
        <button className="aa-modal-close" onClick={onClose}><X size={22}/></button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 44 }}>♥</div>
          <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 28, fontWeight: 700, color: "#ef476f", margin: "4px 0" }}>
            Your Favorites
          </h2>
          <p style={{ fontSize: 14, opacity: 0.7 }}>{favs.length} favorite{favs.length === 1 ? "" : "s"}</p>
        </div>
        {favs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 20px", opacity: 0.7 }}>
            <div style={{ fontSize: 32 }}>💭</div>
            <p style={{ fontSize: 14 }}>Tap the heart on a letter to add it here!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
            {favs.map(l => {
              const d = LETTER_DATA[l];
              return (
                <div key={l} className="aa-fav-card" onClick={() => onPick(l)}>
                  <div style={{ fontSize: 34 }}>{d.emoji}</div>
                  <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 20, fontWeight: 700, color: d.accent }}>{l}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{d.word}</div>
                  <button className="aa-fav-remove" onClick={e => { e.stopPropagation(); onToggleFav(l); }}><X size={12}/></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CelebrationModal({ onClose }) {
  return (
    <div className="aa-modal-overlay" onClick={onClose}>
      <div className="aa-modal-card aa-celebrate" onClick={e => e.stopPropagation()}>
        <button className="aa-modal-close" onClick={onClose}><X size={22}/></button>
        <div style={{ fontSize: 72, textAlign: "center", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))" }}>🏆🎉🌟</div>
        <h2 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 40, fontWeight: 700, textAlign: "center", margin: "8px 0", background: "linear-gradient(90deg, #ef476f, #ffd166, #06d6a0, #118ab2, #9b5de5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          You did it!
        </h2>
        <p style={{ textAlign: "center", fontSize: 18, opacity: 0.85, lineHeight: 1.5 }}>
          You've unlocked all 26 letters of the alphabet!<br/>
          You are an <strong>Alphabet Adventurer</strong>! 🎊
        </p>
        <button onClick={onClose} className="aa-start-btn" style={{ display: "block", margin: "18px auto 0" }}>
          <PartyPopper size={18}/> Keep Exploring
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// STYLES (injected once)
// ═══════════════════════════════════════════════════════════════════════
function AaStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

      .aa-root { font-family: 'Nunito', system-ui, sans-serif; }
      .aa-root * { box-sizing: border-box; }

      /* ── Background ─────────────────────────────────────────── */
      .aa-bg {
        position: fixed; inset: 0; z-index: 0;
        transition: background 1.1s ease;
      }
      .aa-bg-shift {
        position: absolute; inset: 0;
        background:
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%);
        animation: aa-bg-shift 18s ease-in-out infinite;
      }
      @keyframes aa-bg-shift {
        0%,100% { transform: translate(0,0) scale(1); }
        33%     { transform: translate(30px,-20px) scale(1.05); }
        66%     { transform: translate(-20px,25px) scale(0.97); }
      }
      .aa-bg-particles { position: absolute; inset: 0; overflow: hidden; }
      .aa-bokeh {
        position: absolute; border-radius: 50%;
        animation: aa-bokeh-float linear infinite;
        will-change: transform, opacity;
        pointer-events: none;
      }
      @keyframes aa-bokeh-float {
        0%   { transform: translate3d(0,0,0) scale(0.8); opacity: 0; }
        10%  { opacity: 0.85; }
        90%  { opacity: 0.85; }
        100% { transform: translate3d(40px,-140px,0) scale(1.1); opacity: 0; }
      }

      /* ── Cursor trail ───────────────────────────────────────── */
      .aa-cursor-trail {
        position: fixed; inset: 0; pointer-events: none; z-index: 9999;
      }
      @media (hover: none) { .aa-cursor-trail { display: none; } }
      .aa-cursor-dot {
        position: absolute; top: 0; left: 0;
        width: 12px; height: 12px; border-radius: 50%;
        pointer-events: none; will-change: transform, opacity;
      }

      /* ── Logo ───────────────────────────────────────────────── */
      .aa-logo-wrap { animation: aa-pop 0.6s cubic-bezier(.34,1.56,.64,1); }
      @keyframes aa-pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .aa-logo-block { animation: aa-logo-wobble 4s ease-in-out infinite; transform-origin: 35px 40px; }
      @keyframes aa-logo-wobble {
        0%,100% { transform: rotate(-2deg); }
        50%     { transform: rotate(3deg); }
      }
      .aa-logo-arc path { stroke-dasharray: 250; stroke-dashoffset: 0; animation: aa-arc-shimmer 3.5s ease-in-out infinite; }
      @keyframes aa-arc-shimmer { 0%,100% { stroke-dashoffset: 0; } 50% { stroke-dashoffset: -12; } }
      .aa-logo-stars { animation: aa-twinkle 2s ease-in-out infinite; transform-origin: center; }
      @keyframes aa-twinkle { 0%,100% { opacity: 1; } 50% { opacity: 0.5; transform: scale(1.1); } }

      /* ── Progress ───────────────────────────────────────────── */
      .aa-progress-pill {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 16px;
        background: rgba(255,255,255,0.85);
        border: 2px solid rgba(255,255,255,0.9);
        border-radius: 999px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        backdrop-filter: blur(12px);
        color: #2d1b69;
      }
      .aa-progress-track {
        position: relative;
        width: 140px; height: 10px;
        background: rgba(45,27,105,0.1);
        border-radius: 999px; overflow: hidden;
      }
      .aa-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ef476f, #ffd166, #06d6a0, #118ab2, #9b5de5);
        background-size: 200% 100%;
        animation: aa-grad-slide 3s linear infinite;
        border-radius: 999px;
        transition: width 0.6s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes aa-grad-slide { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
      .aa-progress-shimmer {
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        animation: aa-shimmer 2s linear infinite;
      }
      @keyframes aa-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

      /* ── Category filter ────────────────────────────────────── */
      .aa-category-row {
        position: relative; z-index: 10;
        display: flex; gap: 8px; flex-wrap: wrap;
        padding: 4px 24px 16px;
        justify-content: center;
      }
      .aa-cat-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 8px 16px;
        border-radius: 999px; border: none; cursor: pointer;
        transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
        backdrop-filter: blur(8px);
      }
      .aa-cat-btn:hover { transform: translateY(-2px) scale(1.05) !important; }
      .aa-cat-count {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 22px; height: 20px; padding: 0 6px;
        border-radius: 999px;
        font-weight: 800; font-size: 11px;
        margin-left: 2px;
      }

      /* ── 3D canvas ──────────────────────────────────────────── */
      .aa-canvas {
        width: 100%;
        height: min(60vh, 520px);
        min-height: 360px;
        background: rgba(255,255,255,0.25);
        border-radius: 24px;
        border: 2px solid rgba(255,255,255,0.55);
        backdrop-filter: blur(12px);
        box-shadow: 0 20px 60px rgba(45,27,105,0.15), inset 0 1px 0 rgba(255,255,255,0.7);
        touch-action: none;
      }

      /* ── Info card ──────────────────────────────────────────── */
      .aa-info-card {
        border-radius: 24px;
        padding: 22px;
        box-shadow: 0 20px 60px rgba(45,27,105,0.2), 0 0 0 1px rgba(255,255,255,0.4) inset;
        backdrop-filter: blur(16px);
        border: 2px solid;
        transition: border-color 0.4s ease;
        animation: aa-card-in 0.5s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes aa-card-in { 0% { transform: translateY(10px) scale(0.97); opacity: 0; } 100% { transform: none; opacity: 1; } }

      .aa-info-inner { animation: aa-fade-in 0.4s ease; }
      @keyframes aa-fade-in { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: none; } }

      .aa-cat-chip {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px; font-weight: 700;
        margin: 8px 0 2px;
      }
      .aa-action-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 10px 16px;
        border-radius: 14px; border: none; cursor: pointer;
        font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }
      .aa-action-btn:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 10px 24px rgba(0,0,0,0.2); }
      .aa-action-btn:active { transform: scale(0.97); }

      .aa-fav-btn {
        background: none; border: none; cursor: pointer; padding: 6px;
        border-radius: 10px; transition: transform 0.2s ease;
      }
      .aa-fav-btn:hover { transform: scale(1.18); }
      .aa-fav-btn:active { transform: scale(0.95); }

      .aa-tip {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 11px; opacity: 0.6;
        border-top: 1px dashed currentColor;
        padding-top: 10px;
        width: 100%;
      }
      .aa-kbd {
        display: inline-block;
        padding: 2px 6px; min-width: 20px;
        background: rgba(45,27,105,0.1); border: 1px solid rgba(45,27,105,0.2);
        border-radius: 5px; font-family: 'Nunito', monospace;
        font-size: 11px; font-weight: 800;
      }

      /* ── Owl ────────────────────────────────────────────────── */
      .aa-owl {
        position: relative; width: 120px; height: 120px; margin: 0 auto;
        animation: aa-owl-bob 2.5s ease-in-out infinite;
      }
      @keyframes aa-owl-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      .aa-owl-body {
        position: absolute; left: 15px; top: 15px;
        width: 90px; height: 90px; border-radius: 50% 50% 45% 45%;
        background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
        box-shadow: inset 0 -6px 0 rgba(0,0,0,0.15), 0 6px 14px rgba(139,92,246,0.4);
      }
      .aa-owl-eye {
        position: absolute; top: 18px;
        width: 30px; height: 30px; border-radius: 50%;
        background: #fff;
        display: flex; align-items: center; justify-content: center;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .aa-owl-eye-l { left: 12px; }
      .aa-owl-eye-r { right: 12px; }
      .aa-owl-pupil {
        width: 14px; height: 14px; border-radius: 50%;
        background: #1a1a2e;
        animation: aa-owl-blink 4s infinite;
      }
      @keyframes aa-owl-blink {
        0%,94%,100% { transform: scaleY(1); }
        96% { transform: scaleY(0.1); }
      }
      .aa-owl-beak {
        position: absolute; left: 50%; top: 52px;
        transform: translateX(-50%);
        width: 0; height: 0;
        border-left: 8px solid transparent; border-right: 8px solid transparent;
        border-top: 12px solid #fbbf24;
      }
      .aa-owl-wing {
        position: absolute; top: 30px;
        width: 26px; height: 50px; border-radius: 50%;
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        animation: aa-owl-flap 1.8s ease-in-out infinite;
      }
      .aa-owl-wing-l { left: 3px; transform-origin: top right; }
      .aa-owl-wing-r { right: 3px; transform-origin: top left; animation-delay: 0.3s; }
      @keyframes aa-owl-flap {
        0%,100% { transform: rotate(0); }
        50%     { transform: rotate(-12deg); }
      }
      .aa-owl-foot {
        position: absolute; bottom: 4px;
        width: 14px; height: 8px; border-radius: 50%;
        background: #fbbf24;
      }
      .aa-owl-foot-l { left: 32px; }
      .aa-owl-foot-r { right: 32px; }

      .aa-start-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #a78bfa, #ec4899);
        color: #fff; border: none; border-radius: 14px;
        font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 17px;
        cursor: pointer;
        box-shadow: 0 10px 24px rgba(167,139,250,0.45);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .aa-start-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 16px 32px rgba(167,139,250,0.55); }
      .aa-start-btn:active { transform: scale(0.97); }

      /* ── Alphabet strip ─────────────────────────────────────── */
      .aa-strip-wrap {
        position: relative; z-index: 3;
        margin: 28px auto 100px; max-width: 1400px;
        padding: 0 24px;
      }
      .aa-strip {
        display: grid;
        grid-template-columns: repeat(26, minmax(0, 1fr));
        gap: 6px;
        padding: 14px;
        background: rgba(255,255,255,0.55);
        border-radius: 20px;
        border: 2px solid rgba(255,255,255,0.65);
        backdrop-filter: blur(14px);
        box-shadow: 0 16px 40px rgba(45,27,105,0.14);
      }
      .aa-strip-btn {
        position: relative;
        aspect-ratio: 1;
        font-family: 'Fredoka', sans-serif;
        font-weight: 700; font-size: clamp(13px, 2vw, 20px);
        border: none; border-radius: 12px; cursor: pointer;
        transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      }
      .aa-strip-btn:hover { transform: translateY(-6px) scale(1.12); box-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 1; }
      .aa-strip-btn.is-active {
        transform: translateY(-8px) scale(1.18);
        box-shadow: 0 14px 28px rgba(0,0,0,0.25);
        animation: aa-active-pulse 1.5s ease-in-out infinite;
      }
      .aa-strip-btn.is-unlocked { box-shadow: 0 5px 14px rgba(6,214,160,0.3); }
      .aa-strip-btn.is-dim {
        opacity: 0.2; filter: grayscale(0.9);
        cursor: not-allowed;
      }
      .aa-strip-btn.is-dim:hover { transform: none; box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
      @keyframes aa-active-pulse {
        0%,100% { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 0 0 0 rgba(255,255,255,0.7); }
        50%     { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 0 0 12px rgba(255,255,255,0); }
      }
      .aa-strip-star { position: absolute; top: -4px; right: -4px; font-size: 10px; animation: aa-twinkle 1.5s ease-in-out infinite; }
      .aa-strip-heart { position: absolute; bottom: -2px; left: -2px; font-size: 10px; color: #ef476f; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2)); }

      /* ── Controls bar ───────────────────────────────────────── */
      .aa-controls {
        position: fixed; bottom: 20px; left: 50%;
        transform: translateX(-50%);
        display: flex; gap: 8px;
        padding: 10px 14px;
        background: rgba(255,255,255,0.9);
        border-radius: 999px;
        border: 2px solid rgba(255,255,255,0.7);
        box-shadow: 0 16px 40px rgba(45,27,105,0.25);
        backdrop-filter: blur(16px);
        z-index: 100;
      }
      .aa-ctl-btn {
        position: relative;
        width: 44px; height: 44px;
        background: #fff;
        border: 2px solid rgba(45,27,105,0.12);
        border-radius: 12px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        color: #4a3070;
        overflow: hidden;
        transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), border-color 0.2s ease;
      }
      .aa-ctl-btn:hover { transform: translateY(-3px) scale(1.08); }
      .aa-ctl-btn:active { transform: scale(0.92); }
      .aa-ctl-inner { position: relative; z-index: 2; display: inline-flex; }
      .aa-ctl-ring {
        position: absolute; inset: 0;
        opacity: 0; border-radius: 12px;
        transition: opacity 0.25s ease;
      }
      .aa-ctl-btn:hover .aa-ctl-ring { opacity: 0.12; }
      .aa-badge-count {
        position: absolute; top: -5px; right: -5px;
        min-width: 18px; height: 18px;
        padding: 0 5px;
        background: #ef476f; color: #fff;
        font-size: 10px; font-weight: 800;
        border-radius: 999px;
        display: inline-flex; align-items: center; justify-content: center;
        border: 2px solid #fff;
        z-index: 3;
      }

      /* ── Quiz ──────────────────────────────────────────────── */
      .aa-quiz-tag {
        display: inline-block;
        padding: 3px 10px;
        background: linear-gradient(135deg, #06d6a0, #118ab2);
        color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 2px;
        border-radius: 999px;
      }
      .aa-quiz-btn {
        padding: 20px; font-family: 'Fredoka', sans-serif; font-size: 34px; font-weight: 700;
        border: 3px solid rgba(45,27,105,0.12); border-radius: 16px;
        background: #fff; color: #2d1b69;
        cursor: pointer; transition: all 0.22s cubic-bezier(.34,1.56,.64,1);
      }
      .aa-quiz-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.05); border-color: #a78bfa; box-shadow: 0 10px 22px rgba(167,139,250,0.3); }
      .aa-quiz-btn:disabled { cursor: default; }
      .aa-quiz-btn.is-correct {
        background: linear-gradient(135deg, #06d6a0, #4fd1c5);
        color: #fff; border-color: #06d6a0;
        animation: aa-bounce 0.6s;
      }
      .aa-quiz-btn.is-wrong {
        background: linear-gradient(135deg, #ef476f, #f15bb5);
        color: #fff; border-color: #ef476f;
        animation: aa-shake 0.45s;
      }
      @keyframes aa-bounce { 0%,100% { transform: scale(1); } 40% { transform: scale(1.2); } 70% { transform: scale(0.96); } }
      @keyframes aa-shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-8px); } 40%,80% { transform: translateX(8px); } }

      /* ── Modals ─────────────────────────────────────────────── */
      .aa-modal-overlay {
        position: fixed; inset: 0; z-index: 500;
        background: rgba(10,5,30,0.55);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; backdrop-filter: blur(6px);
        animation: aa-fade-in 0.3s ease;
      }
      .aa-modal-card {
        position: relative;
        max-width: 720px; width: 100%;
        max-height: 85vh; overflow-y: auto;
        background: #fff; color: #2d1b69;
        border-radius: 28px; padding: 32px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        animation: aa-modal-in 0.45s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes aa-modal-in { 0% { transform: scale(0.9) translateY(20px); opacity: 0; } 100% { transform: none; opacity: 1; } }
      .aa-modal-close {
        position: absolute; top: 16px; right: 16px;
        width: 36px; height: 36px;
        border: none; border-radius: 50%;
        background: rgba(45,27,105,0.08); color: #2d1b69;
        cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: transform 0.2s ease, background 0.2s ease;
      }
      .aa-modal-close:hover { transform: scale(1.1); background: rgba(45,27,105,0.15); }

      /* ── Achievements ───────────────────────────────────────── */
      .aa-achievement {
        position: relative;
        padding: 16px;
        background: rgba(45,27,105,0.04);
        border: 2px solid rgba(45,27,105,0.1);
        border-radius: 16px;
        text-align: center;
        transition: transform 0.25s ease;
      }
      .aa-achievement:hover { transform: translateY(-3px); }
      .aa-achievement.is-earned {
        background: linear-gradient(135deg, rgba(255,215,0,0.18), rgba(255,158,0,0.12));
        border-color: #ffd700;
        box-shadow: 0 6px 18px rgba(255,215,0,0.25);
      }
      .aa-ach-icon { font-size: 42px; margin-bottom: 4px; }
      .aa-ach-ribbon {
        display: inline-block; margin-top: 6px;
        padding: 2px 10px;
        background: linear-gradient(135deg, #ffd700, #ff9e00);
        color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 2px;
        border-radius: 999px;
      }

      /* ── Favorites ──────────────────────────────────────────── */
      .aa-fav-card {
        position: relative;
        padding: 12px; text-align: center;
        background: rgba(239,71,111,0.08);
        border: 2px solid rgba(239,71,111,0.2);
        border-radius: 14px; cursor: pointer;
        transition: all 0.22s cubic-bezier(.34,1.56,.64,1);
      }
      .aa-fav-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(239,71,111,0.25); border-color: #ef476f; }
      .aa-fav-remove {
        position: absolute; top: 4px; right: 4px;
        width: 20px; height: 20px;
        border: none; border-radius: 50%;
        background: rgba(239,71,111,0.15); color: #ef476f;
        cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .aa-fav-remove:hover { background: #ef476f; color: #fff; }

      /* ── Achievement toast ─────────────────────────────────── */
      .aa-achievement-toast {
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        display: flex; align-items: center;
        padding: 16px 22px 16px 16px;
        background: linear-gradient(135deg, #2d1b69, #4a2c91);
        color: #fff;
        border-radius: 16px; border: 2px solid #ffd700;
        box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,215,0,0.2);
        animation: aa-toast-in 0.5s cubic-bezier(.34,1.56,.64,1);
        max-width: 340px;
      }
      @keyframes aa-toast-in {
        0% { transform: translateX(calc(100% + 40px)); }
        100% { transform: translateX(0); }
      }

      /* ── Confetti ──────────────────────────────────────────── */
      .aa-confetti { position: fixed; inset: 0; pointer-events: none; z-index: 900; overflow: hidden; }
      .aa-conf {
        position: absolute; bottom: 40%;
        will-change: transform, opacity;
      }
      .aa-conf-square { border-radius: 2px; }
      .aa-conf-circle { border-radius: 50%; }
      .aa-conf-tri {
        width: 0 !important; height: 0 !important;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 10px solid;
      }
      @keyframes aa-conf-fall {
        0% { transform: translate(0, 0) rotate(0); opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
      }

      /* ── Celebration ────────────────────────────────────────── */
      .aa-celebrate { text-align: center; background: linear-gradient(135deg, #fff, #fff5f7); }

      /* ── Responsive ─────────────────────────────────────────── */
      @media (max-width: 860px) {
        .aa-stage-grid { grid-template-columns: 1fr !important; }
        .aa-strip { grid-template-columns: repeat(13, 1fr); }
        .aa-strip-wrap { margin-bottom: 110px; }
      }
      @media (max-width: 520px) {
        .aa-strip { grid-template-columns: repeat(7, 1fr); padding: 10px; gap: 4px; }
        .aa-controls { gap: 4px; padding: 8px; }
        .aa-ctl-btn { width: 38px; height: 38px; }
      }
    `}</style>
  );
}
