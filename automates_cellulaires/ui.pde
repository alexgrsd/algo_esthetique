MusicUI ui;
GameOfLife gol;
int halfW;

void setup() {
  size(1000, 600);
  halfW = width / 2;

  rectMode(CENTER);
  noStroke();
  frameRate(30);

  ui  = new MusicUI(0, 0, halfW, height);
  gol = new GameOfLife(halfW, 0, halfW, height);
}


void draw() {
  background(270, 100, 15);

  ui.update();
  ui.draw();

  gol.update();
  gol.draw();
}

void mousePressed() {
  ui.mousePressed(mouseX, mouseY);
}
