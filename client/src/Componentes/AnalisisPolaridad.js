import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

const AnalisisPolaridad = () => {
    const { index } = useParams();
    const [nombre, setNombre] = useState('');
    const [vPositiva, setVPositiva] = useState('');
    const [vNegativa, setVNegativa] = useState('');
    const [vNeutra, setVNeutra] = useState('');
    const [loaded2, setLoaded2] = useState(false);

    if (!loaded2) {
        fetch(`http://localhost:5000/colecciones/${index}/VerPolaridad`)
            .then(response => response.json())
            .then(data => {
                setNombre(data.nombre_c);
                setVPositiva(data.v_positiva);
                setVNegativa(data.v_negativa);
                setVNeutra(data.v_neutra);
                setLoaded2(true);
            })
            .catch(error => console.error('Error:', error));
    };

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
            vPositiva: getFormattedValues(vPositiva),
            vNegativa: getFormattedValues(vNegativa),
            vNeutra: getFormattedValues(vNeutra)
        };
    
        // Define las filas del CSV
        const rows = [
            ["Característica", "Mínimo", "Máximo", "Varianza", "Moda", "Media"],
            ["Valor Positiva", ...data.vPositiva],
            ["Valor Negativa", ...data.vNegativa],
            ["Valor Neutra", ...data.vNeutra]
        ];
    
        // Convierte el array de filas a una cadena CSV
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'polaridad.csv');
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

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left' }}>Colección "{nombre}"</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline' }}>Polaridad</h1>

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
                <h3 style={{ fontSize: '20px' }}>Resumen para la Característica "Polaridad"</h3>
                <div style={{ textAlign: 'center', margin: '20px auto', width: '80%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <tbody>
                            <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                                <th style={{ padding: '10px', borderRight: '1px solid white' }}>Característica</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Positiva</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vPositiva,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vPositiva,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vPositiva,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vPositiva,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vPositiva,5)}</td>
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
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Negativa</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNegativa,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNegativa,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNegativa,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNegativa,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNegativa,5)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Neutra</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Minimo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNeutra,1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Maximo</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNeutra,2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Varianza</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNeutra,3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center'}}>Moda</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNeutra,4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>Media</td>
                                                <td style={{ padding: '10px', textAlign: 'left' }}>{getValor(vNeutra,5)}</td>
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

export default AnalisisPolaridad;
