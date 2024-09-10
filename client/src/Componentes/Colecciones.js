import React, { useState } from 'react'; //Importamos la libreria React para gestionar la parte de frontend { useState }
import { useNavigate } from 'react-router-dom'; //Enlazar los links para navegar entre páginas
import { FaEye, FaChartBar, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa'; //Añadir Iconos
import { FiFolder } from 'react-icons/fi'; // Importa el icono de carpeta

const Colecciones = () => { //Función que incluye el formulario para mostrar la página de inicio de sesión

    const [colecciones, setColecciones] = useState([]);
    const [loaded, setLoaded] = useState(false); // Para evitar hacer peticiones GET constantemente 

    if (!loaded) {
        fetch('http://localhost:5000/colecciones')
            .then(response => response.json())
            .then(data => {
                const coleccionAux = data.map(coleccion => ({
                    Id_C: coleccion[0],
                    Nombre_C: coleccion[1]
                }));
                setColecciones(coleccionAux);
                setLoaded(true);
            })
            .catch(error => {
                navigate("/")
                console.error('Error:', error);
                
            });
    }

    const navigate = useNavigate();

    // Función para volver a cargar la pagina
    const reloadCollections = () => {
        fetch('http://localhost:5000/colecciones')
            .then(response => response.json())
            .then(data => {
                const coleccionAux = data.map(coleccion => ({
                    Id_C: coleccion[0],
                    Nombre_C: coleccion[1]
                }));
                setColecciones(coleccionAux);
                setLoaded(true);
            })
            .catch(error => {
                navigate("/");
                console.error('Error:', error);
            });
    };
    

    // Función de lo que ocurre al pulsar en Añadir Colección
    const handleClick = () => {
        navigate("/addColeccion");
    };

    // Función de lo que ocurre al pulsar en Ver
    const handleView = (index) => {
        navigate(`/viewColeccion/${index}`);
    };

    // Función de lo que ocurre al pulsar en Analizar
    const handleAnalizar = (index) => {
        navigate(`/analisisDescriptivo/${index}`);
    };

    // Función de lo que ocurre al pulsar en Eliminar 
    const handleDelete = (index) => {
        const coleccionesAux = [...colecciones];
        coleccionesAux.splice(index, 1);
        setColecciones(coleccionesAux);
        console.log(index)
        fetch(`http://localhost:5000/colecciones/${index}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log("Colección eliminada correctamente");
                reloadCollections();
            } else {
                console.error('Error al eliminar la colección');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // Función de lo que ocurre al pulsar en Cerrar Sesión
    const handleLogout = () => {
        fetch(`http://localhost:5000/logout`, {
            method: 'POST',
        })
        .then(data => 
            navigate("/")    
        )
        .catch(error => console.error('Error:', error));
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}> {/* Poner el título encima de la página */}
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>
            <h1 style={{ textAlign: 'left', padding: '20px' }}>Colecciones Guardadas</h1>

            {colecciones.length > 0 ? (
                <ul style={{ padding: 0, listStyleType: 'none', marginLeft: '70px' }}>
                    {colecciones.map((coleccion, index) => (
                        <li key={index} style={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            fontSize: '25px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '10px 0', 
                            borderBottom: '1px solid #ddd', 
                            marginBottom: '10px' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '100px', flex: '1' }}>
                                <FiFolder style={{ marginRight: '10px', fontSize: '30px' }} /> {/* Icono de carpeta */}
                                <span style={{ marginRight: '10px' }}>Colección "{coleccion.Nombre_C}"</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '600px' }}>
                                <button 
                                    onClick={() => handleView(coleccion.Id_C)} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        padding: '10px 20px',
                                        backgroundColor: 'blue',
                                        color: 'white', 
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                        outline: 'none',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'darkblue'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'blue'}
                                >
                                    <FaEye style={{ marginRight: '5px', fontSize: '16px' }} /> {/* Icono de ojo */}
                                    Ver
                                </button>

                                <button 
                                    onClick={() => handleAnalizar(coleccion.Id_C)} 
                                    style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        padding: '10px 20px',
                                        backgroundColor: 'green',
                                        color: 'white', 
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                        outline: 'none',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'darkgreen'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'green'}
                                >
                                    <FaChartBar style={{ marginRight: '5px', fontSize: '16px' }} /> {/* Icono de gráfico */}
                                    Analizar
                                </button>

                                <button 
                                    onClick={() => handleDelete(coleccion.Id_C)} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        padding: '10px 20px',
                                        backgroundColor: 'red',
                                        color: 'white', 
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                        outline: 'none',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'darkred'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'red'}
                                >
                                    <FaTrash style={{ marginRight: '5px', fontSize: '16px' }} /> {/* Icono de basura */}
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: 'center', fontSize: '20px', color: '#777' }}>No hay colecciones guardadas.</p>
            )}

                <div style={{ width: '100%', marginLeft: '1250px' }}>
                    <button onClick={handleClick}
                        type="submit" 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '50px',
                            marginRight: '100px',
                            fontSize: '14px',
                            padding: '15px 25px',
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',                            
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            outline: 'none'
                        }}
                    >
                        <FaPlus style={{marginRight: '5px', fontSize: '16px' }} />
                        Añadir Colecciones
                    </button>
                </div>

                <div style={{textAlign: 'center', marginLeft: '650px' }}>
                    <button onClick={handleLogout}
                        type="submit" 
                        style={{
                            display: 'flex',
                            fontSize: '14px',
                            padding: '15px 25px',
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',                            
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            outline: 'none'
                        }}
                    >
                        <FaSignOutAlt style={{ marginRight: '5px', fontSize: '16px' }} />
                        Cerrar Sesión
                    </button>
                </div>
        </div>
    );
}

export default Colecciones;
