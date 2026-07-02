from pathlib import Path
path = Path(r'c:\diario de um deus\gods\effects.css')
text = path.read_text(encoding='utf-8')
idx = text.find('#mobile-nav a:hover')
print('idx', idx)
if idx != -1:
    print(text[idx:idx+250])
