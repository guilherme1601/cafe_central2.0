// Pega o formulário pelo ID
const form = document.getElementById("formContato");
//const API_URL = "http://localhost:3000"
const API_URL = "https://cafe-central-rb0q.onrender.com"

// Escuta o evento de envio do formulário
form.addEventListener("submit", async function(event){
    event.preventDefault(); // impede a página de recarregar

    // Pega os valores digitados nos inputs
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    // Cria um objeto com os dados
    const novaMensagem = { nome, email, mensagem };

    try {
        // Envia os dados para um servidor (ou arquivo fake/API)
        const resposta = await fetch(`${API_URL}/post`, {
            method: "POST", // tipo de envio
            headers: {
                "Content-Type": "application/json" // diz que é JSON
            },
            body: JSON.stringify(novaMensagem) // transforma em JSON
        });

        // Converte a resposta
        const dados = await resposta.json();

        console.log("Enviado:", dados);

        alert("Mensagem enviada com sucesso!");
        form.reset(); // limpa o formulário

    } catch (erro) {
        // Caso dê erro
        console.error(erro);
        alert("Erro ao enviar mensagem!");
    }
});