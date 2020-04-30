//Carregando os módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const admin = require("./routes/admin.js")
const user = require("./routes/usuario.js")

require("./models/Postagem")
const Postagem = mongoose.model("postagens")

const passport = require("passport")
require("./config/auth")(passport)



//Configurações
    //Sessão
    app.use(session({
      secret: "cursodenode",
      resave: true,
      saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
    //Midleware
    app.use((req, res, next)=>{
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")
      res.locals.user = req.user || null; //Armazenado dados do usuario logado
      next()
    })
    //Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(()=>{
      console.log("Conectado com sucesso")
    }).catch((err)=>{
      console.log("Erro ao se conectar: "+err)
    })
    //Public
//    app.use(express.static(path.join(__dirname, "public")))

//Rotas
//Listar postagens
app.get('/', (req, res) =>{
  Postagem.find().populate("categoria").sort({date:"desc"}).lean().then((post)=>{
    res.render("index", {postagens: post})
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as postagens")
    res.redirect("/admin")
  })
})

//Chamando formulário de longin
app.get('/login', (req, res) =>{
  res.render("login")
})
//Authenticando o formulario de login
app.post("/authenticate",(req, res, next)=>{
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next)
})

//logout
app.get('/logout', (req, res) =>{
  req.logout()
  req.flash("success_msg", "Deslogado com sucesso")
  res.redirect("/")
})


app.use('/admin', admin)//inclui as toras do arquivo "./routes/admin.js"
app.use('/user', user)//inclui as toras do arquivo "./routes/user.js"

//Outros
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log('Servidor rodando na porta %s', port)
})
