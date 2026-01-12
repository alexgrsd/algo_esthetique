def setup():
    size(640, 400)
    noFill()
    stroke(255)
    colorMode(HSB, 360, 100, 100)

def draw():
    background(0)

    D = 0
    N = 0
    X = 640
    Y = 400
    hue = 0;

    while N <= Y:
        D += 1
        strokeWeight(D)
        stroke(hue % 360, 100, 100)
        hue += 25
        N = N + D + 1
        X = X - D - 10
        Y = Y - D - 10
        rect(N,N,X-N,Y-N)
