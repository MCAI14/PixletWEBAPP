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

document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-input-bar');
    const inputField = document.getElementById('input-field');

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = inputField.value.trim();
        if (!message) return;
        addMessage('user', message);
        inputField.value = '';
        addMessage('paixel', 'A pensar...');
        try {
            const resposta = await askOpenRouter(message);
            removeLastPaixelThinking();
            addMessage('paixel', resposta);
        } catch (err) {
            removeLastPaixelThinking();
            addMessage('paixel', "Erro ao contactar a IA.");
        }
    });

    function addMessage(sender, text) {
        const msg = document.createElement('div');
        msg.className = 'msg ' + sender;
        msg.textContent = text;
        chatContainer.appendChild(msg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function removeLastPaixelThinking() {
        const msgs = chatContainer.querySelectorAll('.msg.paixel');
        if (msgs.length) chatContainer.removeChild(msgs[msgs.length - 1]);
    }
});

// Função askOpenRouter já definida no index.html ou aqui
async function askOpenRouter(prompt) {
    return await puter.ai.chat(prompt);
}