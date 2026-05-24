import openpyxl, os

folder = r'd:\Sardesai_Data\MINOR\MINOR\CASE_SEARCH_DATASET'
files = [f for f in os.listdir(folder) if f.endswith('.xlsx')]

with open(r'd:\Sardesai_Data\MINOR\MINOR\preview.txt', 'w', encoding='utf-8') as out:
    for fname in files:
        wb = openpyxl.load_workbook(os.path.join(folder, fname))
        ws = wb.active
        rows = list(ws.iter_rows(values_only=True))
        out.write(f'\n=== {fname} ===\n')
        out.write(f'TOTAL ROWS: {len(rows)}\n')
        for i, row in enumerate(rows[:4]):
            out.write(f'ROW{i}: {repr(row)}\n')

print('done')
