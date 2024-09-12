const express = require("express")
const app = new express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const perguntaModel = require("./database/pergunta")
const respostaModel = require("./database/resposta")
const usuarioModel = require("./database/usuarios")
const e = require("express")

connection.authenticate()
    .then(() => {
        console.log("conectado ao banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    let erro = req.query.erro || false
    res.render('index', {
        erro: erro
    })
})

app.post("/login", (req, res) => {
    let user = req.body.user
    let senha = req.body.senha
    usuarioModel.findOne({raw:true, where: {user:user}}).then(usuario => {
        if(usuario == null){
            usuarioModel.create({
                user: user,
                senha: senha
            }).then(usuario =>{
                res.redirect('/inicial')
            })
        }else{
            if(usuario.senha == senha){
                res.redirect('/inicial')
            }else{
                res.redirect('/?erro=true')
            }
        }
    })
})

app.get("/inicial", (req, res) => {
    perguntaModel.findAll({raw:true, order:[['id', 'DESC']]}).then(pergunta => {
        pergunta.forEach(e => {
            e.createdAt = e.createdAt.toLocaleDateString()
        });
        res.render('logado', {
            perguntas: pergunta
        })
    })
})

app.get("/createquestion", (req,res) => {
    res.render('question')
})

app.post("/savequestion", (req,res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    perguntaModel.create({
        titulo:titulo,
        descricao:descricao,
    }).then(() => {
        res.redirect("/inicial")
    })
})

app.post("/saveresponse/:id", (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao
    let perguntaId = req.params.id

    respostaModel.create({
        titulo: titulo,
        descricao: descricao,
        perguntaId: perguntaId,
    }).then(() => {
        res.redirect('back')
    })
})

app.get('/resposta/delete/:id', (req,res)=>{
    let id = req.params.id
    respostaModel.destroy({
        where:{id:id}
    }).then(() => {
        res.redirect('back')
    })
})

app.get("/detalhepergunta/:id", (req, res) => {
    let id = req.params.id
    perguntaModel.findOne({raw:true, where: {id: id}}).then(pergunta => {
        if(pergunta != undefined){
            respostaModel.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'ASC']]
            }).then(resposta => {
                pergunta.createdAt = pergunta.createdAt.toLocaleDateString()
                resposta.forEach(e => {
                    e.createdAt = e.createdAt.toLocaleDateString()
                });
                res.render("responder", {
                    pergunta:pergunta,
                    respostas:resposta
                })
            })
        }else{
            res.redirect("/inicial?msg=Pergunta não existe")
        }
    })
})

app.listen("8181", () => {
    console.log('Servidor online');
})