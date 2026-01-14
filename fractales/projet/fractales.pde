import ddf.minim.*;
import ddf.minim.analysis.*;

Minim minim;
AudioPlayer player;
FFT fft;

final int renderScale = 2;  // pour réduire le nombre de pixel a rendre, le code est pas super super opti
PImage low;
int lw, lh;

// parametres de rendu de la fractale
int maxIter = 160;
final int MAX_ITER_CAP = 180;

float cx = -0.745;
float cy =  0.186;

float zoom = 1.8;
float zoomTarget = 1.8;

// pour l'audio
float bassS = 0, midS = 0, highS = 0;

void setup() {
  size(1300, 900, P2D);
  pixelDensity(1);
  smooth(0); // équivalent à noSmooth() mais plus "Processing-friendly"

  minim = new Minim(this);
  player = minim.loadFile("music.mp3", 2048); // fonctionne aussi avec tech.mp3 (attention au volume)
  player.loop();

  fft = new FFT(player.bufferSize(), player.sampleRate());
  fft.window(FFT.HAMMING);

  lw = max(1, width / renderScale);
  lh = max(1, height / renderScale);
  low = createImage(lw, lh, RGB);
}

void draw() {
  // analyse de l'audio
  fft.forward(player.mix);

  float bass = bandEnergy(0, 6);
  float mid  = bandEnergy(7, 30);
  float high = bandEnergy(31, 120);

  bassS = lerp(bassS, bass, 0.12);
  midS  = lerp(midS,  mid,  0.12);
  highS = lerp(highS, high, 0.12);

  // parametres de ma belle fractale
  float t = frameCount * 0.01;
  float motion = constrain(midS * 0.015 + highS * 0.008, 0, 0.08);

  float cxTarget = -0.745 + cos(t * 0.9) * 0.03 + sin(t * 0.7) * motion;
  float cyTarget =  0.186 + sin(t * 1.1) * 0.03 + cos(t * 0.6) * motion;

  cx = lerp(cx, cxTarget, 0.08);
  cy = lerp(cy, cyTarget, 0.08);

  // zoom a partir des basses
  float K = 120.0; // sensibilité aux basses             
  float bassNorm = bassS / (bassS + K);   
  float baseZoom = 1.70 - 0.5 * bassNorm;

  zoomTarget = baseZoom;
  zoom = lerp(zoom, zoomTarget, 0.18);

  // calcul du nombre d'itérations pour pas lagger
  maxIter = int(120 + constrain(highS * 0.06, 0, 140));
  maxIter = min(maxIter, MAX_ITER_CAP);

  // render et affichage
  renderJuliaLow();
  image(low, 0, 0, width, height);

}

float bandEnergy(int a, int b) {
  float s = 0;
  b = min(b, fft.specSize()-1);
  a = max(a, 0);
  for (int i = a; i <= b; i++) s += fft.getBand(i);
  return s;
}

// pour rendre l'image
void renderJuliaLow() {
  low.loadPixels();

  float invW = 1.0 / max(1.0, (lw - 1.0));
  float invH = 1.0 / max(1.0, (lh - 1.0));
  float aspect = lw / (float)lh;

  float hueShift = frameCount * 0.6 + highS * 1.2;
  float contrast = 1.2 + constrain(bassS * 0.003, 0, 1.2);

  for (int y = 0; y < lh; y++) {
    float ny = (y * invH) * 2.0 - 1.0;
    float y0 = ny * zoom;

    int row = y * lw;
    for (int x = 0; x < lw; x++) {
      float nx = (x * invW) * 2.0 - 1.0;
      float x0 = nx * zoom * aspect; 

      // dessin de la fractale en elle même 
      float zx = x0;
      float zy = y0;

      int i = 0;
      for (; i < maxIter; i++) {
        float zx2 = zx*zx - zy*zy + cx;
        float zy2 = 2*zx*zy + cy;
        zx = zx2;
        zy = zy2;
        if (zx*zx + zy*zy > 4.0) break;
      }

      float v = i / (float)maxIter;
      float r = paletteR(v, hueShift) * contrast;
      float g = paletteG(v, hueShift) * contrast;
      float b = paletteB(v, hueShift) * contrast;

      if (i == maxIter) { r *= 0.12; g *= 0.12; b *= 0.15; }

      int ir = constrain((int)r, 0, 255);
      int ig = constrain((int)g, 0, 255);
      int ib = constrain((int)b, 0, 255);

      low.pixels[row + x] = 0xFF000000 | (ir << 16) | (ig << 8) | ib;
    }
  }

  low.updatePixels();
}

// palettes de couleur (plutot classique en vrai)
float paletteR(float v, float shift) { return 255 * (0.5 + 0.5*sin(6.2831*(v*1.2) + radians(shift))); }
float paletteG(float v, float shift) { return 255 * (0.5 + 0.5*sin(6.2831*(v*1.2) + radians(shift))); }
float paletteB(float v, float shift) { return 255 * (0.5 + 0.5*sin(6.2831*(v*1.2) + radians(shift+50))); }

// pour mettre en pause ou reset
void keyPressed() {
  if (key == ' ') {
    if (player.isPlaying()) player.pause();
    else player.play();
  }
  if (key == 'r' || key == 'R') {
    player.rewind();
    player.play();
  }
}

void stop() {
  player.close();
  minim.stop();
  super.stop();
}
