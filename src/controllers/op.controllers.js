const Operaciones = require("../models/operacion-model");
const Divisas = require("../models/divisas-model");
const DivisasOp = require("../models/divisasOp-model");

const Operacion = async (req, res) => {
  try {
    const {
      Detalle,
      Divisa,
      Monto,
      TipoCambio,
      Estado,
      MontoTotal,
      Comentarios,
      Email,
    } = req.body;

    const SwAlert = () => {
      swal({
        title: "¡Error!",
        text: "Fondos Insuficientes",
        icon: "error",
      });
    };

    const divisas = await Divisas.findOne();
    let divisasOp = await DivisasOp.findOne();

    if (Detalle === "Compra") {
      if (Divisa === "USD" || Divisa === "EUR") {
        if (divisas.Pesos - MontoTotal >= 0) {
          divisas.Pesos = (divisas.Pesos || 0) - MontoTotal;
          divisasOp.Pesos = (divisasOp.Pesos || 0) + MontoTotal;
        } else {
          return res.status(500).json({ message: "Fondos insuficientes" });
        }
      } else {
        return res.status(400).json({ message: "Invalid currency specified" });
      }
    } else {
      if (Divisa === "USD") {
        if (divisas.Dolares - Monto >= 0) {
          divisas.Dolares = (divisas.Dolares || 0) - Monto;
          divisasOp.Dolares = (divisasOp.Dolares || 0) + Monto;
        } else {
          return res.status(500).json({ message: "Fondos insuficientes" });
        }
      } else if (Divisa === "EUR") {
        if (divisas.Dolares - Monto >= 0) {
          divisas.Euros = (divisas.Euros || 0) - Monto;
          divisasOp.Euros = (divisasOp.Euros || 0) + Monto;
        } else {
          return res.status(500).json({ message: "Fondos insuficientes" });
        }
      }
    }

    const newOperacion = new Operaciones({
      Detalle,
      Divisa,
      Monto,
      Comentarios,
      TipoCambio,
      MontoTotal,
      Email,
      Estado: "Activa",
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
      await divisasOp.save({ session });
      await newOperacion.save({ session });

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

const AcceptOp = async (req, res) => {
  try {
    const { Detalle, Divisa, Monto, MontoTotal, _id } = req.body;

    const divisas = await Divisas.findOne();
    let divisasOp = await DivisasOp.findOne();

    if (Detalle === "Compra") {
      if (Divisa === "USD") {
        divisas.Dolares = (divisas.Dolares || 0) + Monto;
        divisasOp.Pesos = (divisasOp.Pesos || 0) - MontoTotal;
      } else if (Divisa === "EUR") {
        divisas.Euros = (divisas.Euros || 0) + Monto;
        divisasOp.Pesos = (divisasOp.Pesos || 0) - MontoTotal;
      } else {
        return res.status(400).json({ message: "Invalid currency specified" });
      }
    } else {
      if (Divisa === "USD") {
        divisasOp.Dolares = (divisasOp.Dolares || 0) - Monto;
        divisas.Pesos = (divisas.Pesos || 0) + MontoTotal;
      } else if (Divisa === "EUR") {
        divisasOp.Euros = (divisasOp.Euros || 0) - Monto;
        divisas.Pesos = (divisas.Pesos || 0) + MontoTotal;
      }
    }

    const updatedOperation = await Operaciones.findOneAndUpdate(
      { _id: _id },
      { Estado: "Realizada" },
      { new: true }
    );

    const session = await Divisas.startSession();
    session.startTransaction();

    try {
      await divisas.save({ session });
      await divisasOp.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        message:
          "Operation accepted and capital information saved successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error(error);
      return res
        .status(500)
        .json({ message: "Error processing operation and saving data" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const CancelOp = async (req, res) => {
  try {
    const { Detalle, Divisa, Monto, MontoTotal, _id } = req.body;

    const divisas = await Divisas.findOne();
    let divisasOp = await DivisasOp.findOne();

    if (Detalle === "Venta") {
      if (Divisa === "USD") {
        divisas.Dolares = (divisas.Dolares || 0) + Monto;
        divisasOp.Dolares = (divisasOp.Dolares || 0) - Monto;
      } else if (Divisa === "EUR") {
        divisas.Euros = (divisas.Euros || 0) + Monto;
        divisasOp.Euros = (divisasOp.Euros || 0) - Monto;
      } else {
        return res.status(400).json({ message: "Invalid currency specified" });
      }
    } else {
      if (Detalle === "Compra") {
        if (Divisa === "USD") {
          divisasOp.Pesos = (divisasOp.Pesos || 0) - MontoTotal;
          divisas.Pesos = (divisas.Pesos || 0) + MontoTotal;
        } else if (Divisa === "EUR") {
          divisasOp.Pesos = (divisasOp.Pesos || 0) - MontoTotal;
          divisas.Pesos = (divisas.Pesos || 0) + MontoTotal;
        }
      }
    }

    const updatedOperation = await Operaciones.findOneAndUpdate(
      { _id: _id },
      { Estado: "Cancelada" },
      { new: true }
    );

    const session = await Divisas.startSession();
    session.startTransaction();

    try {
      await divisas.save({ session });
      await divisasOp.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        message: "Operation canceled successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error(error);
      return res
        .status(500)
        .json({ message: "Error processing operation and saving data" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteOp = async (req, res) => {
  try {
    const deletedOperation = await Operaciones.findByIdAndDelete(req.params.id);

    if (!deletedOperation) {
      return res.status(404).json({ message: "Operation not found" });
    }

    return res.status(200).json({ message: "Operation deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const obtenerOperaciones = async (req, res) => {
  try {
    // Fetch all currency documents from the database
    const operaciones = await Operaciones.find();

    if (!operaciones) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    // Return the array of currency documents
    return res.status(200).json(operaciones);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const EditOp = async (req, res) => {
  try {
    const operationId = req.params.id;
    const updatedOperationData = req.body;

    // Buscar la operación por su ID y actualizarla con los nuevos datos
    const updatedOperation = await Operaciones.findByIdAndUpdate(
      operationId,
      updatedOperationData,
      { new: true } // Esto devuelve la operación actualizada
    );

    res.json(updatedOperation); // Devuelve la operación actualizada como respuesta
  } catch (error) {
    console.error("Error al editar la operación:", error);
    res.status(500).json({ error: "Error al editar la operación" });
  }
};

module.exports = {
  Operacion,
  obtenerOperaciones,
  AcceptOp,
  CancelOp,
  DeleteOp,
  EditOp,
};
