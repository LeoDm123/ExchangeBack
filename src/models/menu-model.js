const { Schema, model } = require("mongoose");

const MenuSchema = Schema({
  Descripcion: {
    type: String,
    required: true,
  },
  Monto: {
    type: Number,
    required: true,
  },
  Nombre: {
    type: String,
    required: true,
  },
  Unidades: {
    type: Number,
    required: true,
  },
});

module.exports = model("Menu", MenuSchema);
