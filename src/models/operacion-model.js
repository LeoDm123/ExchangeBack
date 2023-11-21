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
  TipoCambio: {
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
  Email: {
    type: String,
  },
  Estado: {
    type: String,
  },
  Fecha: {
    type: String,
  },
});

module.exports = model("Operaciones", OperacionesSchema);
