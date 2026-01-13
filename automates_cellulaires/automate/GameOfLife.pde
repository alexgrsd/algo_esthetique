class GameOfLife {

  int x, y, w, h;
  int cols = 60, rows = 60;
  int[][] state, nextState;
  float[][] displayState;

  float noiseProb = 0.002f;
  int numNotes = 12;
  int frameCounter = 0, updateRate = 1;

  GameOfLife(int x, int y, int w, int h) {
    this.x = x; this.y = y; this.w = w; this.h = h;

    colorMode(HSB, 360, 100, 100, 1.0f);

    state = new int[cols][rows];
    nextState = new int[cols][rows];
    displayState = new float[cols][rows];

    // initialisation aléatoire
    for(int i=0; i<cols; i++){
      for(int j=0; j<rows; j++){
        state[i][j] = random(1) > 0.85 ? 1 : 0;
        displayState[i][j] = state[i][j];
      }
    }
  }

  // crée une ligne a chaque note activée
  void reactToNotes(boolean[] notes){
    for(int i=0; i<numNotes; i++){
      if(notes[i]){
        int row = int(map(i, 0, numNotes, 2, rows-2));
        for(int col=0; col<cols; col++){
          state[col][row] = 1;
          displayState[col][row] = 1;
        }
      }
    }
  }

  // update la grille 
  void update(){
    frameCounter++;
    if(frameCounter % updateRate != 0) return;

    for(int x=0; x<cols; x++){
      for(int y=0; y<rows; y++){
        int n = neighbors(x,y);
        nextState[x][y] = (state[x][y] == 1) ? ((n==2 || n==3) ? 1 : 0) : (n==3 ? 1 : 0);
        // active des cases aléatoirement
        if(random(1) < noiseProb) nextState[x][y] = 1;
        displayState[x][y] += (nextState[x][y] - displayState[x][y]) * 0.35;
      }
    }

    // update dans la mémoire 
    int[][] tmp = state; state = nextState; nextState = tmp;
  }
  
  void draw(){
    strokeWeight(0);
    pushMatrix();
    translate(x, y);

    float cw = w / float(cols);
    float ch = h / float(rows);

    for(int i=0; i<cols; i++){
      for(int j=0; j<rows; j++){
        float s = displayState[i][j];
        color c = (state[i][j] == 1)
                  ? color(int(map(j, 2, rows-2, 0, numNotes))*30 + random(30), 100, 100, 1) // couleur aléatoire dans leur range
                  : color(0, 0, 0, 0);  // transparent si mort

        fill(hue(c), saturation(c), brightness(c), s);
        rect(i*cw + cw/2, j*ch + ch/2, cw*(0.6+0.4*s), ch*(0.6+0.4*s));
      }
    }

    popMatrix();
  }

  // Compte le nombre de voisins vivants
  int neighbors(int x, int y){
    int sum = 0;
    for(int dx=-1; dx<=1; dx++){
      for(int dy=-1; dy<=1; dy++){
        if(dx==0 && dy==0) continue;
        sum += state[(x+dx+cols)%cols][(y+dy+rows)%rows];
      }
    }
    return sum;
  }
}
