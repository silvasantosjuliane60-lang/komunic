import os
from gtts import gTTS

AUDIO_DIR = "/home/julianemariasilvaesantos/Documentos/komunic alfa/jogo_web/www/assets/audio"

phrases = {
    # Intro e Genéricos
    "intro_fonfon": "Olá! Eu sou o Fon-Fon! Vamos brincar com as palavras? Escolha um jogo!",
    "escolha_outro": "Escolha outro jogo para brincarmos mais!",
    "acertou": "Muito bem! Você acertou!",
    "errou": "Errar também é aprender. Tente de novo!",
    "vitoria_rodada": "Parabéns! Você completou a rodada! Você é incrível!",
    "pergunta_nome": "Qual é o seu nome?",
    
    # Sílabas, Rimas, Som Inicial
    "instrucao_silabas": "Quantos pedacinhos tem a palavra?",
    "instrucao_rimas": "Qual palavra termina com o mesmo som?",
    "instrucao_som_inicial": "Qual palavra começa com o mesmo som?",
    
    # Palavras
    "p_Sol": "Sol", "p_Gato": "Gato", "p_Sapo": "Sapo", "p_Cachorro": "Cachorro", "p_Macaco": "Macaco", 
    "p_Bicicleta": "Bicicleta", "p_Abacaxi": "Abacaxi", "p_Trem": "Trem", "p_Elefante": "Elefante", "p_Pe": "Pé",
    "p_Rato": "Rato", "p_Bolo": "Bolo", "p_Mao": "Mão", "p_Pao": "Pão", "p_Casa": "Casa", "p_Fogo": "Fogo", 
    "p_Mesa": "Mesa", "p_Jogo": "Jogo", "p_Bola": "Bola", "p_Pato": "Pato", "p_Mato": "Mato", "p_Lobo": "Lobo", 
    "p_Cama": "Cama", "p_Balao": "Balão", "p_Sabao": "Sabão", "p_Carro": "Carro", "p_Dedo": "Dedo", 
    "p_Janela": "Janela", "p_Panela": "Panela", "p_Vaca": "Vaca", "p_Cola": "Cola", "p_Faca": "Faca", 
    "p_Urso": "Urso", "p_Boca": "Boca", "p_Fada": "Fada", "p_Mala": "Mala", "p_Saco": "Saco", "p_Vaso": "Vaso",
    "p_Pipoca": "Pipoca", "p_Jacare": "Jacaré", "p_Girafa": "Girafa", "p_Zebra": "Zebra", "p_Leao": "Leão",
    "p_Sorvete": "Sorvete", "p_Navio": "Navio", "p_Galinha": "Galinha", "p_Peixe": "Peixe", "p_Tigre": "Tigre",
    
    # Jogo dos Balões
    "instrucao_baloes_letras": "Estoure a letra ",
    "instrucao_baloes_numeros": "Estoure o número ",
    "vitoria_baloes": "Parabéns! Você estourou todos os balões corretos!",
    
    # Tangram
    "instrucao_tangram": "Vamos montar a figura! Arraste ou toque nas formas geométricas.",
    "vitoria_tangram": "Parabéns! Você formou a figura!",
    "t_TrianguloCorpo": "Triângulo do corpo!",
    "t_AsaEsquerda": "Asa esquerda!",
    "t_AsaDireita": "Asa direita!",
    "t_QuadradoCauda": "Quadrado da cauda!",
    "t_Parede": "Parede!",
    "t_Telhado": "Telhado!",
    "t_Porta": "Porta!",
    "t_Mastro": "Mastro!",
    "t_Vela": "Vela!",
    "t_Casco": "Casco!"
}

# Letras
for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    phrases[f"letra_{c}"] = c

# Numeros
for i in range(10):
    phrases[f"numero_{i}"] = str(i)

os.makedirs(AUDIO_DIR, exist_ok=True)

for filename, text in phrases.items():
    filepath = os.path.join(AUDIO_DIR, f"{filename}.mp3")
    if not os.path.exists(filepath):
        print(f"Gerando {filepath}...")
        tts = gTTS(text, lang='pt', tld='com.br', slow=False)
        tts.save(filepath)

print("Geração concluída!")
