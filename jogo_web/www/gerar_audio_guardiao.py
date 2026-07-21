from gtts import gTTS
import os

os.makedirs('assets/audio/guardiao', exist_ok=True)

audios = {
    'muitobem_foca': 'Muito bem! Foca!',
    'foca': 'Foca.',
    'sapo': 'Sapo.',
    'gato': 'Gato.',
    'muitobem_sapo': 'Muito bem! Sapo!',
    'bola': 'Bola.',
    'vaca': 'Vaca.',
    'muitobem_macaco': 'Muito bem! Macaco!',
    'pato': 'Pato.',
    'lobo': 'Lobo.',
    'macaco': 'Macaco.',
    'vitoria_guardiao': 'Parabéns! Você é o grande guardião dos sons!'
}

for nome, texto in audios.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/guardiao/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
