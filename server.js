const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express();
const port = 3000; // Porta fixa

app.use(bodyParser.json());

// Configuração de sessão
app.use(session({
    secret: 'segredo-super-seguro', // Troque por algo forte em produção
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true só se usar HTTPS
}));

// Usuários em memória (exemplo simples)
const users = [
    { username: 'admin', password: 'admin' }
];

// Registro de usuário (apenas exemplo, não recomendado para produção)
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password });
    res.send('User registered successfully');
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = { username };
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Verificar sessão
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out');
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor no IP desejado
app.listen(port, '192.168.56.1', () => {
    console.log(`Server running at http://192.168.56.1:${port}`);
});