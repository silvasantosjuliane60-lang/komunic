from gtts import gTTS
import os

os.makedirs('assets/audio/show', exist_ok=True)

audios = {
    'instrucao_B': 'A primeira letra junta os lábios e faz um estalo: Bâ! Qual destes desenhos começa com o som Bâ?',
    'instrucao_F': 'Coloque os dentes no lábio inferior e sopre fazendo: fffff! Qual destes desenhos começa com o som ffff?',
    'instrucao_M': 'Junte os lábios e faça um som pelo nariz: hummmmm! Qual destes desenhos começa com o som hummm?',
    'instrucao_S': 'Junte os dentes e faça o som da cobrinha: sssss! Qual destes desenhos começa com o som ssss?',
    'instrucao_V': 'Coloque os dentes no lábio inferior, sopre e sinta vibrar: vvvvv! Qual destes desenhos começa com o som vvvv?',
    'feedback_B': 'B, b, balão! Muito bem!',
    'feedback_F': 'F, f, faca! Excelente!',
    'feedback_M': 'M, m, macaco! Perfeito!',
    'feedback_S': 'S, s, sapo! Isso mesmo!',
    'feedback_V': 'V, v, vaca! Que incrível!',
    'erro': 'Não é esse! Tente de novo!',
    'final': 'Parabéns! Você completou o Show dos Sons e é um campeão das letras!'
}

for nome, texto in audios.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/show/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
