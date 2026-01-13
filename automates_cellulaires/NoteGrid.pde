// grid de notes (servira plus quand y aura la logique d'automate)
import arb.soundcipher.*;

SoundCipher sc = new SoundCipher(this);

    void playChord(float[] pitches){
      sc.playChord(pitches, 100, 2);
  }
  
  void playNote(int note){
      sc.playNote(60+note, 100, 2);
  }
  
  void updateNotes(boolean[] notes){
    float[] pitches={};
    for (int i = 0; i < notes.length; i++) {
      if(notes[i]){
        pitches = append(pitches,(float)i+60);
      }
      playChord(pitches);
    }
  }
  
  int countNotes(boolean[] s) {
  int c = 0;
  for (boolean b : s) if (b) c++;
  return c;
}

void removeOneNote(boolean[] s) {
 
  for (int i = s.length - 1; i >= 0; i--) {
    if (s[i]) {
      s[i] = false;
      return;
      }  
    }

}


  
  
boolean[] applyRules(boolean[] state) {
  int n = state.length;
  boolean[] next = state.clone();

  for (int i = 0; i < n; i++) {
    if (!state[i]) continue;

    int left  = (i - 1 + n) % n;
    int right = (i + 1) % n;

    // pas de voisin gauche alors quinte
    if (!state[left]) {
      next[(i + 7) % n] = !next[(i + 5) % n];
      next[(i + 5) % n] = !next[(i + 3) % n] ;
    }

    // trop entourée alors disparaît
    if (state[left] && state[right]) {
      next[i] = false;
    }

    // collision droite
    if (state[right]&&!state[left]) {
      next[right] = false;
    }
  
    if (countNotes(next) > 4) {
      removeOneNote(next);
    }
    
        // si une cellule vide a deux voisins, elle se remplit et ses voisines se suppriment
    if (state[left] && state[right]){
    next[left] = false;
    next [right] = false;
    next[i] = true;
    } 
  }

  return next;
}
