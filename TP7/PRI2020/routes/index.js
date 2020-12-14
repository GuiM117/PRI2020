var express = require('express');
var router = express.Router();

const Aluno = require('../controllers/aluno')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lista de Alunos PRI 2020' });
});
/* GET page Alunos */
router.get('/alunos', (req,res) => {
  Aluno.listar()
      .then(dados => res.render('alunos', {lista: dados}))
      .catch(e => res.render('error', {error: e}))
})
/* GET page Registo de Aluno */
router.get('/alunos/registo', (req,res) => {
  res.render('registo',{title: 'Registo'});
})

/*POST Registo de um aluno novo*/ 
router.post('/registo', function(req,res) {
  if(req.body.Nome != ""){
    var AlunoV = {
      Número: req.body.Número,
      Nome: req.body.Nome,
      Git: req.body.Git
    }
    Aluno.inserir(AlunoV)
      .then(dados => res.redirect('/alunos'))
      .catch(e => res.render('error', {error: e}))
  }else{
    res.redirect('/alunos')
  }
})
/* GET page de Aluno */
router.get('/alunos/:idAluno',(req,res) => {
    var idAluno = req.params.idAluno;
    Aluno.consultar(idAluno)
        .then(dados => res.render('aluno', {info: dados}))
        .catch(e => res.render('error', {error: e}))
})
/* DELETE de Aluno */
router.post('/remover/:idAluno', function(req,res) {
  var idAluno = req.params.idAluno;
  Aluno.remover(idAluno)
      .then(res.redirect('/alunos'))
      .catch(e => res.render('error', {error: e}))
})
module.exports = router;
