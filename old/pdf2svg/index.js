const url = require(`url`)
const https = require(`https`)
const http = require(`http`)
const Inkscape = require('inkscape')
// const hummus = require('hummus')
// const {
//     PDFDocumentFactory,
//     PDFDocumentWriter,
//     StandardFonts,
//     drawLinesOfText,
//     drawImage,
//     drawRectangle,
// } = require('pdf-lib')

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


exports.handler = (event, context, callback) => {
    const finish = (body) => {
        return callback(JSON.stringify(body))
        // let message = {
        //     "isBase64Encoded": false,
        //     "statusCode": status,
        //     "headers": {
        //         "Access-Control-Allow-Origin": "*",
        //         "Content-type": "text/html"
        //     },
        //     "body": JSON.stringify(body)
        // }

        // let error = status === 200 ? null : typeof body === `string` ? body : JSON.stringify(body)
        // let resp = status !== 200 ? null : message

        // return callback(error, resp)
    }

    return getRemote(event.url)
        .then(pdfData => {

            // const pdfDoc = PDFDocumentFactory.load(pdfData)
            // const pages = pdfDoc.getPages()
            // console.log(pages[0].toString())
        })
        .catch(finish)
}




// const Inkscape = require('inkscape')
// const url = require(`url`)
// const https = require(`https`)
// const http = require(`http`)
// const fs = require(`fs`)
// // HACK few hacks to let PDF.js be loaded not as a module in global space.
// require(`./domstubs.js`).setStubs(global)
// const pdfjsLib = require(`pdfjs-dist`)

// const getRemote = urlToGet => new Promise((resolve, reject) => {
//     const pdfToSvgConverter = new Inkscape(['--export-svg', '--export-width=1024', '--import-pdf'])
//     const svg = []

//     pdfToSvgConverter
//         .on('data', chunk => {
//             svg.push(chunk)
//         })
//         .on('error', error => {
//             reject(error)
//         })
//         .on('end', () => {
//             resolve(Buffer.concat(svg).toString('utf8'))
//         })

//     pdfToSvgConverter.end(Buffer.from(fileData, 'utf-8'))

//     let getUrl = new url.parse(urlToGet)
//     let getOptions = {
//         host: getUrl.host.indexOf(`localhost`) > -1 ? `localhost` : getUrl.host,
//         protocol: getUrl.protocol,
//         path: getUrl.path,
//         port: getUrl.port,
//         method: 'GET'
//     }

//     let httpModule = getOptions.protocol === `https:` ? https : http

//     const getReq = httpModule.request(getOptions, getResp => {
//         let buffers = []

//         getResp.on('error', error => reject(error))
//         getResp.on('data', chunk => { buffers.push(chunk) })
//         getResp.on('end', () => resolve(Buffer.concat(buffers)))
//     })

//     getResp.pipe(pdfToSvgConverter)

//     getReq.end()
// })

// const readRemote = urlToGet => new Promise((resolve, reject) => {
//     const pdfToSvgConverter = new Inkscape(['--export-svg', '--export-width=1024', '--import-pdf'])
//     const svg = []

//     pdfToSvgConverter
//         .on('data', chunk => {
//             svg.push(chunk)
//         })
//         .on('error', error => {
//             reject(error)
//         })
//         .on('end', () => {
//             resolve(Buffer.concat(svg).toString('utf8'))
//         })

//     const getUrl = new url.parse(urlToGet)
//     const getOptions = {
//         host: getUrl.host.indexOf(`localhost`) > -1 ? `localhost` : getUrl.host,
//         protocol: getUrl.protocol,
//         path: getUrl.path,
//         port: getUrl.port,
//         method: 'GET'
//     }
//     const httpModule = getOptions.protocol === `https:` ? https : http

//     httpModule.get(urlToGet, res => res.pipe(pdfToSvgConverter))

//     // const getReq = httpModule.request
//     // request('http://fromrussiawithlove.com/baby.mp3').pipe(fs.createWriteStream('song.mp3'))

// })

// exports.handler = (event, context, callback) => {

//     const finish = (status, body) => {
//         return callback(JSON.stringify(body))
//         // let message = {
//         //     "isBase64Encoded": false,
//         //     "statusCode": status,
//         //     "headers": {
//         //         "Access-Control-Allow-Origin": "*",
//         //         "Content-type": "text/html"
//         //     },
//         //     "body": JSON.stringify(body)
//         // }

//         // let error = status === 200 ? null : typeof body === `string` ? body : JSON.stringify(body)
//         // let resp = status !== 200 ? null : message

//         // return callback(error, resp)
//     }

//     const loadPage = (doc, pageNum) => new Promise((resolve, reject) => {
//         var pageText
//         var page

//         return doc.getPage(pageNum)
//             .then(p => {
//                 page = p
//                 return page.getTextContent()
//             })
//             .then(pt => {
//                 pageText = pt
//                 return page.getOperatorList()
//             })
//             .then(opList => {
//                 const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs)
//                 svgGfx.embedFonts = true

//                 return svgGfx.getSVG(opList, page.getViewport(1))
//             })
//             .then(svg => resolve({ svg: svg.toString(), pageText }))
//             .catch(reject)
//     })

//     const toSvg = fileData => new Promise((resolve, reject) => {
//         const loader = pdfjsLib.getDocument({
//             data: fileData,
//             disableFontFace: true,
//             nativeImageDecoderSupport: pdfjsLib.NativeImageDecoding.DISPLAY
//         })

//         return loader
//             .promise
//             .then(doc => {
//                 const pagesDone = []
//                 const pages = []
//                 let index = 0

//                 const push = pageNumber => data => {
//                     pagesDone.push(1)
//                     pages[pageNumber - 1] = data

//                     if (pagesDone.length === doc.numPages) {
//                         return resolve(pages)
//                     }
//                 }

//                 const getData = i => {
//                     var pagePush = push(i)
//                     loadPage(doc, i)
//                         .then(pagePush)
//                         .catch(pagePush)
//                 }

//                 while (index < doc.numPages) {
//                     index = index + 1
//                     getData(index)
//                 }
//             })
//     })

//     const toInkscape = fileData => new Promise((resolve, reject) => {
//         const pdfToSvgConverter = new Inkscape(['--export-svg', '--export-width=1024', '--import-pdf'])
//         console.log(pdfToSvgConverter)

//         const svg = []

//         pdfToSvgConverter
//             .on('data', chunk => {
//                 svg.push(chunk)
//             })
//             .on('error', error => {
//                 reject(error)
//             })
//             .on('end', () => {
//                 resolve(Buffer.concat(svg).toString('utf8'))
//             })

//         pdfToSvgConverter.end(Buffer.from(fileData, 'utf-8'))
//     })

//     return readRemote(event.url)
//         .then(data => {
//             console.log(data)
//         })
//         .catch(error => {
//             console.log(error)
//         })

//     // return getRemote(event.url)
//     //     .then(toInkscape)
//     //     .catch(error => {
//     //         console.log(error)
//     //     })
//     // .then(toSvg)
//     // .then(svgs => finish(200, svgs))
//     // .catch(error => finish(500, error))
// }









// // Run `gulp dist-install` to generate `pdfjs-dist` npm package files.

// // Loading file from file system into typed array
// // const pdfPath = process.argv[2] || `../../web/compressed.tracemonkey-pldi-09.pdf`
// // const data = new Uint8Array(fs.readFileSync(pdfPath))

// // const outputDirectory = `./svgdump`

// // try {
// //     // Note: This creates a directory only one level deep. If you want to create
// //     // multiple subdirectories on the fly, use the mkdirp module from npm.
// //     fs.mkdirSync(outputDirectory)
// // } catch (e) {
// //     if (e.code !== `EEXIST`) {
// //         throw e
// //     }
// // }

// // // Dumps svg outputs to a folder called svgdump
// // function getFilePathForPage(pageNum) {
// //     const name = path.basename(pdfPath, path.extname(pdfPath))
// //     return path.join(outputDirectory, name + `-` + pageNum + `.svg`)
// // }

// // /**
// //  * A readable stream which offers a stream representing the serialization of a
// //  * given DOM element (as defined by domstubs.js).
// //  *
// //  * @param {object} options
// //  * @param {DOMElement} options.svgElement The element to serialize
// //  */
// // function ReadableSVGStream(options) {
// //     if (!(this instanceof ReadableSVGStream)) {
// //         return new ReadableSVGStream(options)
// //     }
// //     stream.Readable.call(this, options)
// //     this.serializer = options.svgElement.getSerializer()
// // }
// // util.inherits(ReadableSVGStream, stream.Readable)
// // // Implements https://nodejs.org/api/stream.html#stream_readable_read_size_1
// // ReadableSVGStream.prototype._read = function () {
// //     const chunk
// //     while ((chunk = this.serializer.getNext()) !== null) {
// //         if (!this.push(chunk)) {
// //             return
// //         }
// //     }
// //     this.push(null)
// // }

// // // Streams the SVG element to the given file path.
// // function writeSvgToFile(svgElement, filePath) {
// //     const readableSvgStream = new ReadableSVGStream({
// //         svgElement: svgElement,
// //     })
// //     const writableStream = fs.createWriteStream(filePath)
// //     return new Promise(function (resolve, reject) {
// //         readableSvgStream.once(`error`, reject)
// //         writableStream.once(`error`, reject)
// //         writableStream.once(`finish`, resolve)
// //         readableSvgStream.pipe(writableStream)
// //     }).catch(function (err) {
// //         readableSvgStream = null // Explicitly null because of v8 bug 6512.
// //         writableStream.end()
// //         throw err
// //     })
// // }

// // // Will be using promises to load document, pages and misc data instead of
// // // callback.
// // const loadingTask = pdfjsLib.getDocument({
// //     data: data,
// //     // Try to export JPEG images directly if they don`t need any further
// //     // processing.
// //     nativeImageDecoderSupport: pdfjsLib.NativeImageDecoding.DISPLAY,
// // })
// // loadingTask.promise.then(function (doc) {
// //     const numPages = doc.numPages
// //     console.log(`# Document Loaded`)
// //     console.log(`Number of Pages: ` + numPages)
// //     console.log()

// //     const lastPromise = Promise.resolve() // will be used to chain promises
// //     const loadPage = function (pageNum) {
// //         return doc.getPage(pageNum).then(function (page) {
// //             console.log(`# Page ` + pageNum)
// //             const viewport = page.getViewport({ scale: 1.0, })
// //             console.log(`Size: ` + viewport.width + `x` + viewport.height)
// //             console.log()

// //             return page.getOperatorList().then(function (opList) {
// //                 const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs)
// //                 svgGfx.embedFonts = true
// //                 return svgGfx.getSVG(opList, viewport).then(function (svg) {
// //                     return writeSvgToFile(svg, getFilePathForPage(pageNum))
// //                         .then(function () {
// //                             console.log(`Page: ` + pageNum)
// //                         }, function (err) {
// //                             console.log(`Error: ` + err)
// //                         })
// //                 })
// //             })
// //         })
// //     }

// //     for (const i = 1 i <= numPages i++) {
// //         lastPromise = lastPromise.then(loadPage.bind(null, i))
// //     }
// //     return lastPromise
// // }).then(function () {
// //     console.log(`# End of Document`)
// // }, function (err) {
// //     console.error(`Error: ` + err)
// // })