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
          console.error(err.message)
        } else {
          console.log('Connected to the SQLite database');
          this.runSchemaQueryFromFile('./tables.sql');
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
                resolve('Schema query executed successfully.');
              }
            });
          });
        });
      }

    async validUser(username, password) {
        return this.db.all(`SELECT * FROM users WHERE username=${username} AND password=${password}`, 
            (err,rows) => {
                if(err)
                    return false;

                return rows.length > 0 ? true : false;
            }
        )
    }

    async getTeacherClasses() {

    }
}


module.exports = DB;