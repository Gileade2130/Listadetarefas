document.addEventListener('DOMContentLoaded', () => {
    const tarefaInput = document.querySelector("#tarefa");
    const dataInput = document.querySelector("#data-input");
    const horarioInput = document.querySelector("#horario-input");
    const btn = document.querySelector("#btn");
    const lista = document.querySelector("#lista");

    let tarefas = [];
    let tarefaSendoEditadaIndex = null;

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

    function carregarTarefas() {
        const tarefasSalvas = localStorage.getItem('minhasTarefas');
        if (tarefasSalvas) {
            tarefas = JSON.parse(tarefasSalvas);
        }
        renderizarTarefas();
    }

    function salvarTarefas() {
        localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
    }

    btn.addEventListener("click", function() {
        const textoTarefa = tarefaInput.value.trim();
        const dataTarefa = dataInput.value;
        const horarioTarefa = horarioInput.value;

        if (textoTarefa === "") {
            alert("Digite uma tarefa válida!");
            return;
        }

        if (tarefaSendoEditadaIndex !== null) {
            tarefas[tarefaSendoEditadaIndex].texto = textoTarefa;
            tarefas[tarefaSendoEditadaIndex].data = dataTarefa;
            tarefas[tarefaSendoEditadaIndex].horario = horarioTarefa;
            tarefaSendoEditadaIndex = null;
        } else {
            tarefas.push({
                texto: textoTarefa,
                concluida: false,
                data: dataTarefa,
                horario: horarioTarefa
            });
        }
        
        salvarTarefas();
        renderizarTarefas();
        tarefaInput.value = "";
        dataInput.value = "";
        horarioInput.value = "";
    });

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
            
            tarefaInput.value = tarefas[index].texto;
            dataInput.value = tarefas[index].data;
            horarioInput.value = tarefas[index].horario;
        }
    });

    carregarTarefas();
});
