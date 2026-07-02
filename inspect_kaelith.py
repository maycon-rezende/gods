from pathlib import Path
path = Path(r'c:\diario de um deus\gods\kaelith.html')
text = path.read_text(encoding='utf-8')
needle = '<title>Kaelith — O Diário de um Deus</title>\n<link rel="stylesheet" href="effects.css">\n<link rel="stylesheet" href="responsive-fixes.css">\n<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">\n'
print('head idx', text.find(needle))
print(text[text.find('<title>Kaelith — O Diário de um Deus</title>'):text.find('<title>Kaelith — O Diário de um Deus</title>')+300])
needle2 = '<!-- PODERES -->\n<section id="poderes">\n  <div class="section-header reveal">\n    <span class="section-label">Arsenal completo</span>\n    <h2>Poderes & Habilidades</h2>\n    <div class="section-rule"></div>\n  </div>\n\n  <div class="powers-list">\n'
print('poderes idx', text.find(needle2))
print(text[text.find(needle2):text.find(needle2)+200])
