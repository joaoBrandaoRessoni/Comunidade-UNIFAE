const sequelize = require("sequelize")
const connection = require("./database")

const usuario = connection.define("usuario", {
    user: {
        type: sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: sequelize.STRING,
        allowNull: false
    }
})

usuario.sync({force:false})

module.exports = usuario