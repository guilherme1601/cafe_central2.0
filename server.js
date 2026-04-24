// ================= IMPORTAÇÕES =================

// Carrega variáveis do .env
require("dotenv").config();

// Importa o Express (framework do servidor)
const express = require("express");

// Permite requisições de outros domínios (frontend)
const cors = require("cors");

// Gerencia sessões (login)
const session = require("express-session");

// 🔥 CORREÇÃO: nome estava errado (bcrytjs → bcryptjs)
const bcrypt = require("bcryptjs");

// Conexão com banco de dados
const pool = require("./db.js");

// Cria o servidor
const app = express();


// ================= CORS =================

// Lista de sites permitidos acessar a API
const listOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://guilherme1601.github.io"
];

// Configuração do CORS
app.use(cors({
    origin: listOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Permite receber JSON no body
app.use(express.json());


// ================= SESSÃO =================

const sessionConfig = {
    secret: process.env.SESSION_SECRET, // chave secreta
    resave: false,
    
    // 
    saveUninitialized: false,

    name: "cafecentral.sid",

    cookie: {
        httpOnly: true, // protege contra JS
        maxAge: 1000 * 60 * 60 // 1 hora
    }
};

// Configuração para produção
if (process.env.NODE_ENV == "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.sameSite = "none";
    sessionConfig.cookie.secure = true;
} else {
    sessionConfig.cookie.sameSite = "lax";
    sessionConfig.cookie.secure = false;
}

// Ativa sessão
app.use(session(sessionConfig));


// ================= CADASTRO =================

app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Validação
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        // Verifica se já existe usuário
        const [rows] = await pool.execute(
            "SELECT id FROM tb_usuario WHERE email=?", [email]
        );

        if (rows.length > 0) {
            return res.status(409).json({ erro: "E-mail já cadastrado" });
        }

        // Criptografa senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Salva no banco
        await pool.execute(
            "INSERT INTO tb_usuario(nome,email,senha) VALUES(?,?,?)",
            [nome, email, senhaHash]
        );

        res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});


// ================= LOGIN =================

app.post("/login", async (req, res) => {
    try {
    const { email, senha } = req.body;
    if (!email || !senha)
    // verifica se algum campo está vazio
    return res.status(400).json({ erro: "Preencha e-mail e senha." });
    // retorna erro 400 (requisição inválida)
    const [rows] = await pool.execute(
  
    "SELECT id, nome, email, senha FROM tb_usuario WHERE email = ?", [email]
    );
    if (rows.length === 0)
    // nenhum usuário encontrado com esse e-mail
    return res.status(401).json({ erro: "Usuário não encontrado." });
    // ERRO 401 = não autorizado
    const usuario = rows[0];
    // pega o primeiro (e único) resultado da consulta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    // compara a senha digitada com o hash salvo no banco
    if (!senhaCorreta)
    // hashes diferentes = senha errada
    return res.status(401).json({ erro: "Senha inválida." });
    // ERRO 401 = não autorizado
    req.session.usuario = {
    id: usuario.id, // ID interno do usuário
    nome: usuario.nome, // nome para exibir na interface
    email: usuario.email // e-mail para referência futura
    };
    res.json({ mensagem: "Login realizado com sucesso." });
    } catch(error) {
        console.error(error)
    res.status(500).json({ erro: "Erro ao fazer login." });
    }
});


// ================= VERIFICAR LOGIN =================

app.get("/me", (req, res) => { 
    if (!req.session.usuario) // se não há sessão salva...
    return res.status(401) // responde com ERRO 401 (não autorizado)
    .json({ logado: false }); // avisa que não está logado
    res.json({ // se há sessão, responde com 200
    logado: true, // confirma que está logado
    usuario: req.session.usuario // devolve os dados do usuário (nome, email, id)
    });
});

// ================= LOGOUT =================

app.post("/logout", (req, res) => { // rota POST 4 o front chama para deslogar
    req.session.destroy(() => { // apaga a sessão do servidor completamente
    res.json({ // após destruir, responde com sucesso
    mensagem: "Logout realizado." // confirmação para o front-end
        });
    });
});
    app.listen(
        process.env.PORT || 3000, () => console.log("Servidor rodando")
        );




app.post("/post", (req,res) => {
    // 7. req.body contém os dados envciados pelo form(nome,email,mensagem)
    try{
        const nome = req.body.nome
        const email = req.body.email
        const mensagem = req.body.mensagem
                
        if(!nome || !email || !mensagem){
        // codigo 400 - requisição inválida
            return res.status(400).json({mensagem: "Preecha todos os campos"});
            };
        
            pool.execute("INSERT INTO tb_mensagem(nome,email,mensagem) VALUES(?,?,?)", [nome,email,mensagem]);
            // codigo 201 - criado com sucesso
            res.status(201).json({mensagem: "Mensagem enviada com sucesso!"});
        
                // 8. Envia uma resposta de volta para o navegador
            res.send("Mensagem recebida com sucesso!");
            } catch(error){
                console.error(error);
            }
        });


// ================= SERVIDOR =================

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});