const tarefaInput = document.querySelector("#tarefa");
const btn = document.querySelector("#btn");
const lista = document.querySelector("#lista");

let tarefas = [];

// Função para renderizar as tarefas na tela a partir do array 'tarefas'.
function renderizarTarefas() {
    lista.innerHTML = '';
    
    tarefas.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('tarefa-item'); // Adiciona uma classe para estilização
        
        // Adiciona a classe 'concluida' se a tarefa já estiver marcada
        if (item.concluida) {
            li.classList.add('concluida');
        }

        li.innerHTML = `
            <i class="fas fa-check-circle check" ></i>
            <span>${item.texto}</span>
            <i class="fa-solid fa-trash-can close" data-index="${index}"></i>
        `;
        lista.appendChild(li);
    });
}

// Função para carregar as tarefas do LocalStorage
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas');
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
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
        tarefas.push({
            texto: textoTarefa,
            concluida: false
        });
        
        salvarTarefas();
        renderizarTarefas();
        tarefaInput.value = "";
    }
});

// Adiciona listener para os eventos de clique na lista
lista.addEventListener("click", function(e) {
    // Lógica para marcar/desmarcar como concluída
    if (e.target.classList.contains("check")) {
        const li = e.target.parentElement;
        const index = Array.from(lista.children).indexOf(li);

        // Altera o estado 'concluida' no array de tarefas
        tarefas[index].concluida = !tarefas[index].concluida;
        li.classList.toggle('concluida');
        salvarTarefas();
    }

    // Lógica para remover a tarefa
    if (e.target.classList.contains("close")) {
        const li = e.target.parentElement;
        const index = Array.from(lista.children).indexOf(li);
        
        tarefas.splice(index, 1);
        salvarTarefas();
        renderizarTarefas();
    }
});

// Inicia o projeto carregando as tarefas
carregarTarefas();
