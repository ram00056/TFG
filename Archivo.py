import subprocess                                                      # Ejecutar instrucciones
import os                                                              # Cambiar directorios, etc...
import pandas as pd
import warnings
import sys

usuario = sys.argv[1]
coleccion = sys.argv[2]
documento = sys.argv[3]

# Ruta del directorio del repositorio clonado
repo_dir = 'textflow'

# Verificar si el directorio del repositorio ya existe
if not os.path.exists(repo_dir):
    # Comando para clonar el repositorio
    git_clone_command = "git clone https://github.com/sinai-uja/textflow.git"
    
    # Ejecutar el comando de clonación
    subprocess.run(git_clone_command, shell=True, check=True)
    print("El repositorio ha sido clonado.")
else:
    print("El repositorio ya existe. No se realizará la clonación.")

# Cambiar el directorio a 'textflow'
os.chdir(repo_dir)

# Comando para instalar el paquete
install_command = "python -m pip install ."

# Ejecutar el comando de instalación
subprocess.run(install_command, shell=True, check=True)

print("El repositorio ha sido instalado correctamente, y el directorio de trabajo ha sido cambiado a 'textflow'.")

# Cargar los datos
#os.chdir(f"Examples/")

os.chdir(f"..")
directorio = f'./archivos/{usuario}/analisis{coleccion}'
os.makedirs(directorio, exist_ok=True)

leer_archivo = f"python ./Leer.py {usuario} {coleccion} ./{documento}"
subprocess.run(leer_archivo, shell=True, check=True)
print("Cargando los datos del fichero.")
warnings.filterwarnings('ignore')

pathValidationSet = f'./archivos/{usuario}/analisis{coleccion}/analisis{coleccion}.xlsx'
#dicLabel={0: 'OFP', 1: 'OFG', 2: 'NO', 3: 'NOM'}
df = pd.read_excel(pathValidationSet, nrows=3) #Leer el csv
#df['label']=[dicLabel[df['label'][i]] for i in df.index] # Reemplaza cada valor en la columna 'label' del DataFrame df con su correspondiente valor del diccionario dicLabel

print("El contenido del fichero es: ")
print(df)

os.chdir(repo_dir)
# Anasis de los datos
import nltk
import re
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer, WordPunctTokenizer
nltk.download('stopwords')
from nltk.stem import WordNetLemmatizer
nltk.download("wordnet")
nltk.download("omw-1.4")

#Import the analyzers.
from textflow.BDLASEAnalyzer import BDLASEAnalyzer
from textflow.ComplexityAnalyzer import ComplexityAnalyzer
from textflow.EmofinderAnalyzer import EmofinderAnalyzer
from textflow.EmojiAnalyzer import EmojiAnalyzer
from textflow.EmojiPolarityAnalyzer import EmojiPolarityAnalyzer
from textflow.EmoticonsPolarityAnalyzer import EmoticonsPolarityAnalyzer
from textflow.EmotionAnalyzer import EmotionAnalyzer
from textflow.IronyAnalyzer import IronyAnalyzer
from textflow.IsalAnalyzer import IsalAnalyzer
from textflow.LemmaAnalyzer import LemmaAnalyzer
from textflow.LexicalDiversityAnalyzer import LexicalDiversityAnalyzer
from textflow.LiwcAnalyzer import LiwcAnalyzer
from textflow.NcrAnalyzer import NcrAnalyzer
from textflow.NERAnalyzer import NERAnalyzer
from textflow.NGramsAnalyzer import NGramsAnalyzer
from textflow.PerplexityAnalyzer import PerplexityAnalyzer
from textflow.PolarityAnalyzer import PolarityAnalyzer
from textflow.POSAnalyzer import POSAnalyzer
from textflow.SelAnalyzer import SelAnalyzer
from textflow.StylometryAnalyzer import StylometryAnalyzer
from textflow.VolumetryAnalyzer import VolumetryAnalyzer

#Import the sequence string.
from textflow.SequenceString import SequenceString

print("Todo importado correctamente")

# Inicializar Analizadores
bdlase = BDLASEAnalyzer()
complexity = ComplexityAnalyzer()
emofinder = EmofinderAnalyzer()
emoji = EmojiAnalyzer()
emojiPolarity = EmojiPolarityAnalyzer(positiveEmojiPath = "./textflow/emojis/emojiPositive.txt", negativeEmojiPath = './/textflow/emojis/emojiNegative.txt')
emoticonsPolarity = EmoticonsPolarityAnalyzer(positiveEmojiPath = ".//textflow/emoti-sp/emoticonsPositive.txt", negativeEmojiPath = './/textflow/emoti-sp/emoticonsNegative.txt')
emotion = EmotionAnalyzer()
ironity = IronyAnalyzer()
isal = IsalAnalyzer()
lemma = LemmaAnalyzer()
lexicalDiversity = LexicalDiversityAnalyzer(lemmatizer=WordNetLemmatizer().lemmatize)
liwc = LiwcAnalyzer()
ncr = NcrAnalyzer()
ner = NERAnalyzer()
n1 = NGramsAnalyzer(tokenizer=RegexpTokenizer(r"[\w']+"),ngramsSize = 1)
n2 = NGramsAnalyzer(tokenizer=RegexpTokenizer(r"[\w']+"),ngramsSize = 2,stopwords=[])
n3 = NGramsAnalyzer(tokenizer=RegexpTokenizer(r"[\w']+"),ngramsSize = 3,stopwords=[])
n4 = NGramsAnalyzer(tokenizer=RegexpTokenizer(r"[\w']+"),ngramsSize = 4,stopwords=[])
perplexity = PerplexityAnalyzer(device="cpu")
polarity = PolarityAnalyzer()
pos = POSAnalyzer()
sel = SelAnalyzer()
stylometry = StylometryAnalyzer(stopwords.words('spanish'),tokenizer = WordPunctTokenizer())
volumetry = VolumetryAnalyzer()

#Creamos nuestra lista de secuencias
## En este caso, vamos a usar secuencias de String usando nuestra columna texto en el DataFrame.
## Aunque hay mas tipos de secuencia and puedes crear tu propia Sequence. For more information about Sequence go to https://github.com/sinai-uja/textflow?tab=readme-ov-file#how-to-create-a-sequence
listSequence = []
for index, row in df.iterrows(): #Itera devolviendo el contenido de la fila y el índice
  s = SequenceString(row["message"]) #Covierte a secuencia de string el contenido de la columna de texto
  listSequence.append(s)

print("Analizadores Cargados")

# Realizar Analisis
# Realizar Analisis con manejo de excepciones
for s in listSequence:
    try:
        bdlase.analyze(s,"bdlase","text")
    except Exception as e:
        print(f"Error analizando bdlase: {e}")
    
    try:
        complexity.analyze(s,"complexity","text")
    except Exception as e:
        print(f"Error analizando complexity: {e}")
    
    try:
        emofinder.analyze(s,"emofinder","text")
    except Exception as e:
        print(f"Error analizando emofinder: {e}")
    
    try:
        emoji.analyze(s,"emoji","text")
    except Exception as e:
        print(f"Error analizando emoji: {e}")
    
    try:
        emojiPolarity.analyze(s,"emojiPolarity","text")
    except Exception as e:
        print(f"Error analizando emojiPolarity: {e}")
    
    try:
        emoticonsPolarity.analyze(s,"emoticons","text")
    except Exception as e:
        print(f"Error analizando emoticonsPolarity: {e}")
    
    try:
        emotion.analyze(s,"emotion","text")
    except Exception as e:
        print(f"Error analizando emotion: {e}")
    
    try:
        ironity.analyze(s,"ironity","text")
    except Exception as e:
        print(f"Error analizando ironity: {e}")
    
    try:
        isal.analyze(s,"isal","text")
    except Exception as e:
        print(f"Error analizando isal: {e}")
    
    try:
        lemma.analyze(s,"lemmas","text")
    except Exception as e:
        print(f"Error analizando lemma: {e}")
    
    try:
        lexicalDiversity.analyze(s,"lexicalDiversity","text")
    except Exception as e:
        print(f"Error analizando lexicalDiversity: {e}")
    
    try:
        liwc.analyze(s,"liwc","text")
    except Exception as e:
        print(f"Error analizando liwc: {e}")
    
    try:
        ncr.analyze(s,"ncr","text")
    except Exception as e:
        print(f"Error analizando ncr: {e}")
    
    try:
        ner.analyze(s,"NER","text")
    except Exception as e:
        print(f"Error analizando ner: {e}")
    
    try:
        n1.analyze(s,"1-grams","text")
    except Exception as e:
        print(f"Error analizando n1: {e}")
    
    try:
        n2.analyze(s,"2-grams","text")
    except Exception as e:
        print(f"Error analizando n2: {e}")
    
    try:
        n3.analyze(s,"3-grams","text")
    except Exception as e:
        print(f"Error analizando n3: {e}")
    
    try:
        n4.analyze(s,"4-grams","text")
    except Exception as e:
        print(f"Error analizando n4: {e}")
    
    try:
        perplexity.analyze(s,"perplexity","text")
    except Exception as e:
        print(f"Error analizando perplexity: {e}")
    
    try:
        polarity.analyze(s,"polarity","text")
    except Exception as e:
        print(f"Error analizando polarity: {e}")
    
    try:
        pos.analyze(s,"POS","text")
    except Exception as e:
        print(f"Error analizando POS: {e}")
    
    try:
        sel.analyze(s,"sel","text")
    except Exception as e:
        print(f"Error analizando sel: {e}")
    
    try:
        stylometry.analyze(s,"stylometry","text")
    except Exception as e:
        print(f"Error analizando stylometry: {e}")
    
    try:
        volumetry.analyze(s,"volumetry","text")
    except Exception as e:
        print(f"Error analizando volumetry: {e}")

print("Análisis realizado con manejo de excepciones.")


print("Analisis Hecho")

# Procedemos a guardarlo en un fichero csv
POStags = set()
for seq in listSequence: #Para cada secuencia
  for tag in seq.metadata['POS'][0]['FreqPOS']: #Miramos la etiqueta de la posición POS
    POStags.add(tag)

# Necesitamos definir una lista con todas las etiquetas de análisis
labels = ["bdlase","complexity","emofinder","emoji","emojiPolarity","emoticons","emotion","ironity","isal","lemmas","lexicalDiversity","liwc","ncr","NER","1-grams","2-grams","3-grams","4-grams","perplexity","polarity","POS","sel","stylometry","volumetry"]

# Creacion de un diccionario que guardará toda la información de las secuencias, este diccionario tendrá como
# claves la etiqueta de análisis + metrica de análisis y como valor para cada clave, una lista con el valor obtenido por
# el analisis de las secuencias contenidas en listSequence.
dicTotal = {}
for seq in listSequence: #Para cada secuencia de la lista
  for l in seq.metadata: #Cogemos las etiquetas
    if l in labels: #Si la etiqueta está en el vector de etiquetas la almacenamos dependiendo de cada una
      if l in ["polarity", "emotion", "ironity"]:
        for category in seq.metadata[l][0][0]:
          l_key = str(l+category['label'])
          dicTotal[l_key] = dicTotal.get(l_key, []) + [category['score']]
      elif l == 'POS':
        for cat in ['FreqPOS', 'RelFreqPOS']:
          for tag in POStags:
            dicTotal[cat+''+tag] = dicTotal.get(cat+''+tag, []) + [seq.metadata[l][0][cat].get(tag, 0)]
        l_key = str(l)+'POSTokens'
        dicTotal[l_key] = dicTotal.get(l_key, []) + [seq.metadata[l][0]['POSTokens']]
      elif l == 'perplexity':
        dicTotal[l] = dicTotal.get(l, []) + [seq.metadata[l][0]]
      elif l == 'bdlase' or l == 'emofinder' or  l=='isal'or l == 'liwc' or l=='ncr' or l=='sel':
        dicTotal[l] = dicTotal.get(l, []) + [seq.metadata[l][0]]
      else:
        for key in seq.metadata[l][0]:
          l_key = str(l+key)
          dicTotal[l_key] = dicTotal.get(l_key, []) + [seq.metadata[l][0][key]]

# Una vez que tengamos un diccionario con toda la información de las secuencias, the DataFrame puede ser creado.
for k in dicTotal:
  df[str(k)] = dicTotal[k]

# Mostramos las columnas del DataFrame.
print(df.columns.to_list())

os.chdir(f"..")
# Guardamos the DataFrame como un fichero CSV.
df.to_excel(f'./archivos/{usuario}/analisis{coleccion}/analisis{coleccion}.xlsx', index='False')

