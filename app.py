from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/normal')
def normal():
    return render_template('normal.html')

@app.route('/four-way')
def four_way():
    return render_template('four_way.html')

@app.route('/game/<int:level>')
def game(level):
    if level not in [1, 2, 3]:
        level = 1
    return render_template('game.html', level=level)

@app.route('/four-way-game/<int:level>')
def four_way_game(level):
    if level not in [1, 2, 3]:
        level = 1
    return render_template('four_way_game.html', level=level)

if __name__ == '__main__':
    app.run(debug=True)