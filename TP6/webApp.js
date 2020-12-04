var http = require('http')
var axios = require('axios')
var fs = require('fs')

var static = require('./static')

var {parse} = require('querystring')

// ----------------------------------Funções auxilidares----------------------------------
// Ir buscar informação ao body
function recuperainfo (request, callback){
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data',bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=> {
            console.log(body)
            callback(parse (body))
        })
    }
}
// ----------------------------------POST Confirmation HTML Page Template----------------------------------
function geraPostConfirm(tarefa, d){
    return `
    <html>
    <head>
        <title>Registo: Tarefa ${tarefa.designation}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.designation} inserida</h1>
            </header>

            <footer class="w3-container w3-teal">
                <address>Gerado por ${tarefa.responsible}::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}
// ----------------------------------Template para a página com a lista de tarefas----------------------------------
function geraPagTarefas(lista, d){
  let pagHTML = `
    <html>
        <head>
            <title>To Do List</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>
                    To Do List
                    <button class="w3-button w3-circle w3-black w3-right">
                        <a href="/tarefas/registo">+</a>
                    </button>
                </h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Designação</th>
                    <th>Responsável</th>
                    <th>Data limite</th>
                    <th>Estado</th>
                </tr>
  `
    lista.forEach(a => {
        if(a.state == "active"){
            pagHTML += `
                <tr>
                    <td>${a.designation}</td>
                    <td>${a.responsible}</td>
                    <td>${a.deadlineDate}</td>
                    <td>${a.state}</td>
                    <td><button onclick="window.location.href='http://localhost:7777/done/${a.id}';" class="w3-button w3-green">Feito</button></td>
                    <td><button onclick="window.location.href='http://localhost:7777/cancel/${a.id}';" class="w3-button w3-red">Cancelar</button></td>
                </tr>
            `
        }
    });
    pagHTML += `
    </table>
    `
  return pagHTML
}
function geraCancel( tarefa, d ){
    return `
    <html>
    <head>
        <title>Cancel: Tarefa ${tarefa.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.designation} Cancelada</h1>
            </header>

            <footer class="w3-container w3-teal">
                <address>Gerado por ${tarefa.responsible}::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}
function geraDone(tarefa,d ){
    return `
    <html>
    <head>
        <title>Registo: Tarefa ${tarefa.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${tarefa.designation} completa</h1>
            </header>

            <footer class="w3-container w3-teal">
                <address>Gerado por ${tarefa.responsible}::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}
// Template para o formulário da tarefa ------------------
function geraFormTarefa( d ){
    return `
    <html>
        <head>
            <title>Registo de uma tarefa</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Registo de Tarefa</h2>
            </div>

            <form class="w3-container" action="/tarefas" method="POST">

                <label class="w3-text-teal"><b>ID</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id">

                <label class="w3-text-teal"><b>Designação</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="designation">
          
                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="responsible">

                <label class="w3-text-teal"><b>Data Limite</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="deadlineDate">

                <input type="hidden" name="state" value="active"/>
          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-teal">
                <address>Gerado por Guilherme Martins::PRI2020 em ${d} --------------<a href="/">Voltar</a></address>
            </footer>
        </body>
    </html>
    `
}

// ----------------------------------Template para a página com a lista de tarefas completadas/canceladas----------------------------------
function geraPagTarefasC(lista, d){
    let pagHTML = `
      <html>
          <head>
              <meta charset="utf-8"/>
              <link rel="stylesheet" href="w3.css"/>
          </head>
          <body>
              <div class="w3-container w3-teal">
                  <h2>
                      Lista de Tarefas Completadas
                  </h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Designação</th>
                      <th>Responsável</th>
                      <th>Data limite</th>
                  </tr>
    `
    lista.forEach(a => {
        if(a.state == "done"){
            pagHTML += `
            <tr>
                <td>${a.designation}</td>
                <td>${a.responsible}</td>
                <td>${a.deadlineDate}</td>
            </tr>
        `
        }
    });
  pagHTML += `
        </table>
        <div class="w3-container w3-teal">
        <h2>
            Lista de Tarefas Canceladas
        </h2>
        </div>
        <table class="w3-table w3-bordered">
        <tr>
            <th>Designação</th>
            <th>Responsável</th>
            <th>Data limite</th>
        </tr>
  `
  lista.forEach(a => {
    if(a.state == "canceled"){
        pagHTML += `
        <tr>
            <td>${a.designation}</td>
            <td>${a.responsible}</td>
            <td>${a.deadlineDate}</td>
        </tr>
    `
    }
});

  pagHTML += `
        </table>
        <div class="w3-container w3-teal">
            <address>Gerado por Guilherme Martins::PRI2020 em ${d} --------------</address>
        </div>
    </body>
    </html>
  `
  return pagHTML
}
// -------------------------------SERVER--------------------------------------

var TaskServer = http.createServer(function (req, res) {
    
    var d = new Date().toISOString().substr(0, 16) 
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    //Testa se recurso é estático
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }else{
    switch(req.method){
        case "GET":
            // GET /tarefas --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/tarefas")){
                axios.get("http://localhost:3000/tarefas")
                    .then(response => {
                        var tarefas = response.data

                        // Add code to render page with the tasks list
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagTarefas(tarefas,d))
                        res.write(geraPagTarefasC(tarefas,d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas...")
                        res.end()
                    })
            }
            // GET /tarefas/registo --------------------------------------------------------------------
            else if(req.url == "/tarefas/registo"){
                // Add code to render page with the task form
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraFormTarefa(d))
                    res.end()
            }
            else if(/\/cancel/.test(req.url)){
                var idTarefa = req.url.split("/")[2]
                axios.get("http://localhost:3000/tarefas/" + idTarefa)
                .then(response => {
                    var tarefaReq = response.data

                    axios.put("http://localhost:3000/tarefas/" + idTarefa, {
                        id: tarefaReq.id,
                        designation: tarefaReq.designation,
                        responsible: tarefaReq.responsible,
                        deadlineDate:tarefaReq.deadlineDate,
                        state: 'canceled'
                    })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraCancel(tarefaReq,d))
                    res.end()
                })
                .catch(err => {
                    console.log(err);
                });

            }else if(/\/done/.test(req.url)){
                var idTarefa = req.url.split("/")[2]
                axios.get("http://localhost:3000/tarefas/" + idTarefa)
                .then(response => {
                    var tarefaReq = response.data

                    axios.put("http://localhost:3000/tarefas/" + idTarefa, {
                        id: tarefaReq.id,
                        designation: tarefaReq.designation,
                        responsible: tarefaReq.responsible,
                        deadlineDate:tarefaReq.deadlineDate,
                        state: 'done'
                    })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraDone(tarefaReq,d))
                    res.end()
                })
                .catch(err => {
                    console.log(err);
                });
            }
            // GET /w3.css ------------------------------------------------------------------------
            else if(/\/w3.css$/.test(req.url)){ 
                fs.readFile("./public/w3.css", function(erro, dados){
                    if(!erro){
                        res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                        res.write(dados)
                        res.end()
                    }
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        case "POST":
            if(req.url=='/tarefas'){
                recuperainfo(req, function (info){ 
                    console.log('POST de tarefa:'+JSON.stringify(info)) 
                    axios.post('http://localhost:3000/tarefas', info)
                        .then(resp=> {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm(resp.data, d)) 
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no Post: '+erro+'</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                })
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p> POST" + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
}
})

TaskServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')