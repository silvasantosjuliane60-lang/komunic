from gtts import gTTS
import os

os.makedirs('assets/audio/fonetico', exist_ok=True)

# Formatando os textos de forma que o Google TTS pronuncie como fonemas ou sons suaves
textos = {
    'A': 'Aaaa',
    'B': 'bê',
    'C': 'cê',
    'D': 'dê',
    'E': 'Êeee',
    'F': 'fffff',
    'G': 'gê',
    'I': 'Iiii',
    'J': 'jjjjj',
    'L': 'lllll',
    'M': 'mmmmm',
    'N': 'nnnnn',
    'O': 'Óooo',
    'P': 'pê',
    'R': 'rrrrr',
    'S': 'sssss',
    'T': 'tê',
    'U': 'Uuuu',
    'V': 'vvvvv',
    'Z': 'zzzzz'
}

for letra, texto in textos.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=True)
    tts.save(f'assets/audio/fonetico/{letra}.mp3')
    print(f"Gerado: {letra}.mp3")
