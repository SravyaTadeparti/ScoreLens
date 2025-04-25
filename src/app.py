from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
import numpy as np

app = Flask(__name__)
CORS(app)

DB_NAME = 'student_scores.db'

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

if __name__ == '__main__':
    app.run(debug=True)