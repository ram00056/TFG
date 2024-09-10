import React, { useState, useEffect } from 'react'; // Importamos la librería React para gestionar la parte de frontend { useState }
import { useParams, useNavigate, Link } from 'react-router-dom'; // Enlazar los links para navegar entre páginas
import { FaArrowLeft } from 'react-icons/fa';


const ViewColeccion = () => {

    const { index } = useParams();  // index de la colección que se le pasa por parámetro
    const [nombre, setNombre] = useState(''); // Nombre de la colección
    const [nombre_archivos, setNombreArchivos] = useState([]); // Lista de archivos
    const [loaded, setLoaded] = useState(false); // Para evitar hacer peticiones GET constantemente
    const [filtro, setFiltro] = useState(''); // Estado para el filtro de búsqueda

    useEffect(() => {
        if (!loaded) {
            fetch(`http://localhost:5000/colecciones/${index}/ViewColeccion`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.nombre_c);
                    setNombre(data.nombre_c);
                    setNombreArchivos(data.nombre_archivos);
                    setLoaded(true);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [loaded, index]);

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/colecciones");
    };

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    // Filtrar archivos basados en el contenido del filtro
    const archivosFiltrados = nombre_archivos.filter(archivo =>
        archivo.toLowerCase().includes(filtro.toLowerCase())
    );

    // Mostrar el contenido de la página con un determinado formato
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left', padding: '20px', textDecoration: 'underline' }}> Colección "{nombre}"</h1>

            <p style={{
                textAlign: 'left',
                marginLeft: '100px',
                fontSize: '26px',
                fontWeight: 'bold'
            }}>
                Número de archivos: {nombre_archivos.length} docs
            </p>

            <p style={{
                textAlign: 'left',
                marginLeft: '100px',
                fontWeight: 'bold',
                fontSize: '26px'
            }}>
                Listado de archivos:
            </p>

            <div style={{
                maxWidth: '100%', // Ocupa todo el ancho disponible
                height: '300px', // Altura máxima fija para la barra de desplazamiento
                overflowY: 'auto', // Habilita la barra de desplazamiento vertical
                border: '1px solid #ccc', // Borde para el contenedor
                borderRadius: '5px', // Bordes redondeados
                padding: '10px', // Espaciado interior
                marginLeft: '150px', // Margen izquierdo para alinear con el borde izquierdo deseado
                marginBottom: '20px', // Espacio debajo del contenedor
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '100%', // Ocupa todo el ancho disponible
                    marginLeft: '50px', // Margen izquierdo para alinear con el borde izquierdo deseado
                    marginBottom: '20px', // Espacio debajo del contenedor
                    marginTop: '20px',
                }}>
                    <input
                        type="text"
                        placeholder="Buscar archivo..."
                        style={{ marginBottom: '10px', padding: '10px', fontSize: '16px', width: '300px' }}
                        value={filtro}
                        onChange={handleFiltroChange}
                    />
                </div>

                <ul style={{ padding: 0, listStyleType: 'none', paddingLeft: '20px' }}>
                    {archivosFiltrados.map((archivo, id) => (
                        <li key={id} style={{
                            textAlign: 'left',
                            fontSize: '20px',
                            marginBottom: '10px',
                            marginLeft: '75px',
                            fontWeight: 'bold'
                        }}>
                            <Link to={`/colecciones/${index}/archivo/${archivo}`}>{archivo}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ width: '100%', textAlign: 'right', marginLeft: '1200px' }}>
                <button onClick={handleSubmit}
                    type="submit"
                    style={{
                        display: 'flex',
                        marginRight: '50px',
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
                    <FaArrowLeft style={{ marginRight: '5px', fontSize: '16px' }} />
                    Volver Página Principal
                </button>
            </div>
        </div>
    );
}

export default ViewColeccion;
