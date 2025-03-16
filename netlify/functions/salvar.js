exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método não permitido' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        // Implemente sua lógica de salvamento aqui (armazenamento em banco de dados, etc.)
        console.log("Conteúdo recebido:", data.conteudo);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Texto salvo com sucesso!' })
        };
    } catch (error) {
        console.error("Erro:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno no servidor' })
        };
    }
};