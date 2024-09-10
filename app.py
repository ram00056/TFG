from flask import Flask, request, jsonify, session, send_file
import csv                                      # Gestionar Archivos CSV
import io                                       # Acceder a carpetas del sistema
from flask_cors import CORS                     # Para comunicarnos con la interfaz App.js
from flask_mysqldb import MySQL                 # Utilizar base de datos MySQL
from flask_bcrypt import Bcrypt                 # Para cifrar la contraseña y que no se vea en la base de datos
import os                                       # Gestionar los archivos subidos
from werkzeug.utils import secure_filename      # Eliminar caracteres especiales de la ruta del zip
import zipfile                                  # Para descomprimir los archivos
import pandas as pd                             # Para leer el fichero .xslx generado
import json                                     # Guardar las listas en la base de datos
import subprocess                               # Ejecutar instrucciones
import shutil                                   # Eliminar carpetas
import numpy as np                              # Realizar operaciones matemáticas
import ast                                      # Trabajar con listas
from collections import defaultdict             # Operaciones con colecciones
from collections import Counter                 # Operaciones con colecciones Contar
from scipy import stats                         # Para calcular la moda


app = Flask(__name__)
CORS(app)                                       # Comunicarnos con la interfaz

app.config['MYSQL_HOST'] = 'localhost'          # Host de la base de datos
app.config['MYSQL_USER'] = 'root'               # Nombre del usuario de la base de datos
app.config['MYSQL_DB'] = 'tfgcorpus'            # Nombre de la base de datos
mysql = MySQL(app)                              # Comunicación con base de datos

bcrypt = Bcrypt(app)                            # Para cifrar la contraseña

app.config['Archivos'] = 'archivos'  # Ruta donde se encuentran los archivos

app.config['SECRET_KEY'] = os.urandom(24) # Clave secreta para gestionar las sesiones

usuario_activo = None

# Inicio de Sesión
@app.route('/login', methods=['POST'])
def login():
    global usuario_activo

    data = request.json                         # Mensajes recibidos de la interfaz
    usuario = data.get('usuario')
    contraseña = data.get('contraseña')

    # Comprobar los usuarios existentes en la base de datos
    cursor = mysql.connection.cursor()          # Iniciar comunicación con Base de Datos
    cursor.execute('SELECT * FROM usuarios WHERE usuario = %s', (usuario,)) # Seleccionar todos los usuarios almacenados en la Base de Datos
    usuarios = cursor.fetchone()                    # Almacena los usuarios
    if usuarios:
        # Usuario existe, se verifica que la contraseña sea igual
        hashed_password = usuarios[2] 
        
        if bcrypt.check_password_hash(hashed_password, contraseña.encode('utf-8')):
            usuario_activo = usuario
            
            return jsonify({'message': 'Inicio de sesión exitoso'}), 200
        else:
            return jsonify({'error': 'La contraseña es incorrecta'}), 401
    else:
        # Usuario no existe, envía una respuesta indicando que el usuario no existe
        return jsonify({'error': 'El usuario no existe. Regístrate antes de iniciar sesión'}), 401

# Cerrar sesión
@app.route('/logout', methods=['POST'])
def logout():
    global usuario_activo
    usuario_activo = None
    return jsonify({'message': 'Sesión cerrada correctamente'}), 200

# Registro
@app.route('/registro', methods=['POST'])
def registro():
    global usuario_activo

    datos_usuario = request.json # Almacenar datos reccibidos de interfaz
    hashed_password = bcrypt.generate_password_hash(datos_usuario['contraseña']).decode('utf-8') # Cifrar contraseña
    
    try:
        # Añadir los datos del usuario a la base de datos
        cursor = mysql.connection.cursor() # Inicio comunicación con base de datos
        cursor.execute("INSERT INTO usuarios (usuario, contrasena, email, nombre, primerapellido) VALUES (%s, %s, %s, %s, %s)",
                    (datos_usuario['usuario'], hashed_password, datos_usuario['email'], datos_usuario['nombre'], datos_usuario['apellido'])) # Insertar datos en Tabla usuarios
        mysql.connection.commit() # Guardar cambios en la base de datos
        cursor.close()

        usuario_activo = datos_usuario['usuario']

        return jsonify({'mensaje': 'Usuario registrado correctamente'}), 200
    except Exception:
        return jsonify({'error': 'El nombre de usuario ya está en uso'}), 400

# Recuperar archivos para mostrar en colecciones
@app.route('/colecciones', methods=['GET'])
def colecciones():
    global usuario_activo

    usuario = usuario_activo

    if usuario == None:
        return jsonify({'error': 'No se ha iniciado sesion'}), 401
    else:
        # Coger las colecciones para el usuario loggeado
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT Id_C, Nombre_C FROM colecciones WHERE usuario = %s', (usuario,))
        colecciones_usu = cursor.fetchall()
        cursor.close()
        
        return jsonify(colecciones_usu)

# Ver contenido colecciones
@app.route('/colecciones/<int:index>/ViewColeccion', methods=['GET'])
def obtener_archivos_coleccion(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute('SELECT Nombre_C , Ruta_C FROM colecciones WHERE Id_C = %s', (index,))
        rutaArchivo = cursor.fetchall()

        nombres_archivos = []
        for nombre_archivo in os.listdir(rutaArchivo[0][1]):
            ruta_archivo = os.path.join(rutaArchivo[0][1], nombre_archivo)
            if os.path.isfile(ruta_archivo):
                nombres_archivos.append(nombre_archivo)
        cursor.close()
        
        return jsonify({'nombre_archivos': nombres_archivos, 'nombre_c': rutaArchivo[0][0]}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

#Ver contenido fichero
@app.route('/colecciones/<index>/archivo/<nombreArchivo>', methods=['GET'])
def get_archivo(index, nombreArchivo):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT Ruta_C FROM colecciones WHERE Id_C = %s', (index,))
        rutaArchivo = cursor.fetchone()

        if not rutaArchivo:
            return jsonify({'error': 'La colección no existe'}), 404

        directorio = rutaArchivo[0]
        filepath = os.path.join(directorio, nombreArchivo)

        if not os.path.exists(filepath):
            return jsonify({'error': 'El archivo no existe'}), 404

        # Para visualizarlo de manera correcta
        if nombreArchivo.endswith('.csv'):
            with open(filepath, 'r', encoding='utf-8') as file:
                csv_content = file.read()
            return jsonify({'filename': nombreArchivo, 'type': 'csv', 'content': csv_content})
        elif nombreArchivo.endswith('.json'):
            with open(filepath, 'r', encoding='utf-8') as file:
                json_content = json.load(file)
            return jsonify({'filename': nombreArchivo, 'type': 'json', 'content': json_content})
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Buscar Archivo CSV
def buscar_csv_en_carpeta(ruta_carpeta):
    try:
        # Verificar si la ruta de la carpeta existe
        if not os.path.exists(ruta_carpeta):
            print(f'La carpeta {ruta_carpeta} no existe.')
            return None
        
        # Obtener la lista de archivos en la carpeta
        archivos = os.listdir(ruta_carpeta)

        # Buscar el archivo CSV
        for archivo in archivos:
            if archivo.endswith('.csv'):
                return os.path.join(ruta_carpeta, archivo)

        # Si no se encontró ningún archivo CSV
        print(f'No se encontró ningún archivo CSV en la carpeta {ruta_carpeta}.')
        return None

    except Exception as e:
        print(f'Error al buscar archivos CSV en la carpeta {ruta_carpeta}: {str(e)}')
        return None

def convertir_a_lista_de_listas(cadena):
    try:
        # Usar ast.literal_eval para convertir la cadena a una lista de listas
        lista_de_listas = ast.literal_eval(cadena)
        # Verificar que realmente es una lista de listas de números
        if isinstance(lista_de_listas, list) and all(isinstance(sublista, list) for sublista in lista_de_listas) and all(isinstance(i, (int, float)) for sublista in lista_de_listas for i in sublista):
            return lista_de_listas
        else:
            raise ValueError("La estructura no es una lista de listas de números.")
    except Exception as e:
        print(f"Error al convertir la cadena a lista de listas: {cadena}")
        print(e)
        return None

# Función para convertir una lista de listas a un array de NumPy
def convertir_a_array(matriz):
    try:
        # Convertir la lista de listas a un array de NumPy
        return np.array(matriz, dtype=float)
    except Exception as e:
        print(f"Error al convertir la matriz a NumPy array: {matriz}")
        print(e)
        return None

# Función para calcular la media por posición de todas las matrices
def calcular_media_por_posicion(columna_bdlase):
    try:
        # Convertir cada cadena en la columna 'bdlase' a lista de listas
        matrices_convertidas = columna_bdlase.apply(eval).dropna()
        
        if len(matrices_convertidas) == 0:
            return None

        # Inicializar una lista para almacenar las medias por posición de todas las matrices
        medias_por_posicion = []

        # Calcular la media por posición para cada matriz
        for matriz_lista in matrices_convertidas:
            matriz_array = np.array(matriz_lista, dtype=float)
            media_por_posicion = np.mean(matriz_array, axis=0)
            medias_por_posicion.append(media_por_posicion.tolist())

        # Obtener la media total por posición (promedio de las medias por posición de todas las matrices)
        media_total_por_posicion = np.mean(medias_por_posicion, axis=0)

        # Formatear el resultado como una lista de 4 listas, cada una con 4 valores
        resultado_formateado = [media_total_por_posicion.tolist()] * 4
        
        return resultado_formateado

    except Exception as e:
        print(f"Error al procesar la media de las matrices: {e}")
        return None

def calcular_minimo_por_posicion(columna_bdlase):
    try:
        # Convertir cada cadena en la columna 'bdlase' a lista de listas
        matrices_convertidas = columna_bdlase.apply(eval).dropna()
        
        if len(matrices_convertidas) == 0:
            return None

        # Inicializar una lista para almacenar los mínimos por posición de todas las matrices
        minimos_por_posicion = []

        # Calcular el mínimo por posición para cada matriz
        for matriz_lista in matrices_convertidas:
            matriz_array = np.array(matriz_lista, dtype=float)
            minimo_por_posicion = np.min(matriz_array, axis=0)
            minimos_por_posicion.append(minimo_por_posicion.tolist())

        # Obtener el mínimo total por posición (mínimo de los mínimos por posición de todas las matrices)
        minimo_total_por_posicion = np.min(minimos_por_posicion, axis=0)

        # Formatear el resultado como una lista de 4 listas, cada una con 4 valores
        resultado_formateado = [minimo_total_por_posicion.tolist()] * 4
        
        return resultado_formateado

    except Exception as e:
        print(f"Error al procesar el minimo de las matrices: {e}")
        return None

def calcular_maximo_por_posicion(columna_bdlase):
    try:
        # Convertir cada cadena en la columna 'bdlase' a lista de listas
        matrices_convertidas = columna_bdlase.apply(eval).dropna()
        
        if len(matrices_convertidas) == 0:
            return None

        # Inicializar una lista para almacenar los máximos por posición de todas las matrices
        maximos_por_posicion = []

        # Calcular el máximo por posición para cada matriz
        for matriz_lista in matrices_convertidas:
            matriz_array = np.array(matriz_lista, dtype=float)
            maximo_por_posicion = np.max(matriz_array, axis=0)
            maximos_por_posicion.append(maximo_por_posicion.tolist())

        # Obtener el máximo total por posición (máximo de los máximos por posición de todas las matrices)
        maximo_total_por_posicion = np.max(maximos_por_posicion, axis=0)

        # Formatear el resultado como una lista de 4 listas, cada una con 4 valores
        resultado_formateado = [maximo_total_por_posicion.tolist()] * 4
        
        return resultado_formateado

    except Exception as e:
        print(f"Error al procesar el maximo de las matrices: {e}")
        return None


def calcular_varianza_por_posicion(columna_bdlase):
    try:
        # Convertir cada cadena en la columna 'bdlase' a lista de listas
        matrices_convertidas = columna_bdlase.apply(eval).dropna()
        
        if len(matrices_convertidas) == 0:
            return None

        # Inicializar una lista para almacenar las varianzas por posición de todas las matrices
        varianzas_por_posicion = []

        # Calcular la varianza por posición para cada matriz
        for matriz_lista in matrices_convertidas:
            matriz_array = np.array(matriz_lista, dtype=float)
            varianza_por_posicion = np.var(matriz_array, axis=0)
            varianzas_por_posicion.append(varianza_por_posicion.tolist())

        # Obtener la varianza total por posición (promedio de las varianzas por posición de todas las matrices)
        varianza_total_por_posicion = np.mean(varianzas_por_posicion, axis=0)

        # Formatear el resultado como una lista de 4 listas, cada una con 4 valores
        resultado_formateado = [varianza_total_por_posicion.tolist()] * 4
        
        return resultado_formateado

    except Exception as e:
        print(f"Error al procesar la varianza de las matrices: {e}")
        return None



def calcular_moda_por_posicion(columna_bdlase):
    try:
        # Convertir cada cadena en la columna 'bdlase' a lista de listas
        matrices_convertidas = columna_bdlase.apply(eval).dropna()
        
        if len(matrices_convertidas) == 0:
            return None

        # Inicializar una lista para almacenar las modas por posición de todas las matrices
        modas_por_posicion = []

        # Calcular la moda por posición para cada matriz
        for matriz_lista in matrices_convertidas:
            matriz_array = np.array(matriz_lista, dtype=float)
            moda_por_posicion = stats.mode(matriz_array, axis=0, nan_policy='omit').mode
            modas_por_posicion.append(moda_por_posicion)

        # Convertir la lista de listas de modas a un array de NumPy
        modas_array = np.array(modas_por_posicion)

        # Calcular la moda total por posición (moda de las modas por posición de todas las matrices)
        moda_total_por_posicion = stats.mode(modas_array, axis=0, nan_policy='omit').mode

        # Formatear el resultado como una lista de 4 listas, cada una con 4 valores
        resultado_formateado = [moda_total_por_posicion[0].tolist()] * 4
        
        return resultado_formateado

    except Exception as e:
        print(f"Error al procesar las matrices: {e}")
        return None

def calcular_media_columna(columna):
    try:
        media = np.mean(columna)
        return media
    
    except Exception as e:
        print(f"Error al calcular la media de la columna: {e}")
        return None

def calcular_minimo_columna(columna):
    try:
        minimo = np.min(columna)
        return minimo
    
    except Exception as e:
        print(f"Error al calcular el mínimo de la columna: {e}")
        return None
    
def calcular_maximo_columna(columna):
    try:
        maximo = np.max(columna)
        return maximo
    
    except Exception as e:
        print(f"Error al calcular el máximo de la columna: {e}")
        return None

def calcular_varianza_columna(columna):
    try:
        varianza = np.var(columna)
        return varianza
    
    except Exception as e:
        print(f"Error al calcular la varianza de la columna: {e}")
        return None
    

def calcular_moda_columna(columna):
    try:
        moda = stats.mode(columna, nan_policy='omit').mode
        return moda
    
    except Exception as e:
        print(f"Error al calcular la moda de la columna: {e}")
        return None

def calcular_media_en_columna(columna):
    try:
        # Convertir cada cadena en la columna a lista usando ast.literal_eval
        listas_numeros = columna.apply(ast.literal_eval)
        
        # Aplanar todas las listas en una sola lista
        todos_numeros = [num for sublist in listas_numeros for num in sublist]
        
        # Calcular la media
        if len(todos_numeros) == 0:
            return None
        media = sum(todos_numeros) / len(todos_numeros)

        # Retornar la media
        return media

    except Exception as e:
        print(f"Error al calcular la media en la columna: {e}")
        return None
    
def calcular_moda_en_columna(columna):
    try:
        # Convertir cada cadena en la columna a lista usando ast.literal_eval
        listas_numeros = columna.apply(ast.literal_eval)
        
        # Aplanar todas las listas en una sola lista
        todos_numeros = [num for sublist in listas_numeros for num in sublist]
        
        # Calcular la moda usando Counter
        if len(todos_numeros) == 0:
            return None
        contador = Counter(todos_numeros)
        moda = contador.most_common(1)[0][0]  # La moda es el elemento más común

        # Retornar la moda
        return moda

    except Exception as e:
        print(f"Error al calcular la moda en la columna: {e}")
        return None

def calcular_varianza_en_columna(columna):
    try:
        # Convertir cada cadena en la columna a lista usando ast.literal_eval
        listas_numeros = columna.apply(ast.literal_eval)
        
        # Aplanar todas las listas en una sola lista
        todos_numeros = [num for sublist in listas_numeros for num in sublist]
        
        # Calcular la varianza
        if len(todos_numeros) == 0:
            return None
        varianza = np.var(todos_numeros)

        # Retornar la varianza
        return varianza

    except Exception as e:
        print(f"Error al calcular la varianza en la columna: {e}")
        return None

def calcular_minimo_en_columna(columna):
    try:
        # Convertir cada cadena en la columna a lista usando ast.literal_eval
        listas_numeros = columna.apply(ast.literal_eval)
        
        # Aplanar todas las listas en una sola lista
        todos_numeros = [num for sublist in listas_numeros for num in sublist]
        
        # Calcular el mínimo
        if len(todos_numeros) == 0:
            return None
        minimo = min(todos_numeros)

        # Retornar el mínimo
        return minimo

    except Exception as e:
        print(f"Error al calcular el mínimo en la columna: {e}")
        return None
    
def calcular_maximo_en_columna(columna):
    try:
        # Convertir cada cadena en la columna a lista usando ast.literal_eval
        listas_numeros = columna.apply(ast.literal_eval)
        
        # Aplanar todas las listas en una sola lista
        todos_numeros = [num for sublist in listas_numeros for num in sublist]
        
        # Calcular el máximo
        if len(todos_numeros) == 0:
            return None
        maximo = max(todos_numeros)

        # Retornar el máximo
        return maximo

    except Exception as e:
        print(f"Error al calcular el máximo en la columna: {e}")
        return None

def sumar_columna(columna):
    try:
        # Sumar todos los valores de la columna
        suma_total = columna.sum()
        return suma_total
    except Exception as e:
        print(f"Error al sumar los valores de la columna: {e}")
        return None

# Para valores de NER


def agrupar_entidades_y_sumar(columna):
    entidades_totales = defaultdict(lambda: defaultdict(int))
    
    for i, fila_str in enumerate(columna):
        print(f"Procesando fila {i}: {fila_str}")  # Depuración
        
        try:
            # Convertir el string a diccionario usando ast.literal_eval
            fila = ast.literal_eval(fila_str)
            
            if not isinstance(fila, dict):
                raise ValueError(f"Dato no válido en la posición {i}: {fila_str}")
            
            for categoria, entidades in fila.items():
                if not isinstance(entidades, dict):
                    raise ValueError(f"Dato de entidades no válido para categoría {categoria}: {entidades}")
                
                for entidad, count in entidades.items():
                    if not isinstance(entidad, str):
                        raise ValueError(f"La entidad '{entidad}' no es una cadena válida")
                    if not isinstance(count, int):
                        raise ValueError(f"El conteo '{count}' no es un entero válido")
                    
                    entidades_totales[categoria][entidad] += count
        
        except Exception as e:
            print(f"Error en la fila {i}: {e}")
    
    # Convertir defaultdict a diccionario estándar antes de devolver el resultado
    entidades_totales_final = {categoria: dict(entidades) for categoria, entidades in entidades_totales.items()}
    
    return entidades_totales_final

def contar_entidades_por_categoria(columna):
    entidades_totales = defaultdict(set)
    
    for i, fila_str in enumerate(columna):
        print(f"Procesando fila {i}: {fila_str}")  # Depuración
        
        try:
            # Convertir el string a diccionario usando ast.literal_eval
            fila = ast.literal_eval(fila_str)
            
            if not isinstance(fila, dict):
                raise ValueError(f"Dato no válido en la posición {i}: {fila_str}")
            
            for categoria, entidades in fila.items():
                if not isinstance(entidades, dict):
                    raise ValueError(f"Dato de entidades no válido para categoría {categoria}: {entidades}")
                
                for entidad in entidades:
                    if not isinstance(entidad, str):
                        raise ValueError(f"La entidad '{entidad}' no es una cadena válida")
                    
                    entidades_totales[categoria].add(entidad)
        
        except Exception as e:
            print(f"Error en la fila {i}: {e}")
    
    # Contar el número de entidades únicas por categoría
    conteo_entidades = {categoria: len(entidades) for categoria, entidades in entidades_totales.items()}
    
    return conteo_entidades

# Para estilometria
def contar_elementos_en_columna(columna):
    conteo = defaultdict(int)
    
    for fila in columna:
        lista_tuplas = ast.literal_eval(fila)
        for elemento, cantidad in lista_tuplas:
            conteo[elemento] += cantidad
    
    resultado = sorted(conteo.items(), key=lambda x: x[1], reverse=True)
    
    return resultado

def sumar_conteos_entre_strings(columna):
    conteo_total = {}
    
    for item in columna:
        if isinstance(item, str):
            try:
                diccionario = ast.literal_eval(item)  # Convertir el string a diccionario
                for palabra, cantidad in diccionario.items():
                    conteo_total[palabra] = conteo_total.get(palabra, 0) + cantidad
            except (ValueError, SyntaxError) as e:
                print(f"Error: No se pudo convertir el string a diccionario: {item}")
        else:
            print(f"Error: El item no es un string válido: {item}")
    
    return conteo_total
    
# Para PolEmojis y PolEmoticonos
def calcular_proporciones(conteos):
    positive = conteos.get('positive', 0)
    negative = conteos.get('negative', 0)
    total = positive + negative
    
    if total == 0:
        return {'positive': 0, 'negative': 0}
    
    p_positive = positive / total
    p_negative = negative / total
    
    return {'positive': p_positive, 'negative': p_negative}

def extraer_emoticonos_por_polaridad(columna):
    emoticonos_polaridad = {'positive': set(), 'negative': set()}
    
    for item in columna:
        if isinstance(item, str):
            try:
                diccionario = ast.literal_eval(item)  # Convertir el string a diccionario
                for polaridad, emoticonos_set in diccionario.items():
                    if polaridad in emoticonos_polaridad:
                        emoticonos_polaridad[polaridad].update(emoticonos_set)
            except (ValueError, SyntaxError) as e:
                print(f"Error: No se pudo convertir el string a diccionario: {item}")
        else:
            print(f"Error: El item no es un string válido: {item}")
    
    return emoticonos_polaridad

def formatear_valores(df, columna):
    va_min = round(calcular_minimo_columna(df[columna]), 2)
    va_max = round(calcular_maximo_columna(df[columna]), 2)
    va_var = round(calcular_varianza_columna(df[columna]), 2)
    va_moda = round(calcular_moda_columna(df[columna]), 2)
    va_media = round(calcular_media_columna(df[columna]), 2)
    
    min_str = str(f"{va_min:.2f}")
    max_str = str(f"{va_max:.2f}")
    var_str = str(f"{va_var:.2f}")
    moda_str = str(f"{va_moda:.2f}")
    media_str = str(f"{va_media:.2f}")
    
    return "/".join([min_str, max_str, var_str, moda_str, media_str])

def formatear_valor(valor):
    return f"{valor:.2f}"

# Análisis Descriptivo
@app.route('/colecciones/<int:index>/analisisDescriptivo', methods=['GET'])
def analizar_archivos(index):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute('SELECT Nombre_C, Ruta_C, ruta_analisisDesc FROM colecciones WHERE Id_C = %s', (index,))
        rutaArchivoAux = cursor.fetchall()
        

        archivo_csv = buscar_csv_en_carpeta(rutaArchivoAux[0][1])
        if not rutaArchivoAux[0][2]:
            print("Haciendo el archivo")
            ejecutar_Archivo = f"python archivo.py {usuario_activo} {rutaArchivoAux[0][0]} {archivo_csv}"
            subprocess.run(ejecutar_Archivo, shell=True, check=True)
           
            ruta = f'./archivos/{usuario_activo}/analisis{rutaArchivoAux[0][0]}/analisis{rutaArchivoAux[0][0]}.xlsx'
            
            cursor.execute(f"UPDATE colecciones SET ruta_analisisDesc = '{ruta}' WHERE Id_C = {index}")

            
            mysql.connection.commit()


            #return jsonify({'nombre_c': rutaArchivo[0][0], 'ruta_analisis': rutaArchivo[0][1]}), 200

        #else:
            # Ejecutar el fichero que genera el .xlsx

            #Ejemplo 
        cursor.execute('SELECT Nombre_C, Ruta_C, ruta_analisisDesc FROM colecciones WHERE Id_C = %s', (index,))
        rutaArchivo = cursor.fetchall()
        
        print(rutaArchivo[0][2])

        df = pd.read_excel(rutaArchivo[0][2])                    
        
        #cursor.execute(f'SELECT analizado FROM volumetria WHERE Id_C = {index}')
        #estado[20] = 1
        

        #BDLASE (LUEGO PONER ATRÁS)

        va_bdlase_min = calcular_minimo_por_posicion(df['bdlase'])

        va_bdlase_max = calcular_maximo_por_posicion(df['bdlase'])
        
        va_bdlase_var = calcular_varianza_por_posicion(df['bdlase'])
        
        va_bdlse_moda = calcular_moda_por_posicion(df['bdlase'])
        
        va_bdlase_media = calcular_media_por_posicion(df['bdlase'])
        

        # Primero convertimos las listas a cadenas
        min_str = str(va_bdlase_min)
        max_str = str(va_bdlase_max)
        var_str = str(va_bdlase_var)
        moda_str = str(va_bdlse_moda)
        media_str = str(va_bdlase_media)

        # Luego las concatenamos con un delimitador, por ejemplo "/"
        v_bdlase = "/".join([min_str, max_str, var_str, moda_str, media_str])

        cursor.execute('SELECT id_bdlase FROM bdlase WHERE Id_C = %s', (index,))
        comprobarBDLASE = cursor.fetchall()
        if comprobarBDLASE == ():
            
            va_bdlase_min = calcular_minimo_por_posicion(df['bdlase'])
            va_bdlase_max = calcular_maximo_por_posicion(df['bdlase'])
            va_bdlase_var = calcular_varianza_por_posicion(df['bdlase'])
            va_bdlse_moda = calcular_moda_por_posicion(df['bdlase'])
            va_bdlase_media = calcular_media_por_posicion(df['bdlase'])

            # Primero convertimos las listas a cadenas
            min_str = str(va_bdlase_min)
            max_str = str(va_bdlase_max)
            var_str = str(va_bdlase_var)
            moda_str = str(va_bdlse_moda)
            media_str = str(va_bdlase_media)

            # Luego las concatenamos con un delimitador, por ejemplo "/"
            v_bdlase = "/".join([min_str, max_str, var_str, moda_str, media_str])



            cursor.execute("INSERT INTO bdlase (valor_bdlase, Id_C) VALUES (%s, %s)",
                (v_bdlase, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
            
        
        # Complejidad
        cursor.execute('SELECT id_complejidad FROM complejidad WHERE Id_C = %s', (index,))
        comprobarComplejidad = cursor.fetchall()

        #Número de Sentencias
        nSentencias = formatear_valores(df, 'complexitynSentences')
        
        # Número de Oraciones Complejas
        nSentenciasComplejas = formatear_valores(df, 'complexitynComplexSentence')

        # Media Longitud de Oraciones
        avglenSentence = formatear_valores(df, 'complexityavglenSentence')

        # Número de Signos de Puntuación
        nPuntuationMarks = formatear_valores(df, 'complexitynPuntuationMarks')
       
        # Número de Palabras
        nWords = formatear_valores(df, 'complexitynWords')

        # Número de Palabras Raras
        nRareWords = formatear_valores(df, 'complexitynRareWords')

        # Número de Sílabas
        nSyllabes = formatear_valores(df, 'complexitynSyllabes')
      
        # Número de Caracteres
        nChar = formatear_valores(df, 'complexitynChar')

        # ILFW
        ilfw = formatear_valores(df, 'complexityILFW')

        # LDI
        LDI = formatear_valores(df, 'complexityLDI')
        
        # LC
        LC = formatear_valores(df, 'complexityLC')

        # SSR
        SSR = formatear_valores(df, 'complexitySSR')

        # SCI
        SCI = formatear_valores(df, 'complexitySCI')

        # ARI
        ARI = formatear_valores(df, 'complexityARI')

        # Huerta
        huerta = formatear_valores(df, 'complexityhuerta')

        # IFSZ
        IFSZ = formatear_valores(df, 'complexityIFSZ')

        # Polini
        polini = formatear_valores(df, 'complexitypolini')

        # Mu
        mu = formatear_valores(df, 'complexitymu')

        # Min Age
        minage = formatear_valores(df, 'complexityminage')
        
        # SOL
        SOL = formatear_valores(df, 'complexitySOL')

        # Crawford
        crawford = formatear_valores(df, 'complexitycrawford')

        # Min Depth
        min_depth = formatear_valores(df, 'complexitymin_depth')

        # Max Depth
        max_depth = formatear_valores(df, 'complexitymax_depth')

        # Mean Depth
        mean_depth = formatear_valores(df, 'complexitymean_depth')
        

        if comprobarComplejidad == ():
            cursor.execute("INSERT INTO complejidad (n_oraciones, n_oraciones_c, media_long_oraciones, n_sig_punt, n_palabras, n_palabras_r, n_silabas, n_caracteres, ilfw, ldi, lc, ssr, sci, ari, huerta, ifsz, polini, mu, minage, sol, crawford, min_depth, max_depth, mean_depth, Id_C) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (nSentencias, nSentenciasComplejas, avglenSentence, nPuntuationMarks, nWords, nRareWords, nSyllabes, nChar, ilfw, LDI, LC, SSR, SCI, ARI, huerta, IFSZ, polini, mu, minage, SOL, crawford, min_depth, max_depth, mean_depth, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Emofinder
        cursor.execute('SELECT id_emofinder FROM emofinder WHERE Id_C = %s', (index,))
        comprobarEmofinder = cursor.fetchall()
        

        if comprobarEmofinder == ():

            va_emofinder_min = calcular_minimo_por_posicion(df['emofinder'])
            va_emofinder_max = calcular_maximo_por_posicion(df['emofinder'])
            va_emofinder_var = calcular_varianza_por_posicion(df['emofinder'])
            va_emofinder_moda = calcular_moda_por_posicion(df['emofinder'])
            va_emofinder_media = calcular_media_por_posicion(df['emofinder'])

            # Primero convertimos las listas a cadenas
            min_str = str(va_emofinder_min)
            max_str = str(va_emofinder_max)
            var_str = str(va_emofinder_var)
            moda_str = str(va_emofinder_moda)
            media_str = str(va_emofinder_media)

            # Luego las concatenamos con un delimitador, por ejemplo "/"
            v_emofinder = "/".join([min_str, max_str, var_str, moda_str, media_str])
            

            cursor.execute("INSERT INTO emofinder (v_emofinder, Id_C) VALUES (%s, %s)",
                (v_emofinder, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Polaridad Emojis
        cursor.execute('SELECT id_pol_emojis FROM polaridad_emojis WHERE Id_C = %s', (index,))
        comprobarPolEmojis = cursor.fetchall()
        
        
        if comprobarPolEmojis == ():
            numEmojisPolarity = sumar_conteos_entre_strings(df['emojiPolaritynumEmojisPolarity'])
            percentagePolarity = calcular_proporciones(df['emojiPolaritypercentageEmojisPolarity'])
            distinctEMojis = extraer_emoticonos_por_polaridad(df['emojiPolaritydistinctEmojiFounded'])
            cursor.execute("INSERT INTO polaridad_emojis (n_emojis, p_emojis, distint_emojis, Id_C) VALUES (%s, %s, %s, %s)",
                (numEmojisPolarity, percentagePolarity, distinctEMojis, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Emojis
        cursor.execute('SELECT id_emojis FROM emojis WHERE Id_C = %s', (index,))
        comprobarEmojis = cursor.fetchall()

        if comprobarEmojis == ():
            FreqEmoji = sumar_conteos_entre_strings(df['emojiFreqEmoji'])

            #Número de Emojis
            numEmojis = formatear_valores(df, 'emojiNumEmojis')

            cursor.execute("INSERT INTO emojis (frec_emojis, num_emojis, Id_C) VALUES (%s, %s, %s)",
                (FreqEmoji, numEmojis, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()

        # Polaridad Emoticonos
        cursor.execute('SELECT id_pol_emoticonos FROM polaridad_emoticonos WHERE Id_C = %s', (index,))
        comprobarPolEmoticonos = cursor.fetchall()

        if comprobarPolEmoticonos == ():
            numTextEmojisPolarity = sumar_conteos_entre_strings(df['emoticonsnumTextEmojisPolarity'])
            percentageTextEmojiPolarity = calcular_proporciones(df['emoticonspercentageTextEmojiPolarity'])
            distinctTextEmojiFounded = extraer_emoticonos_por_polaridad(df['emoticonsdistinctTextEmojiFounded'])
            cursor.execute("INSERT INTO polaridad_emoticonos (n_emoticonos, p_emoticonos, distint_emoticonos, Id_C) VALUES (%s, %s, %s, %s)",
                (numTextEmojisPolarity, percentageTextEmojiPolarity, distinctTextEmojiFounded, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Emociones
        cursor.execute('SELECT id_emociones FROM emociones WHERE Id_C = %s', (index,))
        comprobarEmociones = cursor.fetchall()

        if comprobarEmociones == ():
            
            # Otros
            others = formatear_valores(df, 'emotionothers')

            # Alegría
            joy = formatear_valores(df, 'emotionjoy')

            # Tristeza
            sadness = formatear_valores(df, 'emotionsadness')

            # Enfado
            anger = formatear_valores(df, 'emotionanger')

            # Sorpresa
            surprise = formatear_valores(df, 'emotionsurprise')

            # Disgusto
            disgust = formatear_valores(df, 'emotiondisgust')

            # Miedo
            fear = formatear_valores(df, 'emotionfear')            


            cursor.execute("INSERT INTO emociones (otros, alegria, tristeza, ira, sorpresa, asco, miedo, Id_C) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (others, joy, sadness, anger, surprise, disgust, fear, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()

        
        # Ironia
        cursor.execute('SELECT id_ironia FROM ironia WHERE Id_C = %s', (index,))
        comprobarIronia = cursor.fetchall()

        if comprobarIronia == ():

            # No Ironía
            NI = formatear_valores(df, 'ironityNI')

            # Ironía
            I = formatear_valores(df, 'ironityI')

            cursor.execute("INSERT INTO ironia (valor_no, valor_si, Id_C) VALUES (%s, %s, %s)",
                (NI, I, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # ISAL
        cursor.execute('SELECT id_isal FROM isal WHERE Id_C = %s', (index,))
        comprobarISAL = cursor.fetchall()

        if comprobarISAL == ():

            va_isal_min = calcular_minimo_por_posicion(df['isal'])
            va_isal_max = calcular_maximo_por_posicion(df['isal'])
            va_isal_var = calcular_varianza_por_posicion(df['isal'])
            va_isal_moda = calcular_moda_por_posicion(df['isal'])
            va_isal_media = calcular_media_por_posicion(df['isal'])

            # Primero convertimos las listas a cadenas
            min_str = str(va_isal_min)
            max_str = str(va_isal_max)
            var_str = str(va_isal_var)
            moda_str = str(va_isal_moda)
            media_str = str(va_isal_media)

            # Luego las concatenamos con un delimitador, por ejemplo "/"
            v_isal = "/".join([min_str, max_str, var_str, moda_str, media_str])
            

            cursor.execute("INSERT INTO isal (valor_isal, Id_C) VALUES (%s, %s)",
                (v_isal, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        

        # Lemas
        cursor.execute('SELECT id_lemas FROM lemas WHERE Id_C = %s', (index,))
        comprobarLemas = cursor.fetchall()

        if comprobarLemas == ():

            # Lemas Únicos
            uniqueLemmas = formatear_valores(df, 'lemmasuniqueLemmas')

            # Media Lemas
            avgLemmas = formatear_valores(df, 'lemmasavgLemmas')

            
            cursor.execute("INSERT INTO lemas (n_lemas_u, m_caracteres, Id_C) VALUES (%s, %s, %s)",
                (uniqueLemmas, avgLemmas, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        
        # Diversidad Léxica
        cursor.execute('SELECT id_diversidad FROM diversidad_lexica WHERE Id_C = %s', (index,))
        comprobarDivLex = cursor.fetchall()
        if comprobarDivLex == ():

            # Simple TTR
            SimpleTTR = formatear_valores(df, 'lexicalDiversitySimpleTTR')

            # Root TTR
            RootTTR = formatear_valores(df, 'lexicalDiversityRootTTR')

            # Log TTR
            LogTTR = formatear_valores(df, 'lexicalDiversityLogTTR')

            # Maas TTR
            MaasTTR = formatear_valores(df, 'lexicalDiversityMaasTTR')

            # MSTTR
            MSTTR = formatear_valores(df, 'lexicalDiversityMSTTR')

            # MATTR
            MATTR = formatear_valores(df, 'lexicalDiversityMATTR')

            # HDD
            HDD = formatear_valores(df, 'lexicalDiversityHDD')

            # MTLD
            MTLD = formatear_valores(df, 'lexicalDiversityMTLD')

            # MTLDMAWrap
            MTLDMAWrap = formatear_valores(df, 'lexicalDiversityMTLDMAWrap')

            # MTLDMABi
            MTLDMABi = formatear_valores(df, 'lexicalDiversityMTLDMABi')
            
            cursor.execute("INSERT INTO diversidad_lexica (p_simpleTTR, p_rootTTR, p_logTTR, p_maasTTR, p_MSTTR, p_MATTR, p_HDD, p_MLTD, p_MLTDMAWrap, p_MTLDMABi, Id_C) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (SimpleTTR, RootTTR, LogTTR, MaasTTR, MSTTR, MATTR, HDD, MTLD, MTLDMAWrap, MTLDMABi, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # LIWC
        cursor.execute('SELECT id_liwc FROM liwc WHERE Id_C = %s', (index,))
        comprobarLIWC = cursor.fetchall()
        

        if comprobarLIWC == ():

            va_liwc_min = calcular_minimo_por_posicion(df['liwc'])
            va_liwc_max = calcular_maximo_por_posicion(df['liwc'])
            va_liwc_var = calcular_varianza_por_posicion(df['liwc'])
            va_liwc_moda = calcular_moda_por_posicion(df['liwc'])
            va_liwc_media = calcular_media_por_posicion(df['liwc'])

            # Primero convertimos las listas a cadenas
            min_str = str(va_liwc_min)
            max_str = str(va_liwc_max)
            var_str = str(va_liwc_var)
            moda_str = str(va_liwc_moda)
            media_str = str(va_liwc_media)

            # Luego las concatenamos con un delimitador, por ejemplo "/"
            v_liwc = "/".join([min_str, max_str, var_str, moda_str, media_str])

            cursor.execute("INSERT INTO liwc (valor_liwc, Id_C) VALUES (%s, %s)",
                (v_liwc, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # NCR
        cursor.execute('SELECT id_ncr FROM ncr WHERE Id_C = %s', (index,))
        comprobarNCR = cursor.fetchall()
        

        if comprobarNCR == ():

            va_ncr_min = calcular_minimo_por_posicion(df['ncr'])
            va_ncr_max = calcular_maximo_por_posicion(df['ncr'])
            va_ncr_var = calcular_varianza_por_posicion(df['ncr'])
            va_ncr_moda = calcular_moda_por_posicion(df['ncr'])
            va_ncr_media = calcular_media_por_posicion(df['ncr'])

            # Primero convertimos las listas a cadenas
            min_str = str(va_ncr_min)
            max_str = str(va_ncr_max)
            var_str = str(va_ncr_var)
            moda_str = str(va_ncr_moda)
            media_str = str(va_ncr_media)

            # Luego las concatenamos con un delimitador, por ejemplo "/"
            v_ncr = "/".join([min_str, max_str, var_str, moda_str, media_str])
            
            cursor.execute("INSERT INTO ncr (valor_ncr, Id_C) VALUES (%s, %s)",
                (v_ncr, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # NER
        cursor.execute('SELECT id_ner FROM ner WHERE Id_C = %s', (index,))
        comprobarNER = cursor.fetchall()

        if comprobarNER == ():
            entidades = agrupar_entidades_y_sumar(df['NERentidades'])
            freqEntidades = contar_entidades_por_categoria(df['NERentidades'])
            print(freqEntidades)
            cursor.execute("INSERT INTO ner (entidades, frec_entidades, Id_C) VALUES (%s, %s, %s)",
                (entidades, freqEntidades, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # NGrams
        cursor.execute('SELECT id_ngrams FROM ngrams WHERE Id_C = %s', (index,))
        comprobarNGrams = cursor.fetchall()

        if comprobarNGrams == ():
            gramsfreqGramsUno = sumar_conteos_entre_strings(df['1-gramsfreqN-Grams'])
            gramsfreqGramsDos = sumar_conteos_entre_strings(df['2-gramsfreqN-Grams'])
            gramsfreqGramsTres = sumar_conteos_entre_strings(df['3-gramsfreqN-Grams'])
            gramsfreqGramsCuatro = sumar_conteos_entre_strings(df['4-gramsfreqN-Grams'])

            cursor.execute("INSERT INTO ngrams (frec_1grams, frec_2grams, frec_3grams, frec_4grams, Id_C) VALUES (%s, %s, %s, %s, %s)",
                (gramsfreqGramsUno, gramsfreqGramsDos, gramsfreqGramsTres, gramsfreqGramsCuatro, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Perplejidad
        cursor.execute('SELECT id_perplejidad FROM perplejidad WHERE Id_C = %s', (index,))
        comprobarPerplejidad = cursor.fetchall()

        if comprobarPerplejidad == ():
            
            perplexity = formatear_valores(df, 'perplexity')

            cursor.execute("INSERT INTO perplejidad (valor_perplejidad, Id_C) VALUES (%s, %s)",
                (perplexity, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        
        # Polaridad
        cursor.execute('SELECT id_polaridad FROM polaridad WHERE Id_C = %s', (index,))
        comprobarPolaridad = cursor.fetchall()

        if comprobarPolaridad == ():

            # Polaridad Positiva
            POS = formatear_valores(df, 'polarityPOS')

            # Polaridad Negativa
            NEG = formatear_valores(df, 'polarityNEG')

            # Polaridad Neutra
            NEU = formatear_valores(df, 'polarityNEU')

            cursor.execute("INSERT INTO polaridad (v_positiva, v_negativa, v_neutra, Id_C) VALUES (%s, %s, %s, %s)",
                (POS, NEG, NEU, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        #POS
        cursor.execute('SELECT id_pos FROM pos WHERE Id_C = %s', (index,))
        comprobarPOS = cursor.fetchall()
        
        if comprobarPOS == ():
            # Campos de suma
            campos_suma = [
                'FreqPOSCCONJ', 'FreqPOSSPACE', 'FreqPOSVERB', 'FreqPOSSYM', 'FreqPOSNUM',
                'FreqPOSNOUN', 'FreqPOSADJ', 'FreqPOSPUNCT', 'FreqPOSAUX', 'FreqPOSADV',
                'FreqPOSINTJ', 'FreqPOSDET', 'FreqPOSSCONJ', 'FreqPOSPROPN', 'FreqPOSPRON',
                'FreqPOSADP'
            ]

            # Campos relativos
            campos = [
                'RelFreqPOSCCONJ', 'RelFreqPOSSPACE', 'RelFreqPOSVERB', 'RelFreqPOSSYM',
                'RelFreqPOSNUM', 'RelFreqPOSNOUN', 'RelFreqPOSADJ', 'RelFreqPOSPUNCT', 'RelFreqPOSAUX',
                'RelFreqPOSADV', 'RelFreqPOSINTJ', 'RelFreqPOSDET', 'RelFreqPOSSCONJ', 'RelFreqPOSPROPN',
                'RelFreqPOSPRON', 'RelFreqPOSADP'
            ]

            # Crear una lista de valores a insertar
            valores_insertar = []

            # Procesar campos de suma
            for campo in campos_suma:
                if campo in df.columns:
                    va_min = calcular_minimo_columna(df[campo])
                    va_max = calcular_maximo_columna(df[campo])
                    va_var = calcular_varianza_columna(df[campo])
                    va_moda = calcular_moda_columna(df[campo])
                    va_media = calcular_media_columna(df[campo])

                    # Convertir los valores a cadenas con 2 decimales
                    min_str = formatear_valor(va_min)
                    max_str = formatear_valor(va_max)
                    var_str = formatear_valor(va_var)
                    moda_str = formatear_valor(va_moda)
                    media_str = formatear_valor(va_media)

                    # Concatenar con delimitador
                    valor = "/".join([min_str, max_str, var_str, moda_str, media_str])
                else:
                    # Valores predeterminados
                    va_min = 0
                    va_max = 0
                    va_var = 0
                    va_moda = 0
                    va_media = 0

                    # Convertir los valores a cadenas con 2 decimales
                    min_str = formatear_valor(va_min)
                    max_str = formatear_valor(va_max)
                    var_str = formatear_valor(va_var)
                    moda_str = formatear_valor(va_moda)
                    media_str = formatear_valor(va_media)

                    # Concatenar con delimitador
                    valor = "/".join([min_str, max_str, var_str, moda_str, media_str])

                valores_insertar.append(valor)

            # Procesar campos relativos
            for campo in campos:
                if campo in df.columns:
                    va_min = calcular_minimo_columna(df[campo])
                    va_max = calcular_maximo_columna(df[campo])
                    va_var = calcular_varianza_columna(df[campo])
                    va_moda = calcular_moda_columna(df[campo])
                    va_media = calcular_media_columna(df[campo])

                    # Convertir los valores a cadenas con 2 decimales
                    min_str = formatear_valor(va_min)
                    max_str = formatear_valor(va_max)
                    var_str = formatear_valor(va_var)
                    moda_str = formatear_valor(va_moda)
                    media_str = formatear_valor(va_media)

                    # Concatenar con delimitador
                    valor = "/".join([min_str, max_str, var_str, moda_str, media_str])
                else:
                    # Valores predeterminados
                    va_min = 0
                    va_max = 0
                    va_var = 0
                    va_moda = 0
                    va_media = 0

                    # Convertir los valores a cadenas con 2 decimales
                    min_str = formatear_valor(va_min)
                    max_str = formatear_valor(va_max)
                    var_str = formatear_valor(va_var)
                    moda_str = formatear_valor(va_moda)
                    media_str = formatear_valor(va_media)

                    # Concatenar con delimitador
                    valor = "/".join([min_str, max_str, var_str, moda_str, media_str])

                valores_insertar.append(valor)


            

            # Agregar el índice al final de los valores
            valores_insertar.append(index)
            # Crear la consulta SQL con placeholders
            sql_insert = """INSERT INTO pos (frec_conjunciones, frec_espacios, frec_verbos, frec_simbolos, frec_numeros, frec_sustantivos, frec_adjetivos, frec_sig_punt, frec_verb_aux, frec_adverbios, frec_interjecciones, frec_determinantes, frec_conj_sub, frec_nombres_prop, frec_pronon, frec_preposiciones, frec_rel_conj, frec_rel_espacios, frec_rel_verb, frec_rel_simb, frec_rel_num, frec_rel_sus, frec_rel_adj, frec_rel_sdp, frec_rel_vaux,
                    frec_rel_adv, frec_rel_interj, frec_rel_det, frec_rel_conjsub, frec_rel_nprop,
                    frec_rel_pronom, frec_rel_prep, Id_C
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s
                )
            """


            try:
                cursor.execute(sql_insert, valores_insertar)
            except Exception as e:
                print(f"Ocurre el error {e}")

            mysql.connection.commit()

        
        # Sel
        cursor.execute('SELECT id_sel FROM sel WHERE Id_C = %s', (index,))
        comprobarSEL = cursor.fetchall()
        

        if comprobarSEL == ():

            va_sel_min = calcular_minimo_por_posicion(df['sel'])
            va_sel_max = calcular_maximo_por_posicion(df['sel'])
            va_sel_var = calcular_varianza_por_posicion(df['sel'])
            va_sel_moda = calcular_moda_por_posicion(df['sel'])
            va_sel_media = calcular_media_por_posicion(df['sel'])

            # Primero convertimos las listas a cadenas
            min_str = str(va_sel_min)
            max_str = str(va_sel_max)
            var_str = str(va_sel_var)
            moda_str = str(va_sel_moda)
            media_str = str(va_sel_media)

            # Luego las concatenamos con un delimitador, por ejemplo "/"
            v_sel = "/".join([min_str, max_str, var_str, moda_str, media_str])
            
            cursor.execute("INSERT INTO sel (valor_sel, Id_C) VALUES (%s, %s)",
                (v_sel, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Estilometria
        cursor.execute('SELECT id_estilometria FROM estilometria WHERE Id_C = %s', (index,))
        comprobarEstil = cursor.fetchall()
        if comprobarEstil == ():
            
            # Palabras Únicas
            uniqueWords = formatear_valores(df, 'stylometryuniqueWords')

            # TTR
            TTR = formatear_valores(df, 'stylometryTTR')

            # RTTR
            RTTR = formatear_valores(df, 'stylometryRTTR')

            # Herdan
            Herdan = formatear_valores(df, 'stylometryHerdan')

            # Mass
            Mass = formatear_valores(df, 'stylometryMass')

            # Somers
            Somers = formatear_valores(df, 'stylometrySomers')

            # Dugast
            Dugast = formatear_valores(df, 'stylometryDugast')

            # Honore
            Honore = formatear_valores(df, 'stylometryHonore')

            FreqStopWords = json.dumps(contar_elementos_en_columna(df['stylometryFreqStopWords']))
            FreqPuntuationMarks = json.dumps(contar_elementos_en_columna(df['stylometryFreqPuntuationMarks']))

            cursor.execute("INSERT INTO estilometria (palabras_unicas, p_ttr, p_rttr, p_herdan, p_maas, p_somers, p_dugast, p_honore, frec_stopwords, frec_sdp, Id_C) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (uniqueWords, TTR, RTTR, Herdan, Mass, Somers, Dugast, Honore, FreqStopWords, FreqPuntuationMarks, index)) # Insertar datos en Tabla bdlase
            mysql.connection.commit()
        
        # Volumetria
        cursor.execute('SELECT id_volumetria FROM volumetria WHERE Id_C = %s', (index,))
        comprobarVolumetria = cursor.fetchall()
        
        if comprobarVolumetria == ():
            
            # Palabras
            words = formatear_valores(df, 'volumetrywords')

            # Palabras Únicas
            uniqueWords = formatear_valores(df, 'volumetryuniqueWords')

            # Caracteres
            chars = formatear_valores(df, 'volumetrychars')

            # Media longitud de palabras
            avgWordsLen = formatear_valores(df, 'volumetryavgWordsLen')
 

            cursor.execute("INSERT INTO volumetria (n_palabras, n_palabras_unicas, n_caracteres, m_longitud_palabras, Id_C) VALUES (%s, %s, %s, %s, %s)",
                (words, uniqueWords, chars, avgWordsLen, index)) # Insertar datos en Tabla volumetria
            mysql.connection.commit()
            
        
            
            
            

        tablasAnalizar = ['bdlase', 'complejidad', 'emofinder', 'emojis', 'polaridad_emojis', 'polaridad_emoticonos', 'emociones', 'ironia', 'isal', 'lemas', 'diversidad_lexica', 'liwc', 'ncr', 'ner', 'ngrams', 'perplejidad', 'polaridad', 'pos', 'sel', 'estilometria', 'volumetria']
        estado = []
        for tabla in tablasAnalizar:
            #estado.append(0)   
            cursor.execute(f'SELECT analizado FROM {tabla} WHERE Id_C = {index}')
            valor = cursor.fetchall()
            if valor:
                estado.append(valor[0][0])
            else:
                estado.append(0)

        print(estado)    

        # Descomprimir el archivo ZIP y obtener la lista de archivos
        #with zipfile.ZipFile(rutaArchivo[0][1], 'r') as archivos:
        #    lista_archivos = archivos.namelist()
        #    nombres_archivos = [os.path.basename(info.filename) for info in archivos.infolist() if not info.is_dir()] # Sacar el nombre de los archivos pero no sacar el del directorio

        cursor.close()

        #TENGO QUE AÑADIR EL ESTADO PARA PASARSELO Y LUEGO YA GESTIONARLO EN EL OTRO LADO

        return jsonify({'nombre_c': rutaArchivo[0][0], 'analizado': estado}), 200

        #return jsonify({'archivos': lista_archivos, 'nombre_archivos': nombres_archivos, 'nombre_c': rutaArchivo[0][0]}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400
    
# Actualizar estado
@app.route('/colecciones/<int:index>/actualizarEstado/<string:label>', methods=['PUT'])
def actualizar_estado(index, label):
    try:
        data = request.json
        estado = data['estado']

        # Validar que el estado sea 1 o 0
        if estado not in [0, 1]:
            return jsonify({'error': 'El estado debe ser 0 o 1'}), 400

        if label == 'Diversidad Lexica':
            label = 'diversidad_lexica'
        
        if label == 'N-Grams':
            label = 'ngrams'

        if label == 'Polaridad Emojis':
            label = 'polaridad_emojis'
        
        if label == 'Polaridad Emoticonos':
            label = 'polaridad_emoticonos'
            
        # Actualizar el estado en la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute(f"UPDATE {label} SET analizado = %s WHERE Id_C = %s", (estado, index))
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': f'Estado actualizado para {label}'}), 200

    except Exception as e:
        return jsonify({'error': 'Error al actualizar el estado'}), 400

# Ver BDLASE
@app.route('/colecciones/<int:index>/VerBDLASE/', methods=['GET'])
def obtener_bdlase(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        
        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT valor_bdlase FROM bdlase WHERE Id_C = %s', (index,))
        
        bdlase = cursor.fetchall()
        v_vdlase = bdlase[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'v_vdlase': v_vdlase}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Complejidad
@app.route('/colecciones/<int:index>/VerComplejidad/', methods=['GET'])
def obtener_Complejidad(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        
        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT n_oraciones, n_oraciones_c, media_long_oraciones, n_sig_punt, n_palabras, n_palabras_r, n_silabas, n_caracteres, ilfw, ldi, lc, ssr, sci, ari, huerta, ifsz, polini, mu, minage, sol, crawford, min_depth, max_depth, mean_depth FROM complejidad WHERE Id_C = %s', (index,))
        
        complejidad = cursor.fetchall()
        n_oraciones = complejidad[0][0]
        n_oraciones_c = complejidad[0][1]
        media_long_oraciones = complejidad[0][2]
        n_sig_punt = complejidad[0][3]
        n_palabras = complejidad[0][4]
        n_palabras_r = complejidad[0][5]
        n_silabas = complejidad[0][6]
        n_caracteres = complejidad[0][7]
        ilfw = complejidad[0][8]
        ldi = complejidad[0][9]
        lc = complejidad[0][10]
        ssr = complejidad[0][11]
        sci = complejidad[0][12]
        ari = complejidad[0][13]
        huerta = complejidad[0][14]
        ifsz = complejidad[0][15]
        polini = complejidad[0][16]
        mu = complejidad[0][17]
        minage = complejidad[0][18]
        sol = complejidad[0][19]
        crawford = complejidad[0][20]
        min_depth = complejidad[0][21]
        max_depth = complejidad[0][22]
        mean_depth = complejidad[0][23]


        

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()
        
        

        return jsonify({'nombre_c': nombre, 'n_oraciones': n_oraciones, 'n_oraciones_c': n_oraciones_c, 'media_long_oraciones': media_long_oraciones, 'n_sig_punt': n_sig_punt, 'n_palabras': n_palabras, 'n_palabras_r': n_palabras_r, 'n_silabas': n_silabas, 'n_caracteres': n_caracteres, 'ilfw': ilfw, 'ldi': ldi, 'lc': lc, 'ssr': ssr, 'sci': sci, 'ari': ari, 'huerta': huerta, 'ifsz': ifsz, 'polini': polini, 'mu': mu, 'minage': minage, 'sol': sol, 'crawford': crawford, 'min_depth': min_depth, 'max_depth': max_depth, 'mean_depth': mean_depth }), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Emofinder
@app.route('/colecciones/<int:index>/VerEmofinder/', methods=['GET'])
def obtener_Emofinder(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT v_emofinder FROM emofinder WHERE Id_C = %s', (index,))
        emofinder = cursor.fetchall()[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'v_emofinder': emofinder}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Emojis
@app.route('/colecciones/<int:index>/VerEmojis/', methods=['GET'])
def obtener_Emojis(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT frec_emojis, num_emojis FROM emojis WHERE Id_C = %s', (index,))
        emojis = cursor.fetchall()
        frec_emojis = emojis[0][0]
        num_emojis = emojis[0][1]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'frec_emojis': frec_emojis, 'num_emojis': num_emojis}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Polaridad Emojis
@app.route('/colecciones/<int:index>/VerPolaridadEmojis/', methods=['GET'])
def obtener_PolaridadEmojis(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT n_emojis, p_emojis, distint_emojis FROM polaridad_emojis WHERE Id_C = %s', (index,))
        pol_emojis = cursor.fetchall()
        n_emojis = pol_emojis[0][0]
        p_emojis = pol_emojis[0][1]
        distint_emojis = pol_emojis[0][2]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'n_emojis': n_emojis, 'p_emojis': p_emojis, 'distint_emojis': distint_emojis}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Polaridad Emoticonos
@app.route('/colecciones/<int:index>/VerPolaridadEmoticonos/', methods=['GET'])
def obtener_PolaridadEmoticonos(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT n_emoticonos, p_emoticonos, distint_emoticonos FROM polaridad_emoticonos WHERE Id_C = %s', (index,))
        pol_emoticonos = cursor.fetchall()
        n_emoticonos = pol_emoticonos[0][0]
        p_emoticonos = pol_emoticonos[0][1]
        distint_emoticonos = pol_emoticonos[0][2]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'n_emoticonos': n_emoticonos, 'p_emoticonos': p_emoticonos, 'distint_emoticonos': distint_emoticonos}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Emociones
@app.route('/colecciones/<int:index>/VerEmociones/', methods=['GET'])
def obtener_Emociones(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT otros, alegria, tristeza, ira, sorpresa, asco, miedo FROM emociones WHERE Id_C = %s', (index,))
        emociones = cursor.fetchall()
        otros = emociones[0][0]
        alegria = emociones[0][1]
        tristeza = emociones[0][2]
        ira = emociones[0][3]
        sorpresa = emociones[0][4]
        asco = emociones[0][5]
        miedo = emociones[0][6]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'otros': otros, 'alegria': alegria, 'tristeza': tristeza, 'ira': ira, 'sorpresa': sorpresa, 'asco': asco, 'miedo': miedo}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Ironia
@app.route('/colecciones/<int:index>/VerIronia/', methods=['GET'])
def obtener_Ironia(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT valor_no, valor_si FROM ironia WHERE Id_C = %s', (index,))
        ironia = cursor.fetchall()
        valor_no = ironia[0][0]
        valor_si = ironia[0][1]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'valor_no': valor_no, 'valor_si': valor_si}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver ISAL
@app.route('/colecciones/<int:index>/VerISAL/', methods=['GET'])
def obtener_ISAL(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT valor_isal FROM isal WHERE Id_C = %s', (index,))
        isal = cursor.fetchall()[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'valor_isal': isal}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Lemas
@app.route('/colecciones/<int:index>/VerLemas/', methods=['GET'])
def obtener_Lemas(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT n_lemas_u, m_caracteres FROM lemas WHERE Id_C = %s', (index,))
        lemas = cursor.fetchall()
        n_lemas_u = lemas[0][0]
        m_caracteres = lemas[0][1]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'n_lemas_u': n_lemas_u, 'm_caracteres': m_caracteres}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Diversidad Léxica
@app.route('/colecciones/<int:index>/VerDiversidadLexica/', methods=['GET'])
def obtener_DiversidadLexica(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT p_simpleTTR, p_rootTTR, p_logTTR, p_maasTTR, p_MSTTR, p_MATTR, p_HDD, p_MLTD, p_MLTDMAWrap, p_MTLDMABi FROM diversidad_lexica WHERE Id_C = %s', (index,))
        div_lexica = cursor.fetchall()
        p_simpleTTR = div_lexica[0][0]
        p_rootTTR = div_lexica[0][1]
        p_logTTR = div_lexica[0][2]
        p_maasTTR = div_lexica[0][3]
        p_MSTTR = div_lexica[0][4]
        p_MATTR = div_lexica[0][5]
        p_HDD = div_lexica[0][6]
        p_MLTD = div_lexica[0][7]
        p_MLTDMAWrap = div_lexica[0][8]
        p_MTLDMABi = div_lexica[0][9]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'p_simpleTTR': p_simpleTTR, 'p_rootTTR': p_rootTTR, 'p_logTTR': p_logTTR, 'p_maasTTR': p_maasTTR, 'p_MSTTR': p_MSTTR, 'p_MATTR': p_MATTR, 'p_HDD': p_HDD, 'p_MLTD': p_MLTD, 'p_MLTDMAWrap': p_MLTDMAWrap, 'p_MTLDMABi': p_MTLDMABi}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Liwc
@app.route('/colecciones/<int:index>/VerLIWC/', methods=['GET'])
def obtener_liwc(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT valor_liwc FROM liwc WHERE Id_C = %s', (index,))
        liwc = cursor.fetchall()
        valor_liwc = liwc[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'valor_liwc': valor_liwc}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver NCR
@app.route('/colecciones/<int:index>/VerNCR/', methods=['GET'])
def obtener_ncr(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT valor_ncr FROM ncr WHERE Id_C = %s', (index,))
        ncr = cursor.fetchall()
        valor_ncr = ncr[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'valor_ncr': valor_ncr}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver NER
@app.route('/colecciones/<int:index>/VerNER/', methods=['GET'])
def obtener_ner(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT entidades, frec_entidades FROM ner WHERE Id_C = %s', (index,))
        ner = cursor.fetchall()
        entidades = ner[0][0]
        frec_entidades = ner[0][1]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'entidades': entidades, 'frec_entidades': frec_entidades}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver NGrams
@app.route('/colecciones/<int:index>/VerNGrams/', methods=['GET'])
def obtener_ngrams(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT frec_1grams, frec_2grams, frec_3grams, frec_4grams FROM ngrams WHERE Id_C = %s', (index,))
        ngrams = cursor.fetchall()
        frec_1grams = ngrams[0][0]
        frec_2grams = ngrams[0][1]
        frec_3grams = ngrams[0][2]
        frec_4grams = ngrams[0][3]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'frec_1grams': frec_1grams, 'frec_2grams': frec_2grams, 'frec_3grams': frec_3grams, 'frec_4grams': frec_4grams}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Perplejidad
@app.route('/colecciones/<int:index>/VerPerplejidad/', methods=['GET'])
def obtener_perplejidad(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT valor_perplejidad FROM perplejidad WHERE Id_C = %s', (index,))
        perplejidad = cursor.fetchall()[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'valor_perplejidad': perplejidad}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Polaridad
@app.route('/colecciones/<int:index>/VerPolaridad/', methods=['GET'])
def obtener_polaridad(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT v_positiva, v_negativa, v_neutra FROM polaridad WHERE Id_C = %s', (index,))
        polaridad = cursor.fetchall()
        v_positiva = polaridad[0][0]
        v_negativa = polaridad[0][1]
        v_neutra = polaridad[0][2]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'v_positiva': v_positiva, 'v_negativa': v_negativa, 'v_neutra': v_neutra}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver POS
@app.route('/colecciones/<int:index>/VerPOS/', methods=['GET'])
def obtener_pos(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT frec_conjunciones, frec_espacios, frec_verbos, frec_simbolos, frec_numeros, frec_sustantivos, frec_adjetivos, frec_sig_punt, frec_verb_aux, frec_adverbios, frec_interjecciones, frec_determinantes, frec_conj_sub, frec_nombres_prop, frec_pronon, frec_preposiciones, frec_rel_conj, frec_rel_espacios, frec_rel_verb, frec_rel_simb, frec_rel_num, frec_rel_sus, frec_rel_adj, frec_rel_sdp, frec_rel_vaux, frec_rel_adv, frec_rel_interj, frec_rel_det, frec_rel_conjsub, frec_rel_nprop, frec_rel_pronom, frec_rel_prep FROM pos WHERE Id_C = %s', (index,))
        pos = cursor.fetchall()
        frec_conjunciones = pos[0][0]
        frec_espacios = pos[0][1]
        frec_verbos = pos[0][2]
        frec_simbolos = pos[0][3]
        frec_numeros = pos[0][4]
        frec_sustantivos = pos[0][5]
        frec_adjetivos = pos[0][6]
        frec_sig_punt = pos[0][7]
        frec_verb_aux = pos[0][8]
        frec_adverbios = pos[0][9]
        frec_interjecciones = pos[0][10]
        frec_determinantes = pos[0][11]
        frec_conj_sub = pos[0][12]
        frec_nombres_prop = pos[0][13]
        frec_pronon = pos[0][14]
        frec_preposiciones = pos[0][15]
        frec_rel_conj = pos[0][16]
        frec_rel_espacios = pos[0][17]
        frec_rel_verb = pos[0][18]
        frec_rel_simb = pos[0][19]
        frec_rel_num = pos[0][20]
        frec_rel_sus = pos[0][21]
        frec_rel_adj = pos[0][22]
        frec_rel_sdp = pos[0][23]
        frec_rel_vaux = pos[0][24]
        frec_rel_adv = pos[0][25]
        frec_rel_interj = pos[0][26]
        frec_rel_det = pos[0][27]
        frec_rel_conjsub = pos[0][27]
        frec_rel_nprop = pos[0][28]
        frec_rel_pronom = pos[0][29]
        frec_rel_prep = pos[0][30]


        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'frec_conjunciones': frec_conjunciones, 'frec_espacios': frec_espacios, 'frec_verbos': frec_verbos, 'frec_simbolos': frec_simbolos, 'frec_numeros': frec_numeros, 'frec_sustantivos': frec_sustantivos, 'frec_adjetivos': frec_adjetivos, 'frec_sig_punt': frec_sig_punt, 'frec_verb_aux': frec_verb_aux, 'frec_adverbios': frec_adverbios, 'frec_interjecciones': frec_interjecciones, 'frec_determinantes': frec_determinantes, 'frec_conj_sub': frec_conj_sub, 'frec_nombres_prop': frec_nombres_prop, 'frec_pronon': frec_pronon, 'frec_preposiciones': frec_preposiciones, 'frec_rel_conj': frec_rel_conj, 'frec_rel_espacios': frec_rel_espacios, 'frec_rel_verb': frec_rel_verb, 'frec_rel_simb': frec_rel_simb, 'frec_rel_num': frec_rel_num, 'frec_rel_sus': frec_rel_sus, 'frec_rel_adj': frec_rel_adj, 'frec_rel_sdp': frec_rel_sdp, 'frec_rel_vaux': frec_rel_vaux, 'frec_rel_adv': frec_rel_adv, 'frec_rel_interj': frec_rel_interj, 'frec_rel_det': frec_rel_det, 'frec_rel_conjsub': frec_rel_conjsub, 'frec_rel_nprop': frec_rel_nprop, 'frec_rel_pronom': frec_rel_pronom, 'frec_rel_prep': frec_rel_prep}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Ver Estilometría
@app.route('/colecciones/<int:index>/VerEstilometria/', methods=['GET'])
def obtener_estilometria(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT palabras_unicas, p_ttr, p_rttr, p_herdan, p_maas, p_somers, p_dugast, p_honore, frec_stopwords, frec_sdp FROM estilometria WHERE Id_C = %s', (index,))
        estilometria = cursor.fetchall()
        palabras_unicas = estilometria[0][0]
        p_ttr = estilometria[0][1]
        p_rttr = estilometria[0][2]
        p_herdan = estilometria[0][3]
        p_maas = estilometria[0][4]
        p_somers = estilometria[0][5]
        p_dugast = estilometria[0][6]
        p_honore = estilometria[0][7]
        frec_stopwords = estilometria[0][8]
        frec_sdp = estilometria[0][9]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'palabras_unicas': palabras_unicas, 'p_ttr': p_ttr, 'p_rttr': p_rttr, 'p_herdan': p_herdan, 'p_maas': p_maas, 'p_somers': p_somers, 'p_dugast': p_dugast, 'p_honore': p_honore, 'frec_stopwords': frec_stopwords, 'frec_sdp': frec_sdp}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver Estilometría de la colección'}), 400

# Ver SEL
@app.route('/colecciones/<int:index>/VerSEL/', methods=['GET'])
def obtener_sel(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT valor_sel FROM sel WHERE Id_C = %s', (index,))
        sel = cursor.fetchall()
        valor_sel = sel[0][0]

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()

        return jsonify({'nombre_c': nombre, 'valor_sel': valor_sel}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver SEL de la colección'}), 400

# Ver Volumetria
@app.route('/colecciones/<int:index>/VerVolumetria/', methods=['GET'])
def obtener_volumetria(index):
    try:
        global usuario_activo
        cursor = mysql.connection.cursor()

        
        # Coge de la base de datos los valores a mostrar
        cursor.execute('SELECT n_palabras , n_caracteres, n_palabras_unicas, m_longitud_palabras FROM volumetria WHERE Id_C = %s', (index,))
        
        volumetria = cursor.fetchall()
        n_palabras = volumetria[0][0]
        n_caracteres = volumetria[0][1]
        n_palabras_unicas = volumetria[0][2]
        m_longitud_palabras = volumetria[0][3]

        

        cursor.execute('SELECT Nombre_C FROM colecciones WHERE Id_C = %s', (index,))
        nombre = cursor.fetchall()[0][0]
        cursor.close()
        
        

        return jsonify({'nombre_c': nombre, 'n_palabras': n_palabras, 'n_caracteres': n_caracteres, 'n_palabras_unicas': n_palabras_unicas, 'm_longitud_palabras': m_longitud_palabras}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Análisis Contrastivo
@app.route('/colecciones/<int:index>/analisisContrastivo', methods=['GET'])
def analizar_archivos_contrastivo(index):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute('SELECT Nombre_C , Ruta_C, ruta_analisisDesc FROM colecciones WHERE Id_C = %s', (index,))
        rutaArchivo = cursor.fetchall()

        # Descomprimir el archivo ZIP y obtener la lista de archivos
        nombres_archivos = []
        for nombre_archivo in os.listdir(rutaArchivo[0][1]):
            ruta_archivo = os.path.join(rutaArchivo[0][1], nombre_archivo)
            if os.path.isfile(ruta_archivo):
                nombres_archivos.append(nombre_archivo)
        
        cursor.close()

        return jsonify({'nombre_archivos': nombres_archivos, 'nombre_c': rutaArchivo[0][0], 'rutaColeccion': rutaArchivo[0][2]}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver la colección'}), 400

# Realizar Análisis Contrastivo
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/analizado',  methods=['GET'])
def analizar_contrastivo(indexColeccion, indexComparar):
    try:

        global usuario_activo

        cursor = mysql.connection.cursor()
        
        cursor.execute(f'SELECT ruta_analisisDesc, Nombre_C FROM colecciones WHERE Id_C = {indexComparar}')
        comparacion = cursor.fetchall()
        rutaComparar = comparacion[0][0]
        nombre_Cuno = comparacion[0][1]
        


        if(rutaComparar):
            cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
            rutas = cursor.fetchall()

            if not rutas:
                cursor.execute(f'SELECT ruta_analisisDesc, Nombre_C FROM colecciones WHERE Id_C = {indexColeccion}')
                coleccion = cursor.fetchall()
                rutaColeccion = coleccion[0][0]
                nombre_Cdos = coleccion[0][1]

                
                ejecutar_Archivo = f"python pruebaContrastivo.py {rutaColeccion} {rutaComparar} {usuario_activo}"
                subprocess.run(ejecutar_Archivo, shell=True, check=True)

                rutaNormal = f'./archivos/{usuario_activo}/analisisContrastivo/analisis{nombre_Cdos}{nombre_Cuno}/testNormalidad{nombre_Cdos}{nombre_Cuno}.xlsx'
                rutaParam = f'./archivos/{usuario_activo}/analisisContrastivo/analisis{nombre_Cdos}{nombre_Cuno}/testParametricos{nombre_Cdos}{nombre_Cuno}.xlsx'
                rutaNoParam = f'./archivos/{usuario_activo}/analisisContrastivo/analisis{nombre_Cdos}{nombre_Cuno}/testNoParametricos{nombre_Cdos}{nombre_Cuno}.xlsx'

                cursor.execute(f"INSERT INTO analisiscontrastivo (rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal, Id_Cuno, Id_Cdos) VALUES ('{rutaParam}', '{rutaNoParam}', '{rutaNormal}', {indexColeccion}, {indexComparar})")

                
            mysql.connection.commit()

            cursor.close()



        return jsonify({'rutaComparacion': rutaComparar}), 200

    except Exception as e:
        return jsonify({'error': 'Esta colección no ha sido analizada'}), 400
    
# Análisis Contrastivo Comprobacion analizados
@app.route('/colecciones/<int:index1>/comparar/<int:index2>', methods=['GET'])
def comparar_colecciones(index1, index2):
    try:
        cursor = mysql.connection.cursor()

        # Tablas con características numéricas
        tablasAnalizar = ['complejidad', 'emociones', 'ironia', 'lemas', 'diversidad_lexica', 'perplejidad', 'polaridad', 'pos', 'estilometria', 'volumetria']
        comunes = []
        # Obtener características con valor de análisis 1 para la colección index1
        for tabla in tablasAnalizar:
            cursor.execute(f'SELECT analizado FROM {tabla} WHERE Id_C = {index1}')
            if cursor.fetchall()[0][0] == 1:
                cursor.execute(f'SELECT analizado FROM {tabla} WHERE Id_C = {index2}')
                if cursor.fetchall()[0][0] == 1:
                    comunes.append(tabla)

        cursor.close()

        print(comunes)

        return jsonify({'comunes': comunes}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido comparar las colecciones'}), 400

# Para obtener los valores de la fila 
def obtener_valores_fila(df, fila_nombre):
    if fila_nombre in df.index:
        fila = df.loc[fila_nombre]
        valores_formateados = []

        for valor in fila:
            if isinstance(valor, (int, float)):
                valores_formateados.append(f"{valor:.2f}")
            else:
                valores_formateados.append(valor)
        
        return valores_formateados
    else:
        return None





# Realizar Análisis Contrastivo Complejidad
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/complejidad',  methods=['GET'])
def VerContrastivoComplejidad(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]
        
        

        #Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')
        
        #Número de Sentencias
        nSentencias_normal = obtener_valores_fila(df_normal, 'complexitynSentences')
        
        # Número de Oraciones Complejas
        nSentenciasComplejas_normal = obtener_valores_fila(df_normal, 'complexitynComplexSentence')

        # Media Longitud de Oraciones
        avglenSentence_normal = obtener_valores_fila(df_normal, 'complexityavglenSentence')

        # Número de Signos de Puntuación
        nPuntuationMarks_normal = obtener_valores_fila(df_normal, 'complexitynPuntuationMarks')
       
        # Número de Palabras
        nWords_normal = obtener_valores_fila(df_normal, 'complexitynWords')

        # Número de Palabras Raras
        nRareWords_normal = obtener_valores_fila(df_normal, 'complexitynRareWords')

        # Número de Sílabas
        nSyllabes_normal = obtener_valores_fila(df_normal, 'complexitynSyllabes')
      
        # Número de Caracteres
        nChar_normal = obtener_valores_fila(df_normal, 'complexitynChar')

        # ILFW
        ilfw_normal = obtener_valores_fila(df_normal, 'complexityILFW')

        # LDI
        LDI_normal = obtener_valores_fila(df_normal, 'complexityLDI')
        
        # LC
        LC_normal = obtener_valores_fila(df_normal, 'complexityLC')

        # SSR
        SSR_normal = obtener_valores_fila(df_normal, 'complexitySSR')

        # SCI
        SCI_normal = obtener_valores_fila(df_normal, 'complexitySCI')
        
        # ARI
        ARI_normal = obtener_valores_fila(df_normal, 'complexityARI')

        # Huerta
        huerta_normal = obtener_valores_fila(df_normal, 'complexityhuerta')

        # IFSZ
        IFSZ_normal = obtener_valores_fila(df_normal, 'complexityIFSZ')

        # Polini
        polini_normal = obtener_valores_fila(df_normal, 'complexitypolini')

        # Mu
        mu_normal = obtener_valores_fila(df_normal, 'complexitymu')

        # Min Age
        minage_normal = obtener_valores_fila(df_normal, 'complexityminage')
        
        # SOL
        SOL_normal = obtener_valores_fila(df_normal, 'complexitySOL')

        # Crawford
        crawford_normal = obtener_valores_fila(df_normal, 'complexitycrawford')

        # Min Depth
        min_depth_normal = obtener_valores_fila(df_normal, 'complexitymin_depth')

        # Max Depth
        max_depth_normal = obtener_valores_fila(df_normal, 'complexitymax_depth')

        # Mean Depth
        mean_depth_normal = obtener_valores_fila(df_normal, 'complexitymean_depth')
        
        #PArametricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        #Número de Sentencias
        nSentencias_param = obtener_valores_fila(df_param, 'complexitynSentences')

        # Número de Oraciones Complejas
        nSentenciasComplejas_param = obtener_valores_fila(df_param, 'complexitynComplexSentence')

        # Media Longitud de Oraciones
        avglenSentence_param = obtener_valores_fila(df_param, 'complexityavglenSentence')

        # Número de Signos de Puntuación
        nPuntuationMarks_param = obtener_valores_fila(df_param, 'complexitynPuntuationMarks')
       
        # Número de Palabras
        nWords_param = obtener_valores_fila(df_param, 'complexitynWords')

        # Número de Palabras Raras
        nRareWords_param = obtener_valores_fila(df_param, 'complexitynRareWords')

        # Número de Sílabas
        nSyllabes_param = obtener_valores_fila(df_param, 'complexitynSyllabes')
      
        # Número de Caracteres
        nChar_param = obtener_valores_fila(df_param, 'complexitynChar')

        # ILFW
        ilfw_param = obtener_valores_fila(df_param, 'complexityILFW')

        # LDI
        LDI_param = obtener_valores_fila(df_param, 'complexityLDI')
        
        # LC
        LC_param = obtener_valores_fila(df_param, 'complexityLC')

        # SSR
        SSR_param = obtener_valores_fila(df_param, 'complexitySSR')

        # SCI
        SCI_param = obtener_valores_fila(df_param, 'complexitySCI')

        # ARI
        ARI_param = obtener_valores_fila(df_param, 'complexityARI')

        # Huerta
        huerta_param = obtener_valores_fila(df_param, 'complexityhuerta')

        # IFSZ
        IFSZ_param = obtener_valores_fila(df_param, 'complexityIFSZ')

        # Polini
        polini_param = obtener_valores_fila(df_param, 'complexitypolini')

        # Mu
        mu_param = obtener_valores_fila(df_param, 'complexitymu')

        # Min Age
        minage_param = obtener_valores_fila(df_param, 'complexityminage')
        
        # SOL
        SOL_param = obtener_valores_fila(df_param, 'complexitySOL')

        # Crawford
        crawford_param = obtener_valores_fila(df_param, 'complexitycrawford')

        # Min Depth
        min_depth_param = obtener_valores_fila(df_param, 'complexitymin_depth')

        # Max Depth
        max_depth_param = obtener_valores_fila(df_param, 'complexitymax_depth')

        # Mean Depth
        mean_depth_param = obtener_valores_fila(df_param, 'complexitymean_depth')

        #No Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        #Número de Sentencias
        nSentencias_noparam = obtener_valores_fila(df_noparam, 'complexitynSentences')

        # Número de Oraciones Complejas
        nSentenciasComplejas_noparam = obtener_valores_fila(df_noparam, 'complexitynComplexSentence')

        # Media Longitud de Oraciones
        avglenSentence_noparam = obtener_valores_fila(df_noparam, 'complexityavglenSentence')

        # Número de Signos de Puntuación
        nPuntuationMarks_noparam = obtener_valores_fila(df_noparam, 'complexitynPuntuationMarks')
       
        # Número de Palabras
        nWords_noparam = obtener_valores_fila(df_noparam, 'complexitynWords')

        # Número de Palabras Raras
        nRareWords_noparam = obtener_valores_fila(df_noparam, 'complexitynRareWords')

        # Número de Sílabas
        nSyllabes_noparam = obtener_valores_fila(df_noparam, 'complexitynSyllabes')
      
        # Número de Caracteres
        nChar_noparam = obtener_valores_fila(df_noparam, 'complexitynChar')

        # ILFW
        ilfw_noparam = obtener_valores_fila(df_noparam, 'complexityILFW')

        # LDI
        LDI_noparam = obtener_valores_fila(df_noparam, 'complexityLDI')
        
        # LC
        LC_noparam = obtener_valores_fila(df_noparam, 'complexityLC')

        # SSR
        SSR_noparam = obtener_valores_fila(df_noparam, 'complexitySSR')

        # SCI
        SCI_noparam = obtener_valores_fila(df_noparam, 'complexitySCI')

        # ARI
        ARI_noparam = obtener_valores_fila(df_noparam, 'complexityARI')

        # Huerta
        huerta_noparam = obtener_valores_fila(df_noparam, 'complexityhuerta')

        # IFSZ
        IFSZ_noparam = obtener_valores_fila(df_noparam, 'complexityIFSZ')

        # Polini
        polini_noparam = obtener_valores_fila(df_noparam, 'complexitypolini')

        # Mu
        mu_noparam = obtener_valores_fila(df_noparam, 'complexitymu')

        # Min Age
        minage_noparam = obtener_valores_fila(df_noparam, 'complexityminage')
        
        # SOL
        SOL_noparam = obtener_valores_fila(df_noparam, 'complexitySOL')

        # Crawford
        crawford_noparam = obtener_valores_fila(df_noparam, 'complexitycrawford')

        # Min Depth
        min_depth_noparam = obtener_valores_fila(df_noparam, 'complexitymin_depth')

        # Max Depth
        max_depth_noparam = obtener_valores_fila(df_noparam, 'complexitymax_depth')

        # Mean Depth
        mean_depth_noparam = obtener_valores_fila(df_noparam, 'complexitymean_depth') 

        # Unir todo
        # Número de Oraciones
        nSentencias = "/".join([str(nSentencias_normal), str(nSentencias_param), str(nSentencias_noparam)])

        # Número de Oraciones Complejas
        nSentenciasComplejas = "/".join([str(nSentenciasComplejas_normal), str(nSentenciasComplejas_param), str(nSentenciasComplejas_noparam)])

        # Media Longitud de Oraciones
        avglenSentence = "/".join([str(avglenSentence_normal), str(avglenSentence_param), str(avglenSentence_noparam)])

        # Número de Signos de Puntuación
        nPuntuationMarks = "/".join([str(nPuntuationMarks_normal), str(nPuntuationMarks_param), str(nPuntuationMarks_noparam)])

        # Número de Palabras
        nWords = "/".join([str(nWords_normal), str(nWords_param), str(nWords_noparam)])

        # Número de Palabras Raras
        nRareWords = "/".join([str(nRareWords_normal), str(nRareWords_param), str(nRareWords_noparam)])

        # Número de Sílabas
        nSyllabes = "/".join([str(nSyllabes_normal), str(nSyllabes_param), str(nSyllabes_noparam)])

        # Número de Caracteres
        nChar = "/".join([str(nChar_normal), str(nChar_param), str(nChar_noparam)])

        # ILFW
        ilfw = "/".join([str(ilfw_normal), str(ilfw_param), str(ilfw_noparam)])

        # LDI
        LDI = "/".join([str(LDI_normal), str(LDI_param), str(LDI_noparam)])

        # LC
        LC = "/".join([str(LC_normal), str(LC_param), str(LC_noparam)])

        # SSR
        SSR = "/".join([str(SSR_normal), str(SSR_param), str(SSR_noparam)])

        # SCI
        SCI = "/".join([str(SCI_normal), str(SCI_param), str(SCI_noparam)])

        # ARI
        ARI = "/".join([str(ARI_normal), str(ARI_param), str(ARI_noparam)])

        # Huerta
        huerta = "/".join([str(huerta_normal), str(huerta_param), str(huerta_noparam)])

        # IFSZ
        IFSZ = "/".join([str(IFSZ_normal), str(IFSZ_param), str(IFSZ_noparam)])

        # Polini
        polini = "/".join([str(polini_normal), str(polini_param), str(polini_noparam)])

        # Mu
        mu = "/".join([str(mu_normal), str(mu_param), str(mu_noparam)])

        # Min Age
        minage = "/".join([str(minage_normal), str(minage_param), str(minage_noparam)])

        # SOL
        SOL = "/".join([str(SOL_normal), str(SOL_param), str(SOL_noparam)])

        # Crawford
        crawford = "/".join([str(crawford_normal), str(crawford_param), str(crawford_noparam)])

        # Min Depth
        min_depth = "/".join([str(min_depth_normal), str(min_depth_param), str(min_depth_noparam)])

        # Max Depth
        max_depth = "/".join([str(max_depth_normal), str(max_depth_param), str(max_depth_noparam)])

        # Mean Depth
        mean_depth = "/".join([str(mean_depth_normal), str(mean_depth_param), str(mean_depth_noparam)])

        
        print(nSentencias)

        return jsonify({'n_oraciones': nSentencias, 'n_oraciones_c': nSentenciasComplejas, 'media_long_oraciones': avglenSentence, 'n_sig_punt': nPuntuationMarks, 'n_palabras': nWords, 'n_palabras_r': nRareWords, 'n_silabas': nSyllabes, 'n_caracteres': nChar, 'ilfw': ilfw, 'ldi': LDI, 'lc': LC, 'ssr': SSR, 'sci': SCI, 'ari': ARI, 'huerta': huerta, 'ifsz': IFSZ, 'polini': polini, 'mu': mu, 'minage': minage, 'sol': SOL, 'crawford': crawford, 'min_depth': min_depth, 'max_depth': max_depth, 'mean_depth': mean_depth }), 200   

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de complejidad'}), 400
    
# Realizar Análisis Contrastivo Lemas
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/lemas',  methods=['GET'])
def VerContrastivoLemas(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        #Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        #Lemas Únicos
        uniqueLemmas_normal = obtener_valores_fila(df_normal, 'lemmasuniqueLemmas')

        # Media Lemas
        avgLemmas_normal = obtener_valores_fila(df_normal, 'lemmasavgLemmas')


        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        #Lemas Únicos
        uniqueLemmas_param = obtener_valores_fila(df_param, 'lemmasuniqueLemmas')

        # Media Lemas
        avgLemmas_param = obtener_valores_fila(df_param, 'lemmasavgLemmas')
        

        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        #Lemas Únicos
        uniqueLemmas_noparam = obtener_valores_fila(df_noparam, 'lemmasuniqueLemmas')

        # Media Lemas
        avgLemmas_noparam = obtener_valores_fila(df_noparam, 'lemmasavgLemmas')


        #Unir todo
        uniqueLemmas = "/".join([str(uniqueLemmas_normal), str(uniqueLemmas_param), str(uniqueLemmas_noparam)])

        print(f"Lemas únicos: {uniqueLemmas}")

        avgLemmas = "/".join([str(avgLemmas_normal), str(avgLemmas_param), str(avgLemmas_noparam)])

        print(f"Media Lemas: {avgLemmas}")

        return jsonify({'n_lemas_u': uniqueLemmas, 'm_caracteres': avgLemmas}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de lemas'}), 400
    

# Realizar Análisis Contrastivo Emociones
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/emociones',  methods=['GET'])
def VerContrastivoEmociones(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        #Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

         # Otros
        others_normal = obtener_valores_fila(df_normal, 'emotionothers')

        # Alegría
        joy_normal = obtener_valores_fila(df_normal, 'emotionjoy')

        # Tristeza
        sadness_normal = obtener_valores_fila(df_normal, 'emotionsadness')

        # Enfado
        anger_normal = obtener_valores_fila(df_normal, 'emotionanger')

        # Sorpresa
        surprise_normal = obtener_valores_fila(df_normal, 'emotionsurprise')

        # Disgusto
        disgust_normal = obtener_valores_fila(df_normal, 'emotiondisgust')

        # Miedo
        fear_normal = obtener_valores_fila(df_normal, 'emotionfear')


        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # Otros
        others_param = obtener_valores_fila(df_param, 'emotionothers')

        # Alegría
        joy_param = obtener_valores_fila(df_param, 'emotionjoy')

        # Tristeza
        sadness_param = obtener_valores_fila(df_param, 'emotionsadness')

        # Enfado
        anger_param = obtener_valores_fila(df_param, 'emotionanger')

        # Sorpresa
        surprise_param = obtener_valores_fila(df_param, 'emotionsurprise')

        # Disgusto
        disgust_param = obtener_valores_fila(df_param, 'emotiondisgust')

        # Miedo
        fear_param = obtener_valores_fila(df_param, 'emotionfear')
        

        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Otros
        others_noparam = obtener_valores_fila(df_noparam, 'emotionothers')

        # Alegría
        joy_noparam = obtener_valores_fila(df_noparam, 'emotionjoy')

        # Tristeza
        sadness_noparam = obtener_valores_fila(df_noparam, 'emotionsadness')

        # Enfado
        anger_noparam = obtener_valores_fila(df_noparam, 'emotionanger')

        # Sorpresa
        surprise_noparam = obtener_valores_fila(df_noparam, 'emotionsurprise')

        # Disgusto
        disgust_noparam = obtener_valores_fila(df_noparam, 'emotiondisgust')

        # Miedo
        fear_noparam = obtener_valores_fila(df_noparam, 'emotionfear')


        #Unir todo
        others = "/".join([str(others_normal), str(others_param), str(others_noparam)])

        joy = "/".join([str(joy_normal), str(joy_param), str(joy_noparam)])

        sadness = "/".join([str(sadness_normal), str(sadness_param), str(sadness_noparam)])

        anger = "/".join([str(anger_normal), str(anger_param), str(anger_noparam)])

        surprise = "/".join([str(surprise_normal), str(surprise_param), str(surprise_noparam)])

        disgust = "/".join([str(disgust_normal), str(disgust_param), str(disgust_noparam)])

        fear = "/".join([str(fear_normal), str(fear_param), str(fear_noparam)])


        return jsonify({'otros': others, 'alegria': joy, 'tristeza': sadness, 'ira': fear, 'sorpresa': surprise, 'asco': disgust, 'miedo': anger}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de lemas'}), 400


# Realizar Análisis Contrastivo Ironía
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/ironia',  methods=['GET'])
def VerContrastivoIronia(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        #Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # No Ironía
        NI_normal = obtener_valores_fila(df_normal, 'ironityNI')

        # Ironía
        I_normal = obtener_valores_fila(df_normal, 'ironityI')


        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # No Ironía
        NI_param = obtener_valores_fila(df_param, 'ironityNI')

        # Ironía
        I_param = obtener_valores_fila(df_param, 'ironityI')
        

        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # No Ironía
        NI_noparam = obtener_valores_fila(df_noparam, 'ironityNI')

        # Ironía
        I_noparam = obtener_valores_fila(df_noparam, 'ironityI')


        #Unir todo
        NI = "/".join([str(NI_normal), str(NI_param), str(NI_noparam)])

        I = "/".join([str(I_normal), str(I_param), str(I_noparam)])


        return jsonify({'valor_no': NI, 'valor_si': I})

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de lemas'}), 400
    
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/diversidad_lexica', methods=['GET'])
def VerContrastivoDiversidadLexica(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        # Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # Simple TTR
        SimpleTTR_normal = obtener_valores_fila(df_normal, 'lexicalDiversitySimpleTTR')

        # Root TTR
        RootTTR_normal = obtener_valores_fila(df_normal, 'lexicalDiversityRootTTR')

        # Log TTR
        LogTTR_normal = obtener_valores_fila(df_normal, 'lexicalDiversityLogTTR')

        # Maas TTR
        MaasTTR_normal = obtener_valores_fila(df_normal, 'lexicalDiversityMaasTTR')

        # MSTTR
        MSTTR_normal = obtener_valores_fila(df_normal, 'lexicalDiversityMSTTR')

        # MATTR
        MATTR_normal = obtener_valores_fila(df_normal, 'lexicalDiversityMATTR')

        # HDD
        HDD_normal = obtener_valores_fila(df_normal, 'lexicalDiversityHDD')

        # MTLD
        MTLD_normal = obtener_valores_fila(df_normal, 'lexicalDiversityMTLD')

        # MTLDMAWrap
        MTLDMAWrap_normal = obtener_valores_fila(df_normal, 'lexicalDiversityMTLDMAWrap')

        # MTLDMABi
        MTLDMABi_normal = obtener_valores_fila(df_normal, 'lexicalDiversityMTLDMABi')


        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # Simple TTR
        SimpleTTR_param = obtener_valores_fila(df_param, 'lexicalDiversitySimpleTTR')

        # Root TTR
        RootTTR_param = obtener_valores_fila(df_param, 'lexicalDiversityRootTTR')

        # Log TTR
        LogTTR_param = obtener_valores_fila(df_param, 'lexicalDiversityLogTTR')

        # Maas TTR
        MaasTTR_param = obtener_valores_fila(df_param, 'lexicalDiversityMaasTTR')

        # MSTTR
        MSTTR_param = obtener_valores_fila(df_param, 'lexicalDiversityMSTTR')

        # MATTR
        MATTR_param = obtener_valores_fila(df_param, 'lexicalDiversityMATTR')

        # HDD
        HDD_param = obtener_valores_fila(df_param, 'lexicalDiversityHDD')

        # MTLD
        MTLD_param = obtener_valores_fila(df_param, 'lexicalDiversityMTLD')

        # MTLDMAWrap
        MTLDMAWrap_param = obtener_valores_fila(df_param, 'lexicalDiversityMTLDMAWrap')

        # MTLDMABi
        MTLDMABi_param = obtener_valores_fila(df_param, 'lexicalDiversityMTLDMABi')


        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Simple TTR
        SimpleTTR_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversitySimpleTTR')

        # Root TTR
        RootTTR_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityRootTTR')

        # Log TTR
        LogTTR_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityLogTTR')

        # Maas TTR
        MaasTTR_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityMaasTTR')

        # MSTTR
        MSTTR_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityMSTTR')

        # MATTR
        MATTR_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityMATTR')

        # HDD
        HDD_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityHDD')

        # MTLD
        MTLD_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityMTLD')

        # MTLDMAWrap
        MTLDMAWrap_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityMTLDMAWrap')

        # MTLDMABi
        MTLDMABi_noparam = obtener_valores_fila(df_noparam, 'lexicalDiversityMTLDMABi')


        # Unir todo
        SimpleTTR = "/".join([str(SimpleTTR_normal), str(SimpleTTR_param), str(SimpleTTR_noparam)])
        RootTTR = "/".join([str(RootTTR_normal), str(RootTTR_param), str(RootTTR_noparam)])
        LogTTR = "/".join([str(LogTTR_normal), str(LogTTR_param), str(LogTTR_noparam)])
        MaasTTR = "/".join([str(MaasTTR_normal), str(MaasTTR_param), str(MaasTTR_noparam)])
        MSTTR = "/".join([str(MSTTR_normal), str(MSTTR_param), str(MSTTR_noparam)])
        MATTR = "/".join([str(MATTR_normal), str(MATTR_param), str(MATTR_noparam)])
        HDD = "/".join([str(HDD_normal), str(HDD_param), str(HDD_noparam)])
        MTLD = "/".join([str(MTLD_normal), str(MTLD_param), str(MTLD_noparam)])
        MTLDMAWrap = "/".join([str(MTLDMAWrap_normal), str(MTLDMAWrap_param), str(MTLDMAWrap_noparam)])
        MTLDMABi = "/".join([str(MTLDMABi_normal), str(MTLDMABi_param), str(MTLDMABi_noparam)])

        return jsonify({'p_simpleTTR': SimpleTTR, 'p_rootTTR': RootTTR, 'p_logTTR': LogTTR, 'p_maasTTR': MaasTTR, 'p_MSTTR': MSTTR, 'p_MATTR': MATTR, 'p_HDD': HDD, 'p_MLTD': MTLD, 'p_MLTDMAWrap': MTLDMAWrap, 'p_MTLDMABi': MTLDMABi}), 200


    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de diversidad léxica'}), 400

@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/perplejidad', methods=['GET'])
def VerContrastivoPerplejidad(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        # Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # Perplejidad
        perplexity_normal = obtener_valores_fila(df_normal, 'perplexity')

        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # Perplejidad
        perplexity_param = obtener_valores_fila(df_param, 'perplexity')

        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Perplejidad
        perplexity_noparam = obtener_valores_fila(df_noparam, 'perplexity')

        # Unir todo
        perplexity = "/".join([str(perplexity_normal), str(perplexity_param), str(perplexity_noparam)])

        return jsonify({'valor_perplejidad': perplexity}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de perplejidad'}), 400

@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/polaridad', methods=['GET'])
def VerContrastivoPolaridad(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        # Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # Polaridad Positiva
        POS_normal = obtener_valores_fila(df_normal, 'polarityPOS')

        # Polaridad Negativa
        NEG_normal = obtener_valores_fila(df_normal, 'polarityNEG')

        # Polaridad Neutra
        NEU_normal = obtener_valores_fila(df_normal, 'polarityNEU')

        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # Polaridad Positiva
        POS_param = obtener_valores_fila(df_param, 'polarityPOS')

        # Polaridad Negativa
        NEG_param = obtener_valores_fila(df_param, 'polarityNEG')

        # Polaridad Neutra
        NEU_param = obtener_valores_fila(df_param, 'polarityNEU')

        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Polaridad Positiva
        POS_noparam = obtener_valores_fila(df_noparam, 'polarityPOS')

        # Polaridad Negativa
        NEG_noparam = obtener_valores_fila(df_noparam, 'polarityNEG')

        # Polaridad Neutra
        NEU_noparam = obtener_valores_fila(df_noparam, 'polarityNEU')

        # Unir todo
        POS = "/".join([str(POS_normal), str(POS_param), str(POS_noparam)])
        NEG = "/".join([str(NEG_normal), str(NEG_param), str(NEG_noparam)])
        NEU = "/".join([str(NEU_normal), str(NEU_param), str(NEU_noparam)])

        return jsonify({'v_positiva': POS, 'v_negativa': NEG, 'v_neutra': NEU}), 200

    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de polaridad'}), 400
    
@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/pos', methods=['GET'])
def VerContrastivoPOS(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        # Campos de suma
        campos_suma = [
            'FreqPOSCCONJ', 'FreqPOSSPACE', 'FreqPOSVERB', 'FreqPOSSYM', 'FreqPOSNUM',
            'FreqPOSNOUN', 'FreqPOSADJ', 'FreqPOSPUNCT', 'FreqPOSAUX', 'FreqPOSADV',
            'FreqPOSINTJ', 'FreqPOSDET', 'FreqPOSSCONJ', 'FreqPOSPROPN', 'FreqPOSPRON',
            'FreqPOSADP'
        ]

        # Campos relativos
        campos = [
            'RelFreqPOSCCONJ', 'RelFreqPOSSPACE', 'RelFreqPOSVERB', 'RelFreqPOSSYM',
            'RelFreqPOSNUM', 'RelFreqPOSNOUN', 'RelFreqPOSADJ', 'RelFreqPOSPUNCT', 'RelFreqPOSAUX',
            'RelFreqPOSADV', 'RelFreqPOSINTJ', 'RelFreqPOSDET', 'RelFreqPOSSCONJ', 'RelFreqPOSPROPN',
            'RelFreqPOSPRON', 'RelFreqPOSADP'
        ]

        # Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # No Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Inicializar diccionarios para los resultados
        resultados_suma = {}
        resultados_relativos = {}

        # Procesar campos de suma
        for campo in campos_suma:
            suma_normal = obtener_valores_fila(df_normal, campo)
            suma_param = obtener_valores_fila(df_param, campo)
            suma_noparam = obtener_valores_fila(df_noparam, campo)
            resultados_suma[campo] = "/".join([str(suma_normal), str(suma_param), str(suma_noparam)])

        # Procesar campos relativos
        for campo in campos:
            rel_normal = obtener_valores_fila(df_normal, campo)
            rel_param = obtener_valores_fila(df_param, campo)
            rel_noparam = obtener_valores_fila(df_noparam, campo)
            resultados_relativos[campo] = "/".join([str(rel_normal), str(rel_param), str(rel_noparam)])

        return jsonify({
            'frec_conjunciones': resultados_suma['FreqPOSCCONJ'],
            'frec_espacios': resultados_suma['FreqPOSSPACE'],
            'frec_verbos': resultados_suma['FreqPOSVERB'],
            'frec_simbolos': resultados_suma['FreqPOSSYM'],
            'frec_numeros': resultados_suma['FreqPOSNUM'],
            'frec_sustantivos': resultados_suma['FreqPOSNOUN'],
            'frec_adjetivos': resultados_suma['FreqPOSADJ'],
            'frec_sig_punt': resultados_suma['FreqPOSPUNCT'],
            'frec_verb_aux': resultados_suma['FreqPOSAUX'],
            'frec_adverbios': resultados_suma['FreqPOSADV'],
            'frec_interjecciones': resultados_suma['FreqPOSINTJ'],
            'frec_determinantes': resultados_suma['FreqPOSDET'],
            'frec_conj_sub': resultados_suma['FreqPOSSCONJ'],
            'frec_nombres_prop': resultados_suma['FreqPOSPROPN'],
            'frec_pronon': resultados_suma['FreqPOSPRON'],
            'frec_preposiciones': resultados_suma['FreqPOSADP'],
            'frec_rel_conj': resultados_relativos['RelFreqPOSCCONJ'],
            'frec_rel_espacios': resultados_relativos['RelFreqPOSSPACE'],
            'frec_rel_verb': resultados_relativos['RelFreqPOSVERB'],
            'frec_rel_simb': resultados_relativos['RelFreqPOSSYM'],
            'frec_rel_num': resultados_relativos['RelFreqPOSNUM'],
            'frec_rel_sus': resultados_relativos['RelFreqPOSNOUN'],
            'frec_rel_adj': resultados_relativos['RelFreqPOSADJ'],
            'frec_rel_sdp': resultados_relativos['RelFreqPOSPUNCT'],
            'frec_rel_vaux': resultados_relativos['RelFreqPOSAUX'],
            'frec_rel_adv': resultados_relativos['RelFreqPOSADV'],
            'frec_rel_interj': resultados_relativos['RelFreqPOSINTJ'],
            'frec_rel_det': resultados_relativos['RelFreqPOSDET'],
            'frec_rel_conjsub': resultados_relativos['RelFreqPOSSCONJ'],
            'frec_rel_nprop': resultados_relativos['RelFreqPOSPROPN'],
            'frec_rel_pronom': resultados_relativos['RelFreqPOSPRON'],
            'frec_rel_prep': resultados_relativos['RelFreqPOSADP']
        }), 200


    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de POS'}), 400

@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/estilometria', methods=['GET'])
def VerContrastivoEstilometria(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        # Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # Palabras Únicas
        uniqueWords_normal = obtener_valores_fila(df_normal, 'stylometryuniqueWords')

        # TTR
        TTR_normal = obtener_valores_fila(df_normal, 'stylometryTTR')

        # RTTR
        RTTR_normal = obtener_valores_fila(df_normal, 'stylometryRTTR')

        # Herdan
        Herdan_normal = obtener_valores_fila(df_normal, 'stylometryHerdan')

        # Mass
        Mass_normal = obtener_valores_fila(df_normal, 'stylometryMass')

        # Somers
        Somers_normal = obtener_valores_fila(df_normal, 'stylometrySomers')

        # Dugast
        Dugast_normal = obtener_valores_fila(df_normal, 'stylometryDugast')

        # Honore
        Honore_normal = obtener_valores_fila(df_normal, 'stylometryHonore')


        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # Palabras Únicas
        uniqueWords_param = obtener_valores_fila(df_param, 'stylometryuniqueWords')

        # TTR
        TTR_param = obtener_valores_fila(df_param, 'stylometryTTR')

        # RTTR
        RTTR_param = obtener_valores_fila(df_param, 'stylometryRTTR')

        # Herdan
        Herdan_param = obtener_valores_fila(df_param, 'stylometryHerdan')

        # Mass
        Mass_param = obtener_valores_fila(df_param, 'stylometryMass')

        # Somers
        Somers_param = obtener_valores_fila(df_param, 'stylometrySomers')

        # Dugast
        Dugast_param = obtener_valores_fila(df_param, 'stylometryDugast')

        # Honore
        Honore_param = obtener_valores_fila(df_param, 'stylometryHonore')


        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Palabras Únicas
        uniqueWords_noparam = obtener_valores_fila(df_noparam, 'stylometryuniqueWords')

        # TTR
        TTR_noparam = obtener_valores_fila(df_noparam, 'stylometryTTR')

        # RTTR
        RTTR_noparam = obtener_valores_fila(df_noparam, 'stylometryRTTR')

        # Herdan
        Herdan_noparam = obtener_valores_fila(df_noparam, 'stylometryHerdan')

        # Mass
        Mass_noparam = obtener_valores_fila(df_noparam, 'stylometryMass')

        # Somers
        Somers_noparam = obtener_valores_fila(df_noparam, 'stylometrySomers')

        # Dugast
        Dugast_noparam = obtener_valores_fila(df_noparam, 'stylometryDugast')

        # Honore
        Honore_noparam = obtener_valores_fila(df_noparam, 'stylometryHonore')


        # Unir todo
        uniqueWords = "/".join([str(uniqueWords_normal), str(uniqueWords_param), str(uniqueWords_noparam)])
        TTR = "/".join([str(TTR_normal), str(TTR_param), str(TTR_noparam)])
        RTTR = "/".join([str(RTTR_normal), str(RTTR_param), str(RTTR_noparam)])
        Herdan = "/".join([str(Herdan_normal), str(Herdan_param), str(Herdan_noparam)])
        Mass = "/".join([str(Mass_normal), str(Mass_param), str(Mass_noparam)])
        Somers = "/".join([str(Somers_normal), str(Somers_param), str(Somers_noparam)])
        Dugast = "/".join([str(Dugast_normal), str(Dugast_param), str(Dugast_noparam)])
        Honore = "/".join([str(Honore_normal), str(Honore_param), str(Honore_noparam)])

        return jsonify({'palabras_unicas': uniqueWords, 'p_ttr': TTR, 'p_rttr': RTTR, 'p_herdan': Herdan, 'p_maas': Mass, 'p_somers': Somers, 'p_dugast': Dugast, 'p_honore': Honore}), 200


    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de estilometría'}), 400

@app.route('/colecciones/<int:indexColeccion>/<int:indexComparar>/volumetria', methods=['GET'])
def VerContrastivoVolumetria(indexColeccion, indexComparar):
    try:
        global usuario_activo
        
        cursor = mysql.connection.cursor()

        # Coge de la base de datos el nombre y la ruta de los archivos
        cursor.execute(f'SELECT rutaTestParametricos, rutaTestNoParametricos, rutaTestNormal FROM analisiscontrastivo WHERE Id_Cuno = {indexColeccion} AND Id_Cdos = {indexComparar}')
        rutaContrastivo = cursor.fetchall()
        rutaNormal = rutaContrastivo[0][2]
        rutaParam = rutaContrastivo[0][0]
        rutaNoParam = rutaContrastivo[0][1]

        # Normal
        df_normal = pd.read_excel(rutaNormal)
        df_normal = df_normal.set_index('características')

        # Palabras
        words_normal = obtener_valores_fila(df_normal, 'volumetrywords')

        # Palabras Únicas
        uniqueWords_normal = obtener_valores_fila(df_normal, 'volumetryuniqueWords')

        # Caracteres
        chars_normal = obtener_valores_fila(df_normal, 'volumetrychars')

        # Media longitud de palabras
        avgWordsLen_normal = obtener_valores_fila(df_normal, 'volumetryavgWordsLen')


        # Test Paramétricos
        df_param = pd.read_excel(rutaParam)
        df_param = df_param.set_index('Feature')

        # Palabras
        words_param = obtener_valores_fila(df_param, 'volumetrywords')

        # Palabras Únicas
        uniqueWords_param = obtener_valores_fila(df_param, 'volumetryuniqueWords')

        # Caracteres
        chars_param = obtener_valores_fila(df_param, 'volumetrychars')

        # Media longitud de palabras
        avgWordsLen_param = obtener_valores_fila(df_param, 'volumetryavgWordsLen')


        # Test no Paramétricos
        df_noparam = pd.read_excel(rutaNoParam)
        df_noparam = df_noparam.set_index('Feature')

        # Palabras
        words_noparam = obtener_valores_fila(df_noparam, 'volumetrywords')

        # Palabras Únicas
        uniqueWords_noparam = obtener_valores_fila(df_noparam, 'volumetryuniqueWords')

        # Caracteres
        chars_noparam = obtener_valores_fila(df_noparam, 'volumetrychars')

        # Media longitud de palabras
        avgWordsLen_noparam = obtener_valores_fila(df_noparam, 'volumetryavgWordsLen')


        # Unir todo
        words = "/".join([str(words_normal), str(words_param), str(words_noparam)])
        uniqueWords = "/".join([str(uniqueWords_normal), str(uniqueWords_param), str(uniqueWords_noparam)])
        chars = "/".join([str(chars_normal), str(chars_param), str(chars_noparam)])
        avgWordsLen = "/".join([str(avgWordsLen_normal), str(avgWordsLen_param), str(avgWordsLen_noparam)])

        return jsonify({'n_palabras': words, 'n_caracteres': chars, 'n_palabras_unicas': uniqueWords, 'm_longitud_palabras': avgWordsLen}), 200


    except Exception as e:
        return jsonify({'error': 'No se ha podido ver el análisis de volumetría'}), 400





# Gestión archivos subidos
@app.route('/addColeccion', methods=['POST'])
def addColeccion():
    global usuario_activo
    
    if 'archivo' not in request.files: # Comprueba que se haya mandado archivos
        return jsonify({'error': 'No se ha enviado ningún archivo'}), 400

    archivo = request.files['archivo']
    nombre = request.form.get('nombre')

    usuario = usuario_activo
    
    # Crear un directorio por usuario
    usuario_directorio = os.path.join(app.config['Archivos'], str(usuario)) # 
    os.makedirs(usuario_directorio, exist_ok=True) # Por si existe lo crea y si no pues lo deja igual
    
    # Guardar el archivo en el directorio del usuario

    with zipfile.ZipFile(archivo, 'r') as zip_ref:
        # Extraer todo el contenido del archivo ZIP
        directorio_destino = os.path.join(usuario_directorio)  # Elimina la extensión .zip
        os.makedirs(directorio_destino, exist_ok=True)
        zip_ref.extractall(directorio_destino)

    directorio_destino = os.path.join(usuario_directorio, secure_filename(archivo.filename)[:-4])
    # Lo añade a la base de datos
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO colecciones (Nombre_C, Ruta_C, usuario) VALUES (%s, %s, %s)", (nombre, directorio_destino, usuario))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Archivo subido correctamente'}), 200

# Eliminar colecciones 
@app.route('/colecciones/<int:index>', methods=['DELETE'])
def eliminar_coleccion(index):
    global usuario_activo
    
    try:
        cursor = mysql.connection.cursor()
        # Se coge el último id que tenemos
        cursor.execute('SELECT MAX(ID_C) FROM colecciones')
        ultimo_id = cursor.fetchone()[0]

        cursor.execute('SELECT Ruta_C FROM colecciones WHERE Id_C = %s', (index,))
        rutaArchivo = cursor.fetchall()
        shutil.rmtree(rutaArchivo[0][0])

        # Lo borra de la base de datos
        cursor.execute('DELETE FROM colecciones WHERE Id_C = %s', (index,))
        
        # Si hay colecciones restantes, actualizar los ID_C
        if ultimo_id > 1:
            cursor.execute('SET @count = 0')
            cursor.execute('UPDATE colecciones SET Id_C = @count:= @count + 1 ORDER BY Id_C')
            cursor.execute('ALTER TABLE colecciones AUTO_INCREMENT = %s', (ultimo_id,))
        else:
            cursor.execute('ALTER TABLE colecciones AUTO_INCREMENT = 1')


        mysql.connection.commit()
        cursor.close()


        return jsonify({'message': 'Colección eliminada correctamente'}), 200
    except Exception as e:
        return jsonify({'error': 'No se ha podido eliminar la colección'}), 400

if __name__ == '__main__':
    app.run(debug=True)

