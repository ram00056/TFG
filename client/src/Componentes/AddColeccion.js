import React, { useState } from 'react'; //Importamos la libreria React para gestionar la parte de frontend { useState }
import { Navigate } from 'react-router-dom'; //Enlazar los links para navegar entre páginas
import { FaPlus } from 'react-icons/fa'; // Añadir Icono +


const AddColeccion = () => { //Función que incluye el formulario para mostrar la página de inicio de sesión

    const [nombre, setNombre] = useState(''); // Estado para almacenar el nombre de la colección
    const [archivo, setArchivo] = useState(null); // Estado para almacenar el archivo ZIP

    const [coleccionCorrecta, setcoleccionCorrecta] = useState(false);

    // Función de lo que ocurre al pulsar en Añadir Colección
    const handleSubmit = (e) => {
        e.preventDefault();
        // Se envían los datos del formulario al servidor para iniciar sesión

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('archivo', archivo);

        fetch('http://localhost:5000/addColeccion', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log("Archivo subido correctamente");
                setcoleccionCorrecta(true)
            } else {
                console.log(response.data);
                response.json().then(data => {
                    alert(data.error)
                })
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    // Función para actualizar campo nombre
    const handleNombreChange = (e) => {
        setNombre(e.target.value);
      };
    
    // Función para actualizar campo fichero  
    const handleArchivoChange = (e) => {
        const fichero = e.target.files[0];
        setArchivo(fichero);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}> {/* Poner el título encima de la página */}
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1>Añadir Colección</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px', width: '100%' }}>
                    <label style={{ marginRight: '10px' }}>Nombre de la colección:</label>
                    <input type="text" value={nombre} onChange={handleNombreChange} style={{ fontSize: '16px', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '30px', width: '100%' }}>
                    <label style={{ marginRight: '10px' }}>Archivo ZIP:</label>
                    <input type="file" accept=".zip" onChange={handleArchivoChange} style={{ fontSize: '16px', padding: '8px' }} />
                </div>

                <p>Nota: El nombre de la colección debe coincidir con el nombre del archivo ZIP.</p>

                <div style={{ width: '100%', textAlign: 'center', marginLeft: '650px' }}>
                    <button 
                        type="submit" 
                        style={{
                            display: 'flex',
                            fontSize: '14px',
                            padding: '10px 20px',
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
                        Añadir Colección
                    </button>
                    {coleccionCorrecta && <Navigate to="/colecciones" />}
                </div>
            </form>
        </div>
    );
}

export default AddColeccion;