class MusicUI {

  int x, y, w, h;    
  boolean[] notes = new boolean[12];
  boolean running = false;

  int bpm = 120;
  int lastStepTime = 0;

  String[] noteNames = {"C","C#","D","D#","E","F","F#","G","G#","A","A#","B"};

  MusicUI(int x, int y, int w, int h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // on met tout a false
    for(int i=0;i<12;i++) notes[i]=false;
  }

  // on update selon le BPM (120 de base) 
  void update() {
    if (running && millis() - lastStepTime > 60000 / bpm) {
      notes = applyRules(notes);
      updateNotes(notes); // jouer les notes a chaque update
      drawNotesGrid();
      lastStepTime = millis();
      gol.reactToNotes(notes);
    }
  }


  // pour tout dessiner, on bouge tout dans des fonctions différentes
  void draw() {
    pushMatrix();
    translate(x, y);

    drawBackground();
    drawNotesGrid();
    drawStartButton();

    popMatrix();
  }

  // le fond violet tout mignon
  void drawBackground() {
    noStroke();
    fill(270, 100, 15);
  }

  // dessiner les boutons pour les nottes
  void drawNotesGrid() {
    int cellW = w / 12;
    int cellH = 55;       
    int cy = h - 180;     

    // on éclair si le bouton est activé
    for (int i = 0; i < 12; i++) {
      if (notes[i]) {
        fill(270, 80, 70);  
      } else {
        fill(270, 50, 40);
      }

      // le contour et le texte
      stroke(0);
      strokeWeight(1);
      rect(cellW*i + cellW/2, cy, cellW-6, cellH, 6);
      
      fill(0,0,100);
      textAlign(CENTER, CENTER);
      text(noteNames[i], cellW*i + cellW/2, cy);
    }
  }

  void drawStartButton() {
    float bw = 100;
    float bh = 35;  
    float radius = 6;

    fill(running ? color(270, 80, 70) : color(270, 60, 90));
    stroke(0); strokeWeight(1);
    rect(w/2, h - 80, bw, bh, radius);

    fill(0,0,100);
    textAlign(CENTER, CENTER);
    text(running ? "STOP" : "START", w/2, h - 80);
  }

  // detections de clic 
  void mousePressed(int mx, int my) {
    // bouton Start
    float bw = 100;
    float bh = 35;
    if (dist(mx, my, x + w/2, y + h - 80) < max(bw,bh)/2) {
      running = !running;
      return;
    }

    // notes grid
    int cellW = w / 12;
    int cellH = 55;
    int cy = y + h - 180;


    if (my > cy - cellH/2 && my < cy + cellH/2) {
      int idx = (mx - x) / cellW;
      if (idx >=0 && idx < 12){
        notes[idx] = !notes[idx];
        if (notes[idx]) playNote(idx); // jouer la note si elle est activée
      }
    }
  }

  boolean[] getNotes() { return notes; }
  boolean isRunning() { return running; }
  int getBPM() { return bpm; }
}
