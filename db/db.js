import mongoose from "mongoose";
import { mensaje } from "../libs/mensajes.js";

export async function conectarDB() {
    try {
        const conexion = await mongoose.connect("mongodb://localhost:27017/MongoDBApp");
        //console.log(conexion); //Da información de la BD
        return mensaje(200,"Conexión correcta a mongoDB");

    } catch (error) {
        return mensaje(400, "Error de conexión", error);
    }
    
}

conectarDB(); //llamada a la función