using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Speech.Recognition;
using System.Speech.Synthesis;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

public class Worker : BackgroundService
{
    private readonly HttpClient _httpClient;

    public Worker()
    {
        _httpClient = new HttpClient();
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            string comando = CapturarAudio();
            if (!string.IsNullOrEmpty(comando))
            {
                Console.WriteLine($"Comando reconhecido: {comando}");
                string resposta = await ProcessarTexto(comando);
                Console.WriteLine($"Resposta obtida: {resposta}");
                FalarTexto(resposta);
            }
            await Task.Delay(1000, stoppingToken);
        }
    }
    
    private string CapturarAudio()
    {
        string resultado = "";
        using (SpeechRecognitionEngine recognizer = new SpeechRecognitionEngine(new System.Globalization.CultureInfo("pt-BR")))
        {
            try
            {
                recognizer.SetInputToDefaultAudioDevice();
                recognizer.LoadGrammar(new DictationGrammar());
                Console.WriteLine("Fale algo...");
                RecognitionResult recResult = recognizer.Recognize(new TimeSpan(0, 0, 5));
                if (recResult != null)
                {
                    resultado = recResult.Text;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na captura de áudio: {ex.Message}");
            }
        }
        return resultado;
    }
    
    private async Task<string> ProcessarTexto(string mensagem)
    {
        // Exemplo de chamada à API da OpenAI (ou outra similar)
        var jsonContent = "{\"prompt\": \"" + mensagem + "\", \"max_tokens\": 100}";
        var requestContent = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

        // Substitua "SUA_CHAVE_API" pela sua chave de API
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "SUA_CHAVE_API");

        HttpResponseMessage response = await _httpClient.PostAsync("https://api.openai.com/v1/engines/text-davinci-003/completions", requestContent);
        string responseString = await response.Content.ReadAsStringAsync();
        
        // Aqui você pode incluir lógica para extrair a resposta desejada do JSON retornado
        return responseString;
    }
    
    private void FalarTexto(string texto)
    {
        using (SpeechSynthesizer synthesizer = new SpeechSynthesizer())
        {
            try
            {
                synthesizer.Speak(texto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro na síntese de voz: {ex.Message}");
            }
        }
    }
}