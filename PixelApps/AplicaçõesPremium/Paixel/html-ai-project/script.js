// This file contains the JavaScript code for the AI functionality.
// It includes functions for processing user input, generating responses, and updating the HTML content dynamically.

document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const responseArea = document.getElementById('response-area');

    submitButton.addEventListener('click', function() {
        const inputText = userInput.value;
        const responseText = generateResponse(inputText);
        updateResponseArea(responseText);
        userInput.value = ''; // Clear input field
    });

    function generateResponse(input) {
        // Simple AI response logic (can be expanded)
        if (input.toLowerCase().includes('hello')) {
            return 'Hello! How can I assist you today?';
        } else if (input.toLowerCase().includes('how are you')) {
            return 'I am just a program, but thanks for asking!';
        } else {
            return 'I am not sure how to respond to that.';
        }
    }

    function updateResponseArea(response) {
        responseArea.innerText = response;
    }
});

// Função para obter o banco de dados de perguntas/respostas do localStorage
function getKnowledgeBase() {
    const data = localStorage.getItem('knowledgeBase');
    return data ? JSON.parse(data) : {};
}

// Função para salvar o banco de dados
function saveKnowledgeBase(base) {
    localStorage.setItem('knowledgeBase', JSON.stringify(base));
}

async function fetchDuckDuckGoAnswer(query) {
    const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.AbstractText) return data.AbstractText;
        if (data.Answer) return data.Answer;
        return null;
    } catch {
        return null;
    }
}

async function fetchWikipediaSummary(query) {
    const apiUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.extract) return data.extract;
        return null;
    } catch {
        return null;
    }
}

async function fetchWiktionaryDefinition(query) {
    const apiUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(query)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.en && data.en[0] && data.en[0].definitions && data.en[0].definitions[0]) {
            return data.en[0].definitions[0].definition;
        }
        return null;
    } catch {
        return null;
    }
}

async function fetchNumbersAPI(query) {
    // Busca por curiosidades sobre números, se a pergunta contiver um número
    const match = query.match(/\b\d+\b/);
    if (!match) return null;
    const number = match[0];
    const apiUrl = `http://numbersapi.com/${number}/trivia?notfound=floor&fragment&json`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.text) return `Curiosidade sobre o número ${number}: ${data.text}`;
        return null;
    } catch {
        return null;
    }
}

async function fetchAdvice() {
    // Conselho aleatório se a pergunta contiver "conselho"
    const apiUrl = `https://api.adviceslip.com/advice`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.slip && data.slip.advice) return data.slip.advice;
        return null;
    } catch {
        return null;
    }
}

async function fetchJoke() {
    // Piada aleatória se a pergunta contiver "piada"
    const apiUrl = `https://v2.jokeapi.dev/joke/Any?lang=pt`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.type === "single") return data.joke;
        if (data.type === "twopart") return `${data.setup} ... ${data.delivery}`;
        return null;
    } catch {
        return null;
    }
}

async function fetchWeather(query) {
    // Busca previsão do tempo se a pergunta contiver "tempo" ou "clima"
    if (!/tempo|clima/.test(query)) return null;
    // Tenta extrair o nome da cidade
    const cityMatch = query.match(/em ([a-zA-ZÀ-ÿ\s]+)/i);
    const city = cityMatch ? cityMatch[1].trim() : "Lisboa";
    // Open-Meteo API (sem chave)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    try {
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) return null;
        const geoData = await geoRes.json();
        if (!geoData.results || !geoData.results[0]) return null;
        const { latitude, longitude, name } = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&language=pt`;
        const weatherRes = await fetch(weatherUrl);
        if (!weatherRes.ok) return null;
        const weatherData = await weatherRes.json();
        if (weatherData.current_weather) {
            const w = weatherData.current_weather;
            return `O tempo em ${name}: ${w.temperature}°C, vento ${w.windspeed} km/h.`;
        }
        return null;
    } catch {
        return null;
    }
}

const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('input-field');
const submitButton = document.getElementById('submit-button');
const chatForm = document.getElementById('chat-input-bar');

// Função para adicionar mensagem ao chat
function addMessage(text, sender = 'user', source = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    msgDiv.appendChild(bubble);

    // Só mostra a fonte se o usuário pedir
    if (source && window.showSourceNext) {
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `Fonte: ${source}`;
        msgDiv.appendChild(meta);
        window.showSourceNext = false; // Reseta o flag
    }

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função para resposta da IA (exemplo simples, substitua pela sua lógica)
async function getAIResponse(question) {
    let knowledgeBase = getKnowledgeBase();

    // Cumprimentos/despedidas...

    if (knowledgeBase[question]) {
        return { text: knowledgeBase[question], source: "memória" };
    }

    // Tenta aimlapi
    const aimlReply = await fetchAimlApi(question);
    if (aimlReply) {
        knowledgeBase[question] = aimlReply;
        saveKnowledgeBase(knowledgeBase);
        return { text: aimlReply, source: "aimlapi" };
    }

    // Piada
    if (/piada|engraçado|conta.*uma/.test(question)) {
        const joke = await fetchJoke();
        if (joke) {
            knowledgeBase[question] = joke + " (JokeAPI)";
            saveKnowledgeBase(knowledgeBase);
            return { text: joke, source: "JokeAPI" };
        }
    }

    // Conselho
    if (/conselho|diz.*algo|preciso.*dica/.test(question)) {
        const advice = await fetchAdvice();
        if (advice) {
            knowledgeBase[question] = advice + " (AdviceAPI)";
            saveKnowledgeBase(knowledgeBase);
            return { text: advice, source: "AdviceAPI" };
        }
    }

    // Tempo/clima
    const weather = await fetchWeather(question);
    if (weather) {
        knowledgeBase[question] = weather + " (Open-Meteo)";
        saveKnowledgeBase(knowledgeBase);
        return { text: weather, source: "Open-Meteo" };
    }

    // Curiosidade sobre número
    const numberFact = await fetchNumbersAPI(question);
    if (numberFact) {
        knowledgeBase[question] = numberFact + " (NumbersAPI)";
        saveKnowledgeBase(knowledgeBase);
        return { text: numberFact, source: "NumbersAPI" };
    }

    // DuckDuckGo
    const ddg = await fetchDuckDuckGoAnswer(question);
    if (ddg) {
        knowledgeBase[question] = ddg + " (DuckDuckGo)";
        saveKnowledgeBase(knowledgeBase);
        return { text: ddg, source: "DuckDuckGo" };
    }

    // Wikipedia
    const wiki = await fetchWikipediaSummary(question);
    if (wiki) {
        knowledgeBase[question] = wiki + " (Wikipedia)";
        saveKnowledgeBase(knowledgeBase);
        return { text: wiki, source: "Wikipedia" };
    }

    // Wiktionary
    const wikt = await fetchWiktionaryDefinition(question);
    if (wikt) {
        knowledgeBase[question] = wikt + " (Wiktionary)";
        saveKnowledgeBase(knowledgeBase);
        return { text: wikt, source: "Wiktionary" };
    }

    // Se não encontrou, pede para o usuário ensinar
    return { text: "Não encontrei resposta. Pode me ensinar?", source: null };
}

// Evento de envio do formulário
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = inputField.value.trim();
    if (!userText) return;

    // Se o usuário digitar "/fonte", ativa o flag para mostrar a fonte na próxima resposta
    if (userText.toLowerCase() === "/fonte") {
        window.showSourceNext = true;
        addMessage("A fonte será mostrada na próxima resposta da IA.", 'ai');
        inputField.value = '';
        return;
    }

    addMessage(userText, 'user');
    inputField.value = '';
    submitButton.disabled = true;

    // Resposta da IA
    const aiObj = await getAIResponse(userText);
    addMessage(aiObj.text, 'ai', aiObj.source);
    submitButton.disabled = false;
    inputField.focus();
});

// Mensagem inicial
addMessage("Olá! Como posso ajudar você hoje?", 'ai');

document.getElementById('submit-button').addEventListener('click', async function() {
    const inputField = document.getElementById('input-field');
    const output = document.getElementById('response-output');
    const question = inputField.value.trim().toLowerCase();
    let knowledgeBase = getKnowledgeBase();

    if (!question) {
        output.textContent = "Por favor, faça uma pergunta.";
        return;
    }

    if (knowledgeBase[question]) {
        output.textContent = knowledgeBase[question];
        return;
    }

    output.textContent = "Procurando resposta em várias fontes gratuitas...";

    // Busca por contexto
    let answer = null;

    // Piada
    if (/piada|engraçado|conta.*uma/.test(question)) {
        answer = await fetchJoke();
        if (answer) {
            output.textContent = answer;
            knowledgeBase[question] = answer;
            saveKnowledgeBase(knowledgeBase);
            return;
        }
    }

    // Conselho
    if (/conselho|diz.*algo|preciso.*dica/.test(question)) {
        answer = await fetchAdvice();
        if (answer) {
            output.textContent = answer;
            knowledgeBase[question] = answer;
            saveKnowledgeBase(knowledgeBase);
            return;
        }
    }

    // Tempo/clima
    answer = await fetchWeather(question);
    if (answer) {
        output.textContent = answer;
        knowledgeBase[question] = answer;
        saveKnowledgeBase(knowledgeBase);
        return;
    }

    // Curiosidade sobre número
    answer = await fetchNumbersAPI(question);
    if (answer) {
        output.textContent = answer;
        knowledgeBase[question] = answer;
        saveKnowledgeBase(knowledgeBase);
        return;
    }

    // DuckDuckGo
    answer = await fetchDuckDuckGoAnswer(question);
    if (answer) {
        output.textContent = answer;
        knowledgeBase[question] = answer;
        saveKnowledgeBase(knowledgeBase);
        return;
    }

    // Wikipedia
    answer = await fetchWikipediaSummary(question);
    if (answer) {
        output.textContent = answer;
        knowledgeBase[question] = answer;
        saveKnowledgeBase(knowledgeBase);
        return;
    }

    // Wiktionary
    answer = await fetchWiktionaryDefinition(question);
    if (answer) {
        output.textContent = answer;
        knowledgeBase[question] = answer;
        saveKnowledgeBase(knowledgeBase);
        return;
    }

    // Se não encontrou, pede para o usuário ensinar
    output.textContent = "Não encontrei resposta. Como devo responder a isso?";
    document.getElementById('submit-button').disabled = true;
    inputField.value = "";
    inputField.placeholder = "Digite a resposta para ensinar a IA...";
    inputField.focus();

    function learnAnswer() {
        const userAnswer = inputField.value.trim();
        if (userAnswer) {
            knowledgeBase[question] = userAnswer;
            saveKnowledgeBase(knowledgeBase);
            output.textContent = "Aprendi! Pergunte novamente para ver a resposta.";
            inputField.value = "";
            inputField.placeholder = "Ask me anything...";
            document.getElementById('submit-button').disabled = false;
            inputField.removeEventListener('keydown', onEnter);
        }
    }

    function onEnter(e) {
        if (e.key === 'Enter') {
            learnAnswer();
        }
    }

    inputField.addEventListener('keydown', onEnter);
    document.getElementById('submit-button').onclick = learnAnswer;
});

async function fetchAimlApi(question) {
    try {
        const response = await fetch("https://api.aimlapi.com/api/v1/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "c0c4affc7b144dc78a5c51c98b3531f5"
            },
            body: JSON.stringify({
                prompt: question,
                // Adicione outros parâmetros se a documentação pedir
            })
        });
        const data = await response.json();
        if (data && data.completion) {
            return data.completion.trim();
        }
        return null;
    } catch (e) {
        return null;
    }
}