import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AnalisisDescriptivo = () => {
    const { index } = useParams();
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({
        BDLASE: true,
        Complejidad: true,
        Emofinder: true,
        Emojis: true,
        'Polaridad Emojis': true,
        'Polaridad Emoticonos': true,
        Emociones: true,
        Ironia: true,
        ISAL: true,
        Lemas: true,
        'Diversidad Lexica': true,
        LIWC: true,
        NCR: true,
        NER: true,
        'N-Grams': true,
        Perplejidad: true,
        Polaridad: true,
        POS: true,
        SEL: true,
        Estilometria: true,
        Volumetria: true
    });
    const [analisisCompletado, setAnalisisCompletado] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loaded) {
            setLoadingAnalysis(true);  // Mostrar indicador de carga
            fetch(`http://localhost:5000/colecciones/${index}/analisisDescriptivo`)
                .then(response => response.json())
                .then(data => {
                    setNombre(data.nombre_c);
                    setEstado(data.estado);

                    // Actualizar el estado del checkbox basado en el estado del análisis
                    const newCheckboxStates = {};
                    const completados = [];

                    const etiquetas = [
                        'BDLASE', 'Complejidad', 'Emofinder', 'Emojis', 'Polaridad Emojis',
                        'Polaridad Emoticonos', 'Emociones', 'Ironia', 'ISAL', 'Lemas', 'Diversidad Lexica',
                        'LIWC', 'NCR', 'NER', 'N-Grams', 'Perplejidad', 'Polaridad', 'POS', 'SEL', 'Estilometria', 'Volumetria'
                    ];

                    etiquetas.forEach((etiqueta, i) => {
                        if (data.analizado[i] === 0) {
                            newCheckboxStates[etiqueta] = false; // Marcar como no seleccionado
                        } else if (data.analizado[i] === 1) {
                            completados.push(etiqueta);
                        } else {
                            newCheckboxStates[etiqueta] = true; // Mantener como seleccionable
                        }
                    });

                    setCheckboxStates(newCheckboxStates);
                    setAnalisisCompletado(completados);
                    setLoadingAnalysis(false);  // Mostrar indicador de carga

                    setLoaded(true);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [index, loaded]);
    

    const handleVolver = () => {
        navigate("/colecciones");
    };

    const handleAnalizar = (label) => {
    fetch(`http://localhost:5000/colecciones/${index}/actualizarEstado/${label}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: 1 }) // Cambiar estado a 1
    })
        .then(response => response.json())
        .then(data => {
            // Actualizar estado de checkbox y analisisCompletado
            setCheckboxStates(prevState => {
                const newState = { ...prevState };
                delete newState[label]; // Eliminar el ítem de checkboxStates
                return newState;
            });
            setAnalisisCompletado(prev => [...prev, label]);
        })
        .catch(error => console.error('Error:', error));
};
    

    const handleEliminarAnalisis = (label) => {
        fetch(`http://localhost:5000/colecciones/${index}/actualizarEstado/${label}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 0 }) // Cambiar estado a 0
        })
            .then(response => response.json())
            .then(data => {
                // Actualizar estado de checkbox y analisisCompletado
                setCheckboxStates(prevState => ({
                    ...prevState,
                    [label]: true
                }));
                setAnalisisCompletado(prev => prev.filter(item => item !== label));
            })
            .catch(error => console.error('Error:', error));
    };
    

    const handleNombreClick = (option, index) => {
        const routes = {
            BDLASE: `/analisisBDLASE/${index}`,
            Complejidad: `/analisisComplejidad/${index}`,
            Emofinder: `/analisisEmofinder/${index}`,
            Emojis: `/analisisEmojis/${index}`,
            'Polaridad Emojis': `/analisisPolaridadEmojis/${index}`,
            'Polaridad Emoticonos': `/analisisPolaridadEmoticonos/${index}`,
            Emociones: `/analisisEmociones/${index}`,
            Ironia: `/analisisIronidad/${index}`,
            ISAL: `/analisisISAL/${index}`,
            Lemas: `/analisisLemas/${index}`,
            'Diversidad Lexica': `/analisisDiversidad/${index}`,
            LIWC: `/analisisLIWC/${index}`,
            NCR: `/analisisNCR/${index}`,
            NER: `/analisisNER/${index}`,
            'N-Grams': `/analisisNGrams/${index}`,
            Perplejidad: `/analisisPerplejidad/${index}`,
            Polaridad: `/analisisPolaridad/${index}`,
            POS: `/analisisPOS/${index}`,
            SEL: `/analisisSEL/${index}`,
            Estilometria: `/analisisEstilometria/${index}`,
            Volumetria: `/analisisVolumetria/${index}`
        };
        navigate(routes[option]);
    };

    const [selectedTab, setSelectedTab] = useState('descriptivo');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        if (tab === 'contrastivo') {
            handleAnalizarContras(index);
        }
    };

    const handleAnalizarContras = (index) => {
        navigate(`/analisisContrastivo/${index}`);
    };

    

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            {loadingAnalysis && (
            <div style={{ fontSize: '26px', color: 'black', margin: '20px 0', fontWeight: 'bold' }}>
                Cargando Análisis...
            </div>
        )}

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
                            backgroundColor: selectedTab === 'descriptivo' ? 'white' : 'grey',
                            color: selectedTab === 'descriptivo' ? 'black' : 'white',
                            borderBottom: selectedTab === 'descriptivo' ? '2px solid transparent' : 'none',
                            borderRadius: selectedTab === 'descriptivo' ? '5px 5px 0 0' : '5px 5px 0 0',
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
                            backgroundColor: selectedTab === 'contrastivo' ? 'white' : 'grey',
                            color: selectedTab === 'contrastivo' ? 'black' : 'white',
                            borderBottom: selectedTab === 'contrastivo' ? '2px solid transparent' : 'none',
                            borderRadius: selectedTab === 'contrastivo' ? '5px 5px 0 0' : '5px 5px 0 0',
                        }}
                    >
                        Análisis Contrastivo
                    </div>
                </div>
            </div>

            {analisisCompletado.length > 0 && (
                <div style={{ textAlign: 'left' }}>
                    <p style={{ width: '100%', textAlign: 'left', marginLeft: '50px', fontSize: '26px', fontWeight: 'bold', textDecoration: 'underline' }} >Analizados</p>
                    {analisisCompletado.map(option => (
                        <div key={option} style={{ display: 'flex', alignItems: 'center' }}>
                            <p
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    marginLeft: '100px',
                                    fontSize: '26px',
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    color: 'blue',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleNombreClick(option, index)}
                            >
                                {option}
                            </p>
                            <div style={{ width: '500%', textAlign: 'left'}}>
                                <button onClick={() => handleEliminarAnalisis(option)} style={{ fontSize: '20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>- Eliminar análisis</button>
                            </div>    
                        </div>
                    ))}
                </div>
            )}

            {/* Sin analizar */}
            <p style={{ width: '100%', textAlign: 'left', marginLeft: '50px', fontSize: '26px', fontWeight: 'bold', textDecoration: 'underline' }} > Sin analizar </p>

            <div style={{ width: '30%', textAlign: 'left', marginLeft: '100px' }}>
                {Object.entries(checkboxStates).map(([label, checked]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ fontSize: '26px', flex: 1 }}>
                            {!checked && label}
                        </label>
                        {!checked && (
                            <button
                                onClick={() => handleAnalizar(label)}
                                style={{
                                    marginLeft: '10px', 
                                    fontSize: '14px',
                                    padding: '10px 20px',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                    outline: 'none'
                                }}
                            >
                                + Analizar
                            </button>
                        )}
                    </div>
                ))}
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

export default AnalisisDescriptivo;
