const list = document.getElementById('list');
const addButton = document.getElementById('add-button');
const saveButton = document.getElementById('save-button');

const apiUrl = 'http://localhost:3000/tasks';

// função para adicionar um item à lista de tarefas
function addItem() {
    const titleInput = document.getElementById('title').value;
    const descriptionInput = document.getElementById('description').value;
    const priorityInput = document.getElementById('priority').value;
    const dueDateInput = document.getElementById('due-date').value;

    if (titleInput.trim() !== '') {
        const newItem = {
            title: titleInput,
            description: descriptionInput,
            priority: priorityInput,
            dueDate: dueDateInput,
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
                document.getElementById('title').value = '';
                document.getElementById('description').value = '';
                document.getElementById('priority').value = '';
                document.getElementById('due-date').value = '';
            })
            .catch(error => console.log(error));
    } else {
        // Exibe uma mensagem de erro ou destaca o campo de título para o usuário
        alert('Por favor insira um título');
    }


}

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

    const itemId = JSON.parse(localStorage.getItem(`todoItem-${index}`)).id;

    // faz uma solicitação PUT para a rota /tasks/:id do servidor
    fetch(`${apiUrl}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
        .then(response => response.json())
        .then(data => {
            // atualiza o item no localStorage
            localStorage.setItem(`todoItem-${index}`, JSON.stringify(data));
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
        .catch(error => console.error(error));
}


function editItem(index) {
    const item = JSON.parse(localStorage.getItem(`todoItem-${index}`));
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description;
    document.getElementById('priority').value = item.priority;
    document.getElementById('due-date').value = item.dueDate;

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
    const checkboxHTML = `
    <input class="task-checkboxas priority-${item.priority}" type="checkbox" onchange="localStorage.setItem('todoItem-${index}-checked', this.checked)" ${localStorage.getItem(`todoItem-${index}-checked`) === 'true' ? 'checked' : ''}>
    `;

    const taskHTML = `
    <div class="div-js">
        ${checkboxHTML}
        <h2 class="task-title">${item.title}</h2>
        <p class="task-due-date">${item.dueDate}</p>
        <p class="task-priority priority-${item.priority}"></p>
    </div>
    <p class="task-description">${item.description}</p>
    <div class="div-js">
        <button class="option-button" id="editButton" onclick="editItem(${index})">
            <img src="img/icon-edit.png">
            <span>Editar</span>
        </button>
        <button class="option-button" id="deleteButton" onclick="deleteItem(${index})">
            <img src="img/icon-delete.png">
            <span>Deletar</span>
        </button>
    </div>
    `;

    const liHTML = `<li>${taskHTML}</li>`;

    listItem.innerHTML += liHTML;

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

// adiciona um evento de clique ao botão "Adicionar" para chamar a função addItem()
addButton.addEventListener('click', addItem);

// adiciona um evento de clique ao botão "Salvar" para chamar a função updateItem()
saveButton.addEventListener('click', () => {
    const index = document.getElementById('index').value;
    updateItem(index);
});


// renderiza a lista de tarefas ao carregar a página
window.onload = renderList;