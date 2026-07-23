from gtts import gTTS
import os

os.makedirs('assets/audio/guardiao', exist_ok=True)

audios = {
    'muitobem_gato': 'Muito bem! Gato!',
    'muitobem_lobo': 'Muito bem! Lobo!',
    'muitobem_pato': 'Muito bem! Pato!',
    'cao': 'Cão.',
    'muitobem_cao': 'Muito bem! Cão!'
}

for nome, texto in audios.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/guardiao/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
