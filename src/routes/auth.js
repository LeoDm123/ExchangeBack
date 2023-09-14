const express = require("express");
const {
  crearUsuario,
  loginUsuario,
  getUserByEmail,
  getUsers,
} = require("../controllers/auth.controllers");

//va a ser el nombre del router que definamos
const routerAuth = express.Router();

//peticion get       Req = solicitud, va a estar esperando datos del FrontEnd
routerAuth.post("/crearUsuario", crearUsuario);
routerAuth.post("/login", loginUsuario);
routerAuth.get("/getUserByEmail", getUserByEmail);
routerAuth.get("/getUsers", getUsers);

//module.exports es como vamos a exportar nuestros archivos
module.exports = routerAuth;
