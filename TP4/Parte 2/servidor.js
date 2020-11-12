var http = require('http')
var fs = require('fs')
var servidor = http.createServer(function (req,res){
    if(req.url.match(/\/(arq)[0-9]+$/)){
        var num = req.url.split("q")[1]
        fich = './arqWeb/arq'+num+'.html'
    }else{
        if(req.url.match(/\/[*]$/)){
            fich = './arqWeb/index.html'
        }else{
            var fich = 'main.html'
        }
    }
    fs.readFile(fich, function(err, data){
        if(err){
            console.log('Erro na leitura do ficheiro: ' + err)
            res.writeHead(200,{'Content-Type': 'text/html'})
            res.write("<p>Ficheiro inexistente.</p>")
            res.end()
        }else{
            res.writeHead(200,{'Content-Type': 'text/html'})
            res.write(data)
            res.end()
        }
    })
})
servidor.listen(7777)
console.log('Servidor à escuta na porta 7777')