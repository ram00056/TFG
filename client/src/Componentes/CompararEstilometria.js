import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const CompararEstilometria = () => {
    const { index, coleccionComparar } = useParams();  // index de la colección que se le pasa por parámetro

    //Valores para colección Elegida
    const [palabrasUnicas1, setPalabrasUnicas1] = useState([[], [], []]); // Palabras únicas
    const [pTtr1, setPTtr1] = useState([[], [], []]); // p_ttr
    const [pRttr1, setPRttr1] = useState([[], [], []]); // p_rttr
    const [pHerdan1, setPHerdan1] = useState([[], [], []]); // p_herdan
    const [pMaas1, setPMaas1] = useState([[], [], []]); // p_maas
    const [pSomers1, setPSomers1] = useState([[], [], []]); // p_somers
    const [pDugast1, setPDugast1] = useState([[], [], []]); // p_dugast
    const [pHonore1, setPHonore1] = useState([[], [], []]); // p_honore


    const [loaded1, setLoaded1] = useState(false); // Para evitar hacer peticiones GET constantemente

    if (!loaded1) {
        fetch(`http://localhost:5000/colecciones/${index}/${coleccionComparar}/estilometria`)
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
                
                setPalabrasUnicas1(procesarAtributo(data.palabras_unicas));
                setPTtr1(procesarAtributo(data.p_ttr));
                setPRttr1(procesarAtributo(data.p_rttr));
                setPHerdan1(procesarAtributo(data.p_herdan));
                setPMaas1(procesarAtributo(data.p_maas));
                setPSomers1(procesarAtributo(data.p_somers));
                setPDugast1(procesarAtributo(data.p_dugast));
                setPHonore1(procesarAtributo(data.p_honore));
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
        CrearValoresTabla('Palabras Únicas', palabrasUnicas1),
        CrearValoresTabla('TTR', pTtr1),
        CrearValoresTabla('RTTR', pRttr1),
        CrearValoresTabla('Herdan', pHerdan1),
        CrearValoresTabla('Maas', pMaas1),
        CrearValoresTabla('Somers', pSomers1),
        CrearValoresTabla('Dugast', pDugast1),
        CrearValoresTabla('Honore', pHonore1)  

    ];

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate(`/analisisContrastivo/${index}`);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline' }}>Estilometria</h1>         
            
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

export default CompararEstilometria;