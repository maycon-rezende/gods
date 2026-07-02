from pathlib import Path
path = Path(r'c:\diario de um deus\gods\effects.js')
text = path.read_text(encoding='utf-8')
needle = 'const mobileNav = document.createElement(\'div\');\n\n    /* Coleta links da nav desktop */'
idx = text.find(needle)
print('found', idx)
if idx != -1:
    print(text[idx:idx+400])
