let docentes = [];
let editIndex = -1;

document.getElementById('btnNovoDocente').addEventListener('click', () => {
    document.getElementById('formContainer').classList.remove('hidden');
    document.getElementById('formTitle').innerText = 'Cadastrar Docente';
    document.getElementById('docenteForm').reset();
    editIndex = -1;
});

document.getElementById('btnCancelar').addEventListener('click', () => {
    document.getElementById('formContainer').classList.add('hidden');
});

document.getElementById('docenteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const matricula = document.getElementById('matricula').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const dataAdmissao = document.getElementById('dataAdmissao').value;
    const situacao = document.getElementById('situacao').value;
    const areaConcurso = document.getElementById('areaConcurso').value;
    const status = document.getElementById;})