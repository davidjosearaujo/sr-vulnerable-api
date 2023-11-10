const { exec } = require("child_process");

class DB {
    constructor() {
        this.dbname = "./database.db";
        (async () => {
            await this.reset();
        })();
    }

    async reset() {
        const fs = require("fs");

        if (fs.existsSync(this.dbname)) {
            fs.unlinkSync(this.dbname);
        }

        this.db = new (require("sqlite3").verbose().Database)(
            this.dbname,
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Connected to the SQLite database");
                    this.runSchemaQueryFromFile("./tables.sql");
                }
            }
        );
    }

    async backup(role) {
        return new Promise((resolve, reject) => {
            exec(
                "sqlite3 " +
                    this.dbname +
                    ' ".backup ./database_' +
                    role +
                    '.db" && echo "Successful"',
                (error, stdout, stderr) => {
                    resolve(stdout.replace(/\n/g, ""));
                }
            );
        });
    }

    async runSchemaQueryFromFile(filePath) {
        const fs = require("fs");
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, "utf8", (err, schemaQuery) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.db.exec(schemaQuery, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Schema query executed successfully.");
                    }
                });
            });
        });
    }

    async setUser(username, password) {
        return new Promise((resolve, reject) => {
            this.db.all(
                "INSERT INTO teachers (username, password) VALUES (?,?)",
                [username, password],
                (err, row) => {
                    if (err || row.length != 0) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    async getUser(username, password) {
        return new Promise((resolve, reject) => {
            this.db.all(
                "SELECT * FROM teachers WHERE username = ? AND password = ?",
                [username, password],
                (err, row) => {
                    if (err || row.length != 1) {
                        reject(err);
                    } else {
                        resolve(row[0]);
                    }
                }
            );
        });
    }

    async getTeacherClasses(username) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM classes WHERE teacher_username= ?`,
                [username],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    async teacherBelongToClass(teacher_username, class_id) {
        return new Promise((resolve, _) => {
            this.db.all(
                `SELECT * FROM classes WHERE teacher_username=? AND id=?`,
                [teacher_username, class_id],
                (err, rows) => {
                    if (err || rows.length == 0) resolve(false);

                    resolve(true);
                }
            );
        });
    }

    async getStudentsByClass(id) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM students
                JOIN student_classes ON students.id = student_classes.student_id
                WHERE class_id=?
                `,
                [id],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    async existingUsers(username) {
        return new Promise((resolve, reject) => {
            this.db.all(
                "SELECT username FROM teachers WHERE username='" +
                    username +
                    "'",
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }
}

module.exports = DB;
