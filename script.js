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
                location.reload();

            })
            .catch(error => console.log(error));
    } else {
        // Exibe uma mensagem de erro ou destaca o campo de título para o usuário
        alert('Por favor insira um título');
    }


}

function editItem(index) {
    // faz uma solicitação GET para a rota /tasks/:id do servidor
    fetch(`${apiUrl}/${index}`)
        .then(response => response.json())
        .then(data => {

            // atualiza os campos do formulário com os dados do item
            document.getElementById('title').value = data.title;
            document.getElementById('description').value = data.description;
            document.getElementById('priority').value = data.priority;
            document.getElementById('due-date').value = data.dueDate;

            // alterna os botões de adicionar e salvar
            addButton.style.display = 'none';
            saveButton.style.display = 'inline-block';

            // define a função a ser executada quando o botão Salvar for clicado
            saveButton.onclick = () => {
                const updatedItem = {
                    title: document.getElementById('title').value,
                    description: document.getElementById('description').value,
                    priority: document.getElementById('priority').value,
                    dueDate: document.getElementById('due-date').value,
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
                        document.getElementById('title').value = '';
                        document.getElementById('description').value = '';
                        document.getElementById('priority').value = '';
                        document.getElementById('due-date').value = '';
                        // alterna os botões de adicionar e salvar
                        addButton.style.display = 'inline-block';
                        saveButton.style.display = 'none';
                    })
                    .catch(error => console.error(error));
            };
        })
        .catch(error => console.log(error));
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
    <div class="row-header">
        ${checkboxHTML}
        <h2 class="task-title">${item.title}</h2>
        <p class="task-due-date">${item.dueDate}</p>
        <p class="task-priority priority-${item.priority}"></p>
    </div>
    <p class="task-description">${item.description}</p>
    <div class="row-buttons">
    <button class="option-button" id="editButton" onclick="editItem(${index})">
            <img src="src/icon-edit.png">
            <span>Editar</span>
        </button>
        <button class="option-button" id="deleteButton" onclick="deleteItem(${index})">
            <img src="src/icon-delete.png">
            <span>Excluir</span>
        </button>
    </div>
    `;
    listItem.innerHTML = taskHTML;
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