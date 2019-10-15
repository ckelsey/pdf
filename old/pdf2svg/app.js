const http = require('http')
const url = require('url')
const func = require("./index")
const server = http.createServer().listen(8124);

server.on("request", (req, res) => {
    res.setHeader("Content-Type", "text/xml; charset=utf-8")
    // res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const queryUrl = url.parse(req.url, true).query

    if (queryUrl && queryUrl.url) {
        return func.handler(queryUrl, {}, (result) => {
            // res.statusCode = error ? 500 : 200
            // res.write(error ? error : result.body)
            // res.end()
            // return
            console.log('result', result)
            res.statusCode = 200
            res.write(result)
            res.end()
            return
        })
    }

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