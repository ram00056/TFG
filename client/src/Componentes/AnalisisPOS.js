import React, { useState } from 'react'; //Importamos la libreria React para gestionar la parte de frontend { useState }
import { useParams, useNavigate } from 'react-router-dom'; //Enlazar los links para navegar entre páginas
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

const AnalisisPOS = () => { //Función que incluye el formulario para mostrar la página de inicio de sesión

    const { index } = useParams();
    const [nombre, setNombre] = useState(''); // Nombre de la colección
    const [frecConjunciones, setFrecConjunciones] = useState(''); // Frecuencia de conjunciones
    const [frecEspacios, setFrecEspacios] = useState(''); // Frecuencia de espacios
    const [frecVerbos, setFrecVerbos] = useState(''); // Frecuencia de verbos
    const [frecSimbolos, setFrecSimbolos] = useState(''); // Frecuencia de símbolos
    const [frecNumeros, setFrecNumeros] = useState(''); // Frecuencia de números
    const [frecSustantivos, setFrecSustantivos] = useState(''); // Frecuencia de sustantivos
    const [frecAdjetivos, setFrecAdjetivos] = useState(''); // Frecuencia de adjetivos
    const [frecSigPunt, setFrecSigPunt] = useState(''); // Frecuencia de signos de puntuación
    const [frecVerbAux, setFrecVerbAux] = useState(''); // Frecuencia de verbos auxiliares
    const [frecAdverbios, setFrecAdverbios] = useState(''); // Frecuencia de adverbios
    const [frecInterjecciones, setFrecInterjecciones] = useState(''); // Frecuencia de interjecciones
    const [frecDeterminantes, setFrecDeterminantes] = useState(''); // Frecuencia de determinantes
    const [frecConjSub, setFrecConjSub] = useState(''); // Frecuencia de conjunciones subordinadas
    const [frecNombresProp, setFrecNombresProp] = useState(''); // Frecuencia de nombres propios
    const [frecPronon, setFrecPronon] = useState(''); // Frecuencia de pronombres
    const [frecPreposiciones, setFrecPreposiciones] = useState(''); // Frecuencia de preposiciones
    const [frecRelConj, setFrecRelConj] = useState(''); // Frecuencia relativa de conjunciones
    const [frecRelEspacios, setFrecRelEspacios] = useState(''); // Frecuencia relativa de espacios
    const [frecRelVerb, setFrecRelVerb] = useState(''); // Frecuencia relativa de verbos
    const [frecRelSimb, setFrecRelSimb] = useState(''); // Frecuencia relativa de símbolos
    const [frecRelNum, setFrecRelNum] = useState(''); // Frecuencia relativa de números
    const [frecRelSus, setFrecRelSus] = useState(''); // Frecuencia relativa de sustantivos
    const [frecRelAdj, setFrecRelAdj] = useState(''); // Frecuencia relativa de adjetivos
    const [frecRelSdp, setFrecRelSdp] = useState(''); // Frecuencia relativa de signos de puntuación
    const [frecRelVaux, setFrecRelVaux] = useState(''); // Frecuencia relativa de verbos auxiliares
    const [frecRelAdv, setFrecRelAdv] = useState(''); // Frecuencia relativa de adverbios
    const [frecRelInterj, setFrecRelInterj] = useState(''); // Frecuencia relativa de interjecciones
    const [frecRelDet, setFrecRelDet] = useState(''); // Frecuencia relativa de determinantes
    const [frecRelConjsub, setFrecRelConjsub] = useState(''); // Frecuencia relativa de conjunciones subordinadas
    const [frecRelNprop, setFrecRelNprop] = useState(''); // Frecuencia relativa de nombres propios
    const [frecRelPronom, setFrecRelPronom] = useState(''); // Frecuencia relativa de pronombres
    const [frecRelPrep, setFrecRelPrep] = useState(''); // Frecuencia relativa de preposiciones
    const [loaded, setLoaded] = useState(false); // Para evitar hacer peticiones GET constantemente

     
        

    if (!loaded) {
        fetch(`http://localhost:5000/colecciones/${index}/VerPOS`)
            .then(response => response.json())
            .then(data => {
                setNombre(data.nombre_c);
                setFrecConjunciones(data.frec_conjunciones);
                setFrecEspacios(data.frec_espacios);
                setFrecVerbos(data.frec_verbos);
                setFrecSimbolos(data.frec_simbolos);
                setFrecNumeros(data.frec_numeros);
                setFrecSustantivos(data.frec_sustantivos);
                setFrecAdjetivos(data.frec_adjetivos);
                setFrecSigPunt(data.frec_sig_punt);
                setFrecVerbAux(data.frec_verb_aux);
                setFrecAdverbios(data.frec_adverbios);
                setFrecInterjecciones(data.frec_interjecciones);
                setFrecDeterminantes(data.frec_determinantes);
                setFrecConjSub(data.frec_conj_sub);
                setFrecNombresProp(data.frec_nombres_prop);
                setFrecPronon(data.frec_pronon);
                setFrecPreposiciones(data.frec_preposiciones);
                setFrecRelConj(data.frec_rel_conj);
                setFrecRelEspacios(data.frec_rel_espacios);
                setFrecRelVerb(data.frec_rel_verb);
                setFrecRelSimb(data.frec_rel_simb);
                setFrecRelNum(data.frec_rel_num);
                setFrecRelSus(data.frec_rel_sus);
                setFrecRelAdj(data.frec_rel_adj);
                setFrecRelSdp(data.frec_rel_sdp);
                setFrecRelVaux(data.frec_rel_vaux);
                setFrecRelAdv(data.frec_rel_adv);
                setFrecRelInterj(data.frec_rel_interj);
                setFrecRelDet(data.frec_rel_det);
                setFrecRelConjsub(data.frec_rel_conjsub);
                setFrecRelNprop(data.frec_rel_nprop);
                setFrecRelPronom(data.frec_rel_pronom);
                setFrecRelPrep(data.frec_rel_prep);
                setLoaded(true);
            })
            .catch(error => console.error('Error:', error));
    }

    const navigate = useNavigate();

    const toCSV = () => {
        // Define una función para manejar el formato de los datos
        const getFormattedValues = (cadena) => {
            if (cadena.trim() !== '') {
                return cadena.split('/').map(v => v.trim());
            }
            return ['', '', '', '', '']; // Devuelve valores vacíos si no hay datos
        };
    
        // Datos de las características
        const data = {
            frecConjunciones: getFormattedValues(frecConjunciones),
            frecEspacios: getFormattedValues(frecEspacios),
            frecVerbos: getFormattedValues(frecVerbos),
            frecSimbolos: getFormattedValues(frecSimbolos),
            frecNumeros: getFormattedValues(frecNumeros),
            frecSustantivos: getFormattedValues(frecSustantivos),
            frecAdjetivos: getFormattedValues(frecAdjetivos),
            frecSigPunt: getFormattedValues(frecSigPunt),
            frecVerbAux: getFormattedValues(frecVerbAux),
            frecAdverbios: getFormattedValues(frecAdverbios),
            frecInterjecciones: getFormattedValues(frecInterjecciones),
            frecDeterminantes: getFormattedValues(frecDeterminantes),
            frecConjSub: getFormattedValues(frecConjSub),
            frecNombresProp: getFormattedValues(frecNombresProp),
            frecPronon: getFormattedValues(frecPronon),
            frecPreposiciones: getFormattedValues(frecPreposiciones),
            frecRelConj: getFormattedValues(frecRelConj),
            frecRelEspacios: getFormattedValues(frecRelEspacios),
            frecRelVerb: getFormattedValues(frecRelVerb),
            frecRelSimb: getFormattedValues(frecRelSimb),
            frecRelNum: getFormattedValues(frecRelNum),
            frecRelSus: getFormattedValues(frecRelSus),
            frecRelAdj: getFormattedValues(frecRelAdj),
            frecRelSdp: getFormattedValues(frecRelSdp),
            frecRelVaux: getFormattedValues(frecRelVaux),
            frecRelAdv: getFormattedValues(frecRelAdv),
            frecRelInterj: getFormattedValues(frecRelInterj),
            frecRelDet: getFormattedValues(frecRelDet),
            frecRelConjsub: getFormattedValues(frecRelConjsub),
            frecRelNprop: getFormattedValues(frecRelNprop),
            frecRelPronom: getFormattedValues(frecRelPronom),
            frecRelPrep: getFormattedValues(frecRelPrep)
        };
    
        // Define las filas del CSV
        const rows = [
            ["Característica", "Mínimo", "Máximo", "Varianza", "Moda", "Media"],
            ["Frecuencia de Conjunciones", ...data.frecConjunciones],
            ["Frecuencia de Espacios", ...data.frecEspacios],
            ["Frecuencia de Verbos", ...data.frecVerbos],
            ["Frecuencia de Símbolos", ...data.frecSimbolos],
            ["Frecuencia de Números", ...data.frecNumeros],
            ["Frecuencia de Sustantivos", ...data.frecSustantivos],
            ["Frecuencia de Adjetivos", ...data.frecAdjetivos],
            ["Frecuencia de Signos de Puntuación", ...data.frecSigPunt],
            ["Frecuencia de Verbos Auxiliares", ...data.frecVerbAux],
            ["Frecuencia de Adverbios", ...data.frecAdverbios],
            ["Frecuencia de Interjecciones", ...data.frecInterjecciones],
            ["Frecuencia de Determinantes", ...data.frecDeterminantes],
            ["Frecuencia de Conjunciones Subordinadas", ...data.frecConjSub],
            ["Frecuencia de Nombres Propios", ...data.frecNombresProp],
            ["Frecuencia de Pronombres", ...data.frecPronon],
            ["Frecuencia de Preposiciones", ...data.frecPreposiciones],
            ["Frecuencia Relativa de Conjunciones", ...data.frecRelConj],
            ["Frecuencia Relativa de Espacios", ...data.frecRelEspacios],
            ["Frecuencia Relativa de Verbos", ...data.frecRelVerb],
            ["Frecuencia Relativa de Símbolos", ...data.frecRelSimb],
            ["Frecuencia Relativa de Números", ...data.frecRelNum],
            ["Frecuencia Relativa de Sustantivos", ...data.frecRelSus],
            ["Frecuencia Relativa de Adjetivos", ...data.frecRelAdj],
            ["Frecuencia Relativa de Signos de Puntuación", ...data.frecRelSdp],
            ["Frecuencia Relativa de Verbos Auxiliares", ...data.frecRelVaux],
            ["Frecuencia Relativa de Adverbios", ...data.frecRelAdv],
            ["Frecuencia Relativa de Interjecciones", ...data.frecRelInterj],
            ["Frecuencia Relativa de Determinantes", ...data.frecRelDet],
            ["Frecuencia Relativa de Conjunciones Subordinadas", ...data.frecRelConjsub],
            ["Frecuencia Relativa de Nombres Propios", ...data.frecRelNprop],
            ["Frecuencia Relativa de Pronombres", ...data.frecRelPronom],
            ["Frecuencia Relativa de Preposiciones", ...data.frecRelPrep]
        ];
    
        // Convierte el array de filas a una cadena CSV
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'POS.csv');
        document.body.appendChild(link); // Requerido para Firefox
        link.click();
    };
    

    const handleSubmit = () => {
        navigate(`/analisisDescriptivo/${index}`);
    };

    // Función para obtener un valor específico de una característica según su posición
    const getValor = (cadena, posicion) => {
        if (cadena.trim() !== '') {
            const partes = cadena.split('/');
            if (partes.length >= posicion) {
                return partes[posicion - 1].trim(); // posición - 1 porque los arrays son base cero
            }
        }
        return ''; // Devuelve vacío si no se encuentra el valor
    };

    // Mostrar el contenido de la pagina con un determinado formato
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}> {/* Poner el título encima de la página */}
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left'}}> Colección "{nombre}"</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline'}}> POS</h1>

            <div style={{
                maxWidth: '100%', // Ocupa todo el ancho disponible
                height: '600px', // Altura máxima fija para la barra de desplazamiento
                overflowY: 'auto', // Habilita la barra de desplazamiento vertical
                border: '1px solid #ccc', // Borde para el contenedor
                borderRadius: '5px', // Bordes redondeados
                padding: '10px', // Espaciado interior
                marginLeft: '150px', // Margen izquierdo para alinear con el borde izquierdo deseado
                marginBottom: '20px', // Espacio debajo del contenedor
            }}>
                <h3 style={{ fontSize: '20px'}}>Resumen para la Característica "POS"</h3>
                <div style={{ textAlign: 'center', margin: '20px auto', width: '80%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <tbody>
                            <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                                <th style={{ padding: '10px', borderRight: '1px solid white' }}>Característica</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Conjunciones</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjunciones,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjunciones,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjunciones,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjunciones,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjunciones,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            {/* Línea horizontal para separar cada fila */}
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Espacios</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecEspacios,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecEspacios,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecEspacios,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecEspacios,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecEspacios,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Verbos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbos,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbos,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbos,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbos,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbos,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Simbolos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSimbolos,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSimbolos,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSimbolos,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSimbolos,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSimbolos,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Numeros</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNumeros,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNumeros,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNumeros,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNumeros,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNumeros,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Sustantivos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSustantivos,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSustantivos,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSustantivos,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSustantivos,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSustantivos,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Adjetivos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdjetivos,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdjetivos,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdjetivos,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdjetivos,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdjetivos,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Signos Puntuación</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSigPunt,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSigPunt,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSigPunt,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSigPunt,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecSigPunt,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Verbos Auxiliares</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbAux,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbAux,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbAux,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbAux,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecVerbAux,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Adverbios</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdverbios,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdverbios,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdverbios,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdverbios,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecAdverbios,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Interjecciones</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecInterjecciones,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecInterjecciones,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecInterjecciones,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecInterjecciones,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecInterjecciones,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Determinantes</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecDeterminantes,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecDeterminantes,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecDeterminantes,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecDeterminantes,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecDeterminantes,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Conjunciones Subordinadas</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjSub,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjSub,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjSub,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjSub,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecConjSub,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Nombres Propios</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNombresProp,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNombresProp,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNombresProp,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNombresProp,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecNombresProp,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Pronombres</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPronon,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPronon,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPronon,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPronon,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPronon,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Preposiciones</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPreposiciones,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPreposiciones,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPreposiciones,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPreposiciones,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecPreposiciones,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Conjunciones</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConj,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConj,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConj,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConj,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConj,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            {/* Línea horizontal para separar cada fila */}
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Espacios</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelEspacios,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelEspacios,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelEspacios,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelEspacios,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelEspacios,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Verbos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVerb,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVerb,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVerb,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVerb,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVerb,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Simbolos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSimb,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSimb,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSimb,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSimb,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSimb,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Numeros</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNum,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNum,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNum,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNum,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNum,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Sustantivos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSus,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSus,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSus,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSus,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSus,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Adjetivos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdj,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdj,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdj,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdj,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdj,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Signos Puntuación</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSdp,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSdp,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSdp,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSdp,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelSdp,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Verbos Auxiliares</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVaux,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVaux,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVaux,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVaux,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelVaux,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Adverbios</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdv,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdv,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdv,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdv,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelAdv,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Interjecciones</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelInterj,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelInterj,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelInterj,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelInterj,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelInterj,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Determinantes</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelDet,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelDet,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelDet,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelDet,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelDet,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Conjunciones Subordinadas</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConjsub,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConjsub,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConjsub,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConjsub,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelConjsub,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Nombres Propios</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNprop,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNprop,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNprop,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNprop,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelNprop,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Pronombres</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPronom,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPronom,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPronom,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPronom,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPronom,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia Relativa Preposiciones</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPrep,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPrep,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPrep,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPrep,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(frecRelPrep,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <button onClick={toCSV}
                    type="button"
                    style={{
                        fontSize: '14px',
                        padding: '10px 20px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '20px' // Espacio entre los botones
                    }}
                >
                    <FaDownload style={{ marginRight: '5px', fontSize: '16px' }} /> {/* Icono de descargas */}
                    Descargar tabla en formato CSV
                </button>

                <button onClick={handleSubmit}
                    type="submit"
                    style={{
                        fontSize: '14px',
                        padding: '10px 20px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <FaArrowLeft style={{ marginRight: '5px', fontSize: '16px' }} />
                    Volver Página Principal
                </button>
            </div>
           
        </div>
    );
}

export default AnalisisPOS;