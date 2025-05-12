from flask import Flask, render_template, request, redirect, url_for
import json
import os

app = Flask(__name__)
DATA_FILE = 'budget_data.json'


# Hilfsfunktion zum Laden der Daten
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)


# Hilfsfunktion zum Speichern der Daten
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)


@app.route('/')
def index():
    data = load_data()
    return render_template('index.html', entries=data)


@app.route('/add', methods=['POST'])
def add_entry():
    date = request.form['date']
    description = request.form['description']
    category = request.form['category']
    amount = float(request.form['amount'])

    data = load_data()
    data.append({
        'date': date,
        'description': description,
        'category': category,
        'amount': amount
    })
    save_data(data)

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
