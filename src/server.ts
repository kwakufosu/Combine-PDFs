import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

//reading the content ofthe pdf files and retruning them as a buffer
const pdf1 = fs.readFileSync(path.join(__dirname, "files/pdf1.pdf"));
const pdf2 = fs.readFileSync(path.join(__dirname, "files/pdf2.pdf"));

const pdfsToMerge = [pdf1, pdf2];

const merger = async () => {

//Creating an empty pdf
  const mergedPdf = await PDFDocument.create();
//Looping through the pdfs to merge and copying thir contents to the pdf created
  for (const pdfBytes of pdfsToMerge) {
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  
 //saving the newly created buffer for the final pdf
  const buffer = await mergedPdf.save(); 

  //Path to where the merge file will be stored
  const mergedpath = path.join(__dirname, "files/merged.pdf");

  //Opening the path and writing the new merged file buffer to it
  fs.open(mergedpath, "w", function (err, fd) {
    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      fs.close(fd, function () {
        console.log("wrote the file successfully");
      });
    });
  });
};

merger();
