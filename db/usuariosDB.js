import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { generarToken } from "../libs/jwt.js";

console.log("Cargando usuariosDB.js...");

// Registrar un nuevo usuario
export async function register(userData) {
    try {
        console.log("Intentando registrar usuario:", userData);
        const { email, username, password, tipo } = userData;
        const usuarioExistente = await User.findOne({ $or: [{ email }, { username }] });
        if (usuarioExistente) {
            console.log("Usuario ya existe:", usuarioExistente);
            throw new Error("El email o nombre de usuario ya está en uso");
        }
        const { salt, hash } = encriptarPassword(password);
        const nuevoUsuario = new User({ ...userData, salt, password: hash });
        await nuevoUsuario.save();
        console.log("Usuario guardado:", nuevoUsuario);
        const token = generarToken({ id: nuevoUsuario._id, tipo: nuevoUsuario.tipo });
        console.log("Token generado en registro:", token);
        return { mensaje: "Usuario registrado exitosamente", token, usuario: nuevoUsuario };
    } catch (error) {
        console.error("Error en register:", error);
        throw new Error(error.message || "Error al registrar el usuario");
    }
}

// Iniciar sesión
export async function login({ email, password }) {
    try {
        console.log("Intentando login con email:", email);
        if (!email || !password) {
            throw new Error("Email y contraseña son requeridos");
        }
        const usuario = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (!usuario) {
            console.log("Usuario no encontrado para email:", email);
            throw new Error("Usuario no encontrado");
        }
        console.log("Usuario encontrado:", usuario);
        const esValido = validarPassword(password, usuario.salt, usuario.password);
        if (!esValido) {
            console.log("Contraseña incorrecta para:", email);
            throw new Error("Contraseña incorrecta");
        }
        const token = generarToken({ id: usuario._id, tipo: usuario.tipo });
        console.log("Token generado en login:", token);
        console.log("Payload del token:", { id: usuario._id, tipo: usuario.tipo });
        console.log("Login exitoso para:", email);
        return { mensaje: "Inicio de sesión exitoso", token, usuario };
    } catch (error) {
        console.error("Error en login:", error);
        throw new Error(error.message || "Error al iniciar sesión");
    }
}

// Obtener todos los usuarios
export async function obtenerUsuarios() {
    try {
        const usuarios = await User.find();
        return { mensaje: "Usuarios obtenidos exitosamente", usuarios };
    } catch (error) {
        throw new Error("Error al obtener los usuarios");
    }
}

// Obtener un usuario por ID
export async function obtenerUsuarioPorId(id) {
    try {
        const usuario = await User.findById(id);
        if (!usuario) throw new Error("Usuario no encontrado");
        return { mensaje: "Usuario obtenido exitosamente", usuario };
    } catch (error) {
        throw new Error(error.message || "Error al obtener el usuario");
    }
}

// Borrar un usuario por ID
export async function borrarUsuarioPorId(id) {
    try {
        const usuario = await User.findByIdAndDelete(id);
        if (!usuario) throw new Error("Usuario no encontrado");
        return { mensaje: "Usuario borrado exitosamente" };
    } catch (error) {
        throw new Error(error.message || "Error al borrar el usuario");
    }
}

// Actualizar un usuario por ID
export async function actualizarUsuarioPorId(id, nuevosDatos) {
    try {
        const usuario = await User.findByIdAndUpdate(id, nuevosDatos, { new: true });
        if (!usuario) throw new Error("Usuario no encontrado");
        return { mensaje: "Usuario actualizado exitosamente", usuario };
    } catch (error) {
        throw new Error(error.message || "Error al actualizar el usuario");
    }
}

// Obtener información del usuario logueado
export async function obtenerUsuarioLogueado(id) {
    try {
        const usuario = await User.findById(id);
        if (!usuario) throw new Error("Usuario no encontrado");
        return { mensaje: "Usuario logueado obtenido exitosamente", usuario };
    } catch (error) {
        throw new Error(error.message || "Error al obtener el usuario logueado");
    }
}

// Obtener todos los administradores
export async function obtenerAdministradores() {
    try {
        const administradores = await User.find({ tipo: "administrador" });
        return { mensaje: "Administradores obtenidos exitosamente", administradores };
    } catch (error) {
        throw new Error("Error al obtener los administradores");
    }
}

// Cerrar sesión
export async function cerrarSesion(id) {
    try {
        return { mensaje: "Sesión cerrada exitosamente" };
    } catch (error) {
        throw new Error("Error al cerrar sesión");
    }
}