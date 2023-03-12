const express = require('express');
const app = express();
const port = 3000;

// middleware para análise do corpo da solicitação
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// armazenamento em memória para lista de tarefas
let todoList = [];

// Rota para adicionar um item à lista de tarefas
app.post('/tasks', (req, res) => {
  const newItem = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
  };

  todoList.push(newItem);

  // envia a lista atualizada como resposta
  res.json(todoList);
});

// Rota para obter a lista de tarefas
app.get('/tasks', (req, res) => {
  // envia a lista como resposta
  res.json(todoList);
});

// Rota para atualizar um item na lista de tarefas
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const updatedItem = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
  };

  todoList[id] = updatedItem;

  // envia a lista atualizada como resposta
  res.json(todoList);
});

// Rota para excluir um item da lista de tarefas
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  todoList.splice(id, 1);

  // envia a lista atualizada como resposta
  res.json(todoList);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
