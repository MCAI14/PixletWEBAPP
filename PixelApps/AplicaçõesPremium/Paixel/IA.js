const fs = require('fs');

function guardarConversa(usuario, mensagem) {
    let conversas = [];
    if (fs.existsSync('conversas.json')) {
        conversas = JSON.parse(fs.readFileSync('conversas.json'));
    }
    conversas.push({ usuario, mensagem, data: new Date() });
    fs.writeFileSync('conversas.json', JSON.stringify(conversas, null, 2));
}

function responder(mensagem) {
    // Aqui pode programar respostas personalizadas
    if (mensagem.includes('olá')) return 'Olá! Como posso ajudar?';
    return 'Desculpe, não entendi.';
}

// Exemplo de uso:
const userMsg = 'olá, IA!';
guardarConversa('cliente', userMsg);
const resposta = responder(userMsg);
guardarConversa('IA', resposta);
console.log(resposta);