function ditherImage(src, opts) {
  const { pixelSize, algo } = opts;

  // 1) downscale pour pixeliser + accélérer
  const w = max(1, floor(src.width / pixelSize));
  const h = max(1, floor(src.height / pixelSize));
  const small = createImage(w, h);
  small.copy(src, 0, 0, src.width, src.height, 0, 0, w, h);
  small.loadPixels();

  // 2) dither sur small
  if (algo === "THRESH") ditherThreshold(small, opts.threshold);
  else if (algo === "BAYER") ditherBayer(small, opts.bayerN, opts.threshold);
  else if (algo === "ATKINSON") ditherAtkinson(small);
  else ditherFloydSteinberg(small);

  small.updatePixels();

  // 3) upscale (sans smooth) vers une image finale
  const out = createImage(src.width, src.height);
  out.copy(small, 0, 0, w, h, 0, 0, src.width, src.height);
  return out;
}

// calcul de la luminance d'un pixel
function lumAt(pix, i) {
  const r = pix[i], g = pix[i+1], b = pix[i+2];
  return (r + g + b) / 3;
}

function setBW(pix, i, v) {
  pix[i] = pix[i+1] = pix[i+2] = v;
  pix[i+3] = 255;
}

function ditherThreshold(im, thr=128) {
  const p = im.pixels;
  for (let i = 0; i < p.length; i += 4) {
    const v = lumAt(p, i) > thr ? 255 : 0;
    setBW(p, i, v);
  }
}

function ditherBayer(im, n=4, thr=128) {
  // matrice Bayer 4x4 (tu peux ajouter 8x8)
  const b4 = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5],
  ];
  const p = im.pixels, w = im.width, h = im.height;

  for (let y=0; y<h; y++) {
    for (let x=0; x<w; x++) {
      const i = (y*w + x)*4;
      const l = lumAt(p, i);
      const t = (b4[y%4][x%4] / 16) * 255; // 0..255
      const v = (l + t - (thr)) > 0 ? 255 : 0;
      setBW(p, i, v);
    }
  }
}

function ditherFloydSteinberg(im) {
  const w = im.width, h = im.height;
  const p = im.pixels;

  // buffer float luminance
  const a = new Float32Array(w*h);
  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const i = (y*w + x)*4;
    a[y*w + x] = lumAt(p, i);
  }

  for (let y=0; y<h; y++) {
    for (let x=0; x<w; x++) {
      const idx = y*w + x;
      const old = a[idx];
      const neu = old < 128 ? 0 : 255;
      const err = old - neu;
      a[idx] = neu;

      if (x+1 < w) a[idx+1] += err * 7/16;
      if (y+1 < h) {
        if (x > 0) a[idx + w - 1] += err * 3/16;
        a[idx + w] += err * 5/16;
        if (x+1 < w) a[idx + w + 1] += err * 1/16;
      }
    }
  }

  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const i = (y*w + x)*4;
    setBW(p, i, a[y*w + x] < 128 ? 0 : 255);
  }
}

function ditherAtkinson(im) {
  const w = im.width, h = im.height;
  const p = im.pixels;
  const a = new Float32Array(w*h);

  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const i = (y*w + x)*4;
    a[y*w + x] = lumAt(p, i);
  }

  for (let y=0; y<h; y++) {
    for (let x=0; x<w; x++) {
      const idx = y*w + x;
      const old = a[idx];
      const neu = old < 128 ? 0 : 255;
      const err = (old - neu) / 8;
      a[idx] = neu;

      const add = (xx, yy) => {
        if (xx>=0 && yy>=0 && xx<w && yy<h) a[yy*w + xx] += err;
      };
      add(x+1,y); add(x+2,y);
      add(x-1,y+1); add(x,y+1); add(x+1,y+1);
      add(x,y+2);
    }
  }

  for (let y=0; y<h; y++) for (let x=0; x<w; x++) {
    const i = (y*w + x)*4;
    setBW(p, i, a[y*w + x] < 128 ? 0 : 255);
  }
}
