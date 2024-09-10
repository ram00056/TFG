import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const CompararVolumetria = () => {
    const { index, coleccionComparar } = useParams();  // index de la colección que se le pasa por parámetro

    //Valores para colección Elegida
    const [n_palabras1, setNPalabras1] = useState([[], [], []]); //total de archivos 
    const [n_caracteres1, setNCaracteres1] = useState([[], [], []]); //total de archivos 
    const [n_palabras_unicas1, setNPalabrasUnicas1] = useState([[], [], []]); //total de archivos 
    const [m_longitud_palabras1, setMLongitudPalabras1] = useState([[], [], []]); //total de archivos

    const [loaded1, setLoaded1] = useState(false); // Para evitar hacer peticiones GET constantemente


    if (!loaded1) {
        fetch(`http://localhost:5000/colecciones/${index}/${coleccionComparar}/volumetria`)
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

            setNPalabras1(procesarAtributo(data.n_palabras));
            setNCaracteres1(procesarAtributo(data.n_caracteres));
            setNPalabrasUnicas1(procesarAtributo(data.n_palabras_unicas));
            setMLongitudPalabras1(procesarAtributo(data.m_longitud_palabras));
            setLoaded1(true)
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
                    <tr style={{ backgroundColor: 'lightgray', height: '50px' }}>
                        {headers.map((header, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center', backgroundColor: 'lightgray', height: '50px', verticalAlign: 'middle' }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {noData ? (
                        <tr style={{ height: '50px' }}>
                            <td colSpan={numeroColumnas} style={{ border: '1px solid black', padding: '5px', textAlign: 'center', verticalAlign: 'middle', height: '50px' }}>
                                No hay datos disponibles.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} style={{ height: '50px' }}>
                                {row.map((value, colIndex) => (
                                    <td key={colIndex} style={{ border: '1px solid black', padding: '0', fontSize: '12px', textAlign: 'center', verticalAlign: 'middle', height: '50px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', padding: '5px', boxSizing: 'border-box' }}>
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
        CrearValoresTabla('Número de Palabras', n_palabras1),
        CrearValoresTabla('Número de Caracteres', n_caracteres1),
        CrearValoresTabla('Número de Palabras Únicas', n_palabras_unicas1),
        CrearValoresTabla('Media Longitud de Palabras', m_longitud_palabras1)
    ];

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ backgroundColor: 'blue', padding: '20px', color: 'white' }}>Analiza tu corpus</h1>

            <h1 style={{ textAlign: 'left', marginLeft: '50px', textDecoration: 'underline' }}>Volumetria</h1>
            
            <div style={{ padding: '20px', overflow: 'auto', maxWidth: '100%', maxHeight: '600px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', height: '100%' }}>
                <thead>
                    <tr style={{ backgroundColor: 'lightgray', height: '50px' }}>
                        <th style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', backgroundColor: 'lightgray', height: '50px' }}>Característica</th>
                        <th style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', backgroundColor: 'lightgray', height: '50px' }}>Test de Normalidad</th>
                        <th style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', backgroundColor: 'lightgray', height: '50px' }}>Test Paramétricos</th>
                        <th style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', backgroundColor: 'lightgray', height: '50px' }}>Test No Paramétricos</th>
                    </tr>
                </thead>
                <tbody>
                    {DatosTabla.map((row, index) => (
                        <tr key={index} style={{ height: '50px' }}>
                            <td style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', verticalAlign: 'middle', height: '50px' }}>{row.name}</td>
                            <td style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', verticalAlign: 'middle', height: '50px' }}>{row.values[0]}</td>
                            <td style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', verticalAlign: 'middle', height: '50px' }}>{row.values[1]}</td>
                            <td style={{ border: '1px solid black', padding: '10px', fontSize: '12px', textAlign: 'center', verticalAlign: 'middle', height: '50px' }}>{row.values[2]}</td>
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

export default CompararVolumetria;