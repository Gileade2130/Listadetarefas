document.addEventListener('DOMContentLoaded', () => {
    const tarefaInput = document.querySelector("#tarefa");
    const dataInput = document.querySelector("#data-input");
    const horarioInput = document.querySelector("#horario-input");
    const btn = document.querySelector("#btn");
    const lista = document.querySelector("#lista");

    let tarefas = [];
    let tarefaSendoEditadaIndex = null;

    // Função para pedir permissão de notificação ao usuário
    function pedirPermissaoNotificacao() {
        if (!("Notification" in window)) {
            console.log("Este navegador não suporta notificações.");
        } else if (Notification.permission === "granted") {
            console.log("Permissão para notificações já concedida.");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Permissão para notificações concedida!");
                }
            });
        }
    }

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

    // Função para checar e exibir as notificações
    function checarNotificacoes() {
        tarefas.forEach(item => {
            if (item.data && item.horario && !item.concluida) {
                const dataTarefa = new Date(`${item.data}T${item.horario}:00`);
                const agora = new Date();
                
                // Converte a data da tarefa e a data atual para minutos para uma comparação mais fácil
                const tempoTarefaEmMinutos = dataTarefa.getFullYear() * 525600 + dataTarefa.getMonth() * 43200 + dataTarefa.getDate() * 1440 + dataTarefa.getHours() * 60 + dataTarefa.getMinutes();
                const tempoAgoraEmMinutos = agora.getFullYear() * 525600 + agora.getMonth() * 43200 + agora.getDate() * 1440 + agora.getHours() * 60 + agora.getMinutes();

                if (tempoTarefaEmMinutos === tempoAgoraEmMinutos) {
                    if (Notification.permission === "granted") {
                        new Notification("Lembrete de Tarefa!", {
                            body: `A tarefa "${item.texto}" está agendada para agora.`,
                            icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233816.png' // Ícone genérico
                        });
                    }
                }
            }
        });
    }

    // Função central para adicionar ou editar uma tarefa
    function adicionarOuEditarTarefa() {
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
    }

    btn.addEventListener("click", adicionarOuEditarTarefa);

    tarefaInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            adicionarOuEditarTarefa();
        }
    });

    dataInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            adicionarOuEditarTarefa();
        }
    });

    horarioInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            adicionarOuEditarTarefa();
        }
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

    // Chama a função de permissão quando a página carrega
    pedirPermissaoNotificacao();

    // Checa as notificações a cada 60 segundos
    setInterval(checarNotificacoes, 60000);

    carregarTarefas();
});
