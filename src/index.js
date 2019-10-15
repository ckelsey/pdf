import PDFObjects from './components/pdf-svg'

fetch(`samples/pdf.pdf`)
    .then(response => response.arrayBuffer())
    .then(PDFObjects)