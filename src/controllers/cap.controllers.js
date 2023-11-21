const Divisas = require("../models/divisas-model");
const DivisasOps = require("../models/divisasOp-model");
const Movimientos = require("../models/movimiento-model");

const ingresarCapital = async (req, res) => {
  const { moneda, monto } = req.body;

  try {
    let divisas = await Divisas.findOne();

    if (!divisas) {
      divisas = new Divisas();
    }

    divisas.Euros = divisas.Euros || 0;
    divisas.Pesos = divisas.Pesos || 0;
    divisas.Dolares = divisas.Dolares || 0;

    if (moneda === "USD") {
      divisas.Dolares = (divisas.Dolares || 0) + monto;
    } else if (moneda === "ARS") {
      divisas.Pesos = (divisas.Pesos || 0) + monto;
    } else if (moneda === "EUR") {
      divisas.Euros = (divisas.Euros || 0) + monto;
    } else {
      return res.status(400).json({ message: "Invalid currency specified" });
    }

    await divisas.save();

    return res
      .status(200)
      .json({ message: "Currency amount updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const movimientoCapital = async (req, res) => {
  try {
    const { Detalle, Divisa, Monto, Comentarios, Email } = req.body;

    const divisas = await Divisas.findOne();

    if (!divisas) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    let updatedMonto = Monto;

    if (
      Detalle === "Retiro Cap." ||
      Detalle === "Devolucion" ||
      Detalle === "Gasto Op."
    ) {
      updatedMonto = -Monto;
    } else if (
      Detalle === "Ingreso Cap." ||
      Detalle === "Prestamo" ||
      Detalle === "Ingreso Op."
    ) {
      updatedMonto = Monto;
    } else if (
      Detalle !== "Retiro Cap." ||
      Detalle !== "Devolucion" ||
      Detalle !== "Gasto Op." ||
      Detalle !== "Ingreso Cap." ||
      Detalle !== "Ingreso Op." ||
      Detalle !== "Prestamo"
    ) {
      return res.status(400).json({ message: "Invalid detail specified" });
    }

    console.log(Divisa.Dolares + updatedMonto);

    if (Divisa === "USD") {
      if (divisas.Dolares + updatedMonto >= 0) {
        divisas.Dolares = (divisas.Dolares || 0) + updatedMonto;
      } else {
        return res.status(500).json({ message: "Fondos insuficientes" });
      }
    } else if (Divisa === "ARS") {
      if (divisas.Pesos + updatedMonto >= 0) {
        divisas.Pesos = (divisas.Pesos || 0) + updatedMonto;
      } else {
        return res.status(500).json({ message: "Fondos insuficientes" });
      }
    } else if (Divisa === "EUR") {
      if (divisas.Euros + updatedMonto >= 0) {
        divisas.Euros = (divisas.Euros || 0) + updatedMonto;
      } else {
        return res.status(500).json({ message: "Fondos insuficientes" });
      }
    } else {
      return res.status(400).json({ message: "Invalid currency specified" });
    }

    const newMovimiento = new Movimientos({
      Detalle,
      Divisa,
      Monto: updatedMonto,
      Comentarios,
      Email,
      Fecha: new Date().toLocaleString("en-US", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });

    const session = await Divisas.startSession();
    session.startTransaction();

    try {
      await divisas.save({ session });
      await newMovimiento.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res
        .status(201)
        .json({ message: "Capital information saved successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const obtenerDivisas = async (req, res) => {
  try {
    // Fetch the current currency document from the database
    const divisas = await Divisas.findOne();

    if (!divisas) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    // Extract the currency amounts from the retrieved document
    const { Pesos, Dolares, Euros } = divisas;

    return res.status(200).json({
      Pesos: Pesos || 0,
      Dolares: Dolares || 0,
      Euros: Euros || 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const obtenerDivisasOps = async (req, res) => {
  try {
    // Fetch the current currency document from the database
    const divisasOps = await DivisasOps.findOne();

    if (!divisasOps) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    // Extract the currency amounts from the retrieved document
    const { Pesos, Dolares, Euros } = divisasOps;

    return res.status(200).json({
      Pesos: Pesos || 0,
      Dolares: Dolares || 0,
      Euros: Euros || 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetDivisasOps = async (req, res) => {
  try {
    const divisasOps = await DivisasOps.findOne();

    if (!divisasOps) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    divisasOps.Pesos = 0;
    divisasOps.Dolares = 0;
    divisasOps.Euros = 0;

    await divisasOps.save();

    return res.status(200).json({
      message: "Currency data updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const obtenerMovimientos = async (req, res) => {
  try {
    // Fetch all currency documents from the database
    const movimientos = await Movimientos.find();

    if (!movimientos) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    // Return the array of currency documents
    return res.status(200).json(movimientos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const EditCap = async (req, res) => {
  const { moneda, monto } = req.body;

  if (!moneda || !monto || isNaN(monto)) {
    return res.st;
    atus(400).json({ error: "Datos inválidos" });
  }

  try {
    let updateField;
    if (moneda === "USD") {
      updateField = "Dolares";
    } else if (moneda === "ARS") {
      updateField = "Pesos";
    } else if (moneda === "EUR") {
      updateField = "Euros";
    }

    const result = await Divisas.findOneAndUpdate(
      {},
      { $set: { [updateField]: parseFloat(monto) } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Divisa no encontrada" });
    }

    return res.json({ message: "Monto actualizado con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const EditMovimiento = async (req, res) => {
  try {
    const movimientoId = req.params.id;
    const updatedMovimientoData = req.body;

    const updatedMovimiento = await Movimientos.findByIdAndUpdate(
      movimientoId,
      updatedMovimientoData,
      { new: true }
    );

    res.json(updatedMovimiento);
  } catch (error) {
    console.error("Error al editar la operación:", error);
    res.status(500).json({ error: "Error al editar la operación" });
  }
};

const DeleteMov = async (req, res) => {
  try {
    const deletedMovimiento = await Movimientos.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMovimiento) {
      return res.status(404).json({ message: "Operation not found" });
    }

    return res.status(200).json({ message: "Operation deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  ingresarCapital,
  obtenerDivisas,
  obtenerDivisasOps,
  resetDivisasOps,
  movimientoCapital,
  obtenerMovimientos,
  EditCap,
  EditMovimiento,
  DeleteMov,
};
