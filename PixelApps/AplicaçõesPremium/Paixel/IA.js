const fs = require('fs');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: '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' // Substitui pela tua chave
});

function guardarConversa(usuario, mensagem) {
    let conversas = [];
    if (fs.existsSync('conversas.json')) {
        conversas = JSON.parse(fs.readFileSync('conversas.json'));
    }
    conversas.push({ usuario, mensagem, data: new Date() });
    fs.writeFileSync('conversas.json', JSON.stringify(conversas, null, 2));
}

async function responderComOpenAI(mensagem) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: mensagem }]
    });
    return completion.choices[0].message.content;
}

// Exemplo de uso:
(async () => {
    const userMsg = 'olá, IA!';
    guardarConversa('cliente', userMsg);
    const resposta = await responderComOpenAI(userMsg);
    guardarConversa('IA', resposta);
    console.log(resposta);
})();