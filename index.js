import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuariosRutas.js";
import { conectarDB } from "./db/db.js";

const app = express();

// Configura CORS para permitir cookies desde el frontend
app.use(cors({
    origin: 'http://localhost:3001', // Origen del frontend
    credentials: true, // Permite el envío de cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Middleware de depuración para ver las solicitudes
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    console.log("Cuerpo de la solicitud:", req.body);
    console.log("Headers recibidos:", req.headers); // Muestra todos los headers
    console.log("Cookies recibidas:", req.cookies); // Depuración específica de cookies
    next();
});

// Manejo de peticiones preflight OPTIONS
app.options('*', cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}), (req, res) => {
    res.status(200).end(); // Responde al preflight con éxito
});

// Rutas
app.use("/api", usuariosRutas);

// Función para conectar a la base de datos e iniciar el servidor
async function iniciarServidor() {
    try {
        const mensajeDB = await conectarDB();
        console.log(mensajeDB);

        // Iniciar el servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); // Termina el proceso si la conexión falla
    }
}

// Iniciar el servidor
iniciarServidor();