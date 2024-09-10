import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

const AnalisisEstilometria = () => {
    const { index } = useParams();
    const [nombre, setNombre] = useState(''); // Nombre de la colección
    const [palabrasUnicas, setPalabrasUnicas] = useState(''); // Palabras únicas
    const [pTtr, setPTtr] = useState(''); // p_ttr
    const [pRttr, setPRttr] = useState(''); // p_rttr
    const [pHerdan, setPHerdan] = useState(''); // p_herdan
    const [pMaas, setPMaas] = useState(''); // p_maas
    const [pSomers, setPSomers] = useState(''); // p_somers
    const [pDugast, setPDugast] = useState(''); // p_dugast
    const [pHonore, setPHonore] = useState(''); // p_honore
    const [frecStopwords, setFrecStopwords] = useState(''); // frec_stopwords
    const [frecSdp, setFrecSdp] = useState(''); // frec_sdp
    const [loaded, setLoaded] = useState(false); // Para evitar hacer peticiones GET constantemente

    if (!loaded) {
        fetch(`http://localhost:5000/colecciones/${index}/VerEstilometria`)
            .then(response => response.json())
            .then(data => {
                setNombre(data.nombre_c);
                setPalabrasUnicas(data.palabras_unicas);
                setPTtr(data.p_ttr);
                setPRttr(data.p_rttr);
                setPHerdan(data.p_herdan);
                setPMaas(data.p_maas);
                setPSomers(data.p_somers);
                setPDugast(data.p_dugast);
                setPHonore(data.p_honore);
                setFrecStopwords(data.frec_stopwords);
                setFrecSdp(data.frec_sdp);
                setLoaded(true);
            })
            .catch(error => console.error('Error:', error));
    }

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate(`/analisisDescriptivo/${index}`);
    };

    const toCSV = () => {
        // Define una función para manejar el formato de los datos
        const getFormattedValues = (cadena) => {
            if (cadena.trim() !== '') {
                return cadena.split('/').map(v => v.trim());
            }
            return ['', '', '', '', '']; // Devuelve valores vacíos si no hay datos
        };

        const formatFrequencies = (freqObject) => {
            // Convierte el objeto a una cadena JSON
            return JSON.stringify(freqObject);
        };
    
        // Datos de las características
        const data = {
            palabrasUnicas: getFormattedValues(palabrasUnicas),
            pTtr: getFormattedValues(pTtr),
            pRttr: getFormattedValues(pRttr),
            pHerdan: getFormattedValues(pHerdan),
            pMaas: getFormattedValues(pMaas),
            pSomers: getFormattedValues(pSomers),
            pDugast: getFormattedValues(pDugast),
            pHonore: getFormattedValues(pHonore),
            frecStopwords: formatFrequencies(frecStopwords),
            frecSdp: formatFrequencies(frecSdp)
        };
    
        // Define las filas del CSV
        const rows = [
            ["Característica", "Mínimo", "Máximo", "Varianza", "Moda", "Media"],
            ["Palabras Únicas", ...data.palabrasUnicas],
            ["p_TTR", ...data.pTtr],
            ["p_RTTR", ...data.pRttr],
            ["p_Herdan", ...data.pHerdan],
            ["p_MAAS", ...data.pMaas],
            ["p_Somers", ...data.pSomers],
            ["p_Dugast", ...data.pDugast],
            ["p_Honore", ...data.pHonore],
            ["frecStopwords", data.frecStopwords],
            ["frecSdp", data.frecSdp]
        ];
    
        // Convierte el array de filas a una cadena CSV
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'estilometria.csv');
        document.body.appendChild(link); // Requerido para Firefox
        link.click();
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

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left'}}> Colección "{nombre}"</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline'}}> Estilometría</h1>

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
                <h3 style={{ fontSize: '20px'}}>Resumen para la Característica "Estilometría"</h3>
                <div style={{ textAlign: 'center', margin: '20px auto', width: '80%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <tbody>
                            <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                                <th style={{ padding: '10px', borderRight: '1px solid white' }}>Característica</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Palabras Únicas</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(palabrasUnicas,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(palabrasUnicas,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(palabrasUnicas,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(palabrasUnicas,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(palabrasUnicas,5)}</td>
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
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>TTR</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pTtr,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pTtr,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pTtr,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pTtr,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pTtr,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>RTTR</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pRttr,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pRttr,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pRttr,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pRttr,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pRttr,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Herdan</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHerdan,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHerdan,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHerdan,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHerdan,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHerdan,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Maas</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pMaas,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pMaas,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pMaas,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pMaas,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pMaas,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Somers</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '105%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pSomers,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pSomers,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pSomers,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pSomers,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pSomers,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Dugast</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pDugast,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pDugast,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pDugast,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pDugast,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pDugast,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Honore</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '112%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHonore,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHonore,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHonore,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHonore,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(pHonore,5)}</td>
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
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia de StopWords</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px' }}>{frecStopwords}</td>
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
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Frecuencia de Signos de Puntuación</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px' }}>{frecSdp}</td>
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

export default AnalisisEstilometria;
