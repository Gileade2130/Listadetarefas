const tarefaInput = document.querySelector("#tarefa");
const btn = document.querySelector("#btn");
const lista = document.querySelector("#lista");

// Array para armazenar as tarefas. Começamos com um array vazio.
let tarefas = [];

// Função para renderizar as tarefas na tela a partir do array 'tarefas'.
function renderizarTarefas() {
    // Limpa a lista atual no HTML para evitar duplicatas.
    lista.innerHTML = '';
    
    tarefas.forEach((item, index) => {
        // Cria um novo elemento <li>
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-check-circle check" style="color: ${item.concluida ? '#349223' : ''};"></i>
            <span style="text-decoration: ${item.concluida ? 'line-through' : ''};">${item.texto}</span>
            <i class="fa-solid fa-trash-can close" data-index="${index}"></i>
        `;
        lista.appendChild(li);
    });

    // Adiciona os event listeners para os botões de exclusão
    adicionarEventListeners();
}

// Função para adicionar os listeners de click para os botões de exclusão
function adicionarEventListeners() {
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            // Remove a tarefa do array usando o índice no data-index
            const index = e.target.getAttribute('data-index');
            tarefas.splice(index, 1);
            
            // Salva a lista atualizada e renderiza novamente
            salvarTarefas();
            renderizarTarefas();
        });
    });

    // Adiciona o listener para marcar como concluída
    lista.addEventListener("click", function(e) {
        if (e.target.classList.contains("check")) {
            const index = e.target.parentElement.querySelector('.close').getAttribute('data-index');
            tarefas[index].concluida = !tarefas[index].concluida;
            salvarTarefas();
            renderizarTarefas();
        }
    }, { once: true }); // O { once: true } garante que o listener seja adicionado apenas uma vez.
}

// Função para carregar as tarefas do LocalStorage
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas');
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
    // Renderiza as tarefas assim que a página carregar
    renderizarTarefas();
}

// Função para salvar as tarefas no LocalStorage
function salvarTarefas() {
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

// Adiciona nova tarefa
btn.addEventListener("click", function() {
    const textoTarefa = tarefaInput.value.trim();
    if (textoTarefa === "") {
        alert("Digite uma tarefa válida!");
    } else {
        // Adiciona a nova tarefa como um objeto ao array 'tarefas'
        tarefas.push({
            texto: textoTarefa,
            concluida: false
        });
        
        // Salva a lista no LocalStorage e renderiza na tela
        salvarTarefas();
        renderizarTarefas();
        tarefaInput.value = ""; // Limpa o campo de input
    }
});

// Chama a função para carregar as tarefas quando a página é carregada
carregarTarefas();
