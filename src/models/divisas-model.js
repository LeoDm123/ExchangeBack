const { Schema, model } = require("mongoose");

const DivisasSchema = Schema({
  Dolares: {
    type: Number,
    required: true,
  },
  Pesos: {
    type: Number,
    required: true,
  },
  Euros: {
    type: Number,
    required: true,
  },
});

module.exports = model("Divisas", DivisasSchema);
