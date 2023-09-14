const { Schema, model } = require("mongoose");

const MovimientosSchema = Schema({
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
  Comentarios: {
    type: String,
  },
  Fecha: {
    type: String,
  },
  Email: {
    type: String,
  },
});

module.exports = model("Movimientos", MovimientosSchema);
