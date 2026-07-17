const axios = require('axios');
const model = require('./model');

const obtenerUF = async () => {
    try {
        const res = await axios.get('https://mindicador.cl/api/uf');
        return res.data.serie[0].valor;
    } catch (error) {
        console.error("Error al obtener la UF:", error);
        return 0;
    }
};

const obtenerTodos = (req, res) => {
    res.json(model.leerDatos());
};

const crearProyecto = async (req, res) => {
    const valorUF = await obtenerUF();
    const costoCalculado = (valorUF * 0.25).toFixed(2);
    
    const { nombre, fechas } = req.body;
    
    const metrics = {
        uf_dia: valorUF,
        costo_025uf: costoCalculado
    };

    const nuevoProyecto = model.crearNuevoProyecto(nombre || "Sin nombre", fechas, metrics);
    
    res.status(201).json(nuevoProyecto);
};

const agregarFase = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const exito = model.agregarFaseAlProyecto(id, nombre);
    
    if (!exito) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.status(201).json({ message: "Fase agregada con éxito" });
};

const agregarTarea = (req, res) => {
    const { id, faseId } = req.params;
    const tareaData = req.body; 
    
    const exito = model.agregarTareaAFase(id, faseId, tareaData);
    
    if (!exito) return res.status(404).json({ message: "Proyecto o fase no encontrados" });
    res.status(201).json({ message: "Tarea agregada con éxito" });
};

// --- NUEVA FUNCIÓN PARA EDITAR TAREAS ---
const editarTarea = (req, res) => {
    const { id, faseId, tareaId } = req.params;
    const tareaData = req.body; 
    
    const exito = model.editarTareaEnFase(id, faseId, tareaId, tareaData);
    
    if (!exito) return res.status(404).json({ message: "Error al actualizar la tarea" });
    res.status(200).json({ message: "Tarea actualizada con éxito" });
};

const eliminarFase = (req, res) => {
    const { id, faseId } = req.params;
    const exito = model.eliminarFaseDelProyecto(id, faseId);
    
    if (!exito) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.status(200).json({ message: "Fase eliminada con éxito" });
};

module.exports = { 
    obtenerTodos, 
    crearProyecto, 
    agregarFase, 
    agregarTarea,
    editarTarea, // Exportamos la nueva función
    eliminarFase 
};