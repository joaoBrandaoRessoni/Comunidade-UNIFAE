const Sequilize = require("sequelize")
const connection = new Sequilize('projeto_comunidade', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection