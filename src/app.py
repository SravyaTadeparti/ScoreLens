# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import sqlite3
# import numpy as np

# app = Flask(__name__)
# CORS(app)

# DB_NAME = 'student_scores.db'

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     file = request.files.get('file')
#     subject = request.form.get('subject')

#     print(f"Received subject: '{subject}'")
#     print(f"Received file: '{file.filename if file else 'None'}'")

#     if not file or not subject:
#         return jsonify({'error': 'Missing file or subject'}), 400

#     try:
#         df = pd.read_excel(file)

#         if 'Name' not in df.columns or 'Marks' not in df.columns:
#             return jsonify({'error': 'Excel must contain Name and Marks columns'}), 400

#         table_name = subject.strip().replace(" ", "_")
#         print(f"Using table name: '{table_name}'")

#         conn = sqlite3.connect(DB_NAME)
#         c = conn.cursor()

#         # Create table if not exists
#         c.execute(f'''
#             CREATE TABLE IF NOT EXISTS "{table_name}" (
#                 Name TEXT PRIMARY KEY,
#                 Marks INTEGER
#             )
#         ''')

#         # Clear existing data
#         c.execute(f'DELETE FROM "{table_name}"')

#         for _, row in df.iterrows():
#             c.execute(f'''
#                 INSERT OR REPLACE INTO "{table_name}" (Name, Marks)
#                 VALUES (?, ?)
#             ''', (row['Name'], int(row['Marks'])))

#         conn.commit()

#         # Fetch updated data
#         c.execute(f'SELECT Name, Marks FROM "{table_name}"')
#         stored_data = c.fetchall()
#         conn.close()

#         labels = [row[0] for row in stored_data]
#         scores = [row[1] for row in stored_data]

#         return jsonify({
#             'message': f'Data stored for subject: {subject}',
#             'labels': labels,
#             'scores': scores,
#             'statistics': {
#                 'average': float(np.mean(scores)),
#                 'min': int(np.min(scores)),
#                 'max': int(np.max(scores)),
#                 '25th_percentile': float(np.percentile(scores, 25)),
#                 '50th_percentile': float(np.percentile(scores, 50)),
#                 '75th_percentile': float(np.percentile(scores, 75))
#             }
#         })

#     except Exception as e:
#         print("Upload error:", e)
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5001, debug=True)














# Working

# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# import pandas as pd
# import sqlite3
# import numpy as np
# import os

# app = Flask(__name__)
# CORS(app)

# # SQLite database configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)

# # Database name for student scores
# STUDENT_DB_NAME = 'student_scores.db'

# # User model
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     password = db.Column(db.String(200), nullable=False)
#     role = db.Column(db.String(20), nullable=False)
#     created_courses = db.relationship('Course', backref='creator', lazy=True)

# # Course model
# class Course(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     code = db.Column(db.String(20), unique=True, nullable=False)
#     professor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     enrolled_students = db.relationship('Enrollment', backref='course', lazy=True)

# # Enrollment model
# class Enrollment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
#     student_email = db.Column(db.String(100), nullable=False)
#     __table_args__ = (db.UniqueConstraint('course_id', 'student_email', name='_course_student_unique'),)

# # Create the tables
# with app.app_context():
#     db.create_all()

# @app.route('/api/auth', methods=['POST'])
# def auth():
#     data = request.get_json()
#     if not data or 'action' not in data or 'email' not in data or 'password' not in data or 'role' not in data:
#         return jsonify({"message": "Invalid request, missing required fields."}), 400

#     action = data['action']
#     email = data['email']
#     password = data['password']
#     role = data['role']

#     if action == 'signup':
#         # Check if user already exists
#         user = User.query.filter_by(email=email).first()
#         if user:
#             return jsonify({"message": "Email already registered."}), 400

#         # Create new user
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#         new_user = User(email=email, password=hashed_password, role=role)
#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({"message": "User successfully signed up!"}), 201

#     elif action == 'login':
#         # Find user with email and role
#         user = User.query.filter_by(email=email, role=role).first()
#         if user and bcrypt.check_password_hash(user.password, password):
#             return jsonify({
#                 "message": "Login successful!",
#                 "user_id": user.id,
#                 "email": user.email,
#                 "role": user.role
#             }), 200

#         return jsonify({"message": "Invalid credentials"}), 401

#     return jsonify({"message": "Invalid action!"}), 400

# @app.route('/api/courses', methods=['GET'])
# def get_courses():
#     user_id = request.args.get('professor_id')
#     email = request.args.get('student_email')

#     if user_id:
#         courses = Course.query.filter_by(professor_id=user_id).all()
#         course_list = [{"id": c.id, "name": c.name, "code": c.code} for c in courses]
#         return jsonify(course_list), 200
#     elif email:
#         enrolled_courses = Enrollment.query.filter_by(student_email=email).all()
#         course_ids = [ec.course_id for ec in enrolled_courses]
#         courses = Course.query.filter(Course.id.in_(course_ids)).all()
#         course_list = [{"id": c.id, "name": c.name, "code": c.code, "professor_id": c.professor_id} for c in courses]
#         return jsonify(course_list), 200
#     else:
#         return jsonify({"message": "Missing professor_id or student_email for filtering"}), 400

# @app.route('/api/courses', methods=['POST'])
# def create_course():
#     if 'name' not in request.form or 'professor_id' not in request.form or 'file' not in request.files:
#         return jsonify({"error": "Missing course name, professor ID, or Excel file"}), 400

#     name = request.form['name']
#     professor_id = request.form['professor_id'] # This is coming from the form, which is wrong
#     excel_file = request.files['file']
#     code = os.urandom(4).hex().upper() # Generate a random course code

#     # Get the professor object.  We need the user id from the database.
#     professor = User.query.filter_by(id=professor_id).first()
#     if not professor:
#         return jsonify({"error": "Professor not found"}), 400

#     if excel_file and excel_file.filename.endswith(('.xlsx', '.xls')):
#         try:
#             df = pd.read_excel(excel_file)
#             if 'Name' not in df.columns or 'Email' not in df.columns:
#                 return jsonify({"error": "Excel file must contain 'Name' and 'Email' columns"}), 400

#             new_course = Course(name=name, code=code, professor_id=professor.id) # Use professor.id
#             db.session.add(new_course)
#             db.session.flush()
            
#             for _, row in df.iterrows():
#                 student_email = row['Email']
#                 # Check if the student exists.
#                 user = User.query.filter_by(email=student_email).first()
#                 if user:
#                     enrollment = Enrollment(course_id=new_course.id, student_email=student_email)
#                     db.session.add(enrollment)
#                 else:
#                     #  Handle the case where the student does not exist
#                     print(f"Student with email {student_email} not found.  Skipping enrollment.")

#             db.session.commit()
#             return jsonify({"message": f"Course '{name}' created with code '{code}' and students enrolled.", "id": new_course.id}), 201

#         except Exception as e:
#             db.session.rollback()
#             return jsonify({"error": f"Error processing Excel file: {str(e)}"}), 500
#     else:
#         return jsonify({"error": "No Excel file uploaded or invalid file format"}), 400

# @app.route('/api/courses/<int:course_id>', methods=['DELETE'])
# def delete_course(course_id):
#     course = Course.query.get_or_404(course_id)
#     db.session.delete(course)
#     db.session.commit()
#     return jsonify({"message": f"Course '{course.name}' deleted successfully."}), 200

# @app.route('/api/upload_scores/<int:course_id>', methods=['POST'])
# def upload_scores(course_id):
#     file = request.files.get('file')

#     if not file or not file.filename.endswith(('.xlsx', '.xls')):
#         return jsonify({'error': 'Missing or invalid file'}), 400

#     try:
#         df = pd.read_excel(file)
#         if 'Name' not in df.columns or 'Marks' not in df.columns:
#             return jsonify({'error': 'Excel must contain Name and Marks columns'}), 400

#         table_name = f'course_{course_id}_scores'
#         conn = sqlite3.connect(STUDENT_DB_NAME)
#         c = conn.cursor()

#         # Create table if not exists
#         c.execute(f'''
#             CREATE TABLE IF NOT EXISTS "{table_name}" (
#                 Name TEXT PRIMARY KEY,
#                 Marks INTEGER
#             )
#         ''')

#         # Clear existing data
#         c.execute(f'DELETE FROM "{table_name}"')

#         for _, row in df.iterrows():
#             c.execute(f'''
#                 INSERT OR REPLACE INTO "{table_name}" (Name, Marks)
#                 VALUES (?, ?)
#             ''', (row['Name'], int(row['Marks'])))

#         conn.commit()

#         # Fetch updated data
#         c.execute(f'SELECT Name, Marks FROM "{table_name}"')
#         stored_data = c.fetchall()
#         conn.close()

#         labels = [row[0] for row in stored_data]
#         scores = [row[1] for row in stored_data]

#         return jsonify({
#             'message': f'Scores uploaded for course ID: {course_id}',
#             'labels': labels,
#             'scores': scores,
#             'statistics': {
#                 'average': float(np.mean(scores)) if scores else 0,
#                 'min': int(np.min(scores)) if scores else 0,
#                 'max': int(np.max(scores)) if scores else 0,
#                 '25th_percentile': float(np.percentile(scores, 25)) if scores else 0,
#                 '50th_percentile': float(np.percentile(scores, 50)) if scores else 0,
#                 '75th_percentile': float(np.percentile(scores, 75)) if scores else 0
#             }
#         })

#     except Exception as e:
#         print("Upload error:", e)
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)














# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# import pandas as pd
# import sqlite3
# import numpy as np
# import os

# app = Flask(__name__)
# CORS(app)

# # SQLite database configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)

# # Database name for student scores
# STUDENT_DB_NAME = 'student_scores.db'

# # User model
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     password = db.Column(db.String(200), nullable=False)
#     role = db.Column(db.String(20), nullable=False)
#     created_courses = db.relationship('Course', backref='creator', lazy=True)

# # Course model
# class Course(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     code = db.Column(db.String(20), unique=True, nullable=False)
#     professor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     enrolled_students = db.relationship('Enrollment', backref='course', lazy=True)

# # Enrollment model
# class Enrollment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
#     student_email = db.Column(db.String(100), nullable=False)
#     __table_args__ = (db.UniqueConstraint('course_id', 'student_email', name='_course_student_unique'),)

# # Create the tables
# with app.app_context():
#     db.create_all()

# @app.route('/api/auth', methods=['POST'])
# def auth():
#     data = request.get_json()
#     if not data or 'action' not in data or 'email' not in data or 'password' not in data or 'role' not in data:
#         return jsonify({"message": "Invalid request, missing required fields."}), 400

#     action = data['action']
#     email = data['email']
#     password = data['password']
#     role = data['role']

#     print(f"Received data: {data}") # Debug: Print the received data

#     if action == 'signup':
#         # Check if user already exists
#         user = User.query.filter_by(email=email).first()
#         if user:
#             return jsonify({"message": "Email already registered."}), 400

#         # Create new user
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#         new_user = User(email=email, password=hashed_password, role=role)
#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({"message": "User successfully signed up!"}), 201

#     elif action == 'login':
#         # Find user with email and role
#         user = User.query.filter_by(email=email, role=role).first()
#         if user and bcrypt.check_password_hash(user.password, password):
#             print(f"Login successful. User ID: {user.id}, Role: {user.role}") # Debug
#             return jsonify({
#                 "message": "Login successful!",
#                 "user_id": user.id,
#                 "email": user.email,
#                 "role": user.role
#             }), 200

#         return jsonify({"message": "Invalid credentials"}), 401

#     return jsonify({"message": "Invalid action!"}), 400

# @app.route('/api/courses', methods=['GET'])
# def get_courses():
#     user_id = request.args.get('professor_id')
#     email = request.args.get('student_email')

#     if user_id:
#         courses = Course.query.filter_by(professor_id=user_id).all()
#         course_list = [{"id": c.id, "name": c.name, "code": c.code} for c in courses]
#         return jsonify(course_list), 200
#     elif email:
#         enrolled_courses = Enrollment.query.filter_by(student_email=email).all()
#         course_ids = [ec.course_id for ec in enrolled_courses]
#         courses = Course.query.filter(Course.id.in_(course_ids)).all()
#         course_list = [{"id": c.id, "name": c.name, "code": c.code, "professor_id": c.professor_id} for c in courses]
#         return jsonify(course_list), 200
#     else:
#         return jsonify({"message": "Missing professor_id or student_email for filtering"}), 400

# @app.route('/api/courses', methods=['POST'])
# def create_course():
#     if 'name' not in request.form or 'professor_id' not in request.form or 'file' not in request.files:
#         return jsonify({"error": "Missing course name, professor ID, or Excel file"}), 400

#     name = request.form['name']
#     professor_id = request.form['professor_id']
#     excel_file = request.files['file']
#     code = os.urandom(4).hex().upper() # Generate a random course code

#     print(f"Creating course with professor_id: {professor_id}") # Debug

#     # Get the professor object.  We need the user id from the database.
#     professor = User.query.filter_by(id=professor_id).first()
#     if not professor:
#         return jsonify({"error": "Professor not found"}), 400

#     if excel_file and excel_file.filename.endswith(('.xlsx', '.xls')):
#         try:
#             df = pd.read_excel(excel_file)
#             if 'Name' not in df.columns or 'Email' not in df.columns:
#                 return jsonify({"error": "Excel file must contain 'Name' and 'Email' columns"}), 400

#             new_course = Course(name=name, code=code, professor_id=professor.id) # Use professor.id
#             db.session.add(new_course)
#             db.session.flush()
            
#             for _, row in df.iterrows():
#                 student_email = row['Email']
#                 # Check if the student exists.
#                 user = User.query.filter_by(email=student_email).first()
#                 if user:
#                     enrollment = Enrollment(course_id=new_course.id, student_email=student_email)
#                     db.session.add(enrollment)
#                 else:
#                     #  Handle the case where the student does not exist
#                     print(f"Student with email {student_email} not found.  Skipping enrollment.")

#             db.session.commit()
#             return jsonify({"message": f"Course '{name}' created with code '{code}' and students enrolled.", "id": new_course.id}), 201

#         except Exception as e:
#             db.session.rollback()
#             return jsonify({"error": f"Error processing Excel file: {str(e)}"}), 500
#     else:
#         return jsonify({"error": "No Excel file uploaded or invalid file format"}), 400

# @app.route('/api/courses/<int:course_id>', methods=['DELETE'])
# def delete_course(course_id):
#     course = Course.query.get_or_404(course_id)
#     db.session.delete(course)
#     db.session.commit()
#     return jsonify({"message": f"Course '{course.name}' deleted successfully."}), 200

# @app.route('/api/upload_scores/<int:course_id>', methods=['POST'])
# def upload_scores(course_id):
#     file = request.files.get('file')

#     if not file or not file.filename.endswith(('.xlsx', '.xls')):
#         return jsonify({'error': 'Missing or invalid file'}), 400

#     try:
#         df = pd.read_excel(file)
#         if 'Name' not in df.columns or 'Marks' not in df.columns:
#             return jsonify({'error': 'Excel must contain Name and Marks columns'}), 400

#         table_name = f'course_{course_id}_scores'
#         conn = sqlite3.connect(STUDENT_DB_NAME)
#         c = conn.cursor()

#         # Create table if not exists
#         c.execute(f'''
#             CREATE TABLE IF NOT EXISTS "{table_name}" (
#                 Name TEXT PRIMARY KEY,
#                 Marks INTEGER
#             )
#         ''')

#         # Clear existing data
#         c.execute(f'DELETE FROM "{table_name}"')

#         for _, row in df.iterrows():
#             c.execute(f'''
#                 INSERT OR REPLACE INTO "{table_name}" (Name, Marks)
#                 VALUES (?, ?)
#             ''', (row['Name'], int(row['Marks'])))

#         conn.commit()

#         # Fetch updated data
#         c.execute(f'SELECT Name, Marks FROM "{table_name}"')
#         stored_data = c.fetchall()
#         conn.close()

#         labels = [row[0] for row in stored_data]
#         scores = [row[1] for row in stored_data]

#         return jsonify({
#             'message': f'Scores uploaded for course ID: {course_id}',
#             'labels': labels,
#             'scores': scores,
#             'statistics': {
#                 'average': float(np.mean(scores)) if scores else 0,
#                 'min': int(np.min(scores)) if scores else 0,
#                 'max': int(np.max(scores)) if scores else 0,
#                 '25th_percentile': float(np.percentile(scores, 25)) if scores else 0,
#                 '50th_percentile': float(np.percentile(scores, 50)) if scores else 0,
#                 '75th_percentile': float(np.percentile(scores, 75)) if scores else 0
#             }
#         })

#     except Exception as e:
#         print("Upload error:", e)
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)


from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pandas as pd
import sqlite3
import numpy as np
import os

app = Flask(__name__)
CORS(app)

<<<<<<< HEAD
# User auth DB config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

DB_NAME = 'student_scores.db'

# ----------------- User Auth Model -----------------
=======
# SQLite database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Database name for student scores
STUDENT_DB_NAME = 'student_scores.db'

# User model
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
<<<<<<< HEAD
    role = db.Column(db.String(20), nullable=False)  # "student" or "teacher"

with app.app_context():
    db.create_all()

# ----------------- Auth Route -----------------
@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.json
=======
    role = db.Column(db.String(20), nullable=False)
    created_courses = db.relationship('Course', backref='creator', lazy=True)

# Course model
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    professor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    enrolled_students = db.relationship('Enrollment', backref='course', lazy=True)

# Enrollment model
class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    student_email = db.Column(db.String(100), nullable=False)
    __table_args__ = (db.UniqueConstraint('course_id', 'student_email', name='_course_student_unique'),)

# Create the tables
with app.app_context():
    db.create_all()

@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json()
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
    if not data or 'action' not in data or 'email' not in data or 'password' not in data or 'role' not in data:
        return jsonify({"message": "Invalid request, missing required fields."}), 400

    action = data['action']
    email = data['email']
    password = data['password']
    role = data['role']

    if action == 'signup':
<<<<<<< HEAD
=======
        # Check if user already exists
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"message": "Email already registered."}), 400

<<<<<<< HEAD
=======
        # Create new user
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User successfully signed up!"}), 201

    elif action == 'login':
<<<<<<< HEAD
        user = User.query.filter_by(email=email, role=role).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return jsonify({"message": "Login successful!"}), 200
=======
        # Find user with email and role
        user = User.query.filter_by(email=email, role=role).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return jsonify({
                "message": "Login successful!",
                "user_id": user.id,
                "email": user.email,
                "role": user.role
            }), 200
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e

        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"message": "Invalid action!"}), 400

<<<<<<< HEAD
# ----------------- Upload Route -----------------
@app.route('/upload', methods=['POST'])
def upload_file():
=======
@app.route('/api/courses', methods=['GET'])
def get_courses():
    user_id = request.args.get('professor_id')
    student_email = request.args.get('student_email')  # Changed variable name

    if user_id:
        courses = Course.query.filter_by(professor_id=user_id).all()
        course_list = [{"id": c.id, "name": c.name, "code": c.code} for c in courses]
        return jsonify(course_list), 200
    elif student_email:  # Use student_email
        # Find courses where the student is enrolled
        enrollments = Enrollment.query.filter_by(student_email=student_email).all()
        course_ids = [enrollment.course_id for enrollment in enrollments]
        courses = Course.query.filter(Course.id.in_(course_ids)).all()
        course_list = [{"id": c.id, "name": c.name, "code": c.code, "professor_id": c.professor_id} for c in courses]
        return jsonify(course_list), 200
    else:
        return jsonify({"message": "Missing professor_id or student_email for filtering"}), 400



@app.route('/api/courses', methods=['POST'])
def create_course():
    if 'name' not in request.form or 'professor_id' not in request.form or 'file' not in request.files:
        return jsonify({"error": "Missing course name, professor ID, or Excel file"}), 400

    name = request.form['name']
    professor_id = request.form['professor_id'] # This is coming from the form, which is wrong
    excel_file = request.files['file']
    code = os.urandom(4).hex().upper() # Generate a random course code

    # Get the professor object.  We need the user id from the database.
    professor = User.query.filter_by(id=professor_id).first()
    if not professor:
        return jsonify({"error": "Professor not found"}), 400

    if excel_file and excel_file.filename.endswith(('.xlsx', '.xls')):
        try:
            df = pd.read_excel(excel_file)
            if 'Name' not in df.columns or 'Email' not in df.columns:
                return jsonify({"error": "Excel file must contain 'Name' and 'Email' columns"}), 400

            new_course = Course(name=name, code=code, professor_id=professor.id) # Use professor.id
            db.session.add(new_course)
            db.session.flush()
            
            for _, row in df.iterrows():
                student_email = row['Email']
                # Check if the student exists.
                user = User.query.filter_by(email=student_email).first()
                if user:
                    enrollment = Enrollment(course_id=new_course.id, student_email=student_email)
                    db.session.add(enrollment)
                else:
                    #  Handle the case where the student does not exist
                    print(f"Student with email {student_email} not found.  Skipping enrollment.")

            db.session.commit()
            return jsonify({"message": f"Course '{name}' created with code '{code}' and students enrolled.", "id": new_course.id}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error processing Excel file: {str(e)}"}), 500
    else:
        return jsonify({"error": "No Excel file uploaded or invalid file format"}), 400

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": f"Course '{course.name}' deleted successfully."}), 200

@app.route('/api/upload_scores/<int:course_id>', methods=['POST'])
def upload_scores(course_id):
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
    file = request.files.get('file')

    if not file or not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({'error': 'Missing or invalid file'}), 400

    try:
        df = pd.read_excel(file)
        if 'Name' not in df.columns or 'Marks' not in df.columns:
            return jsonify({'error': 'Excel must contain Name and Marks columns'}), 400

        table_name = f'course_{course_id}_scores'
        conn = sqlite3.connect(STUDENT_DB_NAME)
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
            'message': f'Scores uploaded for course ID: {course_id}',
            'labels': labels,
            'scores': scores,
            'statistics': {
                'average': float(np.mean(scores)) if scores else 0,
                'min': int(np.min(scores)) if scores else 0,
                'max': int(np.max(scores)) if scores else 0,
                '25th_percentile': float(np.percentile(scores, 25)) if scores else 0,
                '50th_percentile': float(np.percentile(scores, 50)) if scores else 0,
                '75th_percentile': float(np.percentile(scores, 75)) if scores else 0
            }
        })

    except Exception as e:
        print("Upload error:", e)
        return jsonify({'error': str(e)}), 500

# ----------------- Run App -----------------
if __name__ == '__main__':
<<<<<<< HEAD
    app.run(port=5001, debug=True)
=======
    app.run(port=5000, debug=True)
>>>>>>> 2a29e274376e2878185e36bf9ed2dd9a526fa61e
