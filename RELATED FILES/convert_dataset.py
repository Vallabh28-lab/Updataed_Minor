import openpyxl, json, re

wb = openpyxl.load_workbook(r'd:\Sardesai_Data\MINOR\MINOR\CASE_SEARCH_DATASET\Legal_Statutes_Simple_Marathi.xlsx')
ws = wb.active
rows = list(ws.iter_rows(values_only=True))

def clean(val):
    if not val:
        return ''
    # Keep only the English part (before the newline where Marathi starts)
    return re.sub(r'\n.*', '', str(val)).strip()

data = []
for row in rows[1:]:
    if not any(row):
        continue
    data.append({
        'category': clean(row[0]),
        'offense': clean(row[1]),
        'ipc': clean(row[2]),
        'bns': clean(row[3])
    })

out_path = r'd:\Sardesai_Data\MINOR\MINOR\backend\src\data\legal_statutes.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Saved {len(data)} records to {out_path}')
