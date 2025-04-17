import { PDFDocument } from "pdf-lib"

export async function mergePdfs(files: File[]): Promise<Blob> {
  // Create a new PDF document
  const mergedPdf = await PDFDocument.create()

  // Process each file
  for (const file of files) {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // Get all pages from the document
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())

    // Add each page to the merged document
    for (const page of pages) {
      mergedPdf.addPage(page)
    }
  }

  // Save the merged PDF as a Blob
  const mergedPdfBytes = await mergedPdf.save()
  return new Blob([mergedPdfBytes], { type: "application/pdf" })
}
