const express = require("express");
const { AddMenu } = require("../controllers/menu.controllers");

const routerMenu = express.Router();

routerMenu.post("/AddMenu", AddMenu);

module.exports = routerOp;
