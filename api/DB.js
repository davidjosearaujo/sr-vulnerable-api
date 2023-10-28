class DB {


    constructor() {
        this.dbname = './database.db';
        (async() => {
          await this.reset();
        })()
    }

    async reset() {
      const fs = require('fs')
      
      if(fs.existsSync(this.dbname)) {
        fs.unlinkSync(this.dbname)
      }

      this.db = new (require('sqlite3').verbose()).Database(this.dbname, (err) => {
        if(err) {
          console.error(err.message);
        } else {
          console.log('Connected to the SQLite database');
          
          this.runSchemaQueryFromFile('./tables.sql').then(
            _ => console.log('Schema query executed successfully.')
          ).catch(error => console.error(error))
        }
      });
    }

    async runSchemaQueryFromFile(filePath) {
        const fs = require('fs')
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, schemaQuery) => {
            if (err) {
              reject(err);
              return;
            }
    
            this.db.exec(schemaQuery, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
      }

      async getUser(username, password) {
        return new Promise((resolve, reject) => {
          this.db.all(
            `SELECT * FROM teachers WHERE username = ? AND password = ?`, [username,password],
            (err, row) => {
              if (err || row.length == 0) {
                reject(err);
              } else {
                resolve(row[0]);
              }
            }
          );
        });
      }

    async getTeacherClasses() {

    }

  }

module.exports = DB;