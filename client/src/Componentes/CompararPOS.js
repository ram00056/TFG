import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const CompararPOS = () => {
    const { index, coleccionComparar } = useParams();  // index de la colección que se le pasa por parámetro

    //Valores para colección Elegida
    const [frecConjunciones1, setFrecConjunciones1] = useState([[], [], []]); // Frecuencia de conjunciones
    const [frecEspacios1, setFrecEspacios1] = useState([[], [], []]); // Frecuencia de espacios
    const [frecVerbos1, setFrecVerbos1] = useState([[], [], []]); // Frecuencia de verbos
    const [frecSimbolos1, setFrecSimbolos1] = useState([[], [], []]); // Frecuencia de símbolos
    const [frecNumeros1, setFrecNumeros1] = useState([[], [], []]); // Frecuencia de números
    const [frecSustantivos1, setFrecSustantivos1] = useState([[], [], []]); // Frecuencia de sustantivos
    const [frecAdjetivos1, setFrecAdjetivos1] = useState([[], [], []]); // Frecuencia de adjetivos
    const [frecSigPunt1, setFrecSigPunt1] = useState([[], [], []]); // Frecuencia de signos de puntuación
    const [frecVerbAux1, setFrecVerbAux1] = useState([[], [], []]); // Frecuencia de verbos auxiliares
    const [frecAdverbios1, setFrecAdverbios1] = useState([[], [], []]); // Frecuencia de adverbios
    const [frecInterjecciones1, setFrecInterjecciones1] = useState([[], [], []]); // Frecuencia de interjecciones
    const [frecDeterminantes1, setFrecDeterminantes1] = useState([[], [], []]); // Frecuencia de determinantes
    const [frecConjSub1, setFrecConjSub1] = useState([[], [], []]); // Frecuencia de conjunciones subordinadas
    const [frecNombresProp1, setFrecNombresProp1] = useState([[], [], []]); // Frecuencia de nombres propios
    const [frecPronon1, setFrecPronon1] = useState([[], [], []]); // Frecuencia de pronombres
    const [frecPreposiciones1, setFrecPreposiciones1] = useState([[], [], []]); // Frecuencia de preposiciones
    const [frecRelConj1, setFrecRelConj1] = useState([[], [], []]); // Frecuencia relativa de conjunciones
    const [frecRelEspacios1, setFrecRelEspacios1] = useState([[], [], []]); // Frecuencia relativa de espacios
    const [frecRelVerb1, setFrecRelVerb1] = useState([[], [], []]); // Frecuencia relativa de verbos
    const [frecRelSimb1, setFrecRelSimb1] = useState([[], [], []]); // Frecuencia relativa de símbolos
    const [frecRelNum1, setFrecRelNum1] = useState([[], [], []]); // Frecuencia relativa de números
    const [frecRelSus1, setFrecRelSus1] = useState([[], [], []]); // Frecuencia relativa de sustantivos
    const [frecRelAdj1, setFrecRelAdj1] = useState([[], [], []]); // Frecuencia relativa de adjetivos
    const [frecRelSdp1, setFrecRelSdp1] = useState([[], [], []]); // Frecuencia relativa de signos de puntuación
    const [frecRelVaux1, setFrecRelVaux1] = useState([[], [], []]); // Frecuencia relativa de verbos auxiliares
    const [frecRelAdv1, setFrecRelAdv1] = useState([[], [], []]); // Frecuencia relativa de adverbios
    const [frecRelInterj1, setFrecRelInterj1] = useState([[], [], []]); // Frecuencia relativa de interjecciones
    const [frecRelDet1, setFrecRelDet1] = useState([[], [], []]); // Frecuencia relativa de determinantes
    const [frecRelConjsub1, setFrecRelConjsub1] = useState([[], [], []]); // Frecuencia relativa de conjunciones subordinadas
    const [frecRelNprop1, setFrecRelNprop1] = useState([[], [], []]); // Frecuencia relativa de nombres propios
    const [frecRelPronom1, setFrecRelPronom1] = useState([[], [], []]); // Frecuencia relativa de pronombres
    const [frecRelPrep1, setFrecRelPrep1] = useState([[], [], []]); // Frecuencia relativa de preposiciones

    const [loaded1, setLoaded1] = useState(false); // Para evitar hacer peticiones GET constantemente

    if (!loaded1) {
        fetch(`http://localhost:5000/colecciones/${index}/${coleccionComparar}/pos`)
            .then(response => response.json())
            .then(data => {

                const procesarAtributo = (data) => {
                    if (data === 'None') return [[], [], []];
                
                    const convertidorArrayString = (str) => {
                        try {
                            return JSON.parse(str.replace(/(\d+)\s+(\d+)/g, '$1,$2')
                                                .replace(/\[([\d\s.,]+)\]/g, '[$1]'));
                        } catch (e) {
                            console.error('Error converting array string:', e);
                            return [];
                        }
                    };
                
                    return data.split('/').map(item => {
                        try {
                            const ItemCambiado = JSON.parse(item.replace(/'/g, '"'));
                
                            if (Array.isArray(ItemCambiado)) {
                                return ItemCambiado.map(value => Array.isArray(value) ? value : [value]);
                            }
                
                            if (typeof ItemCambiado === 'string' && ItemCambiado.startsWith('[') && ItemCambiado.endsWith(']')) {
                                return convertidorArrayString(ItemCambiado).map(value => [value]);
                            }
                
                            return [[ItemCambiado]];
                        } catch (e) {
                            console.error('Error parsing attribute data:', e);
                            return [[item]];
                        }
                    });
                };

                setFrecConjunciones1(procesarAtributo(data.frec_conjunciones));
                setFrecEspacios1(procesarAtributo(data.frec_espacios));
                setFrecVerbos1(procesarAtributo(data.frec_verbos));
                setFrecSimbolos1(procesarAtributo(data.frec_simbolos));
                setFrecNumeros1(procesarAtributo(data.frec_numeros));
                setFrecSustantivos1(procesarAtributo(data.frec_sustantivos));
                setFrecAdjetivos1(procesarAtributo(data.frec_adjetivos));
                setFrecSigPunt1(procesarAtributo(data.frec_sig_punt));
                setFrecVerbAux1(procesarAtributo(data.frec_verb_aux));
                setFrecAdverbios1(procesarAtributo(data.frec_adverbios));
                setFrecInterjecciones1(procesarAtributo(data.frec_interjecciones));
                setFrecDeterminantes1(procesarAtributo(data.frec_determinantes));
                setFrecConjSub1(procesarAtributo(data.frec_conj_sub));
                setFrecNombresProp1(procesarAtributo(data.frec_nombres_prop));
                setFrecPronon1(procesarAtributo(data.frec_pronon));
                setFrecPreposiciones1(procesarAtributo(data.frec_preposiciones));
                setFrecRelConj1(procesarAtributo(data.frec_rel_conj));
                setFrecRelEspacios1(procesarAtributo(data.frec_rel_espacios));
                setFrecRelVerb1(procesarAtributo(data.frec_rel_verb));
                setFrecRelSimb1(procesarAtributo(data.frec_rel_simb));
                setFrecRelNum1(procesarAtributo(data.frec_rel_num));
                setFrecRelSus1(procesarAtributo(data.frec_rel_sus));
                setFrecRelAdj1(procesarAtributo(data.frec_rel_adj));
                setFrecRelSdp1(procesarAtributo(data.frec_rel_sdp));
                setFrecRelVaux1(procesarAtributo(data.frec_rel_vaux));
                setFrecRelAdv1(procesarAtributo(data.frec_rel_adv));
                setFrecRelInterj1(procesarAtributo(data.frec_rel_interj));
                setFrecRelDet1(procesarAtributo(data.frec_rel_det));
                setFrecRelConjsub1(procesarAtributo(data.frec_rel_conjsub));
                setFrecRelNprop1(procesarAtributo(data.frec_rel_nprop));
                setFrecRelPronom1(procesarAtributo(data.frec_rel_pronom));
                setFrecRelPrep1(procesarAtributo(data.frec_rel_prep));
                setLoaded1(true);
            })
            .catch(error => console.error('Error:', error));
    }

    const TablaDatos = ({ headers, data }) => {
        if (!Array.isArray(data)) {
            return <div>Error: Los datos no están en el formato esperado.</div>;
        }
    
        const numeroFilas = data.length;
        const numeroColumnas = headers.length;
    
        // Verifica si el mensaje debe ser mostrado
        const noData = (numeroFilas === 1 && data[0].length === 1 && data[0][0] === 'No hay datos disponibles');
    
        return (
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '100%' }}>
                <thead>
                    <tr style={{ backgroundColor: 'lightgray' }}>
                        {headers.map((header, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {noData ? (
                        <tr>
                            <td colSpan={numeroColumnas} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                                No hay datos disponibles.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((value, colIndex) => (
                                    <td key={colIndex} style={{ border: '1px solid black', padding: '0', fontSize: '12px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '5px', boxSizing: 'border-box' }}>
                                            {value || ''}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        );
    };
    
    const TestNormal = [
        'Shapiro stat', 'Shapiro p-value', 
        'D\'Agostino stat', 'D\'Agostino p-value', 
        'Anderson-Darling stat', 'Anderson-Darling crit_val', 
        'Anderson-Darling sig_level', 'Chi-Square stat', 
        'Chi-Square p-value', 'Lilliefors stat', 
        'Lilliefors p-value', 'Jarque–Bera stat', 
        'Jarque–Bera p-value', 'Kolmogorov-Smirnov stat', 
        'Kolmogorov-Smirnov p-value'
    ];

    const TestNoParametricos = [
        'Criteria_1',	'Criteria_2', 
        'mannwhitneyu stat', 'mannwhitneyu p-value',
        'wilcoxon stat', 'wilcoxon p-value',	
        'kruskal stat', 'kruskal p-value'
    ]

    const TestParametricos = [
        'Criteria_1', 'Criteria_2',
        'Students t-test stat',	'Students t-test p-value',
        'Paired Students t-Test stat', 'Paired Students t-Test p-value',
        'ANOVA stat', 'ANOVA p-value'
    ]


    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate(`/analisisContrastivo/${index}`);
    };

    // Prepara los datos para la tabla
    const CrearValoresTabla = (name, data) => {
        const ProcesarDatos = (data) => {
            if (data.every(arr => arr.length === 0) || (data.length === 1 && data[0].length === 1 && data[0][0] === 'None')) {
                return [['No hay datos disponibles']];
            }
            return data;
        };
    
        const normalityData = ProcesarDatos(data[0]);
        const parametricData = ProcesarDatos(data[1]);
        const nonParametricData = ProcesarDatos(data[2]);
    
        const ConvertirColumnas = (data) => {
            if (data.length === 0) return [];
            const numFilas = Math.max(...data.map(col => col.length));
            const resultado = Array.from({ length: numFilas }, () => []);
            data.forEach((col, colIndex) => {
                col.forEach((value, rowIndex) => {
                    resultado[rowIndex][colIndex] = value;
                });
            });
            return resultado;
        };
    
        return {
            name,
            values: [
                <TablaDatos
                    headers={TestNormal}
                    data={ConvertirColumnas(normalityData)}
                />,
                <TablaDatos
                    headers={TestParametricos}
                    data={ConvertirColumnas(parametricData)}
                />,
                <TablaDatos
                    headers={TestNoParametricos}
                    data={ConvertirColumnas(nonParametricData)}
                />
            ]
        };
    };
    
    
    
    
       
    
       
    
    const DatosTabla = [
        CrearValoresTabla('Frecuencia de Conjunciones', frecConjunciones1),
        CrearValoresTabla('Frecuencia de Espacios', frecEspacios1),
        CrearValoresTabla('Frecuencia de Verbos', frecVerbos1),
        CrearValoresTabla('Frecuencia de Símbolos', frecSimbolos1),
        CrearValoresTabla('Frecuencia de Números', frecNumeros1),
        CrearValoresTabla('Frecuencia de Sustantivos', frecSustantivos1),
        CrearValoresTabla('Frecuencia de Adjetivos', frecAdjetivos1),
        CrearValoresTabla('Frecuencia de Signos de Puntuación', frecSigPunt1),
        CrearValoresTabla('Frecuencia de Verbos Auxiliares', frecVerbAux1),
        CrearValoresTabla('Frecuencia de Adverbios', frecAdverbios1),
        CrearValoresTabla('Frecuencia de Interjecciones', frecInterjecciones1),
        CrearValoresTabla('Frecuencia de Determinantes', frecDeterminantes1),
        CrearValoresTabla('Frecuencia de Conjunciones Subordinantes', frecConjSub1),
        CrearValoresTabla('Frecuencia de Nombres Propios', frecNombresProp1),
        CrearValoresTabla('Frecuencia de Pronombres', frecPronon1),
        CrearValoresTabla('Frecuencia de Preposiciones', frecPreposiciones1),
        CrearValoresTabla('Frecuencia Relativa de Conjunciones', frecRelConj1),
        CrearValoresTabla('Frecuencia Relativa de Espacios', frecRelEspacios1),
        CrearValoresTabla('Frecuencia Relativa de Verbos', frecRelVerb1),
        CrearValoresTabla('Frecuencia Relativa de Símbolos', frecRelSimb1),
        CrearValoresTabla('Frecuencia Relativa de Números', frecRelNum1),
        CrearValoresTabla('Frecuencia Relativa de Sustantivos', frecRelSus1),
        CrearValoresTabla('Frecuencia Relativa de Adjetivos', frecRelAdj1),
        CrearValoresTabla('Frecuencia Relativa de Signos de Puntuación', frecRelSdp1),
        CrearValoresTabla('Frecuencia Relativa Relativa de Verbos Auxiliares', frecRelVaux1),
        CrearValoresTabla('Frecuencia Relativa de Adverbios', frecRelAdv1),
        CrearValoresTabla('Frecuencia Relativa de Interjecciones', frecRelInterj1),
        CrearValoresTabla('Frecuencia Relativa de Determinantes', frecRelDet1),
        CrearValoresTabla('Frecuencia Relativa de Conjunciones Subordinantes', frecRelConjsub1),
        CrearValoresTabla('Frecuencia Relativa de Nombres Propios', frecRelNprop1),
        CrearValoresTabla('Frecuencia Relativa de Pronombres', frecRelPronom1),
        CrearValoresTabla('Frecuencia Relativa de Preposiciones', frecRelPrep1),      
    ];

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline' }}>POS</h1>

            <div style={{ padding: '20px', overflow: 'auto', maxWidth: '100%', maxHeight: '600px' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', height: '100%' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'lightgray' }}>
                            <th style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>Característica</th>
                            <th style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>Test de Normalidad</th>
                            <th style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>Test Paramétricos</th>
                            <th style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>Test No Paramétricos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DatosTabla.map((row, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>{row.name}</td>
                                <td style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>{row.values[0]}</td>
                                <td style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>{row.values[1]}</td>
                                <td style={{ border: '1px solid black', padding: '5px', fontSize: '12px' }}>{row.values[2]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div style={{ width: '100%', textAlign: 'center', padding: '40px', marginLeft: '650px' }}>
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

export default CompararPOS;