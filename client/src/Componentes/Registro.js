import React, { useState } from 'react'; //Importar librería React junto con el estado, para gestionar el formulario
import { Navigate } from 'react-router-dom'; //Enlazar páginas y poder navegar entre ellas
import { FaUserPlus } from 'react-icons/fa';


const Registro = () => { //Función para mostrar la página de Registro
    //Poner todos los campos a nulo  
    const [usuario, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setPassword] = useState('');
    const [nombre, setFirstName] = useState('');
    const [apellido, setLastName] = useState(''); 

    const [loggeado, setLoggedIn] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Se envian los datos del formulario al backend para procesar el registro
        fetch('http://localhost:5000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                email: email,
                contraseña: contraseña,
                nombre: nombre,
                apellido: apellido
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Registro exitoso'); 
                setLoggedIn(true);
            } else {
                console.log('Error en Registro:');
                response.json().then(data => {
                    alert(data.error)
                })
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div style={{ textAlign: 'center'}}> {/* Poner el título encima de la página */}
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1> 
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}> {/*Al pulsar en el submit llama a la función handleSubmit para procesar los datos*/}
        <div style={{ marginBottom: '10px', width: '100%' }}>
            <label style={{ marginRight: '65px' }}>Usuario:</label>
            <input type="text" value={usuario} onChange={(e) => setUsername(e.target.value)} style={{ fontSize: '16px', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px', width: '100%' }}>
            <label style={{ marginRight: '82px' }}>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ fontSize: '16px', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px', width: '100%' }}>
            <label style={{ marginRight: '40px' }}>Contraseña:</label>
            <input type="password" value={contraseña} onChange={(e) => setPassword(e.target.value)} style={{ fontSize: '16px', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px', width: '100%' }}>
            <label style={{ marginRight: '60px' }}>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setFirstName(e.target.value)} style={{ fontSize: '16px', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '30px', width: '100%' }}>
            <label style={{ marginRight: '10px' }}> Primer Apellido:</label>
            <input type="text" value={apellido} onChange={(e) => setLastName(e.target.value)} style={{ fontSize: '16px', padding: '8px' }}/>
        </div>
        <div style={{ width: '100%', textAlign: 'center', marginLeft: '700px' }}>
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
                        <FaUserPlus style={{ marginRight: '5px', fontSize: '16px' }} />
                        Registrarse
                    </button>
                    {loggeado && <Navigate to="/colecciones" />}
                </div>
        </form>
        </div>
    );
}

export default Registro;

