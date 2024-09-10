import pandas as pd
import json
import sys
import os 

usuario = sys.argv[1]
coleccion = sys.argv[2]
documento = sys.argv[3]

# Leer el archivo CSV
df = pd.read_csv(documento, sep='\t')

# Función para leer y procesar los archivos JSON
def leer_json(nombre_archivo):
    with open(nombre_archivo, 'r', encoding='utf-8') as f:
        data = json.load(f)
    ids = [mensaje['id_message'] for mensaje in data]
    mensajes = [mensaje['message'] for mensaje in data]
    return ids, mensajes

# Listas para almacenar los IDs y los mensajes
todos_los_ids = []
todos_los_mensajes = []

# Listas para almacenar los datos transformados
data_expandida = []

# Iterar sobre cada fila del DataFrame y procesar los archivos JSON
for index, row in df.iterrows():
    nombre_archivo = f'./archivos/{usuario}/{coleccion}/{row["nick"]}.json'  # Ajusta la ruta según sea necesario
    ids, mensajes = leer_json(nombre_archivo)
    for id_message, message in zip(ids, mensajes):
        nueva_fila = row.to_dict()
        nueva_fila['id_message'] = id_message
        nueva_fila['message'] = message
        data_expandida.append(nueva_fila)

# Agregar las nuevas columnas al DataFrame
df_expandido = pd.DataFrame(data_expandida)

# Crear el directorio si no existe
directorio = f'./archivos/{usuario}/analisis{coleccion}'
os.makedirs(directorio, exist_ok=True)

# Guardar el DataFrame actualizado en un nuevo archivo Excel
output_path = f'./archivos/{usuario}/analisis{coleccion}/analisis{coleccion}.xlsx'
df_expandido.to_excel(output_path, index=False)

print("Todo hecho")

#print(df.head())
