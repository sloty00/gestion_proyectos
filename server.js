const express = require('express');
const cors = require('cors');
const controller = require('./src/controller'); // Asegúrate de que la ruta sea correcta

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas de Proyectos
app.get('/api/proyectos', controller.obtenerTodos);
app.post('/api/proyectos', controller.crearProyecto);

// Rutas de Fases
app.post('/api/proyectos/:id/fases', controller.agregarFase);
app.delete('/api/proyectos/:id/fases/:faseId', controller.eliminarFase);

// Rutas de Tareas
app.post('/api/proyectos/:id/fases/:faseId/tareas', controller.agregarTarea);

// --- RUTA NUEVA PARA EDITAR TAREAS (OBLIGATORIA PARA EL BOTÓN EDITAR) ---
app.put('/api/proyectos/:id/fases/:faseId/tareas/:tareaId', controller.editarTarea);

app.listen(PORT, () => {
    console.log('Servidor activo en http://localhost:' + PORT);
});