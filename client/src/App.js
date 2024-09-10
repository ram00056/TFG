import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InicioSesion from './Componentes/login';
import Registro from './Componentes/Registro';
import Colecciones from './Componentes/Colecciones';
import AddColeccion from './Componentes/AddColeccion';
import ViewColeccion from './Componentes/ViewColeccion';
import AnalisisDescriptivo from './Componentes/analisisDescriptivo';
import AnalisisContrastivo from './Componentes/analisisContrastivo';

import AnalisisBDLASE from './Componentes/AnalisisBDLASE';
import AnalisisComplejidad from './Componentes/AnalisisComplejidad';
import AnalisisDiversidad from './Componentes/AnalisisDiversidad';
import AnalisisEmociones from './Componentes/AnalisisEmociones';
import AnalisisEmofinder from './Componentes/AnalisisEmofinder';
import AnalisisEmojis from './Componentes/AnalisisEmojis';
import AnalisisEstilometria from './Componentes/AnalisisEstilometria';
import AnalisisISAL from './Componentes/AnalisisISAL';
import AnalisisIronidad from './Componentes/AnalisisIronidad';
import AnalisisLIWC from './Componentes/AnalisisLIWC';
import AnalisisLemas from './Componentes/AnalisisLemas';
import AnalisisNCR from './Componentes/AnalisisNCR';
import AnalisisNER from './Componentes/AnalisisNER';
import AnalisisNGrams from './Componentes/AnalisisNGrams';
import AnalisisPOS from './Componentes/AnalisisPOS';
import AnalisisPerplejidad from './Componentes/AnalisisPerplejidad';
import AnalisisPolaridad from './Componentes/AnalisisPolaridad';
import AnalisisPolaridadEmojis from './Componentes/AnalisisPolaridadEmojis';
import AnalisisPolaridadEmoticonos from './Componentes/AnalisisPolaridadEmoticonos';
import AnalisisSEL from './Componentes/AnalisisSEL';
import AnalisisVolumetria from './Componentes/AnalisisVolumetria';
import CompararComplejidad from './Componentes/CompararComplejidad';
import CompararDiversidadLexica from './Componentes/CompararDiversidadLexica';
import CompararEmociones from './Componentes/CompararEmociones';
import CompararEstilometria from './Componentes/CompararEstilometria';
import CompararIronia from './Componentes/CompararIronia';
import CompararLemas from './Componentes/CompararLemas';
import CompararPOS from './Componentes/CompararPOS';
import CompararPerplejidad from './Componentes/CompararPerplejidad';
import CompararPolaridad from './Componentes/CompararPolaridad';
import CompararVolumetria from './Componentes/CompararVolumetria';
import ArchivoDetalle from './Componentes/VerContenidoArchivo';



// Establecer relaciones entre las pantallas del frontend y como se accederan a ellas y su contenido
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/colecciones" element={<Colecciones />} />
        <Route path="/viewColeccion/:index" element={<ViewColeccion />} />
        <Route path="/addColeccion" element={<AddColeccion />} />
        <Route path="/analisisDescriptivo/:index" element={<AnalisisDescriptivo />} />
        <Route path="/analisisContrastivo/:index" element={<AnalisisContrastivo />} />
        <Route path="/analisisBDLASE/:index" element={<AnalisisBDLASE />} />
        <Route path="/analisisComplejidad/:index" element={<AnalisisComplejidad />} />
        <Route path="/analisisDiversidad/:index" element={<AnalisisDiversidad />} />
        <Route path="/analisisEmociones/:index" element={<AnalisisEmociones />} />
        <Route path="/analisisEmofinder/:index" element={<AnalisisEmofinder />} />
        <Route path="/analisisEmojis/:index" element={<AnalisisEmojis />} />
        <Route path="/analisisEstilometria/:index" element={<AnalisisEstilometria />} />
        <Route path="/analisisISAL/:index" element={<AnalisisISAL />} />
        <Route path="/analisisIronidad/:index" element={<AnalisisIronidad />} />
        <Route path="/analisisLIWC/:index" element={<AnalisisLIWC />} />
        <Route path="/analisisLemas/:index" element={<AnalisisLemas />} />
        <Route path="/analisisNCR/:index" element={<AnalisisNCR />} />
        <Route path="/analisisNER/:index" element={<AnalisisNER />} />
        <Route path="/analisisNGrams/:index" element={<AnalisisNGrams />} />
        <Route path="/analisisPOS/:index" element={<AnalisisPOS />} />
        <Route path="/analisisPerplejidad/:index" element={<AnalisisPerplejidad />} />
        <Route path="/analisisPolaridad/:index" element={<AnalisisPolaridad />} />
        <Route path="/analisisPolaridadEmojis/:index" element={<AnalisisPolaridadEmojis />} />
        <Route path="/analisisPolaridadEmoticonos/:index" element={<AnalisisPolaridadEmoticonos />} />
        <Route path="/analisisSEL/:index" element={<AnalisisSEL />} />
        <Route path="/analisisVolumetria/:index" element={<AnalisisVolumetria />} />
        <Route path="/analisisContrastivo/Complejidad/:index/:coleccionComparar" element={<CompararComplejidad />} />
        <Route path="/analisisContrastivo/DiversidadLexica/:index/:coleccionComparar" element={<CompararDiversidadLexica />} />
        <Route path="/analisisContrastivo/Emociones/:index/:coleccionComparar" element={<CompararEmociones />} />
        <Route path="/analisisContrastivo/Estilometria/:index/:coleccionComparar" element={<CompararEstilometria />} />
        <Route path="/analisisContrastivo/Ironia/:index/:coleccionComparar" element={<CompararIronia />} />
        <Route path="/analisisContrastivo/Lemas/:index/:coleccionComparar" element={<CompararLemas />} />
        <Route path="/analisisContrastivo/POS/:index/:coleccionComparar" element={<CompararPOS />} />
        <Route path="/analisisContrastivo/Perplejidad/:index/:coleccionComparar" element={<CompararPerplejidad />} />
        <Route path="/analisisContrastivo/Polaridad/:index/:coleccionComparar" element={<CompararPolaridad />} />
        <Route path="/analisisContrastivo/Volumetria/:index/:coleccionComparar" element={<CompararVolumetria />} />
        <Route path="/colecciones/:index/archivo/:nombreArchivo" element={<ArchivoDetalle />} />
      </Routes>
    </Router>
  );
};

export default App;





