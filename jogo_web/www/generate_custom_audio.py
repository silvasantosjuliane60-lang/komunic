from gtts import gTTS
import os

os.makedirs('assets/audio', exist_ok=True)

textos = {
    'instrucao_som_B': 'Qual palavra começa com a letra B?',
    'instrucao_som_F': 'Qual palavra começa com a letra F?',
    'instrucao_som_M': 'Qual palavra começa com a letra M?',
    'instrucao_som_P': 'Qual palavra começa com a letra P?',
    'instrucao_som_S': 'Qual palavra começa com a letra S?',
    'instrucao_som_V': 'Qual palavra começa com a letra V?',
    'instrucao_som_Z': 'Qual palavra começa com a letra Z?'
}

for nome, texto in textos.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
