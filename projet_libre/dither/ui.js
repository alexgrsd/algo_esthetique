// user interface pour le dither
function setupUI(App, onChange) {
  const el = (tag, txt, parent, cls) => {
    const e = tag === "span" ? createSpan(txt ?? "") : createDiv(txt ?? "");
    if (cls) e.addClass(cls);
    if (parent) e.parent(parent);
    return e;
  };
  const group = (name, parent) => {
    const g = createDiv(); g.parent(parent);
    el("div", name, g, "ui ui-label");
    return g;
  };

  const addFile = (parent, label, cb) => {
    el("div", label, parent, "ui ui-label");
    const i = createFileInput(cb);
    i.addClass("ui");
    i.parent(parent);
    return i;
  };

  const addSelect = (parent, label, options, get, set, evt) => {
    const row = createDiv(); row.addClass("ui-row"); row.parent(parent);
    el("div", label, row, "ui ui-label");
    const s = createSelect(); s.addClass("ui ui-select"); s.parent(row);
    options.forEach(o => s.option(o));
    s.value(get());
    s.changed(() => { set(s.value()); if (evt) onChange(evt); });
    return s;
  };

  const addSlider = (parent, label, min, max, step, get, set, evt, fmt = v => String(v)) => {
    el("div", label, parent, "ui ui-label");
    const row = createDiv(); row.addClass("ui-row"); row.parent(parent);

    const sl = createSlider(min, max, get(), step);
    sl.addClass("ui ui-range");
    sl.parent(row);

    const val = createSpan(fmt(get()));
    val.addClass("ui ui-value");
    val.parent(row);

    sl.input(() => {
      set(sl.value());
      val.html(fmt(get()));
      if (evt) onChange(evt);
    });

    return { sl, val, row };
  };

  const addCheck = (parent, label, get, set) => {
    const c = createCheckbox(label, get());
    c.addClass("ui ui-check");
    c.parent(parent);
    c.changed(() => set(c.checked()));
    return c;
  };

  const hud = createDiv();
  hud.addClass("hud");
  el("div", "Controls", hud, "ui");

  const gFiles = group("Files", hud);

  addFile(gFiles, "Image", file => {
    if (file?.type?.startsWith("image")) loadImage(file.data, im => {
      App.imgOriginal = im;
      onChange("IMAGE_CHANGED");
    });
  });

  addFile(gFiles, "Text (.txt)", file => {
    if (file?.subtype === "plain" || file?.type === "text") {
      App.text = (file.data || "").replace(/\s+/g, " ").trim() || "In the beginning... ";
    }
  });

  const gDither = group("Dither", hud);

  const algo = addSelect(
    gDither,
    "Algorithm",
    ["THRESH","BAYER","FLOYD","ATKINSON"],
    () => App.ditherOpts.algo,
    v => App.ditherOpts.algo = v,
    "DITHER_PARAM"
  );

  addSlider(
    gDither,
    "Pixel size",
    1, 12, 1,
    () => App.ditherOpts.pixelSize,
    v => App.ditherOpts.pixelSize = v,
    "DITHER_PARAM"
  );

  const thrWrap = createDiv(); thrWrap.parent(gDither);
  const thr = addSlider(
    thrWrap,
    "Threshold",
    0, 255, 1,
    () => App.ditherOpts.threshold,
    v => App.ditherOpts.threshold = v,
    "DITHER_PARAM"
  );

  const updateVis = () => {
    const show = ["THRESH","BAYER"].includes(App.ditherOpts.algo);
    thrWrap.style("display", show ? "block" : "none");
  };
  algo.changed(() => { App.ditherOpts.algo = algo.value(); updateVis(); onChange("DITHER_PARAM"); });
  updateVis();

  // --- ACTIONS ---
  const gActions = group("Actions", hud);
  const btnRow = createDiv(); btnRow.addClass("ui-row"); btnRow.parent(gActions);

  const lockBtn = createButton("Lock & Animate");
  lockBtn.addClass("ui ui-btn"); lockBtn.parent(btnRow);
  lockBtn.mousePressed(() => onChange("LOCK_ANIMATE"));

  const backBtn = createButton("Back to Edit");
  backBtn.addClass("ui ui-btn"); backBtn.parent(btnRow);
  backBtn.mousePressed(() => onChange("BACK_TO_EDIT"));

  // --- FX ---
  const gFX = group("FX", hud);

  addCheck(gFX, "RGB shift", () => App.fx.enableRGB, v => App.fx.enableRGB = v);
  addSlider(
    gFX, "RGB amount", 0, 10, 1,
    () => App.fx.rgbAmount,
    v => App.fx.rgbAmount = v,
    null
  );

  addCheck(gFX, "Glitch", () => App.fx.enableGlitch, v => App.fx.enableGlitch = v);
  addSlider(
    gFX, "Glitch amount", 0, 30, 1,
    () => App.fx.glitchAmount,
    v => App.fx.glitchAmount = v,
    null
  );

  return { hud };
}
