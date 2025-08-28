// --- SELEÇÃO DOS ELEMENTOS DO DOM ---
const todasAsCelulas = document.querySelectorAll('[data-celula]');
const tabuleiro = document.getElementById('tabuleiro'); // Seleciona o elemento do tabuleiro
const textoMensagem = document.querySelector('[data-mensagem-texto]');
const botaoReiniciar = document.getElementById('botaoReiniciar');

// --- VARIÁVEIS DO JOGO ---
const CLASSE_X = 'x';
const CLASSE_O = 'o';
let turnoDoO; // Se for true, é a vez do 'O', senão, é a vez do 'X'

// --- COMBINAÇÕES DE VITÓRIA ---
const COMBINACOES_VENCEDORAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

// --- FUNÇÕES PRINCIPAIS ---

// Função para iniciar ou reiniciar o jogo
function iniciarJogo() {
    turnoDoO = false; // Começa com o jogador X
    
    // CORREÇÃO: Remove a classe que desativa o tabuleiro
    tabuleiro.classList.remove('fim-de-jogo'); 

    todasAsCelulas.forEach(celula => {
        // Limpa o tabuleiro para um novo jogo
        celula.classList.remove(CLASSE_X);
        celula.classList.remove(CLASSE_O);
        celula.textContent = ''; // Limpa o "X" ou "O" visualmente
        // Garante que o evento de clique antigo seja removido antes de adicionar um novo
        celula.removeEventListener('click', cliqueNaCelula);
        // Adiciona o evento de clique que só pode ser acionado uma vez por célula
        celula.addEventListener('click', cliqueNaCelula, { once: true });
    });
    
    atualizarMensagemStatus();
}

// Função executada ao clicar em uma célula
function cliqueNaCelula(evento) {
    const celula = evento.target;
    const classeAtual = turnoDoO ? CLASSE_O : CLASSE_X;
    
    // 1. Colocar a marca (X ou O) na célula clicada
    marcarCelula(celula, classeAtual);

    // 2. Verificar se o movimento resultou em vitória
    if (verificarVitoria(classeAtual)) {
        finalizarJogo(false); // false indica que não foi empate
    } 
    // 3. Se não houve vitória, verificar se resultou em empate
    else if (verificarEmpate()) {
        finalizarJogo(true); // true indica que foi empate
    } 
    // 4. Se o jogo continua, trocar o turno
    else {
        trocarTurno();
        atualizarMensagemStatus();
    }
}

// Função para finalizar o jogo
function finalizarJogo(empate) {
    if (empate) {
        textoMensagem.innerText = 'Deu velha! (Empate)';
    } else {
        textoMensagem.innerText = `O jogador '${turnoDoO ? "O" : "X"}' venceu!`;
    }
    
    // CORREÇÃO: Adiciona uma classe ao tabuleiro para desativar os cliques via CSS
    tabuleiro.classList.add('fim-de-jogo');
}

// Função para colocar a marca 'X' ou 'O' na célula
function marcarCelula(celula, classeParaAdicionar) {
    celula.classList.add(classeParaAdicionar);
    celula.textContent = classeParaAdicionar.toUpperCase();
}

// Função para trocar o turno do jogador
function trocarTurno() {
    turnoDoO = !turnoDoO;
}

// Função para atualizar a mensagem de status (de quem é a vez)
function atualizarMensagemStatus() {
    textoMensagem.innerText = `É a vez do jogador '${turnoDoO ? "O" : "X"}'`;
}

// Função para verificar se o jogador atual venceu
function verificarVitoria(classeAtual) {
    return COMBINACOES_VENCEDORAS.some(combinacao => {
        return combinacao.every(indice => {
            return todasAsCelulas[indice].classList.contains(classeAtual);
        });
    });
}

// Função para verificar se o jogo empatou
function verificarEmpate() {
    // Se todas as células estiverem preenchidas (com X ou O), é um empate
    return [...todasAsCelulas].every(celula => {
        return celula.classList.contains(CLASSE_X) || celula.classList.contains(CLASSE_O);
    });
}

// --- EVENT LISTENERS ---
botaoReiniciar.addEventListener('click', iniciarJogo);

// --- INÍCIO DO JOGO ---
// A primeira chamada para preparar o tabuleiro
iniciarJogo();