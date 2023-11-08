CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL,
    teacher_username TEXT NOT NULL,
    FOREIGN KEY (teacher_username) REFERENCES teachers (username)
);

CREATE TABLE IF NOT EXISTS student_classes (
    student_id INTEGER,
    class_id INTEGER,
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (class_id) REFERENCES classes (id)
);

INSERT INTO teachers (username, password) VALUES
    ('JohnSmith', 'password1'),
    ('MaryJohnson', 'password2'),
    ('RobertDavis', 'password3');

INSERT INTO students (name) VALUES
    ('Alice Jones'),
    ('David Brown'),
    ('Linda Wilson');

INSERT INTO classes (class_name, teacher_username) VALUES
    ('Math 101', 'JohnSmith'),
    ('History 201', 'MaryJohnson'),
    ('Science 301', 'RobertDavis');

INSERT INTO student_classes (student_id, class_id) VALUES
    (1, 1), 
    (2, 2), 
    (3, 3);