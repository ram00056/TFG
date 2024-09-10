import React, { useState, useEffect } from 'react'; //Importamos la libreria React para gestionar la parte de frontend { useState }
import { useParams, useNavigate } from 'react-router-dom'; //Enlazar los links para navegar entre páginas
import { FaArrowLeft, FaBalanceScale } from 'react-icons/fa';


const AnalisisContrastivo = () => { //Función que incluye el formulario para mostrar la página del analisis descriptivo

    const { index } = useParams();  // index de la colección que se le pasa por parámetro
    const [nombre, setNombre] = useState([]); //total de archivos (para usar el nombre de la colección)
    const [todasColecciones, setTodasColecciones] = useState([]);
    const [coleccionComparar, setColeccionComparar] = useState("");
    const [loaded, setLoaded] = useState(false); // Para evitar hacer peticiones GET constantemente
    const [caracteristicasComunes, setCaracteristicasComunes] = useState([]); //Caracteristicas analizadas en ambos
    const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState("");
    const [rutaComparacion, setRutaComparacion] = useState([]);
    const [loading, setLoading] = useState(false); // Estado de carga


    if (!loaded){
        fetch(`http://localhost:5000/colecciones/${index}/analisisContrastivo`)
        .then(response => response.json())
        .then(data => {
            setNombre(data.nombre_c);
            setLoaded(true);
        })
        .catch(error => console.error('Error:', error));

        fetch('http://localhost:5000/colecciones')
            .then(response => response.json())
            .then(data => setTodasColecciones(data))
            .catch(error => console.error('Error:', error));
    };

    const navigate = useNavigate();

    // Función de lo que ocurre al pulsar en Añadir Colección
    const handleVolver = () => {
        navigate("/colecciones");
    };

    const [selectedTab, setSelectedTab] = useState('descriptivo');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        if (tab === 'descriptivo') {
            handleAnalizarContras(index);
        }
    };

    const handleAnalizarContras = (index) => {
        navigate(`/analisisDescriptivo/${index}`);
    };

    const handleComparar = () => {
        if (caracteristicaSeleccionada) {
            const routes = {
                complejidad: `/analisisContrastivo/Complejidad/${index}/${coleccionComparar}`,
                emociones: `/analisisContrastivo/Emociones/${index}/${coleccionComparar}`,
                ironia: `/analisisContrastivo/Ironia/${index}/${coleccionComparar}`,
                lemas: `/analisisContrastivo/Lemas/${index}/${coleccionComparar}`,
                diversidad_lexica: `/analisisContrastivo/DiversidadLexica/${index}/${coleccionComparar}`,
                perplejidad: `/analisisContrastivo/Perplejidad/${index}/${coleccionComparar}`,
                polaridad: `/analisisContrastivo/Polaridad/${index}/${coleccionComparar}`,
                pos: `/analisisContrastivo/POS/${index}/${coleccionComparar}`,
                estilometria: `/analisisContrastivo/Estilometria/${index}/${coleccionComparar}`,
                volumetria: `/analisisContrastivo/Volumetria/${index}/${coleccionComparar}`
            };
            navigate(routes[caracteristicaSeleccionada]);
        };
        
    };

    useEffect(() => {
        if (coleccionComparar) {
            setLoading(true);
            fetch(`http://localhost:5000/colecciones/${index}/${coleccionComparar}/analizado`)
            .then(response => response.json())
                .then(data => {
                    setLoading(false); // Finalizar carga
                    if(data.rutaComparacion){
                        setRutaComparacion(data.rutaComparacion);


                        fetch(`http://localhost:5000/colecciones/${index}/comparar/${coleccionComparar}`)
                        .then(response => response.json())
                        .then(data => {
                            setCaracteristicasComunes(data.comunes);
                        })
                        .catch(error => {
                            setLoading(false);
                            console.error('Error:', error);
                    });

                    } else {
                        alert('La colección seleccionada no ha sido analizada.');
                    }
                })     
        }
    }, [index, coleccionComparar]);;

    // Mostrar el contenido de la pagina con un determinado formato
    return (
        
        <div style={{ textAlign: 'center', padding: '20px' }}> {/* Poner el título encima de la página */}
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left', padding: '20px', textDecoration: 'underline' }}> Colección "{nombre}"</h1>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <div style={{ width: '100%', display: 'flex', borderBottom: '2px solid #ddd' }}>
                    <div
                        onClick={() => handleTabClick('descriptivo')}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '25px',
                            padding: '15px 0',
                            cursor: 'pointer',
                            backgroundColor: selectedTab === 'contrastivo' ? 'white' : 'grey',
                            color: selectedTab === 'contrastivo' ? 'black' : 'white',
                            borderBottom: selectedTab === 'contrastivo' ? '2px solid transparent' : 'none',
                            borderRadius: selectedTab === 'contrastivo' ? '5px 5px 0 0' : '5px 5px 0 0',
                            marginRight: '2px'
                        }}
                    >
                        Análisis Descriptivo
                    </div>
                    <div
                        onClick={() => handleTabClick('contrastivo')}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '25px',
                            padding: '15px 0',
                            cursor: 'pointer',
                            backgroundColor: selectedTab === 'descriptivo' ? 'white' : 'grey',
                            color: selectedTab === 'descriptivo' ? 'black' : 'white',
                            borderBottom: selectedTab === 'descriptivo' ? '2px solid transparent' : 'none',
                            borderRadius: selectedTab === 'descriptivo' ? '5px 5px 0 0' : '5px 5px 0 0',
                        }}
                    >
                        Análisis Contrastivo
                    </div>
                </div>
            </div>

            
            
            <div style={{ textAlign: 'left', padding: '20px', marginLeft: '50px' }}>
                <label style={{ fontSize: '26px', fontWeight: 'bold' }} htmlFor="coleccionComparar">Selecciona colección para comparar:</label>
                <select 
                    id="coleccionComparar"
                    value={coleccionComparar}
                    onChange={(e) => setColeccionComparar(e.target.value)}
                    style={{ padding: '10px', margin: '10px', fontSize: '18px' }}
                >
                    <option value="">Seleccionar colección</option>
                    {todasColecciones.map((coleccion) => (
                        <option key={coleccion[0]} value={coleccion[0]}>{coleccion[1]}</option>
                    ))}
                </select>
            </div>
            {loading && <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold' }}>Cargando análisis...</div>}
            {caracteristicasComunes.length > 0 && (
                <div style={{ textAlign: 'left', padding: '20px', marginLeft: '50px' }}>
                    <label style={{ fontSize: '26px', fontWeight: 'bold' }} htmlFor="caracteristicaSeleccionada">Selecciona característica a comparar:</label>
                    <select 
                        id="caracteristicaSeleccionada"
                        value={caracteristicaSeleccionada}
                        onChange={(e) => setCaracteristicaSeleccionada(e.target.value)}
                        style={{ padding: '10px', margin: '10px', fontSize: '18px' }}
                    >
                        <option value="">Seleccionar característica</option>
                        {caracteristicasComunes.map((caracteristica, index) => (
                            <option key={index} value={caracteristica}>{caracteristica}</option>
                        ))}
                    </select>
                </div>
            )}

            

            <div style={{ width: '100%', textAlign: 'right', marginLeft: '1300px' }}>
                    <button 
                        type="submit"
                        onClick={handleComparar} 
                        style={{
                            display: 'flex',
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
                        <FaBalanceScale style={{ marginRight: '5px', fontSize: '16px' }} />
                        Comparar
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginLeft: '650px' }}>
                    <button onClick={handleVolver}
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
                        <FaArrowLeft style={{ marginRight: '5px', fontSize: '16px' }} />
                        Volver a Página Principal
                    </button>
                </div>

        </div>
    );
}

export default AnalisisContrastivo;