class TextRain {
  constructor(g, opts, getText) {
    this.getText = getText;
    this.resize(g, opts);
    this.reset(opts);
  }

  resize(g, opts) {
    this.g = g;
    this.cols = floor(g.width / opts.CELL);
    this.rows = floor(g.height / opts.LH);
  }

  reset(opts) {
    this.opts = opts;
    this.sentences = toSentences(this.getText ? this.getText() : "TEXT ");
    this.si = 0;
    this.line = "";
    this.buf = Array.from({ length: this.rows }, () => " ".repeat(this.cols));
    this.acc = 0;
    this.lastT = millis();
    this._pick();
  }

  _pick() {
    this.sent = random(this.sentences) + " ";
    this.si = 0;
  }

  _next() {
    if (this.si >= this.sent.length) this._pick();
    return this.sent[this.si++];
  }

  step() {
    this.line += this._next();
    if (this.line.length < this.cols) return;
    this.buf.unshift(this.line.slice(0, this.cols));
    this.line = "";
    if (this.buf.length > this.rows) this.buf.pop();
  }

  update(charSpeed) {
    this.acc += (millis() - this.lastT) / 1000;
    this.lastT = millis();
    for (let dt = 1 / max(1, charSpeed); this.acc >= dt; this.acc -= dt) this.step();
  }

  renderMasked(mask) {
    const g = this.g, o = this.opts;
    g.textFont("monospace");
    g.textSize(o.FONT);
    g.textAlign(LEFT, TOP);
    g.fill(o.FG, o.ALPHA);
    g.noStroke();

    for (let r = 0; r < this.rows; r++) {
      const row = this.buf[r], y = r * o.LH, m = mask?.[r];
      if (!m) continue;
      for (let c = 0; c < this.cols; c++) {
        if (!m[c]) continue;
        const ch = row[c];
        if (ch !== " ") g.text(ch, c * o.CELL, y);
      }
    }
  }
}

function toSentences(t) {
  t = (t || "").replace(/\s+/g, " ").trim() || "TEXT ";
  return t.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [t];
}

function buildMaskGrid(img, { CELL, LH }, W, H) {
  const cols = floor(W / CELL), rows = floor(H / LH);
  img.loadPixels();

  const sc = min(W / img.width, H / img.height);
  const ox = (W - img.width * sc) * 0.5;
  const oy = (H - img.height * sc) * 0.5;

  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));

  for (let r = 0; r < rows; r++) {
    const y = r * LH + LH * 0.5;
    for (let c = 0; c < cols; c++) {
      const x = c * CELL + CELL * 0.5;
      const ix = floor((x - ox) / sc), iy = floor((y - oy) / sc);
      if (ix < 0 || iy < 0 || ix >= img.width || iy >= img.height) continue;
      grid[r][c] = img.pixels[(iy * img.width + ix) * 4] > 127;
    }
  }
  return grid;
}
