// controller.js - Estructura completa para navegador
// Importante: Asegúrate de tener tu archivo en ./data/uf.json

const obtenerUF = async () => {
    try {
        const res = await fetch('../data/uf.json');
        const data = await res.json();
        return data.valor_uf; 
    } catch (error) {
        console.error("Error al obtener la UF:", error);
        return 0;
    }
};

const controller = {
    proyectos: JSON.parse(localStorage.getItem('proyectos')) || [],

    // --- LECTURA ---
    obtenerTodos: () => {
        return controller.proyectos;
    },

    // --- CREACIÓN ---
    crearProyecto: async (nombre, fechas) => {
        const valorUF = await obtenerUF();
        const costoCalculado = (valorUF * 0.25).toFixed(2);
        
        const nuevoProyecto = {
            id: Date.now().toString(),
            nombre: nombre || "Sin nombre",
            fechas: fechas,
            metrics: {
                uf_dia: valorUF,
                costo_025uf: costoCalculado
            },
            fases: []
        };

        controller.proyectos.push(nuevoProyecto);
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return nuevoProyecto;
    },

    // --- ELIMINACIÓN ---
    eliminarProyecto: (id) => {
        controller.proyectos = controller.proyectos.filter(p => p.id !== id);
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return true;
    },

    // --- GESTIÓN DE FASES ---
    agregarFase: (id, nombre) => {
        const proyecto = controller.proyectos.find(p => p.id === id);
        if (!proyecto) return false;
        
        proyecto.fases.push({ id: Date.now().toString(), nombre, tareas: [] });
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return true;
    },

    eliminarFase: (id, faseId) => {
        const proyecto = controller.proyectos.find(p => p.id === id);
        if (!proyecto) return false;
        
        proyecto.fases = proyecto.fases.filter(f => f.id !== faseId);
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return true;
    },

    // --- GESTIÓN DE TAREAS ---
    agregarTarea: (id, faseId, tareaData) => {
        const proyecto = controller.proyectos.find(p => p.id === id);
        const fase = proyecto?.fases.find(f => f.id === faseId);
        if (!fase) return false;
        
        tareaData.id = Date.now().toString();
        fase.tareas.push(tareaData);
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return true;
    },

    editarTarea: (id, faseId, tareaId, tareaData) => {
        const proyecto = controller.proyectos.find(p => p.id === id);
        const fase = proyecto?.fases.find(f => f.id === faseId);
        const tarea = fase?.tareas.find(t => t.id === tareaId);
        if (!tarea) return false;
        
        Object.assign(tarea, tareaData);
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return true;
    },

    eliminarTarea: (id, faseId, tareaId) => {
        const proyecto = controller.proyectos.find(p => p.id === id);
        const fase = proyecto?.fases.find(f => f.id === faseId);
        if (!fase) return false;
        
        fase.tareas = fase.tareas.filter(t => t.id !== tareaId);
        localStorage.setItem('proyectos', JSON.stringify(controller.proyectos));
        return true;
    }
};

export default controller;
