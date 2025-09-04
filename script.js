document.addEventListener('DOMContentLoaded', () => {
    const tarefaInput = document.querySelector("#tarefa");
    const observacaoInput = document.querySelector("#observacao-input");
    const dataInput = document.querySelector("#data-input");
    const horarioInput = document.querySelector("#horario-input");
    const btn = document.querySelector("#btn");
    const lista = document.querySelector("#lista");

    let tarefas = [];

    async function carregarTarefas() {
        const response = await fetch('http://localhost:3000/tarefas');
        tarefas = await response.json();
        renderizarTarefas();
    }

    async function adicionarTarefa(tarefa) {
        await fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarefa),
        });
        carregarTarefas();
    }

    async function removerTarefa(id) {
        await fetch(`http://
