import controller from '../src/controller.js';

// --- ASIGNACIÓN AL OBJETO WINDOW (Necesario para los onclick del HTML) ---
window.eliminarProyecto = eliminarProyecto;
window.eliminarTarea = eliminarTarea;
window.eliminarFase = eliminarFase;
window.abrirModalTarea = abrirModalTarea;
window.agregarFase = agregarFase;
window.iniciarEdicion = iniciarEdicion;
window.guardarEdicion = guardarEdicion;
window.guardarProyecto = guardarProyecto;

// Helper para calcular días restantes
function calcularDiasLibres(finProyectado) {
    const fin = new Date(finProyectado);
    const hoy = new Date();
    const diferencia = fin - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias > 0 ? `${dias} días libres` : "Vencido";
}

// Función principal de carga
async function cargarProyectos() {
    const proyectos = controller.obtenerTodos();
    const container = document.getElementById('proyectos-container');
    container.className = "d-flex flex-column gap-4 w-100";
    
    // Obtenemos UF desde el método del objeto controller
    const VALOR_UF = await controller.obtenerUF();

    container.innerHTML = proyectos.map(p => {
        let totalTareas = 0;
        let completadas = 0;
        let totalHoras = 0;

        p.fases.forEach(f => {
            totalTareas += f.tareas.length;
            f.tareas.forEach(t => {
                totalHoras += parseFloat(t.horas) || 0;
                if (t.estado === "COMPLETADA") completadas++;
            });
        });

        const totalUF = totalHoras * 0.25;
        const totalCLP = totalUF * VALOR_UF;
        const porcentajeGlobal = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

        return `
        <div class="card p-4 border-0 bg-dark text-white shadow-lg" style="border-left: 5px solid #00f2ff;">
            <div class="d-flex justify-content-between mb-3">
                <h3 class="fw-bold text-info">${p.nombre}</h3>
                <div class="text-end">
                    <small class="text-secondary" style="font-size: 0.7rem;">TÉRMINO PROYECTADO</small>
                    <div class="d-flex align-items-center justify-content-end gap-2">
                        <span class="fw-bold">${p.fechas?.finProyectado || 'N/A'}</span>
                        <button class="btn btn-sm btn-outline-danger py-0" onclick="eliminarProyecto('${p.id}')">X</button>
                    </div>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-md-3">
                    <small class="text-secondary" style="font-size: 0.7rem;">PLAZOS</small>
                    <div>${p.fechas?.inicio} / ${p.fechas?.finProyectado}</div>
                </div>
                <div class="col-md-3">
                    <small class="text-secondary" style="font-size: 0.7rem;">ESTADO DE DÍAS</small>
                    <div class="text-success fw-bold">${calcularDiasLibres(p.fechas?.finProyectado)}</div>
                </div>
                <div class="col-md-3">
                    <small class="text-secondary" style="font-size: 0.7rem;">FACTURACIÓN TOTAL</small>
                    <div class="text-info fw-bold">${totalUF.toFixed(2)} UF</div>
                    <div class="text-success">$${Math.round(totalCLP).toLocaleString('es-CL')} CLP</div>
                </div>
                <div class="col-md-3">
                    <small class="text-secondary" style="font-size: 0.7rem;">AVANCE GLOBAL</small>
                    <div class="fw-bold">${porcentajeGlobal}%</div>
                    <div class="progress mt-1" style="height: 8px; background: #333;">
                        <div class="progress-bar" style="width: ${porcentajeGlobal}%; background-color: #00f2ff;"></div>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                ${p.fases.map(fase => {
                    const compFase = fase.tareas.filter(t => t.estado === "COMPLETADA").length;
                    const porcFase = fase.tareas.length > 0 ? Math.round((compFase / fase.tareas.length) * 100) : 0;
                    return `
                    <div class="card bg-dark border-secondary mb-3">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="m-0 text-secondary">FASE: ${fase.nombre}</h5>
                                <div>
                                    <button class="btn btn-sm btn-success me-2" onclick="abrirModalTarea('${p.id}', '${fase.id}')">+ Tarea</button>
                                    <span class="fw-bold text-success me-2">${porcFase}%</span>
                                    <button class="btn btn-sm btn-danger py-0" onclick="eliminarFase('${p.id}', '${fase.id}')">X</button>
                                </div>
                            </div>
                            ${fase.tareas.map(t => `
                                <div class="d-flex justify-content-between align-items-center border-top border-secondary pt-2">
                                    <span class="${t.estado === 'COMPLETADA' ? 'text-decoration-line-through text-secondary' : 'text-white'}">• ${t.descripcion}</span>
                                    <div>
                                        <span class="badge ${t.estado === 'COMPLETADA' ? 'bg-info' : 'bg-warning'} text-dark">${t.horas} hrs | ${t.estado}</span>
                                        <button class="btn btn-sm btn-outline-info ms-2 py-0" onclick="iniciarEdicion('${p.id}', '${fase.id}', '${t.id}', '${t.descripcion}', ${t.horas}, '${t.estado}')">Editar</button>
                                        <button class="btn btn-sm btn-danger ms-1 py-0" onclick="eliminarTarea('${p.id}', '${fase.id}', '${t.id}')">X</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <button class="btn btn-sm btn-outline-primary w-100" onclick="agregarFase('${p.id}')">+ Agregar fase</button>
        </div>`;
    }).join('');
}

async function guardarProyecto() {
    const nombre = document.getElementById('nombreProyecto').value;
    const inicio = document.getElementById('fechaInicio').value;
    const finProyectado = document.getElementById('fechaFin').value;

    if (!nombre || !inicio || !finProyectado) {
        alert("Por favor completa todos los campos.");
        return;
    }

    await controller.crearProyecto(nombre, { inicio, finProyectado });
    
    document.getElementById('nombreProyecto').value = '';
    document.getElementById('fechaInicio').value = '';
    document.getElementById('fechaFin').value = '';
    cargarProyectos();
}

function iniciarEdicion(pId, fId, tId, desc, horas, estado) {
    document.getElementById('edit-pId').value = pId;
    document.getElementById('edit-fId').value = fId;
    document.getElementById('edit-tId').value = tId;
    document.getElementById('edit-desc').value = desc;
    document.getElementById('edit-horas').value = horas;
    document.getElementById('edit-estado').value = estado;
    new bootstrap.Modal(document.getElementById('modalEditar')).show();
}

async function guardarEdicion() {
    const pId = document.getElementById('edit-pId').value;
    const fId = document.getElementById('edit-fId').value;
    const tId = document.getElementById('edit-tId').value;
    const descripcion = document.getElementById('edit-desc').value;
    const horas = document.getElementById('edit-horas').value;
    const estado = document.getElementById('edit-estado').value;

    controller.editarTarea(pId, fId, tId, { descripcion, horas: parseFloat(horas), estado });
    bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
    cargarProyectos();
}

async function eliminarProyecto(pId) {
    if (!confirm('¿Eliminar proyecto?')) return;
    controller.eliminarProyecto(pId);
    cargarProyectos();
}

async function eliminarTarea(pId, fId, tId) {
    if (!confirm('¿Eliminar tarea?')) return;
    controller.eliminarTarea(pId, fId, tId);
    cargarProyectos();
}

async function eliminarFase(pId, fId) {
    if (!confirm('¿Eliminar fase?')) return;
    controller.eliminarFase(pId, fId);
    cargarProyectos();
}

async function abrirModalTarea(pId, fId) {
    const descripcion = prompt("Descripción:");
    if (!descripcion) return;
    const horas = prompt("Horas:", "0");
    controller.agregarTarea(pId, fId, { descripcion, horas, estado: "En Proceso" });
    cargarProyectos();
}

async function agregarFase(pId) {
    const nombre = prompt("Nombre de la fase:");
    if (!nombre) return;
    controller.agregarFase(pId, nombre);
    cargarProyectos();
}

// Inicialización
cargarProyectos();
