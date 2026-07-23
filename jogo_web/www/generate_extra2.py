from gtts import gTTS
import os

audios = {
    'cachorro': 'Cachorro.',
    'muitobem_cachorro': 'Muito bem! Cachorro!'
}

for nome, texto in audios.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/guardiao/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
