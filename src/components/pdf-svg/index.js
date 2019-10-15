import PDFJS from 'pdfjs-dist'

const loadDoc = buffer => PDFJS.getDocument(buffer)
    .then(doc => ({
        doc,
        getPage: GetPage(doc)
    }))
const GetPage = doc => pageIndex => doc.getPage(pageIndex)

const PDFObjects = buffer => {
    let methods

    return loadDoc(buffer)
        .then(res => {
            methods = res
            methods.getPage(1)
                .then(page => {
                    const viewport = page.getViewport({ scale: 1.0, })
                    // const pdfPageView = new methods.doc.PDFPageView({
                    //     id: 1,
                    //     scale: 1,
                    //     defaultViewport: viewport,
                    // })

                    // pdfPageView.setPdfPage(page)

                    // const attachments = methods.doc.getAttachments()
                    // const data = methods.doc.getData()
                    // const destinations = methods.doc.getDestinations()
                    // const dlInfo = methods.doc.getDownloadInfo()
                    // const js = methods.doc.getJavaScript()
                    // const meta = methods.doc.getMetadata()
                    // const outline = methods.doc.getOutline()
                    // const stats = methods.doc.getStats()

                    // console.log(attachments, data, destinations, dlInfo, js, meta, outline, stats)

                    return Promise.all([
                        methods.doc.getAttachments(),
                        methods.doc.getData(),
                        methods.doc.getDestinations(),
                        methods.doc.getDownloadInfo(),
                        methods.doc.getJavaScript(),
                        methods.doc.getMetadata(),
                        methods.doc.getOutline(),
                        methods.doc.getStats(),
                        page.getOperatorList(),
                        page.getAnnotations(),
                        page.getTextContent(),

                    ]).then(pageResults => {
                        console.log(pageResults)
                        // const operators = pageResults[0]
                        // const annotations = pageResults[1]
                        // const text = pageResults[2]
                    })
                })
        })
        .catch(console.log)
}

export default PDFObjects