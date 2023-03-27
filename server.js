const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid'); // importa o pacote uuid e sua função v4 para gerar UUIDs
const port = 3000;
const app = express();

app.use(cors());
// middleware para análise do corpo da solicitação
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// armazenamento em memória para lista de tarefas
let todoList = [];

// Rota para adicionar um item à lista de tarefas
app.post('/tasks', cors(), (req, res) => {
  const newItem = {
    id: nanoid(), // gera um novo UUID para cada nova tarefa
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    completed: false
  };

  todoList.push(newItem);

  // envia a lista atualizada como resposta
  res.json(todoList);
});

// Rota para obter a lista de tarefas
app.get('/tasks', cors(), (req, res) => {
  // envia a lista como resposta
  res.json(todoList);
});

app.get('/tasks/:id', cors(), (req, res) => {
  const id = req.params.id;
  const item = todoList[id]; 
  // envia o item como resposta
  res.json(item);
});

// Rota para atualizar um item na lista de tarefas
app.put('/tasks/:id', cors(), (req, res) => {
  const id = req.params.id;
  const updatedItem = {
    id: id,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    completed: req.body.completed
  };

  // Encontra o item a ser atualizado na lista de tarefas pelo ID
  const taskIndex = todoList.findIndex((item) => item.id === id);

  // Se o item existir na lista, atualize-o e envie a lista atualizada como resposta
  if (taskIndex !== -1) {
    todoList[taskIndex] = updatedItem;
    res.json(todoList);
  } else {
    // Se o item não existir na lista, envie uma mensagem de erro como resposta
    res.status(404).json({ message: 'Item not found' });
  }
});

// Rota para excluir um item da lista de tarefas
app.delete('/tasks/:id', cors(), (req, res) => {
  const id = req.params.id;
  todoList = todoList.filter(item => item.id !== id);

  // envia a lista atualizada como resposta
  res.json(todoList);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
