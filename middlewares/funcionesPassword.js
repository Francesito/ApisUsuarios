import crypto from "crypto";

export function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return { salt, hash };
}

export function validarPassword(password, salt, hash) {
    const hashEvaluar = crypto.scryptSync(password, salt, 64).toString("hex");
    return hashEvaluar === hash;
}

export function usuarioAutorizado() {
    throw new Error("Función no implementada");
}

export function adminAutorizado() {
    throw new Error("Función no implementada");
}