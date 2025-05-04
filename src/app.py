from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pandas as pd
import sqlite3
import numpy as np

app = Flask(__name__)
CORS(app)

# User auth DB config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

DB_NAME = 'student_scores.db'

# ----------------- User Auth Model -----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "student" or "teacher"

with app.app_context():
    db.create_all()

# ----------------- Auth Route -----------------
@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.json
    if not data or 'action' not in data or 'email' not in data or 'password' not in data or 'role' not in data:
        return jsonify({"message": "Invalid request, missing required fields."}), 400

    action = data['action']
    email = data['email']
    password = data['password']
    role = data['role']

    if action == 'signup':
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"message": "Email already registered."}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User successfully signed up!"}), 201

    elif action == 'login':
        user = User.query.filter_by(email=email, role=role).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return jsonify({"message": "Login successful!"}), 200

        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"message": "Invalid action!"}), 400

# ----------------- Upload Route -----------------
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    subject = request.form.get('subject')

    print(f"Received subject: '{subject}'")
    print(f"Received file: '{file.filename if file else 'None'}'")

    if not file or not subject:
        return jsonify({'error': 'Missing file or subject'}), 400

    try:
        df = pd.read_excel(file)

        if 'Name' not in df.columns or 'Marks' not in df.columns:
            return jsonify({'error': 'Excel must contain Name and Marks columns'}), 400

        table_name = subject.strip().replace(" ", "_")
        print(f"Using table name: '{table_name}'")

        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()

        # Create table if not exists
        c.execute(f'''
            CREATE TABLE IF NOT EXISTS "{table_name}" (
                Name TEXT PRIMARY KEY,
                Marks INTEGER
            )
        ''')

        # Clear existing data
        c.execute(f'DELETE FROM "{table_name}"')

        for _, row in df.iterrows():
            c.execute(f'''
                INSERT OR REPLACE INTO "{table_name}" (Name, Marks)
                VALUES (?, ?)
            ''', (row['Name'], int(row['Marks'])))

        conn.commit()

        # Fetch updated data
        c.execute(f'SELECT Name, Marks FROM "{table_name}"')
        stored_data = c.fetchall()
        conn.close()

        labels = [row[0] for row in stored_data]
        scores = [row[1] for row in stored_data]

        return jsonify({
            'message': f'Data stored for subject: {subject}',
            'labels': labels,
            'scores': scores,
            'statistics': {
                'average': float(np.mean(scores)),
                'min': int(np.min(scores)),
                'max': int(np.max(scores)),
                '25th_percentile': float(np.percentile(scores, 25)),
                '50th_percentile': float(np.percentile(scores, 50)),
                '75th_percentile': float(np.percentile(scores, 75))
            }
        })

    except Exception as e:
        print("Upload error:", e)
        return jsonify({'error': str(e)}), 500

# ----------------- Run App -----------------
if __name__ == '__main__':
    app.run(port=5001, debug=True)
