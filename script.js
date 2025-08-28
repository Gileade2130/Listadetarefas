document.addEventListener('DOMContentLoaded', () => {
    // Declaração de variáveis. Verifique se os IDs no HTML são os mesmos.
    const tarefaInput = document.querySelector("#tarefa");
    const btn = document.querySelector("#btn");
    const lista = document.querySelector("#lista");
    
    const editModal = document.querySelector("#edit-modal");
    const editForm = document.querySelector("#edit-form");
    const editTarefaInput = document.querySelector("#edit-tarefa");
    const editDataInput = document.querySelector("#edit-data");
    const editHorarioInput = document.querySelector("#edit-horario");
    const cancelEditBtn = document.querySelector("#cancel-edit-btn");

    let tarefas = [];
    let tarefaSendoEditadaIndex = null;

    // Função para renderizar as tarefas na tela a partir do array 'tarefas'.
    function renderizarTarefas() {
        lista.innerHTML = '';
        
        tarefas.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('tarefa-item');
            
            if (item.concluida) {
                li.classList.add('concluida');
            }

            const dataHoraTexto = [];
            if (item.data) {
                dataHoraTexto.push(item.data);
            }
            if (item.horario) {
                dataHoraTexto.push(item.horario);
            }
            const dataHoraDisplay = dataHoraTexto.length > 0 ? dataHoraTexto.join(' às ') : '';

            li.innerHTML = `
                <i class="fas fa-check-circle check"></i>
                <div class="task-details">
                    <span>${item.texto}</span>
                    <span class="task-time">${dataHoraDisplay}</span>
                </div>
                <i class="fas fa-edit edit-btn" data-index="${index}"></i>
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
                concluida: false,
                data: "",
                horario: ""
            });
            
            salvarTarefas();
            renderizarTarefas();
            tarefaInput.value = "";
        }
    });

    // Lógica para clique na lista (marcar/remover/editar)
    lista.addEventListener("click", function(e) {
        if (e.target.classList.contains("check")) {
            const li = e.target.parentElement;
            const index = Array.from(lista.children).indexOf(li);

            tarefas[index].concluida = !tarefas[index].concluida;
            li.classList.toggle('concluida');
            salvarTarefas();
        }

        if (e.target.classList.contains("close")) {
            const li = e.target.parentElement;
            const index = Array.from(lista.children).indexOf(li);
            
            tarefas.splice(index, 1);
            salvarTarefas();
            renderizarTarefas();
        }

        if (e.target.classList.contains("edit-btn")) {
            const index = parseInt(e.target.dataset.index);
            tarefaSendoEditadaIndex = index;
            
            editTarefaInput.value = tarefas[index].texto;
            editDataInput.value = tarefas[index].data;
            editHorarioInput.value = tarefas[index].horario;

            editModal.classList.remove('hidden');
        }
    });

    // Lógica do modal de edição
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const novoTexto = editTarefaInput.value.trim();
        const novaData = editDataInput.value;
        const novoHorario = editHorarioInput.value;

        if (novoTexto === "") {
            alert("A tarefa não pode ficar vazia!");
            return;
        }

        tarefas[tarefaSendoEditadaIndex].texto = novoTexto;
        tarefas[tarefaSendoEditadaIndex].data = novaData;
        tarefas[tarefaSendoEditadaIndex].horario = novoHorario;

        salvarTarefas();
        renderizarTarefas();

        editModal.classList.add('hidden');
    });

    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    carregarTarefas();
});
