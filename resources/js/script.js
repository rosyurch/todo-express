const taskList = document.querySelector('#task-list');
const addBtn = document.querySelector('#add-btn');
const input = document.querySelector('#input');

fetch('/tasks')
    .then(res => res.json())
    .then(res => {
        res.forEach(task => {
            taskList.appendChild(createTask(task));
        });
    });

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', e => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        addTask();
    }
});

function addTask(e) {
    try {
        fetch('/tasks/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: { title: input.value, completed: false } }),
        })
            .then(res => {
                if (res.status !== 200) throw new Error('Adding failed');
                return res.json();
            })
            .then(res => {
                taskList.appendChild(createTask(res));
            });
    } catch (err) {
        console.error(err);
    }
}

function deleteHandler(event) {
    const id = event.target.parentElement.getAttribute('data-id');
    fetch(`/tasks/del/${id}`, { method: 'DELETE' });
    event.target.parentElement.parentElement.removeChild(event.target.parentElement);
}

function toggleHandler(event) {
    if (event.target === document.querySelector(`li[data-id="${event.target.getAttribute('data-id')}"]`)) {
        event.target.firstElementChild.innerText = event.target.firstElementChild.innerText === 'Done' ? '...' : 'Done';

        fetch(`/tasks/edit/${event.target.getAttribute('data-id')}`, { method: 'PATCH' });
    } else if (event.target.parentElement === document.querySelector(`li[data-id="${event.target.parentElement.getAttribute('data-id')}"]`)) {
        event.target.innerText = event.target.innerText === 'Done' ? '...' : 'Done';
        fetch(`/tasks/edit/${event.target.parentElement.getAttribute('data-id')}`, { method: 'PATCH' });
    }
}

function createTask(task) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');

    span.appendChild(document.createTextNode(task.completed ? 'Done' : '...'));
    span.setAttribute('class', 'task-completed');

    button.appendChild(document.createTextNode('Delete'));
    button.addEventListener('click', deleteHandler);

    li.setAttribute('data-id', task.id);
    li.appendChild(span);
    li.appendChild(document.createTextNode(task.title));
    li.appendChild(button);
    li.addEventListener('click', toggleHandler);

    return li;
}
