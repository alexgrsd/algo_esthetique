const App = {
  mode: "EDIT",
  imgOriginal: null,
  imgDither: null,
  maskGrid: null,
  text: "TEXT ",
  ditherOpts: { algo: "FLOYD", pixelSize: 2, levels: 2, threshold: 156, bayerN: 4 },
  animOpts: { CELL: 6, FONT: 6, LH: 8, charSpeed: 500, BG: 0, FG: 255, ALPHA: 255, PASSES: 2 },
  fx: { enableRGB: true, rgbAmount: 2, enableGlitch: true, glitchAmount: 6 }
};

let rain, gfx, postGfx;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  resizeBuffers();

  setupUI(App, onUIChange);
  rain = new TextRain(gfx, App.animOpts, () => App.text);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resizeBuffers();
  if (App.mode === "ANIM" && App.imgDither) App.maskGrid = buildMaskGrid(App.imgDither, App.animOpts, width, height);
}

function draw() {
  background(0);
  if (!App.imgOriginal) return;         

  if (App.mode === "EDIT") {
    if (App.imgDither) { noSmooth(); drawCentered(App.imgDither); }
    return;
  }

  // ANIM
  gfx.background(App.animOpts.BG);
  rain.update(App.animOpts.charSpeed);
  rain.renderMasked(App.maskGrid);

  postGfx.clear();
  applyEffects(postGfx, gfx, App.fx);
  image(postGfx, 0, 0);
}

const rebuildDither = debounce(() => {
  if (App.imgOriginal) App.imgDither = ditherImage(App.imgOriginal, App.ditherOpts);
}, 50);

function onUIChange(type) {
  switch (type) {
    case "IMAGE_CHANGED":
    case "DITHER_PARAM":
      App.mode = "EDIT";
      App.maskGrid = null;
      rebuildDither();
      break;

    case "LOCK_ANIMATE":
      if (!App.imgDither) break;
      App.mode = "ANIM";
      App.maskGrid = buildMaskGrid(App.imgDither, App.animOpts, width, height);
      rain.reset(App.animOpts);
      for (let i = 0, n = rain.cols * rain.rows * App.animOpts.PASSES; i < n; i++) rain.step();
      break;

    case "BACK_TO_EDIT":
      App.mode = "EDIT";
      App.maskGrid = null;
      break;
  }
}

function resizeBuffers() {
  gfx = createGraphics(windowWidth, windowHeight);
  postGfx = createGraphics(windowWidth, windowHeight);
  rain?.resize(gfx, App.animOpts);
}

function drawCentered(im) {
  const sc = min(width / im.width, height / im.height);
  image(im, (width - im.width * sc) * 0.5, (height - im.height * sc) * 0.5, im.width * sc, im.height * sc);
}

function debounce(fn, wait = 100) {
  let t;
  return (...args) => (clearTimeout(t), t = setTimeout(() => fn(...args), wait));
}
