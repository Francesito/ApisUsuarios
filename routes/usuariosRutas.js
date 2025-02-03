import { Router } from "express";
import { register, login, obtenerUsuarios, obtenerUsuarioPorId, borrarUsuarioPorId, actualizarUsuarioPorId } from "../db/usuariosDB.js";

const router = Router();

router.post("/registro", async (req, res) => {
    const respuesta = await register(req.body);
    res.cookie("token", respuesta.token).status(200).json(respuesta.mensaje); 
});

router.post("/login", async (req, res) => {
    const respuesta = await login(req.body);
    res.cookie("token", respuesta.token).status(200).json(respuesta.mensaje); 
});

router.get("/usuarios", async (req, res) => {
    const respuesta = await obtenerUsuarios();
    res.status(200).json({ mensaje: respuesta.mensaje, usuarios: respuesta.usuarios });
});

router.get("/usuarios/:id", async (req, res) => {
    const respuesta = await obtenerUsuarioPorId(req.params.id);
    res.status(200).json({ mensaje: respuesta.mensaje, usuario: respuesta.usuario });
});

router.delete("/usuarios/:id", async (req, res) => {
    const respuesta = await borrarUsuarioPorId(req.params.id);
    res.status(200).json({ mensaje: respuesta });
});

router.put("/usuarios/:id", async (req, res) => {
    const respuesta = await actualizarUsuarioPorId(req.params.id, req.body);
    res.status(200).json({ mensaje: respuesta }); 
});

export default router;
