const list = document.getElementById('list');
const addButton = document.getElementById('add-button');
const saveButton = document.getElementById('save-button');
const apiUrl = 'http://localhost:3000/tasks';

// função para criar um elemento de lista
function createListItem(item, index) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <div class="task-item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p>${item.priority}</p>
      <p>${item.dueDate}</p>
      <div class="button-group">
        <button class="edit-button" onclick="editItem(${index})">Editar</button>
        <button class="delete-button" onclick="deleteItem(${index})">Excluir</button>
      </div>
    </div>
  `;
    return listItem;
}

// função para renderizar a lista de tarefas
function renderList() {
    // limpa a lista existente
    list.innerHTML = '';


    // faz uma solicitação GET para a rota /tasks do servidor
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // cria um elemento de lista para cada item na lista de tarefas
            data.forEach((item, index) => {
                const listItem = createListItem(item, index);
                list.appendChild(listItem);
            });
        })
        .catch(error => console.log(error));
}

// função para adicionar um item à lista de tarefas
function addItem() {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priorityInput = document.getElementById('priority');
    const dueDateInput = document.getElementById('due-date');

    const newItem = {
        title: titleInput.value,
        description: descriptionInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
    };

    // faz uma solicitação POST para a rota /tasks do servidor
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    })
        .then(response => response.json())
        .then(data => {
            // atualiza a lista de tarefas
            renderList();
            // limpa os campos do formulário
            titleInput.value = '';
            descriptionInput.value = '';
            priorityInput.value = '';
            dueDateInput.value = '';
        })
        .catch(error => console.log(error));
}

// função para atualizar um item na lista de tarefas
function updateItem(index) {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priorityInput = document.getElementById('priority');
    const dueDateInput = document.getElementById('due-date');

    const updatedItem = {
        title: titleInput.value,
        description: descriptionInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
    };

    // faz uma solicitação PUT para a rota /tasks/:id do servidor
    fetch(`${apiUrl}/${index}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
        .then(response => response.json())
        .then(data => {
            // atualiza a lista de tarefas
            renderList();
            // limpa os campos do formulário
            titleInput.value = '';
            descriptionInput.value = '';
            priorityInput.value = '';
            dueDateInput.value = '';
            // alterna os botões entre adicionar e salvar
            addButton.style.display = 'inline-block';
            saveButton.style.display = 'none';
        })
        .catch(error => console.log(error));
}

// função para editar um item na lista de tarefas
function editItem(index) {
    const item = todoList[index];
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priorityInput = document.getElementById('priority');
    const dueDateInput = document.getElementById('due-date');

    // preenche os campos do formulário com os dados do item selecionado
    titleInput.value = item.title;
    descriptionInput.value = item.description;
    priorityInput.value = item.priority;
    dueDateInput.value = item.dueDate;

    // alterna os botões entre adicionar e salvar
    addButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
    saveButton.onclick = () => updateItem(index);
}

// função para excluir um item da lista de tarefas
function deleteItem(index) {
    // faz uma solicitação DELETE para a rota /tasks/:id do servidor
    fetch(`${apiUrl}/${index}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            // atualiza a lista de tarefas
            renderList();
        })
        .catch(error => console.log(error));
}

// função para criar um elemento de lista para um item na lista de tarefas
function createListItem(item, index) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    
    <div class="item-header">
    <h3>${item.title}</h3>
    <div class="buttons">
    <button class="edit-button" onclick="editItem(${index})">Editar</button>
    <button class="delete-button" onclick="deleteItem(${index})">Excluir</button>
    </div>
    </div>
    <p>${item.description}</p>
    <div class="item-footer">
    <span class="priority">${item.priority}</span>
    <span class="due-date">${item.dueDate}</span>
    </div>
    `;
    return listItem;
}
// função para renderizar a lista de tarefas
function renderList() {
    // limpa a lista existente
    list.innerHTML = '';
    // faz uma solicitação GET para a rota /tasks do servidor
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // cria um elemento de lista para cada item na lista de tarefas
            data.forEach((item, index) => {
                const listItem = createListItem(item, index);
                list.appendChild(listItem);
            });
        })
        .catch(error => console.log(error));
}

// renderiza a lista de tarefas ao carregar a página
window.onload = renderList;