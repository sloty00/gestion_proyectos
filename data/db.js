const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'proyectos.json');

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

module.exports = { leerDatos, guardarDatos };