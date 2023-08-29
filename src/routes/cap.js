const express = require("express");
const {
  ingresarCapital,
  obtenerDivisas,
  movimientoCapital,
  obtenerMovimientos,
} = require("../controllers/cap.controllers");

//va a ser el nombre del router que definamos
const routerCap = express.Router();

routerCap.post("/ingresarCapital", ingresarCapital);
routerCap.get("/obtenerDivisas", obtenerDivisas);
routerCap.post("/movimientoCapital", movimientoCapital);
routerCap.get("/obtenerMovimientos", obtenerMovimientos);

//module.exports es como vamos a exportar nuestros archivos
module.exports = routerCap;
