//Aluna Isabele Silva Souza Monteiro / Matrícula: 2222868

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://isabelesouzam:naJreHGtadBjlE96@cluster0.fyip3nz.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String
});

// Rota para a página inicial
app.get(['/', '/index'], (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

// Rota para cadastro de usuário
app.post('/cadastro', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        await user.save();

        // Após o cadastro bem-sucedido, redirecione o usuário para a página de login
        res.json({ message: 'Cadastro realizado com sucesso! Você será redirecionado para o login.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

// Rota para autenticação
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        
        if (user) {
            res.json({ message: 'Autenticação bem-sucedida!' });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao autenticar usuário.' });
    }
});


app.get('/redirect', (req, res) => {
    const message = req.query.message;
    res.send(`<script>alert('${message}'); window.location.href = 'login.html';</script>`);
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/public/cadastro.html');
});

// Rota para a página de administração
app.get('/admin', (req, res) => {
    // Lógica para obter usuários do banco de dados e renderizar na página
  
    res.sendFile(__dirname + '/caminho/para/sua/pasta/admin.html');
});

// Rota para editar usuário
app.put('/admin/editar-usuario/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, password }, { new: true });
        res.json({ message: 'Usuário editado com sucesso.', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar usuário.' });
    }
});


// Rota para excluir usuário
app.delete('/admin/excluir-usuario/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
});

app.get('/admin/users', async (req, res) => {
    try {
        // Lógica para obter a lista de usuários do banco de dados
        const listaDeUsuarios = await User.find();

        // Retorna a lista de usuários como JSON
        res.json(listaDeUsuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter a lista de usuários.' });
    }
});


app.listen(3000, '192.168.0.8', () => {
    console.log('Servidor ouvindo na porta 3000');
  });
  
  
