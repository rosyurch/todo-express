const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const Sequelize = require('sequelize');

const app = express();

const sequelize = new Sequelize('tasks', 'tmp', '1234', { host: 'localhost', dialect: 'mariadb' });

// const connection = mysql.createConnection({ user: 'tmp', password: '1234', database: 'tasks' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('resources'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

const Model = Sequelize.Model;
class Task extends Model {}
Task.init(
    {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        completed: { type: Sequelize.BOOLEAN, defaultValue: false },
        title: { type: Sequelize.TEXT },
    },
    { sequelize, modelName: 'task' }
);

app.get('/tasks', (req, res) => {
    // connection.query(`SELECT * FROM Tasks;`, (err, results, fields) => {
    //     if (err) console.error(err);
    //     res.send(results);
    // });
});

app.post('/tasks/add', (req, res) => {
    const { title, completed } = req.body.task;

    if (req.body.task.title === '') {
        res.status(422)
            .send('Invalid title value')
            .end();
    } else {
        // connection.query(`INSERT INTO Tasks(title, completed) VALUES(?, ?);`, [title, completed], (err, results, fields) => {
        //     if (err) console.error(err);
        //     res.status(200);
        //     res.send({ title, completed, id: results.insertId });
        // });
    }
});

app.delete('/tasks/del/:id', (req, res) => {
    const id = req.params.id;

    // connection.query(`DELETE FROM Tasks WHERE id = ?`, [id], (err, results, fields) => {
    //     if (err) console.error(err);
    //     res.status(200).end();
    // });
});

app.patch('/tasks/edit/:id', (req, res) => {
    const id = req.params.id;

    // connection.query(`UPDATE Tasks SET completed = !completed WHERE id = ?`, [id], (err, results, fields) => {
    //     if (err) console.error(err);
    //     res.status(200).end();
    // });
});

app.listen(9000);
