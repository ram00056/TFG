import React, { useState } from 'react'; //Importamos la libreria React para gestionar la parte de frontend
import { Link, Navigate } from 'react-router-dom'; //Enlazar los links para navegar entre páginas
import { FaSignInAlt } from 'react-icons/fa';


const InicioSesion = () => { //Función que incluye el formulario para mostrar la página de inicio de sesión

    const [usuario, setUsername] = useState('');
    const [contraseña, setPassword] = useState('');

    const [loggeado, setLoggedIn] = useState(false); // Función para comprobar si usuario loggeado

    const handleSubmit = (e) => {
        e.preventDefault();
        // Se envían los datos del formulario al servidor para iniciar sesión
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                contraseña: contraseña
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Inicio de sesión exitoso'); 
                setLoggedIn(true);
            } else {
                console.log('Error en inicio de sesión:', response.statusText);
                response.json().then(data => {
                    alert(data.error) // Mensaje de error con el problema mediante una alerta
                })
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    return (
        <div style={{ textAlign: 'center', padding: '20px' }}> {/* Poner el título encima de la página */}
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '10px', width: '100%' }}>
                    <label style={{ marginRight: '36px' }}>Usuario:</label>
                    <input type="text" value={usuario} onChange={(e) => setUsername(e.target.value)} style={{ fontSize: '16px', padding: '8px' }}/>
                </div>
                <div style={{ marginBottom: '30px', width: '100%' }}>
                    <label style={{ marginRight: '10px' }}>Contraseña:</label>
                    <input type="password" value={contraseña} onChange={(e) => setPassword(e.target.value)} style={{ fontSize: '16px', padding: '8px' }} />
                </div>
                <div style={{ width: '100%', textAlign: 'center', marginLeft: '1375px'}}>
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
                            <FaSignInAlt style={{ marginRight: '5px', fontSize: '16px' }} />
                            Iniciar Sesión
                        </button>
                        {loggeado && <Navigate to="/colecciones" />}
                </div>

            </form>
            <p>Si no tienes cuenta. <Link to="/registro">Regístrate aquí</Link>.</p>
        </div>
    );
}

export default InicioSesion;
