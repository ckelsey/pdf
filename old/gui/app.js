const http = require('http')
const func = require("./index")
const server = http.createServer().listen(8125);

server.on("request", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    let body = ''

    req.on('data', (chunk) => {

        body += chunk

    }).on('end', () => {
        let data = body
        try { data = JSON.parse(data) } catch (error) { }

        func.handler(data, {}, (error, result) => {
            res.statusCode = error ? 500 : 200
            res.write(error ? error : result.body)
            res.end()
            return
        })
    })
})