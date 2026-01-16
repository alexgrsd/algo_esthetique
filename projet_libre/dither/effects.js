// gere les effets type VHS, glitch, RGB shift

function applyEffects(dst, src, fx) {
  dst.image(src, 0, 0);

  if (fx.enableGlitch) glitchScanlines(dst, fx.glitchAmount);
  if (fx.enableRGB) rgbShift(dst, fx.rgbAmount);
  if (fx.enableVHS) vhsNoise(dst, fx.vhsAmount);
}

// rajouter des scan lines 
function glitchScanlines(g, amount=6) {
  amount = floor(amount);
  if (amount <= 0) return;

  const h = g.height;
  for (let k=0; k<amount; k++) {
    const y = floor(random(h));
    const band = floor(random(2, 10));
    const dx = floor(random(-30, 30));
    g.copy(g, 0, y, g.width, band, dx, y, g.width, band);
  }
}

// shift RBG simple
function rgbShift(g, amount=2) {
  amount = floor(amount);
  if (amount <= 0) return;

  const tmp = createGraphics(g.width, g.height);
  tmp.image(g, 0, 0);
  tmp.loadPixels();
  g.loadPixels();

  const w = g.width, h = g.height;
  const p = g.pixels, s = tmp.pixels;

  const sample = (x, y) => {
    x = constrain(x, 0, w-1);
    y = constrain(y, 0, h-1);
    return (y*w + x)*4;
  };

  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const i = (y*w + x)*4;
    const ir = sample(x + amount, y);
    const ib = sample(x - amount, y);

    p[i]   = s[ir]; 
    p[i+1] = s[i+1];     
    p[i+2] = s[ib+2];    
    p[i+3] = 255;
  }

  g.updatePixels();
}
