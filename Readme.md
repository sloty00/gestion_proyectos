# Sistema de Gestión de Proyectos | DEVNOD-INC

Este es un panel de control profesional diseñado para la gestión integral de proyectos, optimizado para el seguimiento de tiempos, facturación dinámica y control de avance por fases.

## 🚀 Descripción del Proyecto
El **Gestor de Proyectos de Devnod-Inc** es una solución técnica robusta enfocada en la transparencia operativa y la eficiencia en el desarrollo. La herramienta permite centralizar la creación de proyectos, la estructuración por fases de trabajo y el control granular de tareas.

## 🏗️ Patrón de Diseño: MVC
El sistema ha sido estructurado bajo el patrón **Modelo-Vista-Controlador (MVC)**, garantizando una separación clara de responsabilidades:

* **Modelo (`src/model.js` y `data/`):** Gestiona la estructura, el estado y la persistencia de la información de los proyectos en formato JSON.
* **Vista (`public/index.html`):** Encargada de la representación visual del dashboard, modales y la interfaz del usuario utilizando componentes de Bootstrap 5.
* **Controlador (`src/controller.js` y `public/app.js`):** Intermediario que procesa la lógica de negocio, manipula el DOM, gestiona las peticiones asíncronas y ejecuta los cálculos automáticos de métricas.

Además, implementamos un enfoque **Data-Driven**, donde la interfaz responde dinámicamente a los cambios en el modelo de datos, permitiendo actualizaciones fluidas del estado del proyecto.

## 🛠 Características Técnicas
* **Gestión de Tiempos y Facturación Automática:** Cálculo automático de **UF Totales** mediante la sumatoria en tiempo real de las horas hombre (H/H) registradas.
* **Conversión de moneda:** Integración de cálculo (UF a CLP) para visualización de costos.
* **Monitoreo de Avance:** Indicadores de progreso global y por fase de trabajo.
* **Interfaz Responsiva:** Diseño oscuro profesional bajo el ecosistema Devnod-Inc.

## 📋 Funcionalidades Principales
* **Dashboard Centralizado:** Visualización rápida de estados, plazos y facturación.
* **Edición en Tiempo Real:** Modales optimizados para actualizar tareas rápidamente.
* **Estructura Jerárquica:** Organización de proyectos mediante múltiples fases y tareas individuales.

## 📁 Estructura del Proyecto
```text
gestion_proyectos/
├── data/
│   ├── db.js
│   └── proyectos.json       # Base de datos persistente
├── public/
|   ├── images/
|   |   └── devnod_logo.png      # Identidad visual
│   ├── app.js               # Controlador Frontend y cálculos
│   ├── index.html           # Vista principal
│   └── style.css            # Estilos personalizados
├── src/
│   ├── controller.js        # Lógica de servidor
│   └── model.js             # Definición de datos
└── server.js                # Servidor backend

*Desarrollado para Devnod-Inc. Optimización de flujos de trabajo con tecnología de vanguardia.*