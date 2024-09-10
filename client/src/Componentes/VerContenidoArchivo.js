import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft} from 'react-icons/fa';

const ArchivoDetalle = () => {
    const { index, nombreArchivo } = useParams();
    const [contenido, setContenido] = useState('');
    const [tipo, setTipo] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/colecciones/${index}/archivo/${nombreArchivo}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error');
            })
            .then(data => {
                setContenido(data.content);
                setTipo(data.type);
            })
            .catch(error => console.error('Error:', error));
    }, [index, nombreArchivo]);

    //Visualizar el contenido de mejor manera
    const mostrarContenido = () => {
        if (tipo === 'csv') {
            return <pre>{contenido}</pre>;
        } else if (tipo === 'json') {
            return <pre>{JSON.stringify(contenido, null, 2)}</pre>;
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Análisis de Corpus</h1>

            <h1 style={{ textAlign: 'left', padding: '20px', textDecoration: 'underline' }}> Archivo "{nombreArchivo}"</h1>

            <div style={{ 
                textAlign: 'left', 
                padding: '20px', 
                maxHeight: '70vh', // Controla la altura del contenedor
                overflowY: 'auto', // Añade barra de desplazamiento vertical
                border: '1px solid #ccc', 
                borderRadius: '5px', 
                padding: '10px', 
                marginLeft: '50px',
                marginBottom: '20px'
            }}>
                {mostrarContenido()}
            </div>

            <div style={{ width: '100%', textAlign: 'center', marginTop: '20px', display: 'flex', marginLeft: '1200px' }}>
                <Link to="/colecciones"
                    style={{
                        marginRight: '50px',
                        fontSize: '14px',
                        padding: '10px 20px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        outline: 'none',
                        textDecoration: 'none',
                    }}
                >
                    <FaArrowLeft style={{ marginRight: '5px', fontSize: '16px' }} />
                    Volver a la Lista de Archivos
                </Link>
            </div>
        </div>
    );
}

export default ArchivoDetalle;
