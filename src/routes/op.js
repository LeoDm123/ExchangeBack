const express = require("express");
const {
  Operacion,
  OperacionList,
  obtenerOperaciones,
  AcceptOp,
  CancelOp,
  DeleteOp,
  EditOp,
} = require("../controllers/op.controllers");

//va a ser el nombre del router que definamos
const routerOp = express.Router();

routerOp.post("/Operacion", Operacion);
routerOp.post("/OperacionList", OperacionList);
routerOp.get("/obtenerOperaciones", obtenerOperaciones);
routerOp.post("/AcceptOp", AcceptOp);
routerOp.post("/CancelOp", CancelOp);
routerOp.delete("/DeleteOp/:id", DeleteOp);
routerOp.put("/EditOp/:id", EditOp);

//module.exports es como vamos a exportar nuestros archivos
module.exports = routerOp;
