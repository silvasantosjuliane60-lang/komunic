from gtts import gTTS
import os

os.makedirs('assets/audio', exist_ok=True)

textos = {
    'tangram_intro': 'Vamos montar as figuras! Arraste ou toque nas formas geométricas.',
    
    'tangram_montar_Aviao': 'Vamos montar o avião!',
    'tangram_vitoria_Aviao': 'Parabéns! Você formou o avião!',
    
    'tangram_montar_Casa': 'Vamos montar a casa!',
    'tangram_vitoria_Casa': 'Parabéns! Você formou a casa!',
    
    'tangram_montar_Barco': 'Vamos montar o barco!',
    'tangram_vitoria_Barco': 'Parabéns! Você formou o barco!',
    
    'tangram_montar_Gato': 'Vamos montar o gatinho!',
    'tangram_vitoria_Gato': 'Parabéns! Você formou o gatinho!',
    
    'tangram_montar_Foguete': 'Vamos montar o foguete!',
    'tangram_vitoria_Foguete': 'Parabéns! Você formou o foguete!',
    
    'tangram_montar_Arvore': 'Vamos montar a árvore!',
    'tangram_vitoria_Arvore': 'Parabéns! Você formou a árvore!',
    
    'tangram_montar_Peixe': 'Vamos montar o peixinho!',
    'tangram_vitoria_Peixe': 'Parabéns! Você formou o peixinho!',
    
    'tangram_peca_triangulo': 'Triângulo!',
    'tangram_peca_quadrado': 'Quadrado!',
    'tangram_peca_paralelogramo': 'Paralelogramo!',
    'tangram_peca_retangulo': 'Retângulo!',
    'tangram_concluiu_tudo': 'Incrível! Você montou todas as figuras. Muito bem!'
}

for nome, texto in textos.items():
    tts = gTTS(text=texto, lang='pt', tld='com.br', slow=False)
    tts.save(f'assets/audio/{nome}.mp3')
    print(f"Gerado: {nome}.mp3")
