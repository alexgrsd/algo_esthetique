def setup():
    global wave_offset# vriable d'animation
    wave_offset = 0
    size(640, 400)
    colorMode(HSB, 360, 100, 100)
    frameRate(30)

def draw():
    global wave_offset
    background(0)
    strokeWeight(1)
    
    x = width / 2
    y = height / 4
    h = 200
    hue = 0
    
    for i in range(0, h, 2):
        # on dessine des traits sur 200 de hauteur (avec le même centre)
        height_factor = h * (1 - (i / h)**2)
        #on fait ca jusqu'a la fin de notre largeur (et dans le négatif)
        for x_offset in range(-int(height_factor), int(height_factor), 4):
            #on fait varier la couleur
            stroke(hue % 360, 100, 100)
            hue += sin(wave_offset/10)
            x1 = x + x_offset
            y1 = y + i
            # on fait varier la longueur de négatifa positif pour l'effet "wave"
            x2 = x1 + 3 * sin(i / 10.0 + x_offset / 20.0 + wave_offset)
            y2 = y1
            line(x1, y1, x2, y2)
    
    wave_offset += 0.1  # avance l’onde à chaque frame
 
