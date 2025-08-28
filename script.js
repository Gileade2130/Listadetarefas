// Lógica para clique na lista (marcar/remover/editar)
    lista.addEventListener("click", function(e) {
        // Lógica para marcar/desmarcar como concluída
        if (e.target.classList.contains("check")) {
            const li = e.target.parentElement;
            const index = Array.from(lista.children).indexOf(li);

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

        // Lógica para editar a tarefa
        if (e.target.classList.contains("edit-btn")) {
            const index = parseInt(e.target.dataset.index);
            tarefaSendoEditadaIndex = index;
            
            // Popula o formulário com os dados da tarefa selecionada
            editTarefaInput.value = tarefas[index].texto;
            editDataInput.value = tarefas[index].data;
            editHorarioInput.value = tarefas[index].horario;

            // Mostra o modal de edição
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

        // Esconde o modal
        editModal.classList.add('hidden');
    });

    cancelEditBtn.addEventListener('click', () => {
        // Esconde o modal sem salvar as alterações
        editModal.classList.add('hidden');
    });

    carregarTarefas();
});
