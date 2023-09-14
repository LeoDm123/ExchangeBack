const express = require("express");
const {
  ingresarCapital,
  obtenerDivisas,
  obtenerDivisasOps,
  resetDivisasOps,
  movimientoCapital,
  obtenerMovimientos,
  EditCap,
} = require("../controllers/cap.controllers");

//va a ser el nombre del router que definamos
const routerCap = express.Router();

routerCap.post("/ingresarCapital", ingresarCapital);
routerCap.get("/obtenerDivisas", obtenerDivisas);
routerCap.get("/obtenerDivisasOps", obtenerDivisasOps);
routerCap.put("/resetDivisasOps", resetDivisasOps);
routerCap.post("/movimientoCapital", movimientoCapital);
routerCap.get("/obtenerMovimientos", obtenerMovimientos);
routerCap.put("/EditCap", EditCap);

//module.exports es como vamos a exportar nuestros archivos
module.exports = routerCap;
