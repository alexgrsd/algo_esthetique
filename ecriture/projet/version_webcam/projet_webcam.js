let cam, sentences = [], sent = "", si = 0;
let cols, rows, buf = [], line = "";
let acc = 0, lastT = 0;

// Réglages
const CELL = 15, FONT = 6, LH = 8, THRESH = 100;
const BG = 0, FG = 255, ALPHA = 255;
const char_speed = 20000;
const PASSES = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // on acvite la webcam
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  // reglage de la font
  textFont("monospace");
  textSize(FONT);
  textAlign(LEFT, TOP);

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


  if (cam.width === 0 || cam.height === 0) return;  // on attend que la cam soit valide pour commencer 

  cam.loadPixels();
  if (!cam.pixels || cam.pixels.length === 0) return;

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
      if (ch && ch !== " " && maskWhite(c * CELL + CELL * .5, y + LH * .5)) {
        text(ch, c * CELL, y);
      }
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
  const sc = min(width / cam.width, height / cam.height);
  const ox = (width - cam.width * sc) * 0.5;
  const oy = (height - cam.height * sc) * 0.5;

  const ix = floor((x - ox) / sc);
  const iy = floor((y - oy) / sc);

  // si la lettre n'est pas dans le cadre on affiche pas (logique)
  if (ix < 0 || iy < 0 || ix >= cam.width || iy >= cam.height) return false;

  // on recalcule la luminance, parce que sur la version de base on a déja une input en n&b
  // ici non
  const idx = (iy * cam.width + ix) * 4; // va retrouver le pixel dans la liste
  const r = cam.pixels[idx], g = cam.pixels[idx + 1], b = cam.pixels[idx + 2];
  const v = 0.2126 * r + 0.7152 * g + 0.0722 * b; // luminance
  return v > THRESH;
}
