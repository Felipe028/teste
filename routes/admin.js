const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")//Está pegando apenas a função "eAdin" q está dentro do arquivo "helpers/eAdmin.js"

//#############################################################
//#####################---CATEGORIA---#########################
//#############################################################
//Adicionar categoria
router.get('/categorias/add', eAdmin, (req, res)=>{
  res.render("admin/categoria/addcategorias")
})
//Adicionar categoria (Salvar)
router.post('/categorias/addsalvar', eAdmin, (req, res)=>{
  var erros = []
  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Nome inválido"})
  }
  if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
    erros.push({texto: "Slug inválido"})
  }
  if(req.body.nome.length < 2){
    erros.push({texto: "Nome muito pequeno"})
  }

  if(erros.length > 0){
    res.render("admin/categoria/addcategorias", {erros: erros})
  }else{
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(()=>{
      req.flash("success_msg", "Categoria criada com sucesso!")
      res.redirect("/admin/categorias")
    }).catch((err)=>{
      req.flash("error_msg", "Houve um erro!")
      res.redirect("/admin")
    })
  }
})

//Listar categorias
router.get('/categorias', eAdmin, (req, res)=>{
  Categoria.find().sort({date:"desc"}).lean().then((cat)=>{
    res.render("admin/categoria/categorias", {categorias: cat})
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.rediect("/admin")
  })
})
 
//Editar categoria
router.get('/categorias/editar/:id', eAdmin, (req, res)=>{
  Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
    res.render("admin/categoria/editarcategorias", {categoria: categoria})
  }).catch((err)=>{
    req.flash("error_msg", "Esta categoria não existe")
    res.rediect("/admin/categorias")
  })
})
//Editar categoria (Salvar)
router.post('/categorias/editar/salvar', eAdmin, (req, res)=>{
  Categoria.findOne({_id: req.body.id}).then((categoria)=>{
    categoria.nome = req.body.nome
    categoria.slug = req.body.slug

    categoria.save().then(()=>{
      req.flash("success_msg", "Categoria alterada com sucesso!")
      res.redirect("/admin/categorias")
    }).catch((err)=>{
      req.flash("error_msg", "Houve um erro!")
      res.redirect("/admin/categorias")
    })

  }).catch((err)=>{
    req.flash("error_msg", "houve um erro")
    res.rediect("/admin/categorias")
  })
})

//Excluir categoria
router.post('/categorias/excluir', eAdmin, (req, res)=>{
  Categoria.remove({_id: req.body.id}).then(()=>{
    req.flash("success_msg", "Categoria deletada com sucesso!")
    res.redirect("/admin/categorias")
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro")
  })
})


//#############################################################
//######################---POSTAGEM---#########################
//#############################################################
//Adicionar postagem
router.get('/postagens/add', (req, res)=>{
  Categoria.find().sort({date:"desc"}).lean().then((cat)=>{
    res.render("admin/postagem/addpostagens", {categorias: cat})
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.rediect("/admin")
  })
})

//Adicionar postagem (Salvar)
router.post('/postagens/addsalvar', (req, res)=>{
  var erros = []
  if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
    erros.push({texto: "Titulo inválido"})
  }
  if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
    erros.push({texto: "Slug inválido"})
  }
  if(req.body.titulo.length < 2){
    erros.push({texto: "Título muito pequeno"})
  }

  if(erros.length > 0){
    res.render("admin/postagem/addpostagens", {erros: erros})
  }else{
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    }
    new Postagem(novaPostagem).save().then(()=>{
      req.flash("success_msg", "Postagem criada com sucesso!")
      res.redirect("/admin/postagens")
    }).catch((err)=>{
      req.flash("error_msg", "Houve um erro!")
      res.redirect("/admin")
    })
  }
})

//Listar postagens
router.get('/postagens', (req, res)=>{
  Postagem.find().populate("categoria").sort({date:"desc"}).lean().then((post)=>{
    res.render("admin/postagem/postagens", {postagens: post})
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as postagens")
    res.rediect("/admin")
  })
})

//Editar postagens
router.get('/postagens/editar/:id', (req, res)=>{
  Postagem.findOne({_id: req.params.id}).lean().then((posta)=>{

    Categoria.find().sort({date:"desc"}).lean().then((cat)=>{
      res.render("admin/postagem/editarpostagens", {postagem: posta, categorias: cat})
    }).catch((err)=>{
      req.flash("error_msg", "Houve um erro ao listar as categorias")
      res.rediect("/admin")
    })

  }).catch((err)=>{
    req.flash("error_msg", "Esta postagem não existe")
    res.rediect("/admin/postagens")
  })
})
//Editar postagens (Salvar)
router.post('/postagens/editar/salvar', (req, res)=>{
  Postagem.findOne({_id: req.body.id}).then((postagem)=>{
    postagem.titulo = req.body.titulo,
    postagem.slug = req.body.slug,
    postagem.descricao = req.body.descricao,
    postagem.conteudo = req.body.conteudo,
    postagem.categoria = req.body.categoria
    postagem.save().then(()=>{
      req.flash("success_msg", "Postagem alterada com sucesso!")
      res.redirect("/admin/postagens")
    }).catch((err)=>{
      req.flash("error_msg", "Houve um erro!")
      res.redirect("/admin/postagens")
    })

  }).catch((err)=>{
    req.flash("error_msg", "houve um erro")
    res.rediect("/admin/postagens")
  })
})

//Excluir categoria
router.post('/postagens/excluir', (req, res)=>{
  Postagem.remove({_id: req.body.id}).then(()=>{
    req.flash("success_msg", "Postagem deletada com sucesso!")
    res.redirect("/admin/postagens")
  }).catch((err)=>{
    req.flash("error_msg", "Houve um erro")
  })
})
module.exports = router
