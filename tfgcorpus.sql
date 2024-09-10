-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-09-2024 a las 13:20:50
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfgcorpus`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analisiscontrastivo`
--

CREATE TABLE `analisiscontrastivo` (
  `id_Contrastivo` int(11) NOT NULL,
  `rutaTestParametricos` varchar(100) NOT NULL,
  `rutaTestNoParametricos` varchar(100) NOT NULL,
  `rutaTestNormal` varchar(100) NOT NULL,
  `Id_Cuno` int(11) NOT NULL,
  `Id_Cdos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `analisiscontrastivo`
--

INSERT INTO `analisiscontrastivo` (`id_Contrastivo`, `rutaTestParametricos`, `rutaTestNoParametricos`, `rutaTestNormal`, `Id_Cuno`, `Id_Cdos`) VALUES
(9, './archivos/ram00056/analisisContrastivo/analisisEDAnxiety/testParametricosEDAnxiety.xlsx', './archivos/ram00056/analisisContrastivo/analisisEDAnxiety/testNoParametricosEDAnxiety.xlsx', './archivos/ram00056/analisisContrastivo/analisisEDAnxiety/testNormalidadEDAnxiety.xlsx', 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bdlase`
--

CREATE TABLE `bdlase` (
  `id_bdlase` int(11) NOT NULL,
  `valor_bdlase` varchar(1000) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bdlase`
--

INSERT INTO `bdlase` (`id_bdlase`, `valor_bdlase`, `analizado`, `Id_C`) VALUES
(15, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.6666666666666666, 0.6666666666666666, 0.0], [0.0, 0.6666666666666666, 0.6666666666666666, 0.0], [0.0, 0.6666666666666666, 0.6666666666666666, 0.0], [0.0, 0.6666666666666666, 0.6666666666666666, 0.0]]/[[0.0, 0.008333333333333333, 0.008333333333333333, 0.0], [0.0, 0.008333333333333333, 0.008333333333333333, 0.0], [0.0, 0.008333333333333333, 0.008333333333333333, 0.0], [0.0, 0.008333333333333333, 0.008333333333333333, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.05, 0.05, 0.0], [0.0, 0.05, 0.05, 0.0], [0.0, 0.05, 0.05, 0.0], [0.0, 0.05, 0.05, 0.0]]', 1, 2),
(16, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.5, 0.75, 0.6666666666666666, 1.0], [0.5, 0.75, 0.6666666666666666, 1.0], [0.5, 0.75, 0.6666666666666666, 1.0], [0.5, 0.75, 0.6666666666666666, 1.0]]/[[0.010806759993485203, 0.023471638603347528, 0.020069150419161588, 0.041951032900962644], [0.010806759993485203, 0.023471638603347528, 0.020069150419161588, 0.041951032900962644], [0.010806759993485203, 0.023471638603347528, 0.020069150419161588, 0.041951032900962644], [0.010806759993485203, 0.023471638603347528, 0.020069150419161588, 0.041951032900962644]]/[0.0, 0.0, 0.0, 0.0]/[[0.07927127437125762, 0.12162972588408331, 0.09350070566067885, 0.1569866063986607], [0.07927127437125762, 0.12162972588408331, 0.09350070566067885, 0.1569866063986607], [0.07927127437125762, 0.12162972588408331, 0.09350070566067885, 0.1569866063986607], [0.07927127437125762, 0.12162972588408331, 0.09350070566067885, 0.1569866063986607]]', 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colecciones`
--

CREATE TABLE `colecciones` (
  `Id_C` int(11) NOT NULL,
  `Nombre_C` varchar(50) NOT NULL,
  `Ruta_C` varchar(100) NOT NULL,
  `ruta_analisisDesc` varchar(100) DEFAULT NULL,
  `usuario` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `colecciones`
--

INSERT INTO `colecciones` (`Id_C`, `Nombre_C`, `Ruta_C`, `ruta_analisisDesc`, `usuario`) VALUES
(1, 'Prueba', 'archivos\\Prueba\\Pruebas.zip', NULL, 'Prueba'),
(2, 'ED', 'archivos\\ram00056\\ED', './archivos/ram00056/analisisED/analisisED.xlsx', 'ram00056'),
(3, 'Anxiety', 'archivos\\ram00056\\Anxiety', './archivos/ram00056/analisisAnxiety/analisisAnxiety.xlsx', 'ram00056');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `complejidad`
--

CREATE TABLE `complejidad` (
  `id_complejidad` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `n_oraciones` varchar(200) NOT NULL,
  `n_oraciones_c` varchar(200) NOT NULL,
  `media_long_oraciones` varchar(200) NOT NULL,
  `n_sig_punt` varchar(200) NOT NULL,
  `n_palabras` varchar(200) NOT NULL,
  `n_palabras_r` varchar(200) NOT NULL,
  `n_silabas` varchar(200) NOT NULL,
  `n_caracteres` varchar(200) NOT NULL,
  `ilfw` varchar(200) NOT NULL,
  `ldi` varchar(200) NOT NULL,
  `lc` varchar(200) NOT NULL,
  `ssr` varchar(200) NOT NULL,
  `sci` varchar(200) NOT NULL,
  `ari` varchar(200) NOT NULL,
  `huerta` varchar(200) NOT NULL,
  `ifsz` varchar(200) NOT NULL,
  `polini` varchar(200) NOT NULL,
  `mu` varchar(200) NOT NULL,
  `minage` varchar(200) NOT NULL,
  `sol` varchar(200) NOT NULL,
  `crawford` varchar(200) NOT NULL,
  `min_depth` varchar(200) NOT NULL,
  `max_depth` varchar(200) NOT NULL,
  `mean_depth` varchar(200) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `complejidad`
--

INSERT INTO `complejidad` (`id_complejidad`, `analizado`, `n_oraciones`, `n_oraciones_c`, `media_long_oraciones`, `n_sig_punt`, `n_palabras`, `n_palabras_r`, `n_silabas`, `n_caracteres`, `ilfw`, `ldi`, `lc`, `ssr`, `sci`, `ari`, `huerta`, `ifsz`, `polini`, `mu`, `minage`, `sol`, `crawford`, `min_depth`, `max_depth`, `mean_depth`, `Id_C`) VALUES
(10, 1, '1.00/2.00/0.09/1.00/1.10', '0.00/1.00/0.21/0.00/0.30', '4.00/18.00/19.22/4.00/9.45', '0.00/1.00/0.21/0.00/0.30', '4.00/18.00/17.60/4.00/10.00', '1.00/3.00/0.76/3.00/2.20', '7.00/29.00/51.96/8.00/16.20', '2.00/10.00/6.80/2.00/6.00', '0.00/1.00/0.07/0.33/0.43', '1.00/7.00/3.10/3.00/3.65', '1.00/3.64/0.73/1.67/2.04', '61.01/159.30/532.96/111.39/114.43', '2.00/9.50/5.64/2.00/4.88', '4.89/10.24/3.85/10.24/8.45', '187.51/201.71/19.40/187.51/196.21', '71.24/136.54/460.28/71.24/94.38', '42.85/70.58/63.97/42.85/56.05', '42.77/315.00/5698.11/42.77/130.91', '1.33/8.56/4.97/1.33/5.93', '-0.19/8.26/6.51/5.78/4.31', '-1.07/4.53/3.07/-1.07/1.95', '3.00/6.00/0.89/3.00/3.90', '3.00/6.00/0.80/4.00/4.00', '3.00/6.00/0.82/4.00/3.95', 2),
(11, 1, '2.00/11.00/18.00/2.00/5.00', '0.00/1.00/0.22/1.00/0.67', '6.00/11.73/5.88/6.00/8.41', '1.00/20.00/76.22/1.00/7.67', '12.00/129.00/2966.00/12.00/52.00', '3.00/30.00/150.89/3.00/12.67', '20.00/246.00/11350.22/20.00/95.33', '1.00/6.00/5.56/1.00/2.67', '0.27/0.60/0.02/0.27/0.48', '2.50/4.64/0.76/2.50/3.55', '1.55/2.45/0.14/1.55/2.01', '114.60/144.67/180.56/114.60/125.77', '3.00/5.91/1.46/3.00/4.30', '3.39/6.08/1.31/3.39/4.51', '193.73/199.72/6.59/193.73/197.28', '76.30/116.27/266.32/76.30/96.52', '47.33/60.24/28.78/47.33/54.50', '46.37/85.76/268.67/46.37/63.83', '3.37/8.14/3.87/3.37/5.55', '4.03/6.90/1.42/4.03/5.31', '0.39/4.19/2.60/0.39/1.98', '1.00/2.00/0.22/2.00/1.67', '3.00/6.00/2.00/6.00/5.00', '2.50/4.27/0.53/2.50/3.42', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diversidad_lexica`
--

CREATE TABLE `diversidad_lexica` (
  `id_diversidad` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `p_simpleTTR` varchar(100) NOT NULL,
  `p_rootTTR` varchar(100) NOT NULL,
  `p_logTTR` varchar(100) NOT NULL,
  `p_maasTTR` varchar(100) NOT NULL,
  `p_MSTTR` varchar(100) NOT NULL,
  `p_MATTR` varchar(100) NOT NULL,
  `p_HDD` varchar(100) NOT NULL,
  `p_MLTD` varchar(100) NOT NULL,
  `p_MLTDMAWrap` varchar(100) NOT NULL,
  `p_MTLDMABi` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diversidad_lexica`
--

INSERT INTO `diversidad_lexica` (`id_diversidad`, `analizado`, `p_simpleTTR`, `p_rootTTR`, `p_logTTR`, `p_maasTTR`, `p_MSTTR`, `p_MATTR`, `p_HDD`, `p_MLTD`, `p_MLTDMAWrap`, `p_MTLDMABi`, `Id_C`) VALUES
(8, 1, '0.24/0.69/0.02/0.24/0.40', '2.08/3.32/0.13/2.08/2.52', '0.68/0.86/0.00/0.68/0.75', '0.11/0.19/0.00/0.11/0.15', '0.32/0.69/0.01/0.32/0.43', '0.30/0.69/0.01/0.30/0.43', '0.00/0.51/0.04/0.00/0.25', '9.82/20.79/10.10/9.82/13.39', '11.41/16.98/2.43/11.41/12.71', '10.46/17.14/3.45/10.46/12.14', 2),
(9, 1, '0.05/0.39/0.02/0.05/0.25', '1.35/3.05/0.53/1.35/2.35', '0.54/0.77/0.01/0.54/0.68', '0.13/0.16/0.00/0.13/0.14', '0.36/0.42/0.00/0.36/0.39', '0.34/0.43/0.00/0.34/0.38', '0.39/0.47/0.00/0.39/0.43', '12.86/16.58/3.01/12.86/14.13', '12.55/15.89/2.01/12.55/13.94', '12.53/15.16/1.33/12.53/13.55', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emociones`
--

CREATE TABLE `emociones` (
  `id_emociones` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `alegria` varchar(100) NOT NULL,
  `tristeza` varchar(100) NOT NULL,
  `ira` varchar(100) NOT NULL,
  `sorpresa` varchar(100) NOT NULL,
  `asco` varchar(100) NOT NULL,
  `miedo` varchar(100) NOT NULL,
  `otros` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `emociones`
--

INSERT INTO `emociones` (`id_emociones`, `analizado`, `alegria`, `tristeza`, `ira`, `sorpresa`, `asco`, `miedo`, `otros`, `Id_C`) VALUES
(8, 0, '0.00/0.46/0.02/0.00/0.09', '0.00/0.04/0.00/0.00/0.01', '0.00/0.07/0.00/0.00/0.01', '0.01/0.06/0.00/0.01/0.03', '0.00/0.01/0.00/0.00/0.00', '0.00/0.04/0.00/0.00/0.01', '0.51/0.95/0.01/0.51/0.84', 2),
(9, 1, '0.00/1.00/0.17/0.00/0.46', '0.00/0.00/0.00/0.00/0.00', '0.00/0.00/0.00/0.00/0.00', '0.00/0.06/0.00/0.00/0.02', '0.00/0.00/0.00/0.00/0.00', '0.00/0.01/0.00/0.00/0.00', '0.00/0.99/0.16/0.00/0.51', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emofinder`
--

CREATE TABLE `emofinder` (
  `id_emofinder` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `v_emofinder` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `emofinder`
--

INSERT INTO `emofinder` (`id_emofinder`, `analizado`, `v_emofinder`, `Id_C`) VALUES
(7, 0, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]', 2),
(8, 1, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emojis`
--

CREATE TABLE `emojis` (
  `id_emojis` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `frec_emojis` varchar(300) NOT NULL,
  `num_emojis` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `emojis`
--

INSERT INTO `emojis` (`id_emojis`, `analizado`, `frec_emojis`, `num_emojis`, `Id_C`) VALUES
(8, 0, '{}', '0.00/0.00/0.00/0.00/0.00', 2),
(9, 1, '{\':cara_desesperada:\': 1, \':cara_feliz_con_ojos_sonrientes:\': 2, \':bíceps_flexionado_tono_de_piel_claro_medio:\': 1}', '1.00/2.00/0.22/1.00/1.33', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estilometria`
--

CREATE TABLE `estilometria` (
  `id_estilometria` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `palabras_unicas` varchar(100) NOT NULL,
  `p_ttr` varchar(100) NOT NULL,
  `p_rttr` varchar(100) NOT NULL,
  `p_herdan` varchar(100) NOT NULL,
  `p_maas` varchar(100) NOT NULL,
  `p_somers` varchar(100) NOT NULL,
  `p_dugast` varchar(100) NOT NULL,
  `p_honore` varchar(100) NOT NULL,
  `frec_stopwords` varchar(500) NOT NULL,
  `frec_sdp` varchar(500) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estilometria`
--

INSERT INTO `estilometria` (`id_estilometria`, `analizado`, `palabras_unicas`, `p_ttr`, `p_rttr`, `p_herdan`, `p_maas`, `p_somers`, `p_dugast`, `p_honore`, `frec_stopwords`, `frec_sdp`, `Id_C`) VALUES
(9, 1, '3.00/9.00/3.81/3.00/5.30', '0.33/0.75/0.02/0.75/0.56', '1.13/2.12/0.13/1.13/1.68', '0.56/0.86/0.01/0.56/0.72', '0.21/1.62/0.20/0.21/0.67', '-6.66/7.65/19.12/-6.66/-0.02', '1.94/6.53/2.14/1.94/3.86', '60.21/125.53/374.07/104.14/95.97', '[[\"y\", 4], [\"se\", 4], [\"no\", 3], [\"me\", 3], [\"a\", 3], [\"es\", 2], [\"soy\", 2], [\"que\", 2], [\"como\", 2], [\"mi\", 2], [\"les\", 2], [\"la\", 2], [\"lo\", 1], [\"tengo\", 1], [\"el\", 1], [\"son\", 1], [\"por\", 1], [\"pero\", 1], [\"unos\", 1], [\"hasta\", 1], [\"de\", 1], [\"durante\", 1], [\"porque\", 1], [\"eso\", 1], [\"en\", 1]]', '[[\"?\", 2], [\",\", 1]]', 2),
(10, 1, '7.00/59.00/600.89/7.00/24.33', '0.39/0.50/0.00/0.39/0.45', '1.81/4.82/1.97/1.81/2.83', '0.72/0.81/0.00/0.72/0.76', '0.13/0.46/0.02/0.13/0.34', '-1.23/0.73/0.78/-1.23/-0.51', '4.18/11.69/12.22/4.18/6.74', '114.61/2567.79/1335716.77/114.61/933.34', '[[\"a\", 7], [\"y\", 5], [\"no\", 5], [\"me\", 5], [\"un\", 3], [\"que\", 3], [\"por\", 3], [\"la\", 3], [\"de\", 3], [\"cuando\", 3], [\"con\", 3], [\"os\", 2], [\"los\", 2], [\"estoy\", 2], [\"en\", 2], [\"del\", 2], [\"algo\", 2], [\"ya\", 1], [\"vosotros\", 1], [\"una\", 1], [\"todo\", 1], [\"tambi\\u00e9n\", 1], [\"ser\\u00e1\", 1], [\"pero\", 1], [\"para\", 1], [\"ni\", 1], [\"mucho\", 1], [\"mis\", 1], [\"mi\", 1], [\"hab\\u00e9is\", 1], [\"est\\u00e1s\", 1], [\"esta\", 1], [\"esas\", 1], [\"es\", 1], [\"el\", 1], [\"desde\", 1], [\"esto\", 1], [\"estamos\", 1], [\"ha', '[[\".\", 7], [\",\", 4], [\"!\", 4], [\"?\", 3], [\":\", 2], [\"@\", 1], [\")\", 1], [\"(\", 1]]', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ironia`
--

CREATE TABLE `ironia` (
  `id_ironia` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `valor_no` varchar(150) NOT NULL,
  `valor_si` varchar(150) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ironia`
--

INSERT INTO `ironia` (`id_ironia`, `analizado`, `valor_no`, `valor_si`, `Id_C`) VALUES
(8, 1, '0.00/0.33/0.01/0.00/0.06', '0.67/1.00/0.01/0.67/0.94', 2),
(9, 1, '0.16/0.86/0.10/0.16/0.61', '0.14/0.84/0.10/0.14/0.39', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `isal`
--

CREATE TABLE `isal` (
  `id_isal` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `valor_isal` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `isal`
--

INSERT INTO `isal` (`id_isal`, `analizado`, `valor_isal`, `Id_C`) VALUES
(9, 0, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.6666666666666666, 0.6666666666666666, 0.0], [0.0, 0.6666666666666666, 0.6666666666666666, 0.0], [0.0, 0.6666666666666666, 0.6666666666666666, 0.0], [0.0, 0.6666666666666666, 0.6666666666666666, 0.0]]/[[0.0, 0.008333333333333333, 0.008333333333333333, 0.0], [0.0, 0.008333333333333333, 0.008333333333333333, 0.0], [0.0, 0.008333333333333333, 0.008333333333333333, 0.0], [0.0, 0.008333333333333333, 0.008333333333333333, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.05, 0.05, 0.0], [0.0, 0.05, 0.05, 0.0], [0.0, 0.05, 0.05, 0.0], [0.0, 0.05, 0.05, 0.0]]', 2),
(10, 1, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lemas`
--

CREATE TABLE `lemas` (
  `id_lemas` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `n_lemas_u` varchar(100) NOT NULL,
  `m_caracteres` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lemas`
--

INSERT INTO `lemas` (`id_lemas`, `analizado`, `n_lemas_u`, `m_caracteres`, `Id_C`) VALUES
(17, 1, '4.00/17.00/15.45/4.00/9.50', '2.00/5.00/0.80/4.00/4.00', 2),
(18, 1, '12.00/83.00/1074.89/12.00/36.67', '3.00/4.00/0.22/4.00/3.67', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `liwc`
--

CREATE TABLE `liwc` (
  `id_liwc` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `valor_liwc` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `liwc`
--

INSERT INTO `liwc` (`id_liwc`, `analizado`, `valor_liwc`, `Id_C`) VALUES
(7, 1, '[[0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0]]', 2),
(8, 1, '[[0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 0.0, 1.0]]/[[0.0, 0.0, 0.0, 0.0, 0.04325530440049824], [0.0, 0.0, 0.0, 0.0, 0.04325530440049824], [0.0, 0.0, 0.0, 0.0, 0.04325530440049824], [0.0, 0.0, 0.0, 0.0, 0.04325530440049824]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0, 0.15039482117703043], [0.0, 0.0, 0.0, 0.0, 0.15039482117703043], [0.0, 0.0, 0.0, 0.0, 0.15039482117703043], [0.0, 0.0, 0.0, 0.0, 0.15039482117703043]]', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ncr`
--

CREATE TABLE `ncr` (
  `id_ncr` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `valor_ncr` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ncr`
--

INSERT INTO `ncr` (`id_ncr`, `analizado`, `valor_ncr`, `Id_C`) VALUES
(7, 1, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0]]/[[0.0, 0.01875, 0.0, 0.0], [0.0, 0.01875, 0.0, 0.0], [0.0, 0.01875, 0.0, 0.0], [0.0, 0.01875, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.075, 0.0, 0.0], [0.0, 0.075, 0.0, 0.0], [0.0, 0.075, 0.0, 0.0], [0.0, 0.075, 0.0, 0.0]]', 2),
(8, 1, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0]]/[[0.041666666666666664, 0.041666666666666664, 0.041666666666666664, 0.041666666666666664], [0.041666666666666664, 0.041666666666666664, 0.041666666666666664, 0.041666666666666664], [0.041666666666666664, 0.041666666666666664, 0.041666666666666664, 0.041666666666666664], [0.041666666666666664, 0.041666666666666664, 0.041666666666666664, 0.041666666666666664]]/[0.0, 0.0, 0.0, 0.0]/[[0.16666666666666666, 0.16666666666666666, 0.16666666666666666, 0.16666666666666666], [0.16666666666666666, 0.16666666666666666, 0.16666666666666666, 0.16666666666666666], [0.16666666666666666, 0.16666666666666666, 0.16666666666666666, 0.16666666666666666], [0.16666666666666666, 0.16666666666666666, 0.16666666666666666, 0.16666666666666666]]', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ner`
--

CREATE TABLE `ner` (
  `id_ner` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `entidades` varchar(500) NOT NULL,
  `frec_entidades` varchar(500) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ner`
--

INSERT INTO `ner` (`id_ner`, `analizado`, `entidades`, `frec_entidades`, `Id_C`) VALUES
(5, 0, '{\'MISC\': {\'aa es re nuevito\': 1, \'wpp me\': 1}, \'PER\': {\'sofia\': 1, \'jskdsk perdon\': 1, \'ana\': 1, \'800kcals\': 1}}', '{\'MISC\': 2, \'PER\': 4}', 2),
(8, 1, '{\'LOC\': {\'buenos\': 1}, \'MISC\': {\'tod @s ! !\': 1, \'el problema\': 1, \'???? ????\': 1}, \'PER\': {\'estoy\': 1, \'quería\': 1, \'habéis\': 1, \'voy\': 1}, \'ORG\': {\'depresión\': 1, \'os\': 1}}', '{\'LOC\': 1, \'MISC\': 3, \'PER\': 4, \'ORG\': 2}', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ngrams`
--

CREATE TABLE `ngrams` (
  `id_ngrams` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `frec_1grams` varchar(10000) NOT NULL,
  `frec_2grams` mediumtext NOT NULL,
  `frec_3grams` mediumtext NOT NULL,
  `frec_4grams` mediumtext NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ngrams`
--

INSERT INTO `ngrams` (`id_ngrams`, `analizado`, `frec_1grams`, `frec_2grams`, `frec_3grams`, `frec_4grams`, `Id_C`) VALUES
(4, 1, '{\'hace\': 3, \'cuanto\': 1, \'crearon\': 1, \'aa\': 2, \'re\': 1, \'nuevito\': 1, \'sofia\': 1, \'18\': 1, \'años\': 1, \'mido\': 1, \'157cm\': 1, \'peso\': 1, \'41kg\': 1, \'primer\': 1, \'grupo\': 1, \'meto\': 1, \'asique\': 1, \'manejan\': 1, \'jskdsk\': 1, \'perdon\': 1, \'ana\': 1, \'meta\': 1, \'38kg\': 1, \'sisi\': 1, \'wpp\': 1, \'parece\': 1, \'mas\': 2, \'peligroso\': 1, \'ultimamente\': 1, \'hoy\': 1, \'empece\': 1, \'llegue\': 1, \'800kcals\': 1, \'partir\': 1, \'mañana\': 1, \'500calorias\': 1, \'hacia\': 1, \'meses\': 1, \'paso\': 1, \'cuarentena\': 1, \'dificulta\': 1, \'restringir\': 1, \'si\': 1, \'dificil\': 1, \'tarde\': 1, \'viven\': 1, \'haciendo\': 1, \'postres\': 1, \'casa\': 1}', '{\'hace cuanto\': 1, \'cuanto lo\': 1, \'lo crearon\': 1, \'aa es\': 1, \'es re\': 1, \'re nuevito\': 1, \'soy sofia\': 1, \'sofia tengo\': 1, \'tengo 18\': 1, \'18 años\': 1, \'años mido\': 1, \'mido 157cm\': 1, \'157cm y\': 1, \'y peso\': 1, \'peso 41kg\': 1, \'es el\': 1, \'el primer\': 1, \'primer grupo\': 1, \'grupo que\': 1, \'que me\': 1, \'me meto\': 1, \'meto asique\': 1, \'asique no\': 1, \'no se\': 1, \'se como\': 1, \'como se\': 1, \'se manejan\': 1, \'manejan jskdsk\': 1, \'jskdsk perdon\': 1, \'soy ana\': 1, \'ana y\': 1, \'y mi\': 1, \'mi meta\': 1, \'meta son\': 1, \'son 38kg\': 1, \'aa sisi\': 1, \'sisi por\': 1, \'por wpp\': 1, \'wpp me\': 1, \'me parece\': 1, \'parece mas\': 1, \'mas peligroso\': 1, \'ultimamente no\': 1, \'no pero\': 1, \'pero hoy\': 1, \'hoy empece\': 1, \'empece y\': 1, \'y llegue\': 1, \'llegue a\': 1, \'a 800kcals\': 1, \'a partir\': 1, \'partir de\': 1, \'de mañana\': 1, \'mañana hasta\': 1, \'hasta 500calorias\': 1, \'500calorias como\': 1, \'como hacia\': 1, \'hacia hace\': 1, \'hace unos\': 1, \'unos meses\': 1, \'no les\': 1, \'les paso\': 1, \'paso que\': 1, \'que durante\': 1, \'durante la\': 1, \'la cuarentena\': 1, \'cuarentena se\': 1, \'se les\': 1, \'les dificulta\': 1, \'dificulta restringir\': 1, \'si se\': 1, \'se me\': 1, \'me hace\': 1, \'hace mas\': 1, \'mas dificil\': 1, \'dificil a\': 1, \'a la\': 1, \'la tarde\': 1, \'tarde porque\': 1, \'porque viven\': 1, \'viven haciendo\': 1, \'haciendo postres\': 1, \'postres y\': 1, \'y eso\': 1, \'eso en\': 1, \'en mi\': 1, \'mi casa\': 1}', '{\'hace cuanto lo\': 1, \'cuanto lo crearon\': 1, \'aa es re\': 1, \'es re nuevito\': 1, \'soy sofia tengo\': 1, \'sofia tengo 18\': 1, \'tengo 18 años\': 1, \'18 años mido\': 1, \'años mido 157cm\': 1, \'mido 157cm y\': 1, \'157cm y peso\': 1, \'y peso 41kg\': 1, \'es el primer\': 1, \'el primer grupo\': 1, \'primer grupo que\': 1, \'grupo que me\': 1, \'que me meto\': 1, \'me meto asique\': 1, \'meto asique no\': 1, \'asique no se\': 1, \'no se como\': 1, \'se como se\': 1, \'como se manejan\': 1, \'se manejan jskdsk\': 1, \'manejan jskdsk perdon\': 1, \'soy ana y\': 1, \'ana y mi\': 1, \'y mi meta\': 1, \'mi meta son\': 1, \'meta son 38kg\': 1, \'aa sisi por\': 1, \'sisi por wpp\': 1, \'por wpp me\': 1, \'wpp me parece\': 1, \'me parece mas\': 1, \'parece mas peligroso\': 1, \'ultimamente no pero\': 1, \'no pero hoy\': 1, \'pero hoy empece\': 1, \'hoy empece y\': 1, \'empece y llegue\': 1, \'y llegue a\': 1, \'llegue a 800kcals\': 1, \'a partir de\': 1, \'partir de mañana\': 1, \'de mañana hasta\': 1, \'mañana hasta 500calorias\': 1, \'hasta 500calorias como\': 1, \'500calorias como hacia\': 1, \'como hacia hace\': 1, \'hacia hace unos\': 1, \'hace unos meses\': 1, \'no les paso\': 1, \'les paso que\': 1, \'paso que durante\': 1, \'que durante la\': 1, \'durante la cuarentena\': 1, \'la cuarentena se\': 1, \'cuarentena se les\': 1, \'se les dificulta\': 1, \'les dificulta restringir\': 1, \'si se me\': 1, \'se me hace\': 1, \'me hace mas\': 1, \'hace mas dificil\': 1, \'mas dificil a\': 1, \'dificil a la\': 1, \'a la tarde\': 1, \'la tarde porque\': 1, \'tarde porque viven\': 1, \'porque viven haciendo\': 1, \'viven haciendo postres\': 1, \'haciendo postres y\': 1, \'postres y eso\': 1, \'y eso en\': 1, \'eso en mi\': 1, \'en mi casa\': 1}', '{\'hace cuanto lo crearon\': 1, \'aa es re nuevito\': 1, \'soy sofia tengo 18\': 1, \'sofia tengo 18 años\': 1, \'tengo 18 años mido\': 1, \'18 años mido 157cm\': 1, \'años mido 157cm y\': 1, \'mido 157cm y peso\': 1, \'157cm y peso 41kg\': 1, \'es el primer grupo\': 1, \'el primer grupo que\': 1, \'primer grupo que me\': 1, \'grupo que me meto\': 1, \'que me meto asique\': 1, \'me meto asique no\': 1, \'meto asique no se\': 1, \'asique no se como\': 1, \'no se como se\': 1, \'se como se manejan\': 1, \'como se manejan jskdsk\': 1, \'se manejan jskdsk perdon\': 1, \'soy ana y mi\': 1, \'ana y mi meta\': 1, \'y mi meta son\': 1, \'mi meta son 38kg\': 1, \'aa sisi por wpp\': 1, \'sisi por wpp me\': 1, \'por wpp me parece\': 1, \'wpp me parece mas\': 1, \'me parece mas peligroso\': 1, \'ultimamente no pero hoy\': 1, \'no pero hoy empece\': 1, \'pero hoy empece y\': 1, \'hoy empece y llegue\': 1, \'empece y llegue a\': 1, \'y llegue a 800kcals\': 1, \'a partir de mañana\': 1, \'partir de mañana hasta\': 1, \'de mañana hasta 500calorias\': 1, \'mañana hasta 500calorias como\': 1, \'hasta 500calorias como hacia\': 1, \'500calorias como hacia hace\': 1, \'como hacia hace unos\': 1, \'hacia hace unos meses\': 1, \'no les paso que\': 1, \'les paso que durante\': 1, \'paso que durante la\': 1, \'que durante la cuarentena\': 1, \'durante la cuarentena se\': 1, \'la cuarentena se les\': 1, \'cuarentena se les dificulta\': 1, \'se les dificulta restringir\': 1, \'si se me hace\': 1, \'se me hace mas\': 1, \'me hace mas dificil\': 1, \'hace mas dificil a\': 1, \'mas dificil a la\': 1, \'dificil a la tarde\': 1, \'a la tarde porque\': 1, \'la tarde porque viven\': 1, \'tarde porque viven haciendo\': 1, \'porque viven haciendo postres\': 1, \'viven haciendo postres y\': 1, \'haciendo postres y eso\': 1, \'postres y eso en\': 1, \'y eso en mi\': 1, \'eso en mi casa\': 1}', 2),
(7, 1, '{\'buenos\': 1, \'días\': 1, \'tod\': 1, \'s\': 1, \'sé\': 2, \'si\': 3, \'finalidad\': 1, \'grupo\': 1, \'plena\': 1, \'crisis\': 2, \'buscas\': 1, \'recursos\': 1, \'todas\': 1, \'partes\': 1, \'yendo\': 1, \'terapia\': 1, \'diagnosticaron\': 1, \'tag\': 1, \'trastorno\': 1, \'ansiedad\': 1, \'generalizada\': 1, \'hace\': 1, \'tiempo\': 1, \'problema\': 1, \'dan\': 1, \'poder\': 1, \'parar\': 1, \'segundo\': 1, \'pensamientos\': 1, \'acabo\': 1, \'agotada\': 1, \'depresión\': 1, \'quería\': 1, \'saber\': 2, \'alguno\': 1, \'pasa\': 2, \'parecido\': 2, \'poner\': 1, \'ejemplo\': 1, \'estudiando\': 1, \'carrera\': 1, \'voy\': 2, \'ponerme\': 1, \'estudiar\': 1, \'ganas\': 1, \'boicotea\': 1, \'pensamiento\': 1, \'total\': 1, \'empieza\': 1, \'angustia\': 1, \'nervios\': 1, \'desesperacion\': 1, \'así\': 1, \'logrado\': 1, \'vencerlo\': 1, \'gracias\': 3, \'leerme\': 1, \'2\': 1, \'tranquiliza\': 1, \'solos\': 1, \'dado\': 1, \'cuenta\': 1, \'echarle\': 1, \'vistazo\': 1}', '{\'buenos días\': 1, \'días a\': 1, \'a tod\': 1, \'tod s\': 1, \'s no\': 1, \'no sé\': 2, \'sé si\': 2, \'si esta\': 1, \'esta será\': 1, \'será la\': 1, \'la finalidad\': 1, \'finalidad del\': 1, \'del grupo\': 1, \'grupo pero\': 1, \'pero cuando\': 1, \'cuando estás\': 1, \'estás en\': 1, \'en plena\': 1, \'plena crisis\': 1, \'crisis buscas\': 1, \'buscas recursos\': 1, \'recursos por\': 1, \'por todas\': 1, \'todas partes\': 1, \'partes estoy\': 1, \'estoy yendo\': 1, \'yendo a\': 1, \'a terapia\': 1, \'terapia y\': 1, \'y me\': 2, \'me diagnosticaron\': 1, \'diagnosticaron tag\': 1, \'tag trastorno\': 1, \'trastorno de\': 1, \'de ansiedad\': 1, \'ansiedad generalizada\': 1, \'generalizada desde\': 1, \'desde hace\': 1, \'hace mucho\': 1, \'mucho tiempo\': 1, \'tiempo el\': 1, \'el problema\': 1, \'problema es\': 1, \'es que\': 1, \'que cuando\': 1, \'cuando me\': 1, \'me dan\': 1, \'dan esas\': 1, \'esas crisis\': 1, \'crisis de\': 1, \'de no\': 1, \'no poder\': 1, \'poder parar\': 1, \'parar ni\': 1, \'ni un\': 1, \'un segundo\': 1, \'segundo mis\': 1, \'mis pensamientos\': 1, \'pensamientos acabo\': 1, \'acabo agotada\': 1, \'agotada y\': 1, \'y ya\': 1, \'ya no\': 1, \'si con\': 1, \'con depresión\': 1, \'depresión quería\': 1, \'quería saber\': 1, \'saber si\': 1, \'si a\': 1, \'a alguno\': 1, \'alguno de\': 1, \'de vosotros\': 1, \'vosotros también\': 1, \'también os\': 1, \'os pasa\': 2, \'pasa algo\': 2, \'algo parecido\': 2, \'parecido por\': 1, \'por poner\': 1, \'poner un\': 1, \'un ejemplo\': 1, \'ejemplo estoy\': 1, \'estoy estudiando\': 1, \'estudiando una\': 1, \'una carrera\': 1, \'carrera y\': 1, \'y cuando\': 1, \'cuando voy\': 1, \'voy a\': 2, \'a ponerme\': 1, \'ponerme a\': 1, \'a estudiar\': 1, \'estudiar con\': 1, \'con ganas\': 1, \'ganas me\': 1, \'me boicotea\': 1, \'boicotea mi\': 1, \'mi pensamiento\': 1, \'pensamiento del\': 1, \'del total\': 1, \'total para\': 1, \'para que\': 1, \'que y\': 1, \'me empieza\': 1, \'empieza la\': 1, \'la angustia\': 1, \'angustia los\': 1, \'los nervios\': 1, \'nervios la\': 1, \'la desesperacion\': 1, \'desesperacion y\': 1, \'y así\': 1, \'así con\': 1, \'con todo\': 1, \'todo os\': 1, \'parecido habéis\': 1, \'habéis logrado\': 1, \'logrado vencerlo\': 1, \'vencerlo gracias\': 1, \'gracias por\': 1, \'por leerme\': 1, \'gracias a\': 1, \'a los\': 1, \'los 2\': 1, \'2 tranquiliza\': 1, \'tranquiliza saber\': 1, \'saber que\': 1, \'que no\': 1, \'no estamos\': 1, \'estamos solos\': 1, \'solos en\': 1, \'en esto\': 1, \'no me\': 1, \'me había\': 1, \'había dado\': 1, \'dado cuenta\': 1, \'cuenta voy\': 1, \'a echarle\': 1, \'echarle un\': 1, \'un vistazo\': 1, \'vistazo gracias\': 1}', '{\'buenos días a\': 1, \'días a tod\': 1, \'a tod s\': 1, \'tod s no\': 1, \'s no sé\': 1, \'no sé si\': 2, \'sé si esta\': 1, \'si esta será\': 1, \'esta será la\': 1, \'será la finalidad\': 1, \'la finalidad del\': 1, \'finalidad del grupo\': 1, \'del grupo pero\': 1, \'grupo pero cuando\': 1, \'pero cuando estás\': 1, \'cuando estás en\': 1, \'estás en plena\': 1, \'en plena crisis\': 1, \'plena crisis buscas\': 1, \'crisis buscas recursos\': 1, \'buscas recursos por\': 1, \'recursos por todas\': 1, \'por todas partes\': 1, \'todas partes estoy\': 1, \'partes estoy yendo\': 1, \'estoy yendo a\': 1, \'yendo a terapia\': 1, \'a terapia y\': 1, \'terapia y me\': 1, \'y me diagnosticaron\': 1, \'me diagnosticaron tag\': 1, \'diagnosticaron tag trastorno\': 1, \'tag trastorno de\': 1, \'trastorno de ansiedad\': 1, \'de ansiedad generalizada\': 1, \'ansiedad generalizada desde\': 1, \'generalizada desde hace\': 1, \'desde hace mucho\': 1, \'hace mucho tiempo\': 1, \'mucho tiempo el\': 1, \'tiempo el problema\': 1, \'el problema es\': 1, \'problema es que\': 1, \'es que cuando\': 1, \'que cuando me\': 1, \'cuando me dan\': 1, \'me dan esas\': 1, \'dan esas crisis\': 1, \'esas crisis de\': 1, \'crisis de no\': 1, \'de no poder\': 1, \'no poder parar\': 1, \'poder parar ni\': 1, \'parar ni un\': 1, \'ni un segundo\': 1, \'un segundo mis\': 1, \'segundo mis pensamientos\': 1, \'mis pensamientos acabo\': 1, \'pensamientos acabo agotada\': 1, \'acabo agotada y\': 1, \'agotada y ya\': 1, \'y ya no\': 1, \'ya no sé\': 1, \'sé si con\': 1, \'si con depresión\': 1, \'con depresión quería\': 1, \'depresión quería saber\': 1, \'quería saber si\': 1, \'saber si a\': 1, \'si a alguno\': 1, \'a alguno de\': 1, \'alguno de vosotros\': 1, \'de vosotros también\': 1, \'vosotros también os\': 1, \'también os pasa\': 1, \'os pasa algo\': 2, \'pasa algo parecido\': 2, \'algo parecido por\': 1, \'parecido por poner\': 1, \'por poner un\': 1, \'poner un ejemplo\': 1, \'un ejemplo estoy\': 1, \'ejemplo estoy estudiando\': 1, \'estoy estudiando una\': 1, \'estudiando una carrera\': 1, \'una carrera y\': 1, \'carrera y cuando\': 1, \'y cuando voy\': 1, \'cuando voy a\': 1, \'voy a ponerme\': 1, \'a ponerme a\': 1, \'ponerme a estudiar\': 1, \'a estudiar con\': 1, \'estudiar con ganas\': 1, \'con ganas me\': 1, \'ganas me boicotea\': 1, \'me boicotea mi\': 1, \'boicotea mi pensamiento\': 1, \'mi pensamiento del\': 1, \'pensamiento del total\': 1, \'del total para\': 1, \'total para que\': 1, \'para que y\': 1, \'que y me\': 1, \'y me empieza\': 1, \'me empieza la\': 1, \'empieza la angustia\': 1, \'la angustia los\': 1, \'angustia los nervios\': 1, \'los nervios la\': 1, \'nervios la desesperacion\': 1, \'la desesperacion y\': 1, \'desesperacion y así\': 1, \'y así con\': 1, \'así con todo\': 1, \'con todo os\': 1, \'todo os pasa\': 1, \'algo parecido habéis\': 1, \'parecido habéis logrado\': 1, \'habéis logrado vencerlo\': 1, \'logrado vencerlo gracias\': 1, \'vencerlo gracias por\': 1, \'gracias por leerme\': 1, \'gracias a los\': 1, \'a los 2\': 1, \'los 2 tranquiliza\': 1, \'2 tranquiliza saber\': 1, \'tranquiliza saber que\': 1, \'saber que no\': 1, \'que no estamos\': 1, \'no estamos solos\': 1, \'estamos solos en\': 1, \'solos en esto\': 1, \'no me había\': 1, \'me había dado\': 1, \'había dado cuenta\': 1, \'dado cuenta voy\': 1, \'cuenta voy a\': 1, \'voy a echarle\': 1, \'a echarle un\': 1, \'echarle un vistazo\': 1, \'un vistazo gracias\': 1}', '{\'buenos días a tod\': 1, \'días a tod s\': 1, \'a tod s no\': 1, \'tod s no sé\': 1, \'s no sé si\': 1, \'no sé si esta\': 1, \'sé si esta será\': 1, \'si esta será la\': 1, \'esta será la finalidad\': 1, \'será la finalidad del\': 1, \'la finalidad del grupo\': 1, \'finalidad del grupo pero\': 1, \'del grupo pero cuando\': 1, \'grupo pero cuando estás\': 1, \'pero cuando estás en\': 1, \'cuando estás en plena\': 1, \'estás en plena crisis\': 1, \'en plena crisis buscas\': 1, \'plena crisis buscas recursos\': 1, \'crisis buscas recursos por\': 1, \'buscas recursos por todas\': 1, \'recursos por todas partes\': 1, \'por todas partes estoy\': 1, \'todas partes estoy yendo\': 1, \'partes estoy yendo a\': 1, \'estoy yendo a terapia\': 1, \'yendo a terapia y\': 1, \'a terapia y me\': 1, \'terapia y me diagnosticaron\': 1, \'y me diagnosticaron tag\': 1, \'me diagnosticaron tag trastorno\': 1, \'diagnosticaron tag trastorno de\': 1, \'tag trastorno de ansiedad\': 1, \'trastorno de ansiedad generalizada\': 1, \'de ansiedad generalizada desde\': 1, \'ansiedad generalizada desde hace\': 1, \'generalizada desde hace mucho\': 1, \'desde hace mucho tiempo\': 1, \'hace mucho tiempo el\': 1, \'mucho tiempo el problema\': 1, \'tiempo el problema es\': 1, \'el problema es que\': 1, \'problema es que cuando\': 1, \'es que cuando me\': 1, \'que cuando me dan\': 1, \'cuando me dan esas\': 1, \'me dan esas crisis\': 1, \'dan esas crisis de\': 1, \'esas crisis de no\': 1, \'crisis de no poder\': 1, \'de no poder parar\': 1, \'no poder parar ni\': 1, \'poder parar ni un\': 1, \'parar ni un segundo\': 1, \'ni un segundo mis\': 1, \'un segundo mis pensamientos\': 1, \'segundo mis pensamientos acabo\': 1, \'mis pensamientos acabo agotada\': 1, \'pensamientos acabo agotada y\': 1, \'acabo agotada y ya\': 1, \'agotada y ya no\': 1, \'y ya no sé\': 1, \'ya no sé si\': 1, \'no sé si con\': 1, \'sé si con depresión\': 1, \'si con depresión quería\': 1, \'con depresión quería saber\': 1, \'depresión quería saber si\': 1, \'quería saber si a\': 1, \'saber si a alguno\': 1, \'si a alguno de\': 1, \'a alguno de vosotros\': 1, \'alguno de vosotros también\': 1, \'de vosotros también os\': 1, \'vosotros también os pasa\': 1, \'también os pasa algo\': 1, \'os pasa algo parecido\': 2, \'pasa algo parecido por\': 1, \'algo parecido por poner\': 1, \'parecido por poner un\': 1, \'por poner un ejemplo\': 1, \'poner un ejemplo estoy\': 1, \'un ejemplo estoy estudiando\': 1, \'ejemplo estoy estudiando una\': 1, \'estoy estudiando una carrera\': 1, \'estudiando una carrera y\': 1, \'una carrera y cuando\': 1, \'carrera y cuando voy\': 1, \'y cuando voy a\': 1, \'cuando voy a ponerme\': 1, \'voy a ponerme a\': 1, \'a ponerme a estudiar\': 1, \'ponerme a estudiar con\': 1, \'a estudiar con ganas\': 1, \'estudiar con ganas me\': 1, \'con ganas me boicotea\': 1, \'ganas me boicotea mi\': 1, \'me boicotea mi pensamiento\': 1, \'boicotea mi pensamiento del\': 1, \'mi pensamiento del total\': 1, \'pensamiento del total para\': 1, \'del total para que\': 1, \'total para que y\': 1, \'para que y me\': 1, \'que y me empieza\': 1, \'y me empieza la\': 1, \'me empieza la angustia\': 1, \'empieza la angustia los\': 1, \'la angustia los nervios\': 1, \'angustia los nervios la\': 1, \'los nervios la desesperacion\': 1, \'nervios la desesperacion y\': 1, \'la desesperacion y así\': 1, \'desesperacion y así con\': 1, \'y así con todo\': 1, \'así con todo os\': 1, \'con todo os pasa\': 1, \'todo os pasa algo\': 1, \'pasa algo parecido habéis\': 1, \'algo parecido habéis logrado\': 1, \'parecido habéis logrado vencerlo\': 1, \'habéis logrado vencerlo gracias\': 1, \'logrado vencerlo gracias por\': 1, \'vencerlo gracias por leerme\': 1, \'gracias a los 2\': 1, \'a los 2 tranquiliza\': 1, \'los 2 tranquiliza saber\': 1, \'2 tranquiliza saber que\': 1, \'tranquiliza saber que no\': 1, \'saber que no estamos\': 1, \'que no estamos solos\': 1, \'no estamos solos en\': 1, \'estamos solos en esto\': 1, \'no me había dado\': 1, \'me había dado cuenta\': 1, \'había dado cuenta voy\': 1, \'dado cuenta voy a\': 1, \'cuenta voy a echarle\': 1, \'voy a echarle un\': 1, \'a echarle un vistazo\': 1, \'echarle un vistazo gracias\': 1}', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perplejidad`
--

CREATE TABLE `perplejidad` (
  `id_perplejidad` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `valor_perplejidad` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perplejidad`
--

INSERT INTO `perplejidad` (`id_perplejidad`, `analizado`, `valor_perplejidad`, `Id_C`) VALUES
(12, 1, '59.17/6561.70/3503654.54/59.17/1126.97', 2),
(13, 1, '91.61/178.95/1306.48/91.61/131.09', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `polaridad`
--

CREATE TABLE `polaridad` (
  `id_polaridad` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `v_positiva` varchar(100) NOT NULL,
  `v_negativa` varchar(100) NOT NULL,
  `v_neutra` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `polaridad`
--

INSERT INTO `polaridad` (`id_polaridad`, `analizado`, `v_positiva`, `v_negativa`, `v_neutra`, `Id_C`) VALUES
(8, 1, '0.00/0.81/0.06/0.00/0.09', '0.00/1.00/0.16/0.00/0.25', '0.00/1.00/0.18/0.00/0.66', 2),
(9, 1, '0.00/1.00/0.17/0.00/0.56', '0.00/0.01/0.00/0.00/0.00', '0.00/0.99/0.17/0.00/0.44', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `polaridad_emojis`
--

CREATE TABLE `polaridad_emojis` (
  `id_pol_emojis` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `n_emojis` varchar(100) NOT NULL,
  `p_emojis` varchar(100) NOT NULL,
  `distint_emojis` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `polaridad_emojis`
--

INSERT INTO `polaridad_emojis` (`id_pol_emojis`, `analizado`, `n_emojis`, `p_emojis`, `distint_emojis`, `Id_C`) VALUES
(4, 1, '{\'positive\': 0, \'negative\': 0}', '{\'positive\': 0, \'negative\': 0}', '{\'positive\': set(), \'negative\': set()}', 2),
(7, 1, '{\'positive\': 2, \'negative\': 1}', '{\'positive\': 0, \'negative\': 0}', '{\'positive\': {\'????\'}, \'negative\': {\'????\'}}', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `polaridad_emoticonos`
--

CREATE TABLE `polaridad_emoticonos` (
  `id_pol_emoticonos` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `n_emoticonos` varchar(100) NOT NULL,
  `p_emoticonos` varchar(100) NOT NULL,
  `distint_emoticonos` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `polaridad_emoticonos`
--

INSERT INTO `polaridad_emoticonos` (`id_pol_emoticonos`, `analizado`, `n_emoticonos`, `p_emoticonos`, `distint_emoticonos`, `Id_C`) VALUES
(4, 1, '{\'positive\': 0, \'negative\': 0}', '{\'positive\': 0, \'negative\': 0}', '{\'positive\': set(), \'negative\': set()}', 2),
(7, 1, '{\'positive\': 0, \'negative\': 0}', '{\'positive\': 0, \'negative\': 0}', '{\'positive\': set(), \'negative\': set()}', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pos`
--

CREATE TABLE `pos` (
  `id_pos` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `frec_conjunciones` varchar(100) NOT NULL,
  `frec_espacios` varchar(100) NOT NULL,
  `frec_verbos` varchar(100) NOT NULL,
  `frec_simbolos` varchar(100) NOT NULL,
  `frec_numeros` varchar(100) NOT NULL,
  `frec_sustantivos` varchar(100) NOT NULL,
  `frec_adjetivos` varchar(100) NOT NULL,
  `frec_sig_punt` varchar(100) NOT NULL,
  `frec_verb_aux` varchar(100) NOT NULL,
  `frec_adverbios` varchar(100) NOT NULL,
  `frec_interjecciones` varchar(100) NOT NULL,
  `frec_determinantes` varchar(100) NOT NULL,
  `frec_conj_sub` varchar(100) NOT NULL,
  `frec_nombres_prop` varchar(100) NOT NULL,
  `frec_pronon` varchar(100) NOT NULL,
  `frec_preposiciones` varchar(100) NOT NULL,
  `frec_rel_conj` varchar(100) NOT NULL,
  `frec_rel_espacios` varchar(100) NOT NULL,
  `frec_rel_verb` varchar(100) NOT NULL,
  `frec_rel_simb` varchar(100) NOT NULL,
  `frec_rel_num` varchar(100) NOT NULL,
  `frec_rel_sus` varchar(100) NOT NULL,
  `frec_rel_adj` varchar(100) NOT NULL,
  `frec_rel_sdp` varchar(100) NOT NULL,
  `frec_rel_vaux` varchar(100) NOT NULL,
  `frec_rel_adv` varchar(100) NOT NULL,
  `frec_rel_interj` varchar(100) NOT NULL,
  `frec_rel_det` varchar(100) NOT NULL,
  `frec_rel_conjsub` varchar(100) NOT NULL,
  `frec_rel_nprop` varchar(100) NOT NULL,
  `frec_rel_pronom` varchar(100) NOT NULL,
  `frec_rel_prep` varchar(100) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pos`
--

INSERT INTO `pos` (`id_pos`, `analizado`, `frec_conjunciones`, `frec_espacios`, `frec_verbos`, `frec_simbolos`, `frec_numeros`, `frec_sustantivos`, `frec_adjetivos`, `frec_sig_punt`, `frec_verb_aux`, `frec_adverbios`, `frec_interjecciones`, `frec_determinantes`, `frec_conj_sub`, `frec_nombres_prop`, `frec_pronon`, `frec_preposiciones`, `frec_rel_conj`, `frec_rel_espacios`, `frec_rel_verb`, `frec_rel_simb`, `frec_rel_num`, `frec_rel_sus`, `frec_rel_adj`, `frec_rel_sdp`, `frec_rel_vaux`, `frec_rel_adv`, `frec_rel_interj`, `frec_rel_det`, `frec_rel_conjsub`, `frec_rel_nprop`, `frec_rel_pronom`, `frec_rel_prep`, `Id_C`) VALUES
(9, 1, '0.00/2.00/0.45/0.00/0.50', '0.00/0.00/0.00/0.00/0.00', '1.00/3.00/0.81/1.00/1.70', '0.00/0.00/0.00/0.00/0.00', '0.00/3.00/0.85/0.00/0.50', '0.00/5.00/2.01/1.00/1.70', '0.00/1.00/0.24/0.00/0.40', '0.00/1.00/0.21/0.00/0.30', '0.00/2.00/0.45/0.00/0.50', '0.00/3.00/0.76/1.00/0.80', '0.00/0.00/0.00/0.00/0.00', '0.00/2.00/0.41/1.00/0.70', '0.00/2.00/0.45/0.00/0.50', '0.00/2.00/0.45/0.00/0.50', '0.00/4.00/2.01/0.00/1.30', '0.00/4.00/1.49/0.00/0.90', '0.00/0.22/0.01/0.00/0.05', '0.00/0.00/0.00/0.00/0.00', '0.08/0.40/0.01/0.12/0.18', '0.00/0.00/0.00/0.00/0.00', '0.00/0.23/0.01/0.00/0.05', '0.00/0.38/0.01/0.12/0.15', '0.00/0.12/0.00/0.00/0.04', '0.00/0.20/0.00/0.00/0.04', '0.00/0.25/0.01/0.00/0.06', '0.00/0.33/0.01/0.00/0.08', '0.00/0.00/0.00/0.00/0.00', '0.00/0.12/0.00/0.00/0.06', '0.00/0.11/0.00/0.00/0.04', '0.00/0.25/0.01/0.00/0.06', '0.00/0.27/0.01/0.00/0.13', '0.00/0.36/0.01/0.00/0.08', 2),
(10, 1, '0.00/6.00/8.00/0.00/2.00', '0.00/0.00/0.00/0.00/0.00', '2.00/21.00/76.22/2.00/8.67', '0.00/0.00/0.00/0.00/0.00', '0.00/1.00/0.22/0.00/0.33', '2.00/25.00/112.67/2.00/10.00', '0.00/9.00/16.22/0.00/3.33', '1.00/20.00/76.22/1.00/7.67', '1.00/6.00/4.67/1.00/3.00', '1.00/8.00/10.89/1.00/3.33', '0.00/0.00/0.00/0.00/0.00', '1.00/13.00/32.00/1.00/5.00', '0.00/8.00/12.67/0.00/3.00', '0.00/3.00/2.00/0.00/1.00', '1.00/11.00/20.22/1.00/4.67', '2.00/19.00/64.22/2.00/7.67', '0.00/0.04/0.00/0.00/0.01', '0.00/0.00/0.00/0.00/0.00', '0.14/0.19/0.00/0.14/0.16', '0.00/0.00/0.00/0.00/0.00', '0.00/0.06/0.00/0.00/0.02', '0.12/0.21/0.00/0.12/0.17', '0.00/0.06/0.00/0.00/0.04', '0.06/0.14/0.00/0.06/0.11', '0.04/0.14/0.00/0.04/0.08', '0.05/0.07/0.00/0.05/0.06', '0.00/0.00/0.00/0.00/0.00', '0.06/0.09/0.00/0.06/0.07', '0.00/0.06/0.00/0.00/0.04', '0.00/0.02/0.00/0.00/0.01', '0.07/0.12/0.00/0.07/0.09', '0.12/0.14/0.00/0.12/0.13', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sel`
--

CREATE TABLE `sel` (
  `id_sel` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `valor_sel` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sel`
--

INSERT INTO `sel` (`id_sel`, `analizado`, `valor_sel`, `Id_C`) VALUES
(6, 1, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]', 2),
(7, 1, '[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]/[0.0, 0.0, 0.0, 0.0]/[[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `contrasena` varchar(300) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `primerapellido` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario`, `email`, `contrasena`, `nombre`, `primerapellido`) VALUES
('Prueba', 'prueba@gmail.com', '$2b$12$pBqDmamTzSYJboh48f8I..gxUu/4RPorNFmVOtnp6sZr5Gg4nCcGK', 'Prueba', 'Prueba'),
('Pruebas', 'pruebas@gmail.com', '$2b$12$eAhxsbCOPKtwFHhlkilLXOXoqhYr1/bhAIoSw7guLWZ50kYs5rWa2', 'Pruebas', 'Pruebas'),
('Pruebas12', 'pruebas@pruebas.com', '$2b$12$fsTnZhLSv5.McLfOH7b.zuE59FDFKU2FizzfpZ0U/kLOnAJ/ughTq', 'Pras', 'asdf'),
('ram00056', 'ram00056@red.ujaen.es', '$2b$12$ADmmHBBcrdTXcHenC7P4G.gXiQzbxlbWr3Rrq2SP/bmCkWbJKAl8W', 'Rubén', 'Aguayo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `volumetria`
--

CREATE TABLE `volumetria` (
  `id_volumetria` int(11) NOT NULL,
  `analizado` int(1) NOT NULL DEFAULT 0,
  `n_palabras` varchar(1000) NOT NULL,
  `n_caracteres` varchar(1000) NOT NULL,
  `n_palabras_unicas` varchar(1000) NOT NULL,
  `m_longitud_palabras` varchar(1000) NOT NULL,
  `Id_C` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `volumetria`
--

INSERT INTO `volumetria` (`id_volumetria`, `analizado`, `n_palabras`, `n_caracteres`, `n_palabras_unicas`, `m_longitud_palabras`, `Id_C`) VALUES
(9, 1, '4.00/18.00/17.00/11.00/10.00', '16.00/83.00/459.69/16.00/48.90', '4.00/18.00/15.76/11.00/9.80', '4.00/6.00/0.60/5.00/5.00', 2),
(10, 1, '14.00/149.00/4020.22/14.00/59.33', '62.00/755.00/105654.89/62.00/295.33', '14.00/107.00/1901.56/14.00/45.33', '4.00/5.00/0.22/5.00/4.67', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `analisiscontrastivo`
--
ALTER TABLE `analisiscontrastivo`
  ADD PRIMARY KEY (`id_Contrastivo`),
  ADD KEY `analisisContrastivoUno_fk` (`Id_Cuno`),
  ADD KEY `analisisContrastivoDos_fk` (`Id_Cdos`);

--
-- Indices de la tabla `bdlase`
--
ALTER TABLE `bdlase`
  ADD PRIMARY KEY (`id_bdlase`),
  ADD KEY `coleccion_fk` (`Id_C`);

--
-- Indices de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD PRIMARY KEY (`Id_C`),
  ADD KEY `usuario_fk` (`usuario`);

--
-- Indices de la tabla `complejidad`
--
ALTER TABLE `complejidad`
  ADD PRIMARY KEY (`id_complejidad`),
  ADD KEY `coleccionComplej_fk` (`Id_C`);

--
-- Indices de la tabla `diversidad_lexica`
--
ALTER TABLE `diversidad_lexica`
  ADD PRIMARY KEY (`id_diversidad`),
  ADD KEY `coleccionDivLex_fk` (`Id_C`);

--
-- Indices de la tabla `emociones`
--
ALTER TABLE `emociones`
  ADD PRIMARY KEY (`id_emociones`),
  ADD KEY `coleccionEmocion_fk` (`Id_C`);

--
-- Indices de la tabla `emofinder`
--
ALTER TABLE `emofinder`
  ADD PRIMARY KEY (`id_emofinder`),
  ADD KEY `coleccionEmofin_fk` (`Id_C`);

--
-- Indices de la tabla `emojis`
--
ALTER TABLE `emojis`
  ADD PRIMARY KEY (`id_emojis`),
  ADD KEY `coleccionEmojis_fk` (`Id_C`);

--
-- Indices de la tabla `estilometria`
--
ALTER TABLE `estilometria`
  ADD PRIMARY KEY (`id_estilometria`),
  ADD KEY `coleccionEstilo_fk` (`Id_C`);

--
-- Indices de la tabla `ironia`
--
ALTER TABLE `ironia`
  ADD PRIMARY KEY (`id_ironia`),
  ADD KEY `coleccionIronia_fk` (`Id_C`);

--
-- Indices de la tabla `isal`
--
ALTER TABLE `isal`
  ADD PRIMARY KEY (`id_isal`),
  ADD KEY `coleccionIsal_fk` (`Id_C`);

--
-- Indices de la tabla `lemas`
--
ALTER TABLE `lemas`
  ADD PRIMARY KEY (`id_lemas`),
  ADD KEY `coleccionLemas_fk` (`Id_C`);

--
-- Indices de la tabla `liwc`
--
ALTER TABLE `liwc`
  ADD PRIMARY KEY (`id_liwc`),
  ADD KEY `coleccionLIWC_fk` (`Id_C`);

--
-- Indices de la tabla `ncr`
--
ALTER TABLE `ncr`
  ADD PRIMARY KEY (`id_ncr`),
  ADD KEY `coleccionNCR_fk` (`Id_C`);

--
-- Indices de la tabla `ner`
--
ALTER TABLE `ner`
  ADD PRIMARY KEY (`id_ner`),
  ADD KEY `coleccionNER_fk` (`Id_C`);

--
-- Indices de la tabla `ngrams`
--
ALTER TABLE `ngrams`
  ADD PRIMARY KEY (`id_ngrams`),
  ADD KEY `coleccionNgrams_fk` (`Id_C`);

--
-- Indices de la tabla `perplejidad`
--
ALTER TABLE `perplejidad`
  ADD PRIMARY KEY (`id_perplejidad`),
  ADD KEY `coleccionPerplej_fk` (`Id_C`);

--
-- Indices de la tabla `polaridad`
--
ALTER TABLE `polaridad`
  ADD PRIMARY KEY (`id_polaridad`),
  ADD KEY `coleccionPolaridad_fk` (`Id_C`);

--
-- Indices de la tabla `polaridad_emojis`
--
ALTER TABLE `polaridad_emojis`
  ADD PRIMARY KEY (`id_pol_emojis`),
  ADD KEY `coleccionPolEmojis_fk` (`Id_C`);

--
-- Indices de la tabla `polaridad_emoticonos`
--
ALTER TABLE `polaridad_emoticonos`
  ADD PRIMARY KEY (`id_pol_emoticonos`),
  ADD KEY `coleccionPolEmoticonos_fk` (`Id_C`);

--
-- Indices de la tabla `pos`
--
ALTER TABLE `pos`
  ADD PRIMARY KEY (`id_pos`),
  ADD KEY `coleccionPOS_fk` (`Id_C`);

--
-- Indices de la tabla `sel`
--
ALTER TABLE `sel`
  ADD PRIMARY KEY (`id_sel`),
  ADD KEY `coleccionSel_fk` (`Id_C`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `volumetria`
--
ALTER TABLE `volumetria`
  ADD PRIMARY KEY (`id_volumetria`),
  ADD KEY `coleccionVolumen_fk` (`Id_C`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `analisiscontrastivo`
--
ALTER TABLE `analisiscontrastivo`
  MODIFY `id_Contrastivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `bdlase`
--
ALTER TABLE `bdlase`
  MODIFY `id_bdlase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  MODIFY `Id_C` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `complejidad`
--
ALTER TABLE `complejidad`
  MODIFY `id_complejidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `diversidad_lexica`
--
ALTER TABLE `diversidad_lexica`
  MODIFY `id_diversidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `emociones`
--
ALTER TABLE `emociones`
  MODIFY `id_emociones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `emofinder`
--
ALTER TABLE `emofinder`
  MODIFY `id_emofinder` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `emojis`
--
ALTER TABLE `emojis`
  MODIFY `id_emojis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `estilometria`
--
ALTER TABLE `estilometria`
  MODIFY `id_estilometria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `ironia`
--
ALTER TABLE `ironia`
  MODIFY `id_ironia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `isal`
--
ALTER TABLE `isal`
  MODIFY `id_isal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `lemas`
--
ALTER TABLE `lemas`
  MODIFY `id_lemas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `liwc`
--
ALTER TABLE `liwc`
  MODIFY `id_liwc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ncr`
--
ALTER TABLE `ncr`
  MODIFY `id_ncr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ner`
--
ALTER TABLE `ner`
  MODIFY `id_ner` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ngrams`
--
ALTER TABLE `ngrams`
  MODIFY `id_ngrams` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `perplejidad`
--
ALTER TABLE `perplejidad`
  MODIFY `id_perplejidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `polaridad`
--
ALTER TABLE `polaridad`
  MODIFY `id_polaridad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `polaridad_emojis`
--
ALTER TABLE `polaridad_emojis`
  MODIFY `id_pol_emojis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `polaridad_emoticonos`
--
ALTER TABLE `polaridad_emoticonos`
  MODIFY `id_pol_emoticonos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `pos`
--
ALTER TABLE `pos`
  MODIFY `id_pos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `sel`
--
ALTER TABLE `sel`
  MODIFY `id_sel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `volumetria`
--
ALTER TABLE `volumetria`
  MODIFY `id_volumetria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `analisiscontrastivo`
--
ALTER TABLE `analisiscontrastivo`
  ADD CONSTRAINT `analisisContrastivoDos_fk` FOREIGN KEY (`Id_Cdos`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `analisisContrastivoUno_fk` FOREIGN KEY (`Id_Cuno`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `bdlase`
--
ALTER TABLE `bdlase`
  ADD CONSTRAINT `coleccion_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD CONSTRAINT `usuario_fk` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `complejidad`
--
ALTER TABLE `complejidad`
  ADD CONSTRAINT `coleccionComplej_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `diversidad_lexica`
--
ALTER TABLE `diversidad_lexica`
  ADD CONSTRAINT `coleccionDivLex_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `emociones`
--
ALTER TABLE `emociones`
  ADD CONSTRAINT `coleccionEmocion_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `emofinder`
--
ALTER TABLE `emofinder`
  ADD CONSTRAINT `coleccionEmofin_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `emojis`
--
ALTER TABLE `emojis`
  ADD CONSTRAINT `coleccionEmojis_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estilometria`
--
ALTER TABLE `estilometria`
  ADD CONSTRAINT `coleccionEstilo_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ironia`
--
ALTER TABLE `ironia`
  ADD CONSTRAINT `coleccionIronia_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `isal`
--
ALTER TABLE `isal`
  ADD CONSTRAINT `coleccionIsal_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `lemas`
--
ALTER TABLE `lemas`
  ADD CONSTRAINT `coleccionLemas_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `liwc`
--
ALTER TABLE `liwc`
  ADD CONSTRAINT `coleccionLIWC_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ncr`
--
ALTER TABLE `ncr`
  ADD CONSTRAINT `coleccionNCR_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ner`
--
ALTER TABLE `ner`
  ADD CONSTRAINT `coleccionNER_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ngrams`
--
ALTER TABLE `ngrams`
  ADD CONSTRAINT `coleccionNgrams_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `perplejidad`
--
ALTER TABLE `perplejidad`
  ADD CONSTRAINT `coleccionPerplej_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `polaridad`
--
ALTER TABLE `polaridad`
  ADD CONSTRAINT `coleccionPolaridad_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `polaridad_emojis`
--
ALTER TABLE `polaridad_emojis`
  ADD CONSTRAINT `coleccionPolEmojis_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `polaridad_emoticonos`
--
ALTER TABLE `polaridad_emoticonos`
  ADD CONSTRAINT `coleccionPolEmoticonos_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pos`
--
ALTER TABLE `pos`
  ADD CONSTRAINT `coleccionPOS_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `sel`
--
ALTER TABLE `sel`
  ADD CONSTRAINT `coleccionSel_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `volumetria`
--
ALTER TABLE `volumetria`
  ADD CONSTRAINT `coleccionVolumen_fk` FOREIGN KEY (`Id_C`) REFERENCES `colecciones` (`Id_C`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
