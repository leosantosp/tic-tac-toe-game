/* Vamos pegar as regiões do tabuleiro */
const boardRegions = document.querySelectorAll('#gameBoard span');

// Criar um tabuleiro virtual
/* Vamos utilizá-lo para gerenciar ao tabuleiro real e fazer as verificações
se o jogador ganhou ou não */
let vBoard = [];

// TurnPlayer -> Jogador da Vez
let turnPlayer = '';

// Ela vai servir para mostrar o jogador da vez
function updateTitle(){
    // vou pegar um elemento pelo id que é o 'turnPlayer' ou seja, pegar qual é o jogador da vez
    const playerInput = document.getElementById(turnPlayer);
    /*E agora eu vou pegar lá no HTML, o span que mostra o nome do jogador da vez
    e vou dizer que o texto dentro dele, será o playerInput.value, ou seja, o jogador da vez */
    document.getElementById('turnPlayer').innerText = playerInput.value;

}

/* Ela vai ter a função de inicializar o game, não necessariamente INICIAR o game,
Mas ela será para preparar o jogo para iniciar */
function initializeGame(){
    /* Atribuir um array bi-dimensional com varias strings, ele vai mostrar a situação do tabuleiro no console
    e mais pra frente definir como um jogador venceu
    */
    vBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]

    turnPlayer = 'player1';

    /* Quando o jogo terminar, eu vou modificar o HTML dentro dele para mostrar
       a mensagem de vencedor e assim que o jogo recomeçar, ele vai setar este valor
       inicial.  
        
    */
    document.querySelector('h2').innerHTML = 'Vez de: <span id="turnPlayer"></span>';
    
    /* Depois que eu resetei o title, eu chamo a função updateTitle() que vai passar o turnPlayer
    que inicialmente será o player1 */
    updateTitle();


    /*
        o forEach servirá para passarmos pelos 'spans' do tabuleiro, nisto
        pegaremos qualquer 'span' que tiver a classe 'win' e removê-lo
        também setaremos para que o valor padrão fique como vazio '', assim caso tenha
        qualquer elemento 'X' ou 'O', ele ficará vazio.
        E vamos adicionar um evento de click que chamará o resultado da função handleBoardClick

        Como o botão inicializar servirá não só para iniciar o game, mas também para resetá-lo. 
        Nós adicionamos este forEach. 
    */
    boardRegions.forEach(function(element){
        element.classList.remove('win');
        element.innerText = '';
        element.classList.add('cursor-pointer');
        element.addEventListener('click', handleBoardClick);
    });

}
/* Criar a função getWinRegions */
function getWinRegions(){
    /* Essa função getWinRegios servirá para verificar se ele venceu 
    baseado no estado atual do nosso tabuleiro */
    const winRegions = []; // Se o jogador não estiver vencido, ele permanecerá vazio

    /* Estes três primeiros ifs verificam as linhas, se todas elas estiverem com o mesmo valor, 
        Este valor, irá para dentro da const winRegions
    */

    if (vBoard[0][0] && vBoard[0][0] === vBoard[0][1] && vBoard[0][0] === vBoard[0][2])
        winRegions.push("0.0", "0.1", "0.2");
    if (vBoard[1][0] && vBoard[1][0] === vBoard[1][1] && vBoard[1][0] === vBoard[1][2])
        winRegions.push("1.0", "1.1", "1.2");
    if (vBoard[2][0] && vBoard[2][0] === vBoard[2][1] && vBoard[2][0] === vBoard[2][2])
        winRegions.push("2.0", "2.1", "2.2");
    
    // Verificando as colunas
    if (vBoard[0][0] && vBoard[0][0] === vBoard[1][0] && vBoard[0][0] === vBoard[2][0])
        winRegions.push("0.0", "1.0", "2.0");
    if (vBoard[0][1] && vBoard[0][1] === vBoard[1][1] && vBoard[0][1] === vBoard[2][1])
        winRegions.push("0.1", "1.1", "2.1");
    if (vBoard[0][2] && vBoard[0][2] === vBoard[1][2] && vBoard[0][2] === vBoard[2][2])
        winRegions.push("0.2", "1.2", "2.2");
    
    // Verificando as diagonais
    if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2])
        winRegions.push("0.0", "1.1", "2.2");
    if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0])
        winRegions.push("0.2", "1.1", "2.0");
    
    return winRegions; // Retorne a variável

}


/* Definir uma função para que ao clicar na região, a região fique desabilitada */
function disableRegion(element){
    element.classList.remove('cursor-pointer'); // Mudo o tipo de cursor para 'default'
    element.removeEventListener('click', handleBoardClick); // Removo o evento de click e sua função
}

/* 
    HandleWin será uma função para 'tratar' quando houver uma vitória. 
    A handleWin precisa receber um parâmetro, este parâmetro será a variável que
    contém as regiões clicadas que levaram a vitória, no caso, a variável winRegions
*/
function handleWin(regions){
    /* 
        Faremos uma forEach pelas regiões de vitória, afinal a variável winRegions é
        um array, então, pegaremos o valor de cada região
    */
    regions.forEach(function(region){
        /* Quando ele pegar uma das regiões, ele selecionará o elemento que possui 
        o atributo 'data-region' igual a região que está sendo passada no momento
        e então ele adicionará uma classe neste elemento chamada 'win'
        */
        document.querySelector('[data-region="' + region + '"]').classList.add('win');
    })

    // Depois, pegaremos o valor que está dentro do turnPlayer, no caso, o nome
    const playerName = document.getElementById(turnPlayer).value;
    // Depois, alteraremos o valor do nosso h2 e colocarmos o nome do jogador que venceu
    document.querySelector('h2').innerHTML = playerName + ' VENCEU!';

    // Desabilito todos as funções de click impedindo que o jogo continue
    boardRegions.forEach(function(element){
        element.classList.remove('cursor-pointer');
        element.removeEventListener('click', handleBoardClick);
    });
}

/*
 Agora, vamos criar a função handleBoardClick, ela servirá para atribuirmos
o valor 'X' ou 'O' para a região clicada. 

Nós passamos o 'ev' como parâmetro, pois
sabemos que a função de click está atribuída a vários 'spans' então, passando o 'ev'
que é o click do evento, estamos atribuindo ao elemento clicado. 
*/
function handleBoardClick(ev){
    // Obter a região clicada
    const span = ev.currentTarget;
    /* 
        Quem é o 'currentTarget' do nosso evento? O span clicado
        O que eu preciso pegar de informação? É o data-region dele, então dataset.region
    */
    const region = span.dataset.region; // valor obtido 'N.N'
    /* 
        split -> Divide uma string transformando em um array.
        Então conseguimos escolher um caractere da string e sempre que ele acontecer, ele
        quebra a string em um elemento de array, no nosso caso, queremos pegar o '.' do 'N.N' 
    */
    const rowColumnPair = region.split('.');
    /* 
        Agora que tenho isso separado em posições de array, sabemos que teremos duas
        posições de array, afinal nosso data-region tem o formato 'N.N', logo duas posições no array
        No 'N.N' o primeiro valor define a nossa linha
        O segundo valor define a nossa coluna. Então vamos pegar o valor
        row = ao array na posição 0 [primeiro valor]
        column = ao array na posição 1 [segundo valor]
    */
    const row = rowColumnPair[0];
    const column = rowColumnPair[1];
    
    // Verificação do turnPlayer
    if(turnPlayer === 'player1'){
        // Pegaremos o nosso span clicado 'span clicado' e atribuiremos o valor X
        span.innerText = 'X';
        /* Agora pegaremos o nosso tabuleiro virtual [vBoard] e colocaremos que no nosso array 
            bi-dimensional, ele identifique qual a linha e a coluna e atribua o valor 'X'
        */
        vBoard[row][column] = 'X';
    } else {
        span.innerText = 'O';
        vBoard[row][column] = 'O';
    }

    console.clear(); // Para sempre que ele chegar aqui, estiver vazio
    console.table(vBoard); // Pega alguma informação e tenta mostrar como se fosse uma tabela

    /* Desabilitar a região clicada para não permitir clicar de novo, caso contrário,
        O player seguinte conseguirá 'mudar' a região clicada ao seu favor
    */
    disableRegion(span); 
    

    /* Agora precisamos trocar o jogador da vez, mas antes, 
    precisamos verificar se ele venceu. Para isto, vamos criar uma const chamada 
    winRegions, que vai definir as possibilidades de vitória */
/* Essa função getWinRegios servirá para verificar se ele venceu 
    baseado no estado atual do nosso tabuleiro */
    const winRegions = getWinRegions(); 
    // Agora precisamos fazer algumas verificações
    if(winRegions.length > 0){ // Verificar se a winRegions retornou valor maior que 0, caso sim, VENCEU
        /* 
            Passar uma função handleWin() para cuidar do comportamento de vitória
            Vou passar como parâmetro as regiões de vitória.
         */
        handleWin(winRegions);

    } else if (vBoard.flat().includes('')){ 
        /* 
            A função 'flat()' permite transformar um array bi-dimensional em um array único 
            Logo, uso a função includes, para verificar se existe algum valor vazio ''. Caso sim, 
            preciso continuar o jogo
        */
        // Então, pego o turnPlayer e verifico, se seu valor atual foi player1, mude para player2
        // Se o valor for player2 mude para player1
        turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1';

        updateTitle(); // Chamo a função para mudar o título de 'Agora é a vez de: turnPlayer'
    } else {
        /*
            Chegando aqui, passamos por duas situações:
            1 - Nenhuma região clicada foi identificada como vencedora
            2 - Não existem mais regiões vazias

            Logo, temos um empate
        */
        document.querySelector('h2').innerHTML = 'É UM EMPATE!';
    }
    
}

/* Aqui, vamos definir para pegarmos o elemento 'start' 
que é o nosso botão e ao clicá-lo, ele chamará o resultado do initializeGame */
document.getElementById('start').addEventListener('click', initializeGame);



const main = document.querySelector('main'); // Nossa tag <main>
const root = document.querySelector(':root'); // O element ':root' do CSS

// Funcionalidade de trocar o tema
document.getElementById('themeSwitcher').addEventListener('click', function(){
    
    if(main.dataset.theme === 'dark'){
        // O setProperty permite inserir uma propriedade no CSS
        root.style.setProperty('--bg-color', '#232323');
        root.style.setProperty('--border-color', '#DDD');
        root.style.setProperty('--font-color', '#232323');
        root.style.setProperty('--primary-color', '#2bf195');

        main.dataset.theme = 'light';
    } else {
        root.style.setProperty('--bg-color', '#DDD');
        root.style.setProperty('--border-color', '#232323');
        root.style.setProperty('--font-color', '#DDD');
        root.style.setProperty('--primary-color', '#2bf195');

        main.dataset.theme = 'dark';
    }
});