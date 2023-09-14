const Menu = require("../models/menu-model");

const AddMenu = async (req, res) => {
  const { Descripcion, Monto, Nombre, Unidades } = req.body;

  try {
    let menu = await Menu.findOne({ Nombre });
    console.log(usuario);

    if (menu) {
      return res.json({
        msg: "El nombre del menú que desea agregar ya existe",
      });
    }

    menu = new Menu(req.body);

    await menu.save();

    res.json({
      msg: "Menú Registrado",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  AddMenu,
};
