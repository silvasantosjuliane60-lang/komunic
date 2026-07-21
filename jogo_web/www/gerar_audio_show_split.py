from gtts import gTTS
import os

os.makedirs('assets/audio/show', exist_ok=True)

audios = {
    'instrucao_B_parte1': 'A primeira letra junta os lábios e faz um estalo.',
    'instrucao_F_parte1': 'Coloque os dentes no lábio inferior e sopre fazendo.',
    'instrucao_M_parte1': 'Junte os lábios e faça um som pelo nariz.',
    'instrucao_S_parte1': 'Junte os dentes e faça o som da cobrinha.',
    'instrucao_V_parte1': 'Coloque os dentes no lábio inferior, sopre e sinta vibrar.',
}

for nome, texto in audios.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/show/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
