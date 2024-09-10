import matplotlib
matplotlib.use('Agg')  # Cambia el backend a uno que no muestre las imágenes

import os
import pandas as pd
import sys
import numpy as np
from textflow.Test import Test
from textflow.Visualization import Visualization

# Función para eliminar columnas con datos constantes
def remove_constant_columns(df):
    return df.loc[:, df.apply(pd.Series.nunique) != 1]

# Obtén los nombres de los archivos desde los argumentos de la línea de comandos
coleccion_uno = sys.argv[1]
coleccion_dos = sys.argv[2]
usuario = sys.argv[3]

# Extrae solo la parte del nombre del archivo antes del .xlsx
parte_coleccion_uno = os.path.splitext(os.path.basename(coleccion_uno))[0]  
parte_coleccion_dos = os.path.splitext(os.path.basename(coleccion_dos))[0]  

nombre_coleccion_uno = parte_coleccion_uno.replace("analisis", "")  
nombre_coleccion_dos = parte_coleccion_dos.replace("analisis", "")  

# Carga los datos desde los archivos Excel
df1 = pd.read_excel(coleccion_uno)
df2 = pd.read_excel(coleccion_dos)

# Imprime las columnas de ambos DataFrames
print("COLUMNAS DF1")
print(df1.columns)

print("COLUMNAS DF2")
print(df2.columns)

# Identifica las columnas comunes
columnas_comunes = list(set(df1.columns).intersection(set(df2.columns)))

# Filtra los DataFrames para que solo contengan las columnas comunes
df1_comun = df1[columnas_comunes]
df2_comun = df2[columnas_comunes]

# Elimina columnas constantes
df1_comun = remove_constant_columns(df1_comun)
df2_comun = remove_constant_columns(df2_comun)

# Imprime las columnas filtradas después de eliminar constantes
print("COLUMNAS FILTRADAS DF1")
print(df1_comun.columns)

print("COLUMNAS FILTRADAS DF2")
print(df2_comun.columns)

# Añade la columna 'collection' a ambos DataFrames
df1_comun['collection'] = nombre_coleccion_uno
df2_comun['collection'] = nombre_coleccion_dos

for col in df2.columns:
    if col not in df1_comun.columns:
        df1_comun[col] = np.nan

# Reordenar las columnas para que coincidan con df2_comun
df1_comun = df1_comun[df2_comun.columns]

# Crea una instancia de la clase Test con los valores predeterminados
t = Test()

# Crea una lista para almacenar aquellas columnas del dataframe que son numéricas
numeric_cols = [col for col, dtype in zip(df1_comun.columns, df1_comun.dtypes) if pd.api.types.is_numeric_dtype(dtype)]

# DataFrames solo contienen columnas numéricas válidas
valid_numeric_cols = []
for col in numeric_cols:
    if df1_comun[col].dropna().shape[0] >= 2 and df2_comun[col].dropna().shape[0] >= 2:
        valid_numeric_cols.append(col)
    else:
        print(f"Columna '{col}' es inválida para KDE debido a datos insuficientes o NaN.")

# Solo seleccionar las columnas válidas en ambos DataFrames
df1_comun = df1_comun[valid_numeric_cols + ['collection']]
df2_comun = df2_comun[valid_numeric_cols + ['collection']]

# Crea una instancia de la clase Visualization
v = Visualization()

# Realiza el análisis comparativo entre las dos colecciones
testResults = t.report(df1_comun, df2_comun, nombre_coleccion_uno, nombre_coleccion_dos, v, 'collection', [None, 'collection'], [None, 'collection'])

#Crea el directorio
directorio = f'./archivos/{usuario}/analisisContrastivo/analisis{nombre_coleccion_uno}{nombre_coleccion_dos}'
os.makedirs(directorio, exist_ok=True)

# Ejemplo de resultados de test de normalidad
normal_results = testResults['normalTest']
normal_df = normal_results[0]
normal_summary = normal_results[1]

normal_df.reset_index(inplace=True)
normal_df.rename(columns={'index': 'características'}, inplace=True)


testNormal = f"./archivos/{usuario}/analisisContrastivo/analisis{nombre_coleccion_uno}{nombre_coleccion_dos}/testNormalidad{nombre_coleccion_uno}{nombre_coleccion_dos}.xlsx"
normal_df.to_excel(testNormal, index=False)


# Ejemplo de resultados de test paramétricos
parametric_results = testResults['parametricTest']
parametric_df = parametric_results[0]
parametric_summary = parametric_results[1]

testParametricos = f"./archivos/{usuario}/analisisContrastivo/analisis{nombre_coleccion_uno}{nombre_coleccion_dos}/testParametricos{nombre_coleccion_uno}{nombre_coleccion_dos}.xlsx"
parametric_df.to_excel(testParametricos, index=False)

# Ejemplo de resultados de test no paramétricos
nonparametric_results = testResults['nonParametricTest']
nonparametric_df = nonparametric_results[0]
nonparametric_summary = nonparametric_results[1]

testNoParametricos = f"./archivos/{usuario}/analisisContrastivo/analisis{nombre_coleccion_uno}{nombre_coleccion_dos}/testNoParametricos{nombre_coleccion_uno}{nombre_coleccion_dos}.xlsx"
nonparametric_df.to_excel(testNoParametricos, index=False)




