// Lista de alunos
const listaDeAlunos = [
  {
    nome: 'Aluno 1',
    matricula: '0001',
    media: 8.5,
    notas: { 'Matemática': 9, 'Português': 8, 'História': 8.5 },
    anotacao: '',
    classeFoto: 'Aluno1' 
  },
  {
    nome: 'Aluno 2',
    matricula: '0002',
    media: 7.8,
    notas: { 'Matemática': 7.5, 'Português': 8, 'História': 8 },
    anotacao: '',
    classeFoto: 'Aluno2' 
  },
  {
    nome: 'Aluno 3',
    matricula: '0003',
    media: 9.1,
    notas: { 'Matemática': 9.5, 'Português': 8.8, 'História': 9 },
    anotacao: '',
    classeFoto: 'Aluno3' 
  },
];


let indiceAtual = 0;

// Seletores de elementos
const nomeAlunoElemento = document.getElementById('studentName');
const matriculaAlunoElemento = document.getElementById('studentID');
const mediaAlunoElemento = document.getElementById('studentAverage');
const listaNotasElemento = document.getElementById('gradesList');
const anotacoesElemento = document.getElementById('notes');
const fotoElemento = document.getElementById('photo'); // PEGAR O HEXÁGONO

// Função para atualizar a média automaticamente
function atualizarMedia(aluno) {
    let somaDasNotas = 0;
    let quantidadeDeNotas = 0;
    for (let materia in aluno.notas) {
        somaDasNotas += aluno.notas[materia];
        quantidadeDeNotas++;
    }
    const mediaCalculada = (somaDasNotas / quantidadeDeNotas).toFixed(2);
    aluno.media = mediaCalculada;
    mediaAlunoElemento.textContent = mediaCalculada;
}

// Função para renderizar o aluno atual
function renderizarAluno(indice) {
    const aluno = listaDeAlunos[indice];
    nomeAlunoElemento.textContent = aluno.nome;
    matriculaAlunoElemento.textContent = aluno.matricula;
    mediaAlunoElemento.textContent = aluno.media;
    listaNotasElemento.innerHTML = '';

    // Trocar foto dinamicamente via classe
    fotoElemento.className = 'photo'; // Resetar classe
    fotoElemento.classList.add(aluno.classeFoto); // Adicionar classe específica do aluno

    // Renderizar notas editáveis
    for (let materia in aluno.notas) {
        const itemLista = document.createElement('li');
        const rotuloMateria = document.createElement('span');
        rotuloMateria.textContent = materia;

        const inputNota = document.createElement('input');
        inputNota.type = 'number';
        inputNota.min = 0;
        inputNota.max = 10;
        inputNota.step = 0.1;
        inputNota.value = aluno.notas[materia];
        inputNota.classList.add('grade-input');

        // Atualiza a nota no objeto e recalcula a média
        inputNota.addEventListener('change', () => {
            aluno.notas[materia] = parseFloat(inputNota.value);
            atualizarMedia(aluno);
        });

        itemLista.appendChild(rotuloMateria);
        itemLista.appendChild(inputNota);
        listaNotasElemento.appendChild(itemLista);
    }

    // Atualiza anotação
    anotacoesElemento.textContent = aluno.anotacao || '';
}

// Placeholder funcional para as anotações
if (!anotacoesElemento.textContent.trim()) {
    anotacoesElemento.textContent = '';
}

// Salva anotação ao sair do campo
anotacoesElemento.addEventListener('blur', () => {
    if (!anotacoesElemento.textContent.trim()) {
        anotacoesElemento.textContent = '';
    }
    listaDeAlunos[indiceAtual].anotacao = anotacoesElemento.textContent.trim();
});

// Salva anotação ao pressionar Enter
anotacoesElemento.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        anotacoesElemento.blur(); // Sai do modo edição e salva
    }
});

// Botões de navegação
document.getElementById('prev').addEventListener('click', () => {
    indiceAtual = (indiceAtual - 1 + listaDeAlunos.length) % listaDeAlunos.length;
    renderizarAluno(indiceAtual);
});

document.getElementById('next').addEventListener('click', () => {
    indiceAtual = (indiceAtual + 1) % listaDeAlunos.length;
    renderizarAluno(indiceAtual);
});

// Inicializa exibindo o primeiro aluno
renderizarAluno(indiceAtual);
