const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/proyectos.json');

// --- Funciones base de persistencia ---
const leerDatos = () => {
    try {
        if (!fs.existsSync(DATA_PATH)) return [];
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (error) {
        return [];
    }
};

const guardarDatos = (datos) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(datos, null, 2));
};

// --- Lógica de Proyectos ---
const crearNuevoProyecto = (nombre, fechas, metrics) => {
    const proyectos = leerDatos();
    const nuevoProyecto = {
        id: Date.now().toString(),
        nombre: nombre,
        fechas: fechas,
        fases: [],
        metrics: metrics
    };
    
    proyectos.push(nuevoProyecto);
    guardarDatos(proyectos);
    return nuevoProyecto;
};

const eliminarProyectoCompleto = (proyectoId) => {
    let proyectos = leerDatos();
    const proyectosFiltrados = proyectos.filter(p => p.id !== proyectoId);
    
    if (proyectos.length !== proyectosFiltrados.length) {
        guardarDatos(proyectosFiltrados);
        return true;
    }
    return false;
};

// --- Lógica de Fases ---
const agregarFaseAlProyecto = (proyectoId, nombreFase) => {
    const proyectos = leerDatos();
    const index = proyectos.findIndex(p => p.id === proyectoId);

    if (index !== -1) {
        const nuevaFase = {
            id: Date.now().toString(),
            nombre: nombreFase,
            tareas: []
        };
        
        proyectos[index].fases.push(nuevaFase);
        guardarDatos(proyectos);
        return true;
    }
    return false;
};

const eliminarFaseDelProyecto = (proyectoId, faseId) => {
    const proyectos = leerDatos();
    const pIndex = proyectos.findIndex(p => p.id === proyectoId);

    if (pIndex !== -1) {
        proyectos[pIndex].fases = proyectos[pIndex].fases.filter(f => f.id !== faseId);
        guardarDatos(proyectos);
        return true;
    }
    return false;
};

// --- Lógica de Tareas ---
const agregarTareaAFase = (proyectoId, faseId, tareaData) => {
    const proyectos = leerDatos();
    const pIndex = proyectos.findIndex(p => p.id === proyectoId);

    if (pIndex !== -1) {
        const fIndex = proyectos[pIndex].fases.findIndex(f => f.id === faseId);
        
        if (fIndex !== -1) {
            const nuevaTarea = {
                id: Date.now().toString(),
                descripcion: tareaData.descripcion,
                horas: parseFloat(tareaData.horas) || 0,
                estado: tareaData.estado
            };
            
            proyectos[pIndex].fases[fIndex].tareas.push(nuevaTarea);
            guardarDatos(proyectos);
            return true;
        }
    }
    return false;
};

const editarTareaEnFase = (proyectoId, faseId, tareaId, newData) => {
    const proyectos = leerDatos();
    const pIndex = proyectos.findIndex(p => p.id === proyectoId);

    if (pIndex !== -1) {
        const fIndex = proyectos[pIndex].fases.findIndex(f => f.id === faseId);
        
        if (fIndex !== -1) {
            const tIndex = proyectos[pIndex].fases[fIndex].tareas.findIndex(t => t.id === tareaId);
            
            if (tIndex !== -1) {
                proyectos[pIndex].fases[fIndex].tareas[tIndex] = {
                    ...proyectos[pIndex].fases[fIndex].tareas[tIndex],
                    descripcion: newData.descripcion,
                    horas: parseFloat(newData.horas) || 0,
                    estado: newData.estado
                };
                
                guardarDatos(proyectos);
                return true;
            }
        }
    }
    return false;
};

const eliminarTareaDeFase = (proyectoId, faseId, tareaId) => {
    const proyectos = leerDatos();
    const pIndex = proyectos.findIndex(p => p.id === proyectoId);

    if (pIndex !== -1) {
        const fIndex = proyectos[pIndex].fases.findIndex(f => f.id === faseId);
        
        if (fIndex !== -1) {
            proyectos[pIndex].fases[fIndex].tareas = proyectos[pIndex].fases[fIndex].tareas.filter(
                t => t.id !== tareaId
            );
            
            guardarDatos(proyectos);
            return true;
        }
    }
    return false;
};

module.exports = { 
    leerDatos, 
    guardarDatos,
    crearNuevoProyecto,
    eliminarProyectoCompleto,
    agregarFaseAlProyecto, 
    eliminarFaseDelProyecto,
    agregarTareaAFase,
    editarTareaEnFase,
    eliminarTareaDeFase
};