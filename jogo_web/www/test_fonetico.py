from gtts import gTTS
import os

os.makedirs('assets/audio/fonetico', exist_ok=True)

testes = {
    'teste_A': 'aaaa',
    'teste_B': 'b, b, b',
    'teste_F': 'ffffff'
}

for nome, texto in testes.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=True)
    tts.save(f'assets/audio/fonetico/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
