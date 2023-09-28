const express = require("express");
const {
  ingresarCapital,
  obtenerDivisas,
  obtenerDivisasOps,
  resetDivisasOps,
  movimientoCapital,
  obtenerMovimientos,
  EditCap,
  EditMovimiento,
  DeleteMov,
} = require("../controllers/cap.controllers");

const routerCap = express.Router();

routerCap.post("/ingresarCapital", ingresarCapital);
routerCap.get("/obtenerDivisas", obtenerDivisas);
routerCap.get("/obtenerDivisasOps", obtenerDivisasOps);
routerCap.put("/resetDivisasOps", resetDivisasOps);
routerCap.post("/movimientoCapital", movimientoCapital);
routerCap.get("/obtenerMovimientos", obtenerMovimientos);
routerCap.put("/EditCap", EditCap);
routerCap.put("/EditMovimiento/:id", EditMovimiento);
routerCap.delete("/DeleteMov/:id", DeleteMov);

module.exports = routerCap;
