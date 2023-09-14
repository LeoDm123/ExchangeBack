const { Schema, model } = require("mongoose");

const OperacionesSchema = Schema({
  Detalle: {
    type: String,
    required: true,
  },
  Divisa: {
    type: String,
    required: true,
  },
  Monto: {
    type: Number,
    required: true,
  },
  MontoTotal: {
    type: Number,
    required: true,
  },
  Comentarios: {
    type: String,
  },
  Fecha: {
    type: String,
  },
  TipoCambio: {
    type: Number,
    required: true,
  },
  Estado: {
    type: String,
  },
  Email: {
    type: String,
  },
});

module.exports = model("Operaciones", OperacionesSchema);
