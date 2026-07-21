from gtts import gTTS
import os

os.makedirs('assets/audio', exist_ok=True)

letras = {
    'letra_som_B': 'B',
    'letra_som_F': 'F',
    'letra_som_M': 'M',
    'letra_som_P': 'P',
    'letra_som_S': 'S',
    'letra_som_V': 'V',
    'letra_som_Z': 'Z'
}

for nome, texto in letras.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
