const fs = require("fs")
const cheerio = require("cheerio")
const PDFDocument = require("pdfkit")
const SVGtoPDF = require("./populate/node_modules/svg-to-pdfkit")
const url = require(`url`)
const https = require(`https`)
const http = require(`http`)

const fromJson = data => {
    try { data = JSON.parse(data) } catch (error) { }

    return data
}

const getRemote = urlToGet => new Promise((resolve, reject) => {
    let getUrl = new url.parse(urlToGet)
    let getOptions = {
        host: getUrl.host.indexOf(`localhost`) > -1 ? `localhost` : getUrl.host,
        protocol: getUrl.protocol,
        path: getUrl.path,
        port: getUrl.port,
        method: 'GET'
    }

    let httpModule = getOptions.protocol === `https:` ? https : http

    const getReq = httpModule.request(getOptions, getResp => {
        let buffers = []

        getResp.on('error', error => reject(error))
        getResp.on('data', chunk => { buffers.push(chunk) })
        getResp.on('end', () => resolve(Buffer.concat(buffers)))
    })

    getReq.end()
})

const getRemoteJson = urlToGet => getRemote(urlToGet).then(fromJson)

const templateKeys = template => {
    // const regex = new RegExp('(?:\{\{)([\w.]+)(?:\}\})', 'igm')
    // const keys = regex.exec(template)
    // const keys = template.match(regex)
    // const keys = template.match(/(?:\{\{)(.*?)(?:\}\})/gm)
    // const keys = template.match(/\{\{\s?([\w.]+)\s?\}\}/gm)
    // const keys = /\{\{\s?([\w.]+)\s?\}\}/gm.exec(template)
    // const keys = template.match(/(\{\{\s+)(.*)(\s+\}\})/gm)

    let keys = template.match(/\{\{\s?([\w.]+)\s?\}\}/gm)

    if(!keys){
        return []
    }

    keys = keys.map(k=>k.split('{{')[1].split('}}')[0])
    return keys
}

const populate = (input, template, keys) => {
    keys.forEach(key=>{
        template = template.split('{{'+key+'}}').join(input[key])
    })

    return template
}

exports.handler = (event, context, callback) => {
    const input = fromJson(event.input)
    const inputUrl = event.inputUrl
    const template = event.template
    const templateUrl = event.templateUrl

    const finish = (status, body) => {
        console.log(status, body)
        let message = {
            "isBase64Encoded": false,
            "statusCode": status,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json"
            },
            "body": typeof body === `string` ? body : JSON.stringify(body)
        }

        let error = status === 200 ? null : typeof body === `string` ? body : JSON.stringify(body)
        let resp = status !== 200 ? null : message

        return callback(error, resp)
    }

    const makePdf = (inputData, templateData) => {
        const keys = templateKeys(template)



        finish(200, populate(inputData[0], templateData, keys))
    }

    if (inputUrl && templateUrl) {
        return Promise.all(
            getRemoteJson(inputUrl),
            getRemote(templateUrl)
        ).then(results => { return makePdf(results[0], results[1]) })
    } else if (inputUrl) {
        return getRemoteJson(inputUrl).then(result => { makePdf(result, template) })
    } else if (templateUrl) {
        return getRemote(templateUrl).then(result => { makePdf(input, result) })
    } else {
        return makePdf(input, template)
    }
}



// P.promisifyAll(fs);
// const generatePDF = async (req, res) = {
// const inputData = req.body
// const template = await fs.readFileAsync(pathToTemplate, "utf8");
// const $ = cheerio.load(template);
// Const inputDataKeys = _.keys(inputData);
// inputDataKeys.forEach((key) => {
// const identif = '.' + key
// if (inputData[key] == null) inputData[key] = 'NA'
// $(identif).html(inputData[key])
// });
// var doc = new PDFDocument({
//           size: [593, 917]
//         });
//         SVGtoPDF(doc, $("body").html(), 0, 0, {
//           preserveAspectRatio: "true"
//         });
//         console.log("SVG - PDF converted");
//         res.writeHead(200, {
//           "Content-Type": "application/pdf"
//         });
//         // Piping the response
//         doc.pipe(res);
//         doc.end();
// }