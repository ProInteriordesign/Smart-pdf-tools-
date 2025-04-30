// PDF संबंधित फंक्शन्स
class PDFTools {
    static async mergePDFs(files) {
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        
        for (const file of files) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }
        
        return await mergedPdf.save();
    }

    static async extractText(pdfFile) {
        const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(pdfFile));
        const pdf = await loadingTask.promise;
        let text = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ');
        }
        
        return text;
    }
}