def setup():
    size(640, 400)
    noFill()
    colorMode(HSB, 360, 100, 100)
    noLoop()

def draw():
    background(0)

    A = 320
    B = 200
    strokeWeight(1)
    hue = 0

    for i in range(1, 12):
        R = 400 * 0.7
        W = PI / 4
        while W <= 3.6:
            X = R * cos(W)
            Y = R * sin(W)
            stroke(hue % 360, 100, 100)
            hue += 10
            line(A+X, B-Y, A-Y, B-X)
            line(A-Y, B-X, A-X, B+X)
            line(A-X, B+Y, A+X, B-Y)
            line(A-X, B+Y, A+Y, B+X)
            line(A+X, B+X, A+X, B-Y)
            R *= 0.94
            W += 0.05
