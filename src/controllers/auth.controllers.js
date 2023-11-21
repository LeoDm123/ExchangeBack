const Usuarios = require("../models/usuario-model");
const bcrypt = require("bcrypt");

const crearUsuario = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let usuario = await Usuarios.findOne({ email });
    console.log(usuario);

    if (usuario) {
      return res.json({
        msg: "El email que intenta registrase ya existe",
      });
    }

    usuario = new Usuarios(req.body);

    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    res.json({
      msg: "Usuario Registrado",
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validacion si existe el usuario
    let usuario = await Usuarios.findOne({ email });

    //si el usuario no existe
    if (!usuario) {
      return res.json({
        msg: "El Email o la contraseña es incorrectas",
      });
    }

    //confirmar contraseñas
    const validarPassword = bcrypt.compareSync(password, usuario.password);

    if (!validarPassword) {
      res.json({
        msg: "El email o la contraseña es incorrectos",
      });
    }

    res.json({
      msg: "Usuario logueado",
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const usuario = await Usuarios.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getUsers = async (req, res) => {
  try {
    const usuarios = await Usuarios.find();

    if (!usuarios) {
      return res.status(404).json({ message: "Currency data not found" });
    }

    return res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  getUserByEmail,
  getUsers,
};
