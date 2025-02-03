import crypto from "crypto";

export function encriptarPassword(password){
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt,10,64,"sha512").toString("hex");
    return{
        salt,
        hash
    }
}

export function validarPassword(password, salt, hash){
    const hashEvaluar = crypto.scryptSync(password, salt,10,64,"sha512").toString("hex");
    return hashEvaluar == hash
}
export function usuarioAutorizado(){
    
}
export function adminAutorizado(){
    
}
/*const {salt, hash}= encriptarPassword("abc");
console.log("salt ------->"+salt);//conjunto de caractéres en que se incripta una contraseña
console.log("hash ------->"+hash);//valores con los que se incripta en salt

const aprobado = validarPassword("abe",salt, hash);
console.log("Aprobado "+aprobado);**/

