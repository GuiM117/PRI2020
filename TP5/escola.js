var http = require('http')
const axios = require('axios');

var servidor = http.createServer(function (req,res){
    console.log(req.method + '' + req.url)

    if(req.method == 'GET'){
        if(req.url == '/'){
            res.writeHead(200, {
                'Content-Type' : 'text/html; charset=utf-8'
            })
            res.write('<h1><u>Escola de Música</u></h1>')
            res.write('<ul>');
            res.write('<li><a href=\"http://localhost:3001/alunos\">Lista de Alunos</a></li>');
            res.write('<li><a href=\"http://localhost:3001/instrumentos\">Lista de Instrumentos</a></li>');
            res.write('<li><a href=\"http://localhost:3001/cursos\">Lista de Cursos</a></li>');
            res.write('</ul>');
            res.end()
        }else{
            // ------------------------------------  Aluno Especifico ------------------------------------------
            if(req.url.match('\/alunos\/A(E[\-])?[0-9]+')){
                res.writeHead(200, {
                    'Content-Type' : 'text/html; charset=utf-8'
                })
                var aluno = req.url.split("/")[2];
                //res.write('<p>'+aluno+'</p>');
                axios.get('http://localhost:3000/alunos/'+aluno)
                    .then(resp=> {
                        alunoD = resp.data;
                        res.write('<h1><u>'+alunoD.nome+'</u></h1>');
                        res.write('<ul>');
                        res.write('<li>ID: '+alunoD.id+'</li>');
                        res.write('<li>Data de Nascimento: '+alunoD.dataNasc+'</li>');
                        res.write('<li>Curso: '+alunoD.curso+'</li>');
                        res.write('<li>Ano do Curso '+alunoD.anoCurso+'</li>');
                        res.write('<li>Instrumento: '+alunoD.instrumento+'</li>');
                        res.write('</ul>');
                        res.write('<a href=\"http://localhost:3001/alunos\"">Voltar à página de alunos</a>');
                        res.end();
                    })
                    .catch(error => {
                        console.log('ERRO: ' + error);
                        res.write('<p>Não consegui obter o aluno pedido...</p>')
                        res.end()
                    });
            }
            // ------------------------------------  Instrumento Especifico ------------------------------------------
            if (req.url.match('\/instrumentos\/I[0-9]+')) {
                res.writeHead(200, {
                    'Content-Type' : 'text/html; charset=utf-8'
                })
                var instrumento = req.url.split("/")[2]
                //res.write('<p>'+instrumento+'</p>');
                axios.get('http://localhost:3000/instrumentos/'+instrumento)
                    .then(resp=> {
                        instrumentoD = resp.data;
                        res.write('<h1><u>'+instrumentoD["#text"]+'</u></h1>');
                        res.write('<ul>');
                        res.write('<li>ID: '+instrumentoD .id+'</li>');
                        res.write('</ul>');
                        res.write('<a href=\"http://localhost:3001/instrumentos\"">Voltar à página de instrumentos</a>');
                        res.end();
                    })
                    .catch(error => {
                        console.log('ERRO: ' + error);
                        res.write('<p>Não consegui obter o instrumento pedido...</p>')
                        res.end()
                    });
            }
            // ------------------------------------  Curso Especifico ------------------------------------------
            if (req.url.match('\/cursos\/C[B|S][0-9]+')) {
                res.writeHead(200, {
                    'Content-Type' : 'text/html; charset=utf-8'
                })
                var curso = req.url.split("/")[2]
                //res.write('<p>'+curso+'</p>');
                axios.get('http://localhost:3000/cursos/'+curso)
                    .then(resp=> {
                        cursoD = resp.data;
                        res.write('<h1><u>'+cursoD.designacao+'</u></h1>')
                        res.write('<ul>');
                        res.write('<li>ID: '+cursoD.id+'</li>');
                        res.write('<li>Duração: '+cursoD.duracao+'</li>');
                        res.write('</ul>');
                        res.write('<a href=\"http://localhost:3001/cursos\"">Voltar à página de cursos</a>');
                        res.end();
                    })
                    .catch(error => {
                        console.log('ERRO: ' + error);
                        res.write('<p>Não consegui obter o curso pedido...</p>')
                        res.end()
                    });
            }
            switch (req.url){
                // ------------------------------------  Alunos ------------------------------------------
                case '/alunos':
                    res.writeHead(200, {
                        'Content-Type' : 'text/html; charset=utf-8'
                    })
                    axios.get('http://localhost:3000/alunos')
                        .then(resp=> {
                            alunos = resp.data; // alunos é uma array
                            res.write('<h1><u>Alunos da Escola de Música</u></h1>')
                            res.write('<ul>');
                            alunos.forEach(a => {
                                //res.write(`<li>${a.id}, ${a.nome}, ${a.instrumento}</li>`)
                                res.write(`<li><a href=\"http://localhost:3001/alunos/${a.id}\">${a.nome}</a></li>`)
                            });
                            res.write('</ul>');
                            res.write('<a href=\"http://localhost:3001\"">Voltar à página principal</a>');
                            res.end();
                        })
                        .catch(error => {
                            console.log('ERRO: ' + error);
                            res.write('<p>Não consegui obter a lista de alunos...</p>')
                            res.end()
                        });
                    break;
                // ------------------------------------  Instrumentos ------------------------------------------
                case '/instrumentos':
                    res.writeHead(200, {
                        'Content-Type' : 'text/html; charset=utf-8'
                    })
                    axios.get('http://localhost:3000/instrumentos')
                        .then(resp=> {
                            alunos = resp.data; // alunos é uma array
                            res.write('<h1><u>Instrumentos da Escola de Música</u></h1>')
                            res.write('<ul>');
                            alunos.forEach(a => {
                                //res.write(`<li>${a.id}, ${a["#text"]}</li>`)
                                res.write(`<li><a href=\"http://localhost:3001/instrumentos/${a.id}\">${a["#text"]}</a></li>`)
                            });
                            res.write('</ul>');
                            res.write('<a href=\"http://localhost:3001\">Voltar à página principal</a>');
                            res.end();
                        })
                        .catch(error => {
                            console.log('ERRO: ' + error);
                            res.write('<p>Não consegui obter a lista de instrumentos...</p>')
                            res.end()
                        });
                    break;
                // ------------------------------------  Cursos ------------------------------------------
                case '/cursos':
                    res.writeHead(200, {
                        'Content-Type' : 'text/html; charset=utf-8'
                    })
                    axios.get('http://localhost:3000/cursos')
                        .then(resp=> {
                            alunos = resp.data; // alunos é uma array
                            res.write('<h1><u>Cursos da Escola de Música</u></h1>')
                            res.write('<ul>');
                            alunos.forEach(a => {
                                //res.write(`<li>${a.id}, ${a.designacao}, ${a.duracao}</li>`)
                                res.write(`<li><a href=\"http://localhost:3001/cursos/${a.id}\">${a.designacao}</a></li>`)
                            });
                            res.write('</ul>');
                            res.write('<a href=\"http://localhost:3001\">Voltar à página principal</a>');
                            res.end();
                        })
                        .catch(error => {
                            console.log('ERRO: ' + error);
                            res.write('<p>Não consegui obter a lista de cursos...</p>')
                            res.end()
                        });
                    break;
            }
        }
    }else{
        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        res.write('<p>Pedido não suportado: ' + req.method + '</p>')
        res.end()
    }
})

servidor.listen(3001)
console.log('Servidor à escuta na porta 3001')