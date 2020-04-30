const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
//require("../models/Postagem")
//const Postagem = mongoose.model("postagens")

//Adicionar usuario
router.get('/usuarios/add', (req, res)=>{
  res.render("user/usuario/addusuario")
})

//Adicionar usuario (Salvar)
router.post('/usuarios/addsalvar', (req, res)=>{
  var erros = []
  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Nome inválido"})
  }
  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
    erros.push({texto: "Email inválido"})
  }
  if(req.body.senha != req.body.senha2){
    erros.push({texto: "Senhas diferentes"})
  }
  if(req.body.senha.length < 6){
    erros.push({texto: "Senha inferior a 6 caracteres"})
  }

  if(erros.length > 0){
    res.render("user/usuario/addusuario", {erros: erros})
  }else{

    //Verificando e o email ja existe no banco
      Usuario.findOne({email: req.body.email}).then((usuario)=>{
        if(usuario){
          req.flash("error_msg", "Usuario já existe")
          res.redirect("/user/usuarios/add")
        }else{
          const novoUsuario = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
          }

          bcrypt.genSalt(10, (erro, salt)=>{
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
              if(erro){
                req.flash("error_msg", "Houve um erro!")
                res.redirect("/")
              }else{
                novoUsuario.senha = hash //Encryptando a senha
                new Usuario(novoUsuario).save().then(()=>{//Salvando o usuario
                  req.flash("success_msg", "Usuario criado com sucesso!")
                  res.redirect("/")
                }).catch((err)=>{
                  req.flash("error_msg", "Houve um erro!")
                  res.redirect("/usuarios/add")
                })
              }
            })
          })
        }
      }).catch((err)=>{
        req.flash("error_msg", "Houve um erro")
        res.rediect("/")
      })









  }
})


module.exports = router
