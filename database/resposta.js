const sequelize = require("sequelize")
const connection = require("./database")
const usuario = require("./usuarios")

const resposta = connection.define('resposta', {

    titulo: {
        type: sequelize.STRING,
        allowNull: false,
    },
    descricao: {
        type: sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
})

resposta.sync({force:false})

module.exports = resposta