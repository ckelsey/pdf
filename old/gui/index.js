const fs = require(`fs`)

exports.handler = (event, context, callback) => {

    const finish = (status, body) => {
        let message = {
            "isBase64Encoded": false,
            "statusCode": status,
            "headers": {
                "Content-type": "text/html"
            },
            "body": body.toString()
        }

        let error = status === 200 ? null : typeof body === `string` ? body : JSON.stringify(body)
        let resp = status !== 200 ? null : message

        return callback(error, resp)
    }

    fs.readFile('./index.html', 'utf8', function(err, contents) {
        finish(200, contents)
    })

}