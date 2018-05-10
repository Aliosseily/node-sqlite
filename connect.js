const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('moviesdatabase.db' , sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the mydatabase SQlite database.');
  });


  db.all('SELECT * FROM movies' ,[], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.id +"\t"+ row.name +"\t"+ row.genre);
    });
  });


  db.run(`INSERT INTO movies(id,name,genre) VALUES(9,'movie','action')`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with id ${this.lastID}`);
  });


  db.run('UPDATE movies set name="kingsman",genre="action" where id = 7', function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
   
  });


  db.run(`DELETE FROM movies WHERE id=6`, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted ${this.changes}`);
  });

 

  	
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the mydatabase connection.');
  });