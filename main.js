// NOVO: Rótulos globais para o histórico (Três períodos)
const periodos = ['1º Trim.', '2º Trim.', '3º Trim.']; 

// Lista de alunos (ATUALIZADA com historicoMedia)
const listaDeAlunos = [
  {
    nome: 'Aluno 1',
    matricula: '0001',
    media: 8.5,
    notas: { 
      'Matemática': 9, 
      'Português': 8, 
      'História': 8.5, 
      'Geografia': 9.5,
      'Inglês': 7.5,
      'Ciências': 8
    },
    frequencia: { faltas: 10, totalAulas: 200 },
    anotacao: '',
    metas: 'Melhorar a nota de Inglês para 8.0.',
    feedback: 'Conversado com o aluno em 10/10 sobre o progresso.',
    alerta: '', 
    classeFoto: 'Aluno1',
    historicoMedia: [8.0, 7.8, 8.5] // NOVO
  },
  {
    nome: 'Aluno 2',
    matricula: '0002',
    media: 7.37, 
    notas: { 
      'Matemática': 7.5, 
      'Português': 8, 
      'História': 8,
      'Geografia': 6.8,
      'Inglês': 9.0,
      'Ciências': 7.3
    },
    frequencia: { faltas: 24, totalAulas: 200 },
    anotacao: 'Parece desatento nas aulas de História.',
    metas: 'Entregar o trabalho de História pendente.',
    feedback: 'Reunião com responsáveis agendada para 15/11.',
    alerta: 'alto numero de faltas!', 
    classeFoto: 'Aluno2',
    historicoMedia: [9.0, 7.5, 7.37] // NOVO
  },
  {
    nome: 'Aluno 3',
    matricula: '0003',
    media: 9.1,
    notas: { 
      'Matemática': 9.5, 
      'Português': 8.8, 
      'História': 9,
      'Geografia': 9.2,
      'Inglês': 9.5,
      'Ciências': 9.8
    },
    frequencia: { faltas: 2, totalAulas: 200 },
    anotacao: 'Excelente participação.',
    metas: 'Manter a média acima de 9.0.',
    feedback: 'Parabenizado pelo desempenho em Ciências.',
    alerta: '',
    classeFoto: 'Aluno3',
    historicoMedia: [8.5, 9.2, 9.1] // NOVO
  },
];


let indiceAtual = 0;

// Seletores de elementos
const nomeAlunoElemento = document.getElementById('studentName');
const matriculaAlunoElemento = document.getElementById('studentID');
const mediaAlunoElemento = document.getElementById('studentAverage');
const listaNotasElemento = document.getElementById('gradesList');
const anotacoesElemento = document.getElementById('notes');
const fotoElemento = document.getElementById('photo');
const mediaBarElemento = document.getElementById('studentAverageBar');
const faltasInputElemento = document.getElementById('studentAbsencesInput');

const metasElemento = document.getElementById('studentGoals');
const feedbackElemento = document.getElementById('studentFeedback');
const alertaElemento = document.getElementById('studentAlert');
// Seletores de input de trimestre
const gradeTrim1Input = document.getElementById('gradeTrim1');
const gradeTrim2Input = document.getElementById('gradeTrim2');
const gradeTrim3Input = document.getElementById('gradeTrim3');
// NOVO: Seletor para o Rank
const rankElemento = document.getElementById('studentRank');

// Variáveis globais para os Gráficos
let radarChart;
let doughnutChart;
let lineChart; 
const radarCtx = document.getElementById('radarChart')?.getContext('2d');
const doughnutCtx = document.getElementById('doughnutChart')?.getContext('2d');
const lineCtx = document.getElementById('lineChart')?.getContext('2d'); // NOVO

// NOVO: Função para calcular e atualizar o ranking de todos os alunos
function calcularRanking() {
    // 1. Clonar a lista e ordenar por média (decrescente)
    const alunosOrdenados = [...listaDeAlunos].sort((a, b) => b.media - a.media);
    
    // 2. Atribuir o rank
    alunosOrdenados.forEach((aluno, index) => {
        aluno.rank = index + 1;
    });
}

// Configurações dos Gráficos 
const radarConfig = {
    type: 'radar',
    data: {
        labels: [], 
        datasets: [{
            label: 'Notas',
            data: [], 
            backgroundColor: 'rgba(100, 255, 218, 0.2)',
            borderColor: '#64ffda',
            pointBackgroundColor: '#64ffda',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#64ffda',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
            r: {
                angleLines: {
                    color: '#495c80'
                },
                grid: {
                    color: '#495c80'
                },
                pointLabels: {
                    color: '#ccd6f6',
                    font: {
                        size: 14 
                    }
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: {
                    backdropColor: '#112240',
                    color: '#a8b2d1',
                    stepSize: 2 
                }
            }
        }
    }
};

const doughnutConfig = {
    type: 'doughnut',
    data: {
        labels: ['Presença (%)', 'Faltas (%)'],
        datasets: [{
            data: [], 
            backgroundColor: [
                '#64ffda', // Ciano para Presença
                '#ff4d4d'  // Vermelho para Faltas
            ],
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#a8b2d1'
                }
            }
        },
        cutout: '80%',
    }
};

// Configurações base do Line Chart
const lineConfig = {
    type: 'line',
    data: {
        labels: periodos,
        datasets: [{
            label: 'Média Geral',
            data: [], // Será preenchido na renderização
            borderColor: '#64ffda', // Ciano
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            borderWidth: 2,
            tension: 0.4, // Suaviza a linha
            pointRadius: 6, // Destaca os pontos
            pointBackgroundColor: '#fff',
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Evolução da Média Geral',
                color: '#ccd6f6',
                font: { size: 16 }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 10,
                ticks: {
                    color: '#a8b2d1',
                    stepSize: 2
                },
                grid: {
                    color: '#1e3c72'
                }
            },
            x: {
                ticks: {
                    color: '#a8b2d1'
                },
                grid: {
                    display: false
                }
            }
        }
    }
};


// Função para inicializar o Chart.js (AGORA INCLUI GRÁFICO DE LINHA)
function inicializarGraficos() {
    if (radarCtx) {
        radarChart = new Chart(radarCtx, radarConfig);
    }
    if (doughnutCtx) { 
        doughnutChart = new Chart(doughnutCtx, doughnutConfig);
    }
    if (lineCtx) { // Inicializa o Gráfico de Linha
        lineChart = new Chart(lineCtx, lineConfig);
    }
}

// Função para atualizar o Gráfico Radar (Sem alterações)
function atualizarGraficoRadar(notas) {
    const labels = Object.keys(notas);
    const data = Object.values(notas);

    if (radarChart) {
        radarChart.data.labels = labels;
        radarChart.data.datasets[0].data = data;
        radarChart.update();
    }
}

// Função para atualizar o Gráfico de Rosca (Sem alterações)
function atualizarGraficoRosca(frequencia) {
    if (doughnutChart) {
        const { faltas, totalAulas } = frequencia;
        const total = Math.max(totalAulas, 1); 
        const percFaltas = (faltas / total) * 100;
        const percPresente = 100 - percFaltas;
        doughnutChart.data.datasets[0].data = [percPresente.toFixed(2), percFaltas.toFixed(2)];
        doughnutChart.update();
    }
}

// Função para atualizar o Gráfico de Linha
function atualizarGraficoLinha(historicoMedia) {
    if (lineChart) {
        lineChart.data.datasets[0].data = historicoMedia;
        lineChart.update();
    }
}


// Função para atualizar a média (Sem alterações)
function atualizarMedia(aluno) {
    let somaDasNotas = 0;
    let quantidadeDeNotas = 0;
    for (let materia in aluno.notas) {
        somaDasNotas += aluno.notas[materia];
        quantidadeDeNotas++;
    }
    const mediaCalculada = Math.min(somaDasNotas / quantidadeDeNotas, 10).toFixed(2);
    aluno.media = mediaCalculada;
    mediaAlunoElemento.textContent = mediaCalculada;

    const mediaPercentual = (mediaCalculada * 10); 
    mediaBarElemento.style.width = mediaPercentual + '%';
    
    // Garante que o ranking seja recalculado se a média principal mudar
    calcularRanking(); 
    rankElemento.textContent = `Rank ${aluno.rank}`;
    
    atualizarGraficoRadar(aluno.notas);
}

// Função para renderizar o aluno atual
function renderizarAluno(indice) {
    
    // Antes de tudo, garante que o ranking está atualizado
    calcularRanking(); 
    
    const aluno = listaDeAlunos[indice];
    
    // O nome é populado aqui (e agora é editável)
    nomeAlunoElemento.textContent = aluno.nome;
    matriculaAlunoElemento.textContent = aluno.matricula;
    listaNotasElemento.innerHTML = ''; 

    // NOVO: Exibe o Rank
    rankElemento.textContent = `Rank ${aluno.rank}`;

    fotoElemento.className = 'photo'; 
    fotoElemento.classList.add(aluno.classeFoto);

    // Atualiza Gráficos
    atualizarGraficoRadar(aluno.notas); 
    atualizarGraficoRosca(aluno.frequencia);
    atualizarGraficoLinha(aluno.historicoMedia); 

    // Popula os inputs de Trimestre
    const [t1, t2, t3] = aluno.historicoMedia;
    // O operador ternário garante que o campo fique vazio se o valor for undefined
    gradeTrim1Input.value = t1 !== undefined ? t1 : '';
    gradeTrim2Input.value = t2 !== undefined ? t2 : '';
    gradeTrim3Input.value = t3 !== undefined ? t3 : '';
    
    // Atualiza input de faltas
    faltasInputElemento.value = aluno.frequencia.faltas;
    faltasInputElemento.max = aluno.frequencia.totalAulas;

    // Recria os inputs de nota
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

        inputNota.addEventListener('change', () => {
            let novoValor = parseFloat(inputNota.value);
            if (novoValor > 10) novoValor = 10;
            if (novoValor < 0) novoValor = 0;
            inputNota.value = novoValor;
            
            aluno.notas[materia] = novoValor;
            atualizarMedia(aluno); 
        });

        itemLista.appendChild(rotuloMateria);
        itemLista.appendChild(inputNota);
        listaNotasElemento.appendChild(itemLista);
    }

    // Popula os novos campos (Anotações, Metas, Feedback, Alerta)
    anotacoesElemento.textContent = aluno.anotacao || '';
    metasElemento.textContent = aluno.metas || '';
    feedbackElemento.textContent = aluno.feedback || '';
    
    // Popula o Alerta
    alertaElemento.textContent = aluno.alerta || ''; 

    // Calcula e exibe a média e a barra
    atualizarMedia(aluno); 
}

// --- Event Listeners para Conteúdo Editável ---

// Função para salvar e atualizar a média de um trimestre
function handleHistoricalGradeChange(inputElement, trimestreIndex) {
    const aluno = listaDeAlunos[indiceAtual];
    let novoValor = parseFloat(inputElement.value);

    // Validação de 0 a 10
    if (novoValor > 10) novoValor = 10;
    if (novoValor < 0) novoValor = 0;
    
    // Atualiza o input (caso tenha sido corrigido)
    inputElement.value = novoValor;

    // Atualiza o array no objeto do aluno
    if (aluno.historicoMedia[trimestreIndex] !== undefined) {
        aluno.historicoMedia[trimestreIndex] = novoValor;
    } else {
        // Se o array tiver menos que 3 posições, adiciona a nota
        aluno.historicoMedia[trimestreIndex] = novoValor;
    }

    // Atualiza o Gráfico de Linha imediatamente
    atualizarGraficoLinha(aluno.historicoMedia);
}

// Adiciona Event Listeners aos inputs de Trimestre
gradeTrim1Input.addEventListener('change', () => handleHistoricalGradeChange(gradeTrim1Input, 0));
gradeTrim2Input.addEventListener('change', () => handleHistoricalGradeChange(gradeTrim2Input, 1));
gradeTrim3Input.addEventListener('change', () => handleHistoricalGradeChange(gradeTrim3Input, 2));


// Event Listeners para Nome do Aluno
nomeAlunoElemento.addEventListener('blur', () => {
    let novoNome = nomeAlunoElemento.textContent.trim();
    if (novoNome) {
        listaDeAlunos[indiceAtual].nome = novoNome;
    } else {
        // Se o nome for apagado, impede que fique vazio
        nomeAlunoElemento.textContent = listaDeAlunos[indiceAtual].nome; 
    }
});
nomeAlunoElemento.addEventListener('keydown', (evento) => {
    // Salva ao pressionar Enter (e previne a quebra de linha)
    if (evento.key === 'Enter') {
        evento.preventDefault();
        nomeAlunoElemento.blur(); 
    }
});

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
        anotacoesElemento.blur(); 
    }
});

// Event Listeners para Alerta
if (!alertaElemento.textContent.trim()) {
    alertaElemento.textContent = '';
}
alertaElemento.addEventListener('blur', () => {
    // Salva o texto do alerta
    if (!alertaElemento.textContent.trim()) {
        alertaElemento.textContent = '';
    }
    listaDeAlunos[indiceAtual].alerta = alertaElemento.textContent.trim();
    
    // Força a re-renderização para que o CSS do alerta seja atualizado
    renderizarAluno(indiceAtual); 
});
alertaElemento.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        alertaElemento.blur(); // Salva e sai do modo edição
    }
});

// Event Listeners para Metas
if (!metasElemento.textContent.trim()) {
    metasElemento.textContent = '';
}
metasElemento.addEventListener('blur', () => {
    if (!metasElemento.textContent.trim()) {
        metasElemento.textContent = '';
    }
    listaDeAlunos[indiceAtual].metas = metasElemento.textContent.trim();
});
metasElemento.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        metasElemento.blur();
    }
});

// Event Listeners para Feedback
if (!feedbackElemento.textContent.trim()) {
    feedbackElemento.textContent = '';
}
feedbackElemento.addEventListener('blur', () => {
    if (!feedbackElemento.textContent.trim()) {
        feedbackElemento.textContent = '';
    }
    listaDeAlunos[indiceAtual].feedback = feedbackElemento.textContent.trim();
});
feedbackElemento.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        feedbackElemento.blur();
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

// Event Listener para o input de FALTAS
faltasInputElemento.addEventListener('change', () => {
    const alunoAtual = listaDeAlunos[indiceAtual];
    let novoNumFaltas = parseInt(faltasInputElemento.value);

    if (novoNumFaltas < 0) {
        novoNumFaltas = 0;
    }
    if (novoNumFaltas > alunoAtual.frequencia.totalAulas) {
        novoNumFaltas = alunoAtual.frequencia.totalAulas;
    }
    
    faltasInputElemento.value = novoNumFaltas;
    alunoAtual.frequencia.faltas = novoNumFaltas;

    atualizarGraficoRosca(alunoAtual.frequencia);
});


// Inicializa o Chart.js e exibe o primeiro aluno
calcularRanking(); // Calcula o ranking na inicialização
inicializarGraficos();
renderizarAluno(indiceAtual);