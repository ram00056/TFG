import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

const AnalisisPolaridadEmoticonos = () => {
    const { index } = useParams();
    const [nombre, setNombre] = useState('');
    const [nEmoticonos, setNEmoticonos] = useState('');
    const [pEmoticonos, setPEmoticonos] = useState('');
    const [distintEmoticonos, setDistintEmoticonos] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            fetch(`http://localhost:5000/colecciones/${index}/VerPolaridadEmoticonos`)
                .then(response => response.json())
                .then(data => {
                    setNombre(data.nombre_c);
                    setNEmoticonos(data.n_emoticonos);
                    setPEmoticonos(data.p_emoticonos);
                    setDistintEmoticonos(data.distint_emoticonos);
                    setLoaded(true);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [index, loaded]);

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate(`/analisisDescriptivo/${index}`);
    };

    const toCSV = () => {
        // Define una función para convertir un objeto de frecuencias en una cadena de texto
        const formatFrequencies = (freqObject) => {
            // Convierte el objeto a una cadena JSON
            return JSON.stringify(freqObject);
        };

        // Datos de las características
        const data = {
            nEmoticonos: formatFrequencies(nEmoticonos),
            pEmoticonos: formatFrequencies(pEmoticonos),
            distintEmoticonos: formatFrequencies(distintEmoticonos),
        };

        // Define las filas del CSV
        const rows = [
            ["Característica", "Frecuencia"],
            ["Numero Emoticonos", data.nEmoticonos],
            ["Porcentaje Emoticonos", data.pEmoticonos],
            ["Distintos Emoticonos", data.distintEmoticonos]
        ];

        // Convierte el array de filas a una cadena CSV
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'polaridadEmoticonos.csv');
        document.body.appendChild(link); // Requerido para Firefox
        link.click();
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left' }}>Colección "{nombre}"</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline' }}>Polaridad de Emoticonos</h1>

            <div style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '5px',
                width: '80%',
                margin: '20px auto'
            }}>
                <h3 style={{ fontSize: '20px' }}>Resumen para la Característica "Polaridad de Emoticonos"</h3>
                <div style={{ textAlign: 'center', margin: '20px auto', width: '80%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <tbody>
                            <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                                <th style={{ padding: '10px', borderRight: '1px solid white' }}>Característica</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Número de Emoticonos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px' }}>{nEmoticonos}</td>
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
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Porcentaje de Emoticonos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px'}}>{pEmoticonos}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr style={{ border: '1px solid #ccc' }}>
                                <td colSpan={2} style={{ padding: '5px' }}></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Emoticonos distintos</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px'}}>{distintEmoticonos}</td>
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

export default AnalisisPolaridadEmoticonos;
