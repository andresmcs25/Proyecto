-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-06-2025 a las 22:57:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `neoposdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo`
--

CREATE TABLE `articulo` (
  `id_articulo` int(11) NOT NULL,
  `id_categoria_articulo` int(11) NOT NULL COMMENT 'FK a categoria_articulo',
  `id_unidad_medida` int(11) DEFAULT NULL COMMENT 'FK a unidad_medida',
  `codigo_barra` varchar(100) DEFAULT NULL COMMENT 'Código de barras o SKU (puede ser único)',
  `nombre` varchar(150) NOT NULL COMMENT 'Nombre del artículo',
  `stock_actual` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cantidad en existencia',
  `descripcion` text DEFAULT NULL COMMENT 'Descripción detallada del artículo',
  `ruta_imagen` varchar(255) DEFAULT NULL COMMENT 'Ruta o nombre del archivo de imagen',
  `precio_compra_neto_actual` decimal(10,2) DEFAULT 0.00 COMMENT 'Último precio de compra sin impuestos',
  `precio_venta_neto` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Precio de venta sin impuestos',
  `aplica_impuesto` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Indica si el artículo aplica el impuesto general (1=Sí, 0=No)',
  `activo` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado (1=activo, 0=inactivo)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Productos o servicios ofrecidos';

--
-- Volcado de datos para la tabla `articulo`
--

INSERT INTO `articulo` (`id_articulo`, `id_categoria_articulo`, `id_unidad_medida`, `codigo_barra`, `nombre`, `stock_actual`, `descripcion`, `ruta_imagen`, `precio_compra_neto_actual`, `precio_venta_neto`, `aplica_impuesto`, `activo`) VALUES
(1, 1, 1, 'SN-XIA-N11P', 'Smartphone Xiaomi Note 11 Pro', 50.00, 'Celular Xiaomi Note 11 Pro, 128GB, 6GB RAM', 'xiaomi_note11pro.png', 650.00, 950.00, 1, 1),
(2, 2, 1, 'LP-ASUS-ROG2', 'Laptop Asus ROG Strix G15', 20.00, 'Laptop gamer, Ryzen 9, RTX 3070, 16GB RAM, 1TB SSD', 'asus_rog_strix_g15.png', 2800.00, 3500.00, 1, 1),
(3, 3, 2, 'PK-GAL-OR01', 'Paquete Galletas Oreo x12', 100.00, 'Paquete de 12 unidades de galletas Oreo Clásicas', 'galletas_oreo.png', 1.50, 2.50, 1, 1),
(4, 4, 3, 'CJ-BOL-BIC01', 'Caja Bolígrafos BIC Cristal x50', 200.00, 'Caja con 50 bolígrafos BIC Cristal, tinta azul', 'bic_cristal_caja.png', 8.00, 12.50, 1, 1),
(5, 5, 1, 'LIM-FAB-LAV1L', 'Limpiador Fabuloso Lavanda 1L', 75.00, 'Limpiador multiusos líquido con aroma a lavanda, botella 1L', 'fabuloso_lavanda.png', 2.20, 3.80, 1, 1),
(6, 2, 1, 'ACC-CAB-USBC1M', 'Cable USB-C 1 Metro', 150.00, 'Cable de carga y datos USB-C a USB-A, 1 metro, color negro', 'cable_usbc.png', 3.00, 7.00, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja_fisica`
--

CREATE TABLE `caja_fisica` (
  `id_caja_fisica` int(11) NOT NULL,
  `nombre_caja` varchar(50) NOT NULL COMMENT 'Ej: Caja Principal, Caja 2',
  `ubicacion` varchar(100) DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Identificación de cajas registradoras físicas';

--
-- Volcado de datos para la tabla `caja_fisica`
--

INSERT INTO `caja_fisica` (`id_caja_fisica`, `nombre_caja`, `ubicacion`, `activa`) VALUES
(1, 'Caja Principal', 'Mostrador Frente', 1),
(2, 'Caja Rápida', 'Salida Lateral', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja_sesion`
--

CREATE TABLE `caja_sesion` (
  `id_caja_sesion` int(11) NOT NULL,
  `id_usuario_apertura` int(11) NOT NULL COMMENT 'Usuario que abre la caja/turno',
  `id_caja_fisica` int(11) DEFAULT NULL COMMENT 'FK a caja_fisica (opcional)',
  `fecha_hora_apertura` datetime NOT NULL,
  `monto_inicial_efectivo` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Dinero inicial en efectivo en caja',
  `fecha_hora_cierre` datetime DEFAULT NULL,
  `total_ventas_sistema_efectivo` decimal(12,2) DEFAULT NULL COMMENT 'Total ventas en efectivo según sistema',
  `total_ingresos_extras_efectivo` decimal(12,2) DEFAULT 0.00 COMMENT 'Otros ingresos en efectivo a caja',
  `total_egresos_extras_efectivo` decimal(12,2) DEFAULT 0.00 COMMENT 'Otros egresos en efectivo de caja',
  `monto_final_efectivo_sistema` decimal(12,2) DEFAULT NULL COMMENT 'Calculado: inicial + ventas_efectivo + ingresos_extras - egresos_extras',
  `monto_final_efectivo_conteo` decimal(12,2) DEFAULT NULL COMMENT 'Dinero en efectivo contado físicamente al cerrar',
  `diferencia_efectivo_arqueo` decimal(12,2) DEFAULT NULL COMMENT 'Diferencia (conteo - sistema_efectivo)',
  `total_ventas_otros_metodos` decimal(12,2) DEFAULT NULL COMMENT 'Total ventas con otros métodos de pago',
  `observaciones_cierre` text DEFAULT NULL,
  `estado_sesion` enum('Abierta','Cerrada','Arqueada') NOT NULL DEFAULT 'Abierta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Sesiones de caja para arqueos y control de turnos';

--
-- Volcado de datos para la tabla `caja_sesion`
--

INSERT INTO `caja_sesion` (`id_caja_sesion`, `id_usuario_apertura`, `id_caja_fisica`, `fecha_hora_apertura`, `monto_inicial_efectivo`, `fecha_hora_cierre`, `total_ventas_sistema_efectivo`, `total_ingresos_extras_efectivo`, `total_egresos_extras_efectivo`, `monto_final_efectivo_sistema`, `monto_final_efectivo_conteo`, `diferencia_efectivo_arqueo`, `total_ventas_otros_metodos`, `observaciones_cierre`, `estado_sesion`) VALUES
(1, 2, 1, '2025-05-27 08:00:00', 200.00, NULL, NULL, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, 'Abierta'),
(2, 2, 1, '2025-05-26 08:00:00', 150.00, '2025-05-26 18:00:00', 1250.50, 0.00, 0.00, 1400.50, 1400.00, -0.50, 850.00, NULL, 'Arqueada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_articulo`
--

CREATE TABLE `categoria_articulo` (
  `id_categoria_articulo` int(11) NOT NULL COMMENT 'ID único de la categoría',
  `nombre` varchar(70) NOT NULL COMMENT 'Nombre de la categoría',
  `descripcion` varchar(255) DEFAULT NULL COMMENT 'Descripción opcional de la categoría',
  `activa` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado (1=activa, 0=inactiva)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Categorías para los artículos';

--
-- Volcado de datos para la tabla `categoria_articulo`
--

INSERT INTO `categoria_articulo` (`id_categoria_articulo`, `nombre`, `descripcion`, `activa`) VALUES
(1, 'Smartphones', 'Teléfonos móviles inteligentes y accesorios', 1),
(2, 'Laptops y Computadoras', 'Equipos de cómputo portátiles y de escritorio', 1),
(3, 'Alimentos No Perecederos', 'Productos alimenticios con larga vida útil', 1),
(4, 'Papelería y Oficina', 'Útiles escolares y de oficina', 1),
(5, 'Limpieza del Hogar', 'Productos para la limpieza y mantenimiento del hogar', 1),
(6, 'Bebidas', 'Refrescos, jugos y otras bebidas', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id_compra` int(11) NOT NULL,
  `id_tercero_proveedor` int(11) NOT NULL COMMENT 'FK a tercero (tipo_tercero=''Proveedor'')',
  `id_usuario_registro` int(11) NOT NULL COMMENT 'FK a usuario que registra',
  `tipo_comprobante` varchar(50) NOT NULL COMMENT 'Ej: Factura Compra, Nota Entrada',
  `serie_comprobante` varchar(20) DEFAULT NULL,
  `numero_comprobante` varchar(30) NOT NULL,
  `fecha_hora_compra` datetime NOT NULL,
  `subtotal_compra` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_impuestos_compra` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_compra_final` decimal(12,2) NOT NULL,
  `tasa_impuesto_aplicada` decimal(5,2) DEFAULT 0.00 COMMENT 'Ej: 19.00 para 19%',
  `observaciones` text DEFAULT NULL,
  `estado_compra` enum('Registrada','Recibida','Parcialmente Recibida','Anulada') NOT NULL DEFAULT 'Registrada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Transacciones de compra a proveedores';

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`id_compra`, `id_tercero_proveedor`, `id_usuario_registro`, `tipo_comprobante`, `serie_comprobante`, `numero_comprobante`, `fecha_hora_compra`, `subtotal_compra`, `total_impuestos_compra`, `total_compra_final`, `tasa_impuesto_aplicada`, `observaciones`, `estado_compra`) VALUES
(1, 3, 3, 'Factura de Compra', 'FC-ELEC', '00123', '2025-05-20 10:00:00', 32500.00, 6175.00, 38675.00, 19.00, NULL, 'Recibida'),
(2, 4, 3, 'Factura de Compra', 'FC-ALIM', 'A-0088', '2025-05-22 14:30:00', 150.00, 0.00, 150.00, 0.00, NULL, 'Recibida');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id_detalle_compra` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio_compra_unitario_neto` decimal(10,2) NOT NULL,
  `subtotal_linea_neto` decimal(12,2) NOT NULL COMMENT 'cantidad * precio_compra_unitario_neto',
  `impuesto_linea` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Detalle de artículos en una compra';

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detalle_compra`, `id_compra`, `id_articulo`, `cantidad`, `precio_compra_unitario_neto`, `subtotal_linea_neto`, `impuesto_linea`) VALUES
(1, 1, 1, 50.00, 650.00, 32500.00, 6175.00),
(2, 2, 3, 100.00, 1.50, 150.00, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio_venta_unitario_base` decimal(10,2) NOT NULL COMMENT 'Precio del artículo antes de descuento e impuestos',
  `porcentaje_descuento_linea` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT '(ej. 10.00 para 10%)',
  `monto_descuento_linea` decimal(10,2) NOT NULL DEFAULT 0.00,
  `precio_unitario_con_descuento` decimal(10,2) NOT NULL COMMENT 'precio_base - monto_descuento',
  `subtotal_linea_neto` decimal(12,2) NOT NULL COMMENT 'cantidad * precio_unitario_con_descuento',
  `tasa_impuesto_linea` decimal(5,2) DEFAULT 0.00,
  `monto_impuesto_linea` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Detalle de artículos en una venta';

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id_detalle_venta`, `id_venta`, `id_articulo`, `cantidad`, `precio_venta_unitario_base`, `porcentaje_descuento_linea`, `monto_descuento_linea`, `precio_unitario_con_descuento`, `subtotal_linea_neto`, `tasa_impuesto_linea`, `monto_impuesto_linea`) VALUES
(1, 1, 1, 1.00, 950.00, 0.00, 0.00, 950.00, 950.00, 19.00, 180.50),
(2, 2, 3, 1.00, 2.50, 0.00, 0.00, 2.50, 2.50, 19.00, 0.48),
(3, 2, 5, 1.00, 3.80, 0.00, 0.00, 3.80, 3.80, 19.00, 0.72),
(4, 3, 2, 1.00, 3500.00, 2.86, 100.00, 3400.00, 3400.00, 19.00, 646.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int(11) NOT NULL,
  `nombre_metodo` varchar(50) NOT NULL COMMENT 'Ej: Efectivo, Tarjeta Crédito, Nequi',
  `requiere_referencia` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Si necesita un dato adicional',
  `es_efectivo` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 si este método es efectivo para arqueo',
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Métodos de pago aceptados';

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodo_pago`, `nombre_metodo`, `requiere_referencia`, `es_efectivo`, `activo`) VALUES
(1, 'Efectivo', 0, 1, 1),
(2, 'Tarjeta Débito', 1, 0, 1),
(3, 'Tarjeta Crédito', 1, 0, 1),
(4, 'Nequi', 1, 0, 1),
(5, 'Daviplata', 1, 0, 1),
(6, 'Transferencia Bancaria', 1, 0, 1),
(7, 'Bono/Cupón', 1, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

CREATE TABLE `rol_usuario` (
  `id_rol_usuario` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL COMMENT 'Nombre del rol (ej: Administrador, Cajero)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Roles de usuario en el sistema';

--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`id_rol_usuario`, `nombre_rol`) VALUES
(1, 'Administrador Sistema'),
(3, 'Bodeguero'),
(2, 'Cajero Principal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tercero`
--

CREATE TABLE `tercero` (
  `id_tercero` int(11) NOT NULL,
  `tipo_tercero` enum('Cliente','Proveedor','Otro') NOT NULL COMMENT 'Tipo de tercero',
  `nombre_razon_social` varchar(150) NOT NULL COMMENT 'Nombre completo o razón social',
  `tipo_documento_identidad` varchar(30) DEFAULT NULL COMMENT 'Ej: CC, NIT, RUT, CE, Pasaporte',
  `numero_documento_identidad` varchar(30) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono_contacto` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Clientes, proveedores y otros terceros';

--
-- Volcado de datos para la tabla `tercero`
--

INSERT INTO `tercero` (`id_tercero`, `tipo_tercero`, `nombre_razon_social`, `tipo_documento_identidad`, `numero_documento_identidad`, `direccion`, `telefono_contacto`, `email`, `fecha_registro`, `activo`) VALUES
(1, 'Cliente', 'Juan Carlos Pérez', 'CC', '1022345678', 'Calle 100 # 20-30', '3101234567', 'juan.perez@email.com', '2025-05-27 22:06:52', 1),
(2, 'Cliente', 'Ana María López (Consumidor Final)', 'CC', '1022987654', 'Avenida Siempre Viva 742', '3159876543', 'ana.lopez@email.com', '2025-05-27 22:06:52', 1),
(3, 'Proveedor', 'ElectroTech ', 'RUT', '900123456-6', 'Zona Industrial Montevideo Bodega 5', '6017845026', 'ventas@electrotech.com.co', '2025-05-27 22:06:52', 1),
(4, 'Proveedor', 'Distribuidora Alimentos ABC Ltda.', 'NIT', '800987654-3', 'Carrera 50 # 10-20', '6017654321', 'pedidos@distriabc.com', '2025-05-27 22:06:52', 1),
(6, 'Proveedor', 'Distriabastos LTDA', 'NIT', '800123456-7', 'Calle 10 # 15-20', '3001234567', 'distriabastos@gmail.com', '2025-06-09 08:56:52', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_medida`
--

CREATE TABLE `unidad_medida` (
  `id_unidad_medida` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL COMMENT 'Ej: Unidad, Kilogramo, Litro',
  `abreviatura` varchar(10) NOT NULL COMMENT 'Ej: UND, KG, LT',
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Unidades de medida para artículos';

--
-- Volcado de datos para la tabla `unidad_medida`
--

INSERT INTO `unidad_medida` (`id_unidad_medida`, `nombre`, `abreviatura`, `activa`) VALUES
(1, 'Unidad', 'UND', 1),
(2, 'Paquete', 'PQT', 1),
(3, 'Caja', 'CJ', 1),
(4, 'Docena', 'DOC', 1),
(5, 'Set', 'SET', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL COMMENT 'FK a rol_usuario',
  `nombre_completo` varchar(100) NOT NULL,
  `tipo_documento_identidad` varchar(30) DEFAULT NULL,
  `numero_documento_identidad` varchar(30) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cargo_descripcion` varchar(50) DEFAULT NULL COMMENT 'Descripción del cargo o puesto',
  `login_acceso` varchar(50) NOT NULL COMMENT 'Nombre de usuario para login',
  `password_hash` varchar(255) NOT NULL COMMENT 'Contraseña hasheada',
  `ruta_avatar` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Usuarios del sistema';

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_rol_usuario`, `nombre_completo`, `tipo_documento_identidad`, `numero_documento_identidad`, `telefono`, `email`, `cargo_descripcion`, `login_acceso`, `password_hash`, `ruta_avatar`, `fecha_creacion`, `ultimo_acceso`, `activo`) VALUES
(1, 1, 'Administrador Principal', NULL, NULL, NULL, 'admin@neosystem.com', NULL, 'admin', '$2b$10$clIQUsB4V4yo/YHXacIxWuDRmvdYbjVZIh0yWW9814iEugD5fQHom', NULL, '2025-05-27 22:06:52', NULL, 1),
(2, 2, 'Maria García (Cajera)', NULL, NULL, NULL, 'maria.garcia@neosystem.com', NULL, 'cajero1', '$2b$10$yoSMIwtTN8CTPDWdlt8Awetbdbn.u.daZZvg4OzOkSBxM4oHUws9O', NULL, '2025-05-27 22:06:52', NULL, 1),
(3, 3, 'Carlos Ruiz (Bodega)', NULL, NULL, NULL, 'carlos.ruiz@neosystem.com', NULL, 'bodega1', '$2b$10$86tBVeB/8l.4G6VzjHZhyuHsM/ytbAsHmerSpYZknr6jbKgh0/TPe', NULL, '2025-05-27 22:06:52', NULL, 1),
(4, 1, 'Jose Luis Piñeros', 'Cedula Ciudadania', '1000163533', '3152185937', 'devjose@gmail.com', NULL, '', '$2b$10$x8jsRwn4fH7sHCkJ/5aq5ecu2iAEBXbXpi66rJNij5WpHKJy2.ZtG', NULL, '2025-05-28 19:42:03', '2025-06-11 17:34:59', 1),
(8, 1, 'Andrés de Jesús Mejía Contreras', 'CC', '1083016546', '3187189335', 'amejia@neosystem.com', 'Administrador', 'admin1', '$2b$12$ohh5j8A91aaezMBcJOKUjO2omjh3qPo1nzKlAkHCT47VaBTMaVJyS', NULL, '2025-06-09 01:37:11', '2025-06-09 03:56:29', 1),
(10, 2, 'cajero prubas 01', 'cedula ciudadania', '222222222222222', '3132801187', 'cajero@gmail.com', 'cajero principal', 'cajero', '$2b$12$1DzbqT16xYu37gl5ldrG0.QtIjP640ygZuCDtk1c6U25QkXgWT776', NULL, '2025-06-11 03:38:45', '2025-06-11 15:41:49', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` int(11) NOT NULL,
  `id_tercero_cliente` int(11) NOT NULL COMMENT 'FK a tercero (tipo_tercero=''Cliente'')',
  `id_usuario_vendedor` int(11) NOT NULL COMMENT 'FK a usuario que realiza la venta',
  `id_caja_sesion` int(11) DEFAULT NULL COMMENT 'FK a caja_sesion activa',
  `tipo_comprobante` varchar(50) NOT NULL COMMENT 'Ej: Factura de Venta, Boleta, Ticket POS',
  `serie_comprobante` varchar(20) DEFAULT NULL,
  `numero_comprobante` varchar(30) NOT NULL,
  `fecha_hora_venta` datetime NOT NULL,
  `subtotal_venta_neto` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma de subtotales de línea netos',
  `total_descuentos` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma de descuentos de línea',
  `total_impuestos_venta` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma de impuestos de línea',
  `total_venta_final` decimal(12,2) NOT NULL COMMENT 'subtotal_neto - descuentos + impuestos',
  `tasa_impuesto_general_aplicada` decimal(5,2) DEFAULT 0.00,
  `observaciones` text DEFAULT NULL,
  `estado_venta` enum('Cotizacion','Pendiente de Pago','Pagada','Parcialmente Pagada','Anulada','Devolucion Parcial','Devolucion Total') NOT NULL DEFAULT 'Pagada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Transacciones de venta a clientes';

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_venta`, `id_tercero_cliente`, `id_usuario_vendedor`, `id_caja_sesion`, `tipo_comprobante`, `serie_comprobante`, `numero_comprobante`, `fecha_hora_venta`, `subtotal_venta_neto`, `total_descuentos`, `total_impuestos_venta`, `total_venta_final`, `tasa_impuesto_general_aplicada`, `observaciones`, `estado_venta`) VALUES
(1, 1, 2, 1, 'Factura Electrónica', 'FE-001', '00001', '2025-05-27 09:30:00', 950.00, 0.00, 180.50, 1130.50, 19.00, NULL, 'Pagada'),
(2, 2, 2, 1, 'Ticket POS', 'TK-001', '00002', '2025-05-27 10:15:00', 6.30, 0.30, 1.14, 7.14, 19.00, NULL, 'Pagada'),
(3, 1, 2, 2, 'Factura Electrónica', 'FE-001', '00000', '2025-05-26 11:00:00', 3500.00, 100.00, 646.00, 4046.00, 19.00, NULL, 'Pagada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta_metodo_pago`
--

CREATE TABLE `venta_metodo_pago` (
  `id_venta_metodo_pago` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_metodo_pago` int(11) NOT NULL,
  `monto_pagado` decimal(12,2) NOT NULL,
  `referencia_pago` varchar(100) DEFAULT NULL,
  `fecha_hora_pago` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Métodos de pago utilizados en una venta';

--
-- Volcado de datos para la tabla `venta_metodo_pago`
--

INSERT INTO `venta_metodo_pago` (`id_venta_metodo_pago`, `id_venta`, `id_metodo_pago`, `monto_pagado`, `referencia_pago`, `fecha_hora_pago`) VALUES
(1, 1, 1, 1130.50, NULL, '2025-05-27 22:06:53'),
(2, 2, 4, 5.00, 'TRXN12345NEQUI', '2025-05-27 22:06:53'),
(3, 2, 1, 2.14, NULL, '2025-05-27 22:06:53'),
(4, 3, 2, 4046.00, 'AUTH5678TD', '2025-05-27 22:06:53');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD PRIMARY KEY (`id_articulo`),
  ADD UNIQUE KEY `uq_articulo_codigo_barra` (`codigo_barra`),
  ADD KEY `idx_articulo_nombre` (`nombre`),
  ADD KEY `idx_fk_articulo_categoria` (`id_categoria_articulo`),
  ADD KEY `idx_fk_articulo_unidad_medida` (`id_unidad_medida`);

--
-- Indices de la tabla `caja_fisica`
--
ALTER TABLE `caja_fisica`
  ADD PRIMARY KEY (`id_caja_fisica`),
  ADD UNIQUE KEY `uq_caja_fisica_nombre` (`nombre_caja`);

--
-- Indices de la tabla `caja_sesion`
--
ALTER TABLE `caja_sesion`
  ADD PRIMARY KEY (`id_caja_sesion`),
  ADD KEY `idx_fk_caja_sesion_usuario` (`id_usuario_apertura`),
  ADD KEY `idx_fk_caja_sesion_caja_fisica` (`id_caja_fisica`);

--
-- Indices de la tabla `categoria_articulo`
--
ALTER TABLE `categoria_articulo`
  ADD PRIMARY KEY (`id_categoria_articulo`),
  ADD UNIQUE KEY `uq_categoria_nombre` (`nombre`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_compra`),
  ADD UNIQUE KEY `uq_compra_tipo_serie_numero` (`tipo_comprobante`,`serie_comprobante`,`numero_comprobante`),
  ADD KEY `idx_fk_compra_proveedor` (`id_tercero_proveedor`),
  ADD KEY `idx_fk_compra_usuario` (`id_usuario_registro`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id_detalle_compra`),
  ADD UNIQUE KEY `uq_detalle_compra_compra_articulo` (`id_compra`,`id_articulo`),
  ADD KEY `idx_fk_detalle_compra_articulo` (`id_articulo`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD UNIQUE KEY `uq_detalle_venta_venta_articulo` (`id_venta`,`id_articulo`),
  ADD KEY `idx_fk_detalle_venta_articulo` (`id_articulo`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodo_pago`),
  ADD UNIQUE KEY `uq_metodo_pago_nombre` (`nombre_metodo`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD PRIMARY KEY (`id_rol_usuario`),
  ADD UNIQUE KEY `uq_rol_nombre` (`nombre_rol`);

--
-- Indices de la tabla `tercero`
--
ALTER TABLE `tercero`
  ADD PRIMARY KEY (`id_tercero`),
  ADD UNIQUE KEY `uq_tercero_tipo_num_documento` (`tipo_documento_identidad`,`numero_documento_identidad`),
  ADD KEY `idx_tercero_nombre` (`nombre_razon_social`),
  ADD KEY `idx_tercero_tipo` (`tipo_tercero`);

--
-- Indices de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  ADD PRIMARY KEY (`id_unidad_medida`),
  ADD UNIQUE KEY `uq_unidad_medida_nombre` (`nombre`),
  ADD UNIQUE KEY `uq_unidad_medida_abreviatura` (`abreviatura`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuario_login` (`login_acceso`),
  ADD UNIQUE KEY `uq_usuario_email` (`email`),
  ADD KEY `idx_fk_usuario_rol` (`id_rol_usuario`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD UNIQUE KEY `uq_venta_tipo_serie_numero` (`tipo_comprobante`,`serie_comprobante`,`numero_comprobante`),
  ADD KEY `idx_fk_venta_cliente` (`id_tercero_cliente`),
  ADD KEY `idx_fk_venta_usuario` (`id_usuario_vendedor`),
  ADD KEY `idx_fk_venta_caja_sesion` (`id_caja_sesion`);

--
-- Indices de la tabla `venta_metodo_pago`
--
ALTER TABLE `venta_metodo_pago`
  ADD PRIMARY KEY (`id_venta_metodo_pago`),
  ADD KEY `idx_fk_venta_pago_venta` (`id_venta`),
  ADD KEY `idx_fk_venta_pago_metodo` (`id_metodo_pago`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo`
--
ALTER TABLE `articulo`
  MODIFY `id_articulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `caja_fisica`
--
ALTER TABLE `caja_fisica`
  MODIFY `id_caja_fisica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `caja_sesion`
--
ALTER TABLE `caja_sesion`
  MODIFY `id_caja_sesion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categoria_articulo`
--
ALTER TABLE `categoria_articulo`
  MODIFY `id_categoria_articulo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único de la categoría', AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detalle_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  MODIFY `id_rol_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tercero`
--
ALTER TABLE `tercero`
  MODIFY `id_tercero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  MODIFY `id_unidad_medida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `venta_metodo_pago`
--
ALTER TABLE `venta_metodo_pago`
  MODIFY `id_venta_metodo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD CONSTRAINT `fk_articulo_categoria_articulo` FOREIGN KEY (`id_categoria_articulo`) REFERENCES `categoria_articulo` (`id_categoria_articulo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_articulo_unidad_medida` FOREIGN KEY (`id_unidad_medida`) REFERENCES `unidad_medida` (`id_unidad_medida`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `caja_sesion`
--
ALTER TABLE `caja_sesion`
  ADD CONSTRAINT `fk_caja_sesion_caja_fisica` FOREIGN KEY (`id_caja_fisica`) REFERENCES `caja_fisica` (`id_caja_fisica`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_caja_sesion_usuario_apertura` FOREIGN KEY (`id_usuario_apertura`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `fk_compra_tercero_proveedor` FOREIGN KEY (`id_tercero_proveedor`) REFERENCES `tercero` (`id_tercero`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_compra_usuario_registro` FOREIGN KEY (`id_usuario_registro`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `fk_detalle_compra_articulo` FOREIGN KEY (`id_articulo`) REFERENCES `articulo` (`id_articulo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_compra_compra` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `fk_detalle_venta_articulo` FOREIGN KEY (`id_articulo`) REFERENCES `articulo` (`id_articulo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_venta_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol_usuario` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `fk_venta_caja_sesion` FOREIGN KEY (`id_caja_sesion`) REFERENCES `caja_sesion` (`id_caja_sesion`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_venta_tercero_cliente` FOREIGN KEY (`id_tercero_cliente`) REFERENCES `tercero` (`id_tercero`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_venta_usuario_vendedor` FOREIGN KEY (`id_usuario_vendedor`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `venta_metodo_pago`
--
ALTER TABLE `venta_metodo_pago`
  ADD CONSTRAINT `fk_venta_metodo_pago_metodo_pago` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_venta_metodo_pago_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
