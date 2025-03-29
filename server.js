const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
async function conectarMongoDB() {
    try {
        await mongoose.connect("mongodb+srv://bherrera05:WcKQNFbFs9lNQNL7@cluster0.g1alhpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Conectado a MongoDB Atlas");
        iniciarServidor();
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1); 
    }
}

const DatosSchema = new mongoose.Schema({
    corriente1: Number,
    corriente2: Number,
    potencia1: Number,
    potencia2: Number,
    potenciaTotal: Number,
    relay1State: Boolean,
    relay2State: Boolean,
    fecha: { type: Date, default: Date.now }
});
const Datos = mongoose.model("Datos", DatosSchema);

// Ruta para recibir datos del ESP32
app.post("/datos", async (req, res) => {
    console.log("Datos recibidos:", req.body);

    try {
        const nuevoDato = new Datos(req.body);
        await nuevoDato.save();
        res.status(201).json({ mensaje: "Datos almacenados con éxito" });
    } catch (error) {
        console.error("Error guardando datos:", error);
        res.status(500).json({ error: "Error al guardar los datos" });
    }
});

// Ruta para ver los datos guardados
app.get("/datos", async (req, res) => {
    try {
        const datos = await Datos.find().sort({ fecha: -1 });
        res.json(datos);
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        res.status(500).json({ error: "Error obteniendo los datos" });
    }
});

// Iniciar servidor después de conectar a MongoDB
function iniciarServidor() {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
        console.log("Servidor corriendo en http://0.0.0.0:${PORT}");
    });
}

// Llamar a la función de conexión
conectarMongoDB();