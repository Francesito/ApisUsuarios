import jwt from "jsonwebtoken";

const SECRETO = process.env.JWT_SECRET || "mi_secreto_super_seguro";
const STATIC_TOKEN = "KSjsjdbbkirjbckjs545186dgS"; // Token estático (opcional)

export function generarToken(payload) {
    return jwt.sign(payload, SECRETO, { expiresIn: "1h" });
}

export function verificarTokenSimple(token) {
    try {
        return jwt.verify(token, SECRETO);
    } catch (error) {
        return null;
    }
}

export function verificarToken(req, res, next) {
    let token = req.cookies.token; // Intenta obtener el token de las cookies
    console.log("Token desde req.cookies.token:", token);

    // Si no hay token en cookies, intenta desde Authorization
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]; // Formato: Bearer <token>
        console.log("Token desde Authorization:", token);
    }

    // Si no hay token, revisa el header Cookie crudo
    if (!token && req.headers.cookie) {
        const cookieString = req.headers.cookie;
        console.log("Cookie cruda recibida:", cookieString);
        const cookies = cookieString.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) acc[key] = value;
            return acc;
        }, {});
        token = cookies.token || cookieString;
        console.log("Token extraído de Cookie header:", token);
    }

    if (!token) {
        console.log("No se encontró token en ninguna fuente. Headers:", req.headers);
        return res.status(401).json({ mensaje: "Acceso no autorizado" });
    }

    // Verifica si es el token estático
    if (token === STATIC_TOKEN) {
        console.log("Token estático detectado:", token);
        req.user = {
            id: "67d11fd4a701f3cbc85b5eee", // ID del administrador
            tipo: "administrador",
        };
        console.log("Usuario asignado manualmente:", req.user);
        return next();
    }

    // Verifica el token JWT
    try {
        const usuario = jwt.verify(token, SECRETO);
        console.log("Usuario decodificado del token:", usuario);
        req.user = usuario;
        next();
    } catch (error) {
        console.error("Error al verificar token:", error.message);
        return res.status(401).json({ mensaje: "Token inválido" });
    }
}

export function esAdministrador(req, res, next) {
    console.log("Verificando si es administrador. Tipo de usuario:", req.user?.tipo);
    if (!req.user || req.user.tipo !== "administrador") {
        console.log("Acceso denegado: no es administrador");
        return res.status(403).json({ mensaje: "Acceso denegado: se requiere ser administrador" });
    }
    next();
}