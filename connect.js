const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const bodyParser = require('body-parser')

let db = new sqlite3.Database('moviesdatabase.db' , sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the mydatabase SQlite database.');
  });

  const app = express();

  app.set('view engine', 'ejs')

  app.use(bodyParser.urlencoded({
    extended: true
}))  
  

app.get ('/',(req , res) => {

  db.all('SELECT * FROM movies' ,[], (err, rows) => {
    
    res.render("index.ejs",{

      rows:rows
    })
})

})


 
app.get ('/admin',(req , res) => {
  
    db.all('SELECT * FROM movies' ,[], (err, rows) => {
     
      res.render("admin.ejs",{
  
        rows:rows
      })
  })
  
  })

  app.post ('/add',(req , res) => {

const name = req.body.name
const genre = req.body.genre

if(!name){
  res.send('name is required')
  return
}

if(!genre){
  res.send('genre is required')
  return
}
db.run('INSERT INTO movies (name, genre) VALUES (?, ?)', [ name, genre ], function(err) {
  if (err) {
    return res.send(err.message);
  }
  // get the last insert id
  res.redirect('/')
});
      
  })
  
  app.get('/delete/:id', ( req, res ) => {
    const id = req.params.id
    db.run(`DELETE FROM movies WHERE id = ?`, id, function(err) {
      if (err) {
        return res.send(err.message);
      }
      if(this.changes === 0){
        return res.send("I didn't delete anything")
      }
      res.redirect('/')
    });
  })
  

  app.all('/edit/:id', ( req, res ) => {
    const id = req.params.id
    db.get('SELECT * FROM movies WHERE id = ?', id, ( err, movie ) => {
      if(err){
        return res.send(err.message)
      }
      if(!movie){
        return res.send('movie not found')
      }
      res.render('edit.ejs', {
          movie: movie
      })
 
    })
  })


  app.all('/update/:id', ( req, res ) => {
    const id = req.params.id
    const name = req.body.name
    const genre = req.body.genre
    db.run('UPDATE movies SET name = ?, genre = ? WHERE id = ?', [ name, genre, id ], function(err) {
      if (err) {
        return res.send(err.message);
      }
      res.redirect('/admin/')
    });
  })

  app.get('/view/:movietitle',(req,res)=>{
    const id = req.params.movietitle

    db.all('SELECT * FROM movies where id = ?' ,id, (err, rows) => {
     
      res.render("view.ejs",{
        
              rows:rows
            })  })
})

app.listen('3001',()=>{
  console.log('server is listening on port 3000')
})