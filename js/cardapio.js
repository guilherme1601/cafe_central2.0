// Seleciona o elemento onde os produtos do cardápio vão aparecer
const ListaCardapio = document.querySelector("#ListaCardapio");
const BuscaCardapio = document.querySelector("#BuscaCardapio");

// Cria um array vazio para armazenar os dados do cardápio
let cardapio = [];

// Função assíncrona para carregar o JSON
async function carregarCardapio() {
    // Faz uma requisição para pegar o arquivo JSON
    const resposta = await fetch("../data/cardapio.json");

    // Converte o JSON em objeto JavaScript
    cardapio = await resposta.json();

    // Chama a função para exibir os dados na tela
    renderizarCardapio(cardapio);
}

// Função responsável por mostrar os itens na tela
function renderizarCardapio(lista) {
    // Limpa o conteúdo antes de renderizar novamente
    ListaCardapio.innerHTML = "";

    // Percorre cada item da lista
    lista.forEach(item => {

        // Cria uma div para cada produto
        const card = document.createElement("div");

        // Adiciona uma classe para estilização
        card.classList.add("produto");

        // Insere o conteúdo HTML dentro do card
        card.innerHTML = `
        <img src="${item.img}" width="100" height="140">
        <h3>${item.titulo}</h3>
        <p>${item.desc}</p>
        <p><strong>Preço:</strong> ${item.preco}</p>
        `;

        // Adiciona o card dentro da lista na página
        ListaCardapio.appendChild(card);
    });
}

// Chama a função para carregar o cardápio ao iniciar a página
carregarCardapio();