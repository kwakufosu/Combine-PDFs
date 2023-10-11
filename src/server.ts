import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

let pdf1 = fs.readFileSync(path.join(__dirname, "files/pdf1.pdf"));
let pdf2 = fs.readFileSync(path.join(__dirname, "files/pdf2.pdf"));

const pdfsToMerge = [pdf1, pdf2];

const merger = async () => {

//Creating an empty pdf
  let mergedPdf = await PDFDocument.create();
//Looping through the pdfs to merge and copying thir contents to the pdf created
  for (const pdfBytes of pdfsToMerge) {
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  
 //saving the newly created pdf
  const buffer = await mergedPdf.save(); 

  //Path to wherw the merge file will be stored
  let mergedpath = path.join(__dirname, "files/merged.pdf");

  //Opening the path and writing the new merged file to it
  fs.open(mergedpath, "w", function (err, fd) {
    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      fs.close(fd, function () {
        console.log("wrote the file successfully");
      });
    });
  });
};

merger();
