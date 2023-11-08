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

    //TODO: sql injection no getStudentsByClass
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
}

module.exports = DB;
