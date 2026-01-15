let img, sentences = [], sent = "", si = 0;
let cols, rows, buf = [], line = "";
let acc = 0, lastT = 0;

// Réglages
const CELL = 6, FONT = 6, LH = 8, THRESH = 180;
const BG = 0, FG = 255, ALPHA = 255; // couleur de fond / devant / texte
const char_speed = 20000;
const PASSES = 2;

function preload() { img = loadImage("angel.png"); }

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // charger l'image
  img.loadPixels();

  // reglage de la font
  textFont("monospace");
  textSize(FONT);
  textAlign(LEFT, TOP);
  
  // initialisation du tableau de char et on le pré remplit (pour pas avoir a attendre)
  cols = floor(width / CELL);
  rows = floor(height / LH);
  buf = Array.from({ length: rows }, () => " ".repeat(cols));

  loadStrings("bible.txt", (a) => {
    const t = (a.join("\n").replace(/\s+/g, " ").trim()) || "In the beginning... ";
    sentences = t.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [t];
    pick();

    for (let i = 0, n = cols * rows * PASSES; i < n; i++) step();
    lastT = millis();
  });
}

function draw() {
  background(BG);
  if (!sentences.length) return;

// on charge au fur et a mseure le texte pour cet effet "pluie" de texte
  acc += (millis() - lastT) / 1000;
  lastT = millis();

  const dt = 1 / char_speed;
  while (acc >= dt) { acc -= dt; step(); }

  fill(FG, ALPHA);
  noStroke();

  for (let r = 0; r < rows; r++) {
    const y = r * LH, row = buf[r];
    for (let c = 0; c < cols; c++) {
      const ch = row[c];
      if (ch && ch !== " " && maskWhite(c * CELL + CELL * .5, y + LH * .5)) text(ch, c * CELL, y);
    }
  }
}

const pick = () => (sent = random(sentences) + " ", si = 0);
const nextChar = () => (si >= sent.length && pick(), sent[si++]);

function step() {
  line += nextChar();
  if (line.length >= cols) {
    buf.unshift(line.slice(0, cols));
    line = "";
    if (buf.length > rows) buf.pop();
  }
}

// fonction du masque permettant de n'afficher que sur le blanc
function maskWhite(x, y) {
  const sc = min(width / img.width, height / img.height);
  const ox = (width - img.width * sc) * 0.5;
  const oy = (height - img.height * sc) * 0.5;

  const ix = floor((x - ox) / sc);
  const iy = floor((y - oy) / sc);

  // on affiche la lettre si elle est dans le cadre et si sa luminance est supérieure au threshold 
  // (pas forcément nécessaire d'avoir un threshold précis vu que mon image est soit noire soit blanche ici)
  return ix >= 0 && iy >= 0 && ix < img.width && iy < img.height &&
         img.pixels[(iy * img.width + ix) * 4] > THRESH;
}
