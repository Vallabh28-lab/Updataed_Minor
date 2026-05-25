import pandas as pd

df = pd.read_csv(r'd:\Sardesai_Data\MINOR\MINOR\CASE_SEARCH_DATASET\archive (2)\case_files_total.csv', nrows=5)
with open(r'd:\Sardesai_Data\MINOR\MINOR\preview.txt', 'w', encoding='utf-8') as f:
    f.write('COLUMNS: ' + str(list(df.columns)) + '\n')
    f.write('SHAPE: ' + str(df.shape) + '\n\n')
    f.write(df.to_string())
print('done')
