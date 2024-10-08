import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

const AnalisisBDLASE = () => {
    const { index } = useParams();  // index de la colección que se le pasa por parámetro
    const [nombre, setNombre] = useState(''); // Estado para almacenar el nombre de la colección
    const [loaded, setLoaded] = useState(false); // Para evitar hacer peticiones GET constantemente
    const [v_bdlase, setVBDLASE] = useState(''); // Estado para almacenar la cadena combinada de datos

    useEffect(() => {
        if (!loaded) {
            fetch(`http://localhost:5000/colecciones/${index}/VerBDLASE`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ha ocurrido un error');
                    }
                    return response.json();
                })
                .then(data => {
                    setNombre(data.nombre_c);
                    setVBDLASE(data.v_vdlase);  // Asignar la cadena combinada desde el backend
                    setLoaded(true);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [index, loaded]);

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
    
        // Datos de la característica "BDLASE"
        const data = {
            bdlase: getFormattedValues(v_bdlase) // Suponiendo que 'bdlase' es una variable que contiene todos los valores
        };
    
        // Define las filas del CSV
        const rows = [
            ["Característica", "Mínimo", "Máximo", "Varianza", "Moda", "Media"],
            ["BDLASE", ...data.bdlase]
        ];
    
        // Convierte el array de filas a una cadena CSV
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'bdlase.csv');
        document.body.appendChild(link); // Requerido para Firefox
        link.click();
    };
    

    // Función para obtener un valor específico de v_bdlase según su posición
    const getValor = (posicion) => {
        if (v_bdlase.trim() !== '') {
            const partes = v_bdlase.split('/');
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

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline' }}>BDLASE</h1>

            <div style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '5px',
                width: '80%',
                margin: '20px auto'
            }}>
                <h3 style={{ fontSize: '20px' }}>Resumen para la Característica "BDLASE"</h3>
                <div style={{ textAlign: 'center', margin: '20px auto', width: '80%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <tbody>
                            <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                                <th style={{ padding: '10px', borderRight: '1px solid white' }}>Característica</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #ccc', fontWeight: 'bold' }}>BDLASE</td>
                                <td style={{ padding: '10px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>Minimo</td>
                                                <td style={{ padding: '10px' }}>{getValor(1)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>Maximo</td>
                                                <td style={{ padding: '10px' }}>{getValor(2)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>Varianza</td>
                                                <td style={{ padding: '10px' }}>{getValor(3)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>Moda</td>
                                                <td style={{ padding: '10px' }}>{getValor(4)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '10px', fontWeight: 'bold' }}>Media</td>
                                                <td style={{ padding: '10px' }}>{getValor(5)}</td>
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

export default AnalisisBDLASE;
