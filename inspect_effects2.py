from pathlib import Path
path = Path(r'c:\diario de um deus\gods\effects.js')
text = path.read_text(encoding='utf-8')
idx = text.find('mobileNav')
print('first', idx)
if idx != -1:
    print(text[idx-120:idx+240])
