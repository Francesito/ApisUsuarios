import { Router } from "express";
import { 
    register, 
    login, 
    obtenerUsuarios, 
    obtenerUsuarioPorId, 
    borrarUsuarioPorId, 
    actualizarUsuarioPorId,
    obtenerUsuarioLogueado,
    obtenerAdministradores,
    cerrarSesion
} from "../db/usuariosDB.js";
import { verificarToken, esAdministrador } from "../libs/jwt.js";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/registro", async (req, res) => {
    try {
        const respuesta = await register(req.body);
        console.log("Token establecido en cookie para registro:", respuesta.token); // Depuración
        res.cookie("token", respuesta.token, {
            httpOnly: false, // Temporalmente falso para pruebas locales
            secure: false, // Falso para desarrollo
            maxAge: 3600000, // 1 hora
            sameSite: 'lax', // Ajuste para permitir cookies
        }).status(201).json(respuesta);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
    try {
        const respuesta = await login(req.body);
        console.log("Token establecido en cookie para login:", respuesta.token); // Depuración
        res.cookie("token", respuesta.token, {
            httpOnly: false, // Temporalmente falso para pruebas locales
            secure: false, // Falso para desarrollo
            maxAge: 3600000, // 1 hora
            sameSite: 'lax', // Ajuste para permitir cookies
        }).status(200).json(respuesta);
    } catch (error) {
        res.status(401).json({ mensaje: error.message });
    }
});

// Ruta para obtener información del usuario logueado
router.get("/usuarioLogueado", verificarToken, async (req, res) => {
    try {
        console.log("Token recibido desde cookie:", req.cookies.token); // Depuración
        console.log("Token recibido desde Authorization:", req.headers.authorization); // Depuración
        console.log("Usuario autenticado en /usuarioLogueado:", req.user); // Depuración
        const respuesta = await obtenerUsuarioLogueado(req.user.id);
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

// Ruta para obtener todos los administradores (accesible solo por administradores)
router.get("/administradores", verificarToken, esAdministrador, async (req, res) => {
    try {
        console.log("Token recibido desde cookie:", req.cookies.token); // Depuración
        console.log("Usuario autenticado en /administradores:", req.user); // Depuración
        const respuesta = await obtenerAdministradores();
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Ruta para cerrar sesión
router.post("/salir", verificarToken, async (req, res) => {
    try {
        console.log("Usuario cerrando sesión:", req.user); // Depuración
        const respuesta = await cerrarSesion(req.user.id);
        res.clearCookie("token").status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Ruta pública para obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const respuesta = await obtenerUsuarios();
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Ruta para obtener un usuario por ID (requiere autenticación, accesible por todos los logueados)
router.get("/usuarios/:id", verificarToken, async (req, res) => {
    try {
        console.log("Token recibido desde cookie:", req.cookies.token); // Depuración
        console.log("Usuario autenticado en /usuarios/:id:", req.user); // Depuración
        const respuesta = await obtenerUsuarioPorId(req.params.id);
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

// Ruta para borrar un usuario por ID (solo administradores)
router.delete("/usuarios/:id", verificarToken, esAdministrador, async (req, res) => {
    try {
        console.log("Token recibido desde cookie:", req.cookies.token); // Depuración
        console.log("Usuario autenticado en /usuarios/:id (delete):", req.user); // Depuración
        const respuesta = await borrarUsuarioPorId(req.params.id);
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

// Ruta para actualizar un usuario por ID (solo administradores)
router.put("/usuarios/:id", verificarToken, esAdministrador, async (req, res) => {
    try {
        console.log("Token recibido desde cookie:", req.cookies.token); // Depuración
        console.log("Usuario autenticado en /usuarios/:id (put):", req.user); // Depuración
        const respuesta = await actualizarUsuarioPorId(req.params.id, req.body);
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

export default router;