//Importamos las librarías requeridas
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

//Documentación en https://expressjs.com/en/starter/hello-world.html
const app = express()

//Creamos un parser de tipo application/json
//Documentación en https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json()


// Abre la base de datos de SQLite
let db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');

    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Tabla tareas creada o ya existente.');
        }
    });
});
const borrarTabla = async () => {
  const db = await open({
    filename: "base.sqlite3",
    driver: sqlite3.Database
  });
  await db.exec("DROP TABLE IF EXISTS todos;");
  console.log("Tabla 'todos' eliminada correctamente");
};

borrarTabla();

//Creamos un endpoint de login que recibe los datos como json
app.post('/insert', jsonParser, function (req, res) {
    //Imprimimos el contenido del campo todo
    const { todo } = req.body;
   
    console.log(todo);
    res.setHeader('Content-Type', 'application/json');
    

    if (!todo) {
        res.status(400).send('Falta información necesaria');
        return;
    }
    const stmt  =  db.prepare('INSERT INTO todos (todo, created_at) VALUES (?, CURRENT_TIMESTAMP)');

    stmt.run(todo, (err) => {
        if (err) {
          console.error("Error running stmt:", err);
          res.status(500).send(err);
          return;

        } else {
          console.log("Insert was successful!");
        }
    });

    stmt.finalize();
    
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send();
})



app.get('/', function (req, res) {
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok2' }));
})


//Creamos un endpoint de login que recibe los datos como json
app.post('/login', jsonParser, function (req, res) {
    //Imprimimos el contenido del body
    console.log(req.body);

    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok' }));
})

app.post('/agrega_todo',jsonParser, function (req,res){

const{todo}=req.body;

if (!todo) {
    return res.status(400).json({ error: 'Falta el campo todo' });
  }

  const query = `INSERT INTO todos (todo) VALUES (?)`;

  db.run(query, [todo], function(err) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
  res.status(201).json({
    status: 201,
    mensaje: 'Tarea agregada correctamente',
    data: {id: this.lastID,
    todo,
    created_at: new Date().toISOString()
    }
  });
});
});

app.get('/ver_todo', function (req, res) {

    const query = `SELECT * FROM todos`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({
            status: 200,
            mensaje: 'Funciona correctamente',
            data: rows
        });
    }
);
});

//Corremos el servidor en el puerto 3000
const port = 3000;

app.listen(port, () => {
    console.log(`Aplicación corriendo en http://localhost:${port}`)
})
