const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

// const findMaxId = require('./helpers/findMaxId');
// const writeToJsonFile = require('./helpers/writeToJsonFile');

const app = express();

const connection = mysql.createConnection({ user: 'tmp', password: '1234', database: 'tasks' });

// let tasks = [];
fs.readFile('data.json', (err, data) => {
    if (err) console.error(err);
    tasks = JSON.parse(data.toString());
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('resources'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', (req, res) => {
    connection.query(`SELECT * FROM tasks;`, (err, results, fields) => {
        if (err) console.error(err);
        res.send(results);
    });

    // res.sendFile(path.join(__dirname, 'data.json'));
});

app.post('/tasks/add', (req, res) => {
    // const id = findMaxId(tasks) + 1;
    const { title, completed } = req.body.task;

    if (req.body.task.title === '') {
        res.status(422)
            .send('Invalid title value')
            .end();
    } else {
        // const taskToBeAdded = { ...req.body.task, id };
        // const updatedTasks = [...tasks, taskToBeAdded];
        // writeToJsonFile('data.json', updatedTasks);

        // res.status(200);
        // res.send(taskToBeAdded);

        connection.query(`INSERT INTO tasks(title, completed) VALUES(?, ?);`, [title, completed], (err, results, fields) => {
            if (err) console.error(err);
            res.status(200);
            res.send({ title, completed, id: results.insertId });
        });
    }
});

app.delete('/tasks/del/:id', (req, res) => {
    const id = req.params.id;

    // const tasksWithoutOne = tasks.filter(t => t.id !== Number(id));
    // writeToJsonFile('data.json', tasksWithoutOne);

    // res.status(200).end();

    connection.query(`DELETE FROM tasks WHERE id = ?`, [id], (err, results, fields) => {
        if (err) console.error(err);
        res.status(200).end();
    });
});

app.patch('/tasks/edit/:id', (req, res) => {
    const id = req.params.id;
    // const taskToChange = tasks.filter(t => t.id === Number(id))[0];

    // const toggledCompletion = [
    //     ...tasks.slice(0, tasks.indexOf(taskToChange)),
    //     { ...taskToChange, completed: !taskToChange.completed },
    //     ...tasks.slice(tasks.indexOf(taskToChange) + 1),
    // ];
    // writeToJsonFile('data.json', toggledCompletion);

    // res.status(200).end();

    connection.query(`UPDATE tasks SET completed = !completed WHERE id = ?`, [id], (err, results, fields) => {
        if (err) console.error(err);
        res.status(200).end();
    });
});

app.listen(9000);
