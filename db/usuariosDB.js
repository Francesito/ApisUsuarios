import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { crearToken } from "../libs/jwt.js";

export const register = async ({ username, email, password }) => {
    try {
        const usuarioDuplicado = await User.findOne({ username });
        const emailDuplicado = await User.findOne({ email });
        if (usuarioDuplicado || emailDuplicado) {
            return "Usuario ya existente"; 
        }
        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, email, password: hash, salt });
        const respuestaMongo = await dataUser.save();
        const token = await crearToken({ id: respuestaMongo._id });
        return { mensaje: "Usuario Registrado", token }; 
    } catch (error) {
        return "Error de Registro"; 
    }
};


export const login = async ({ username, password }) => {
    try {
        const usuarioEncontrado = await User.findOne({ username });
        if (!usuarioEncontrado) {
            return "Datos incorrectos";
        }

        const passwordValido = validarPassword(password, usuarioEncontrado.salt, usuarioEncontrado.password);
        if (!passwordValido) {
            return "Datos incorrectos"; 
        }

        const token = await crearToken({ id: usuarioEncontrado._id });
        return { mensaje: `Bienvenido ${usuarioEncontrado.username}`, token };
    } catch (error) {
        return "Error al iniciar sesión";
    }
};


export const obtenerUsuarios = async () => {
    try {
        const usuarios = await User.find();
        return { mensaje: "Usuarios encontrados", usuarios }; 
    } catch (error) {
        return "Error al obtener usuarios"; 
    }
};


export const obtenerUsuarioPorId = async (id) => {
    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return "Usuario no encontrado"; 
        }
        return { mensaje: "Usuario encontrado", usuario }; 
    } catch (error) {
        return "Error al buscar usuario"; 
    }
};

export const borrarUsuarioPorId = async (id) => {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return "Usuario no encontrado";
        }
        return "Usuario borrado correctamente"; 
    } catch (error) {
        return "Error al borrar usuario"; 
    }
};

export const actualizarUsuarioPorId = async (id, datosActualizados) => {
    try {
        const usuario = await User.findById(id);
        if (!usuario) {
            return "Usuario no encontrado"; 
        }

        Object.keys(datosActualizados).forEach(key => {
            usuario[key] = datosActualizados[key];
        });

        await usuario.save();
        return "Datos del usuario actualizados exitosamente"; 
    } catch (error) {
        return "Error al actualizar usuario"; 
    }
};
