const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// Utility function to delete temp files
const cleanUp = (files) => {
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

// API Routes
app.post('/api/image-to-pdf', upload.array('files'), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.create();
    for (const file of req.files) {
      const imageBytes = fs.readFileSync(file.path);
      const image = file.mimetype === 'image/png' 
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0 });
    }
    const pdfBytes = await pdfDoc.save();
    res.contentType('application/pdf');
    res.send(pdfBytes);
    cleanUp(req.files);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/word-to-pdf', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.pdf`);
    execSync(`libreoffice --headless --convert-to pdf ${req.file.path} --outdir uploads`);
    const pdfBytes = fs.readFileSync(outputPath);
    res.contentType('application/pdf');
    res.send(pdfBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/excel-to-pdf', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.pdf`);
    execSync(`libreoffice --headless --convert-to pdf ${req.file.path} --outdir uploads`);
    const pdfBytes = fs.readFileSync(outputPath);
    res.contentType('application/pdf');
    res.send(pdfBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/ppt-to-pdf', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.pdf`);
    execSync(`libreoffice --headless --convert-to pdf ${req.file.path} --outdir uploads`);
    const pdfBytes = fs.readFileSync(outputPath);
    res.contentType('application/pdf');
    res.send(pdfBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/pdf-to-word', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.docx`);
    execSync(`libreoffice --headless --convert-to docx ${req.file.path} --outdir uploads`);
    const docxBytes = fs.readFileSync(outputPath);
    res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(docxBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/pdf-to-excel', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.xlsx`);
    execSync(`libreoffice --headless --convert-to xlsx ${req.file.path} --outdir uploads`);
    const xlsxBytes = fs.readFileSync(outputPath);
    res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(xlsxBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/pdf-to-ppt', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.pptx`);
    execSync(`libreoffice --headless --convert-to pptx ${req.file.path} --outdir uploads`);
    const pptxBytes = fs.readFileSync(outputPath);
    res.contentType('application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.send(pptxBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/pdf-to-jpg', upload.single('file'), (req, res) => {
  try {
    const outputDir = path.join(__dirname, 'uploads', `${Date.now()}`);
    fs.mkdirSync(outputDir);
    execSync(`pdftoppm -jpeg ${req.file.path} ${path.join(outputDir, 'page')}`);
    
    const files = fs.readdirSync(outputDir);
    const zipFiles = files.map(file => ({
      name: file,
      data: fs.readFileSync(path.join(outputDir, file))
    }));
    
    res.contentType('application/zip');
    res.send(createZip(zipFiles));
    cleanUp([req.file]);
    fs.rmdirSync(outputDir, { recursive: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/pdf-to-png', upload.single('file'), (req, res) => {
  try {
    const outputDir = path.join(__dirname, 'uploads', `${Date.now()}`);
    fs.mkdirSync(outputDir);
    execSync(`pdftoppm -png ${req.file.path} ${path.join(outputDir, 'page')}`);
    
    const files = fs.readdirSync(outputDir);
    const zipFiles = files.map(file => ({
      name: file,
      data: fs.readFileSync(path.join(outputDir, file))
    }));
    
    res.contentType('application/zip');
    res.send(createZip(zipFiles));
    cleanUp([req.file]);
    fs.rmdirSync(outputDir, { recursive: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/merge-pdf', upload.array('files'), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    res.contentType('application/pdf');
    res.send(mergedPdfBytes);
    cleanUp(req.files);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/split-pdf', upload.single('file'), async (req, res) => {
  try {
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const zipFiles = [];
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);
      const pageBytes = await newPdf.save();
      zipFiles.push({
        name: `page_${i+1}.pdf`,
        data: pageBytes
      });
    }
    
    res.contentType('application/zip');
    res.send(createZip(zipFiles));
    cleanUp([req.file]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/protect-pdf', upload.single('file'), async (req, res) => {
  try {
    const { password } = req.body;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const encryptedPdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'lowResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false
      }
    });
    
    res.contentType('application/pdf');
    res.send(encryptedPdfBytes);
    cleanUp([req.file]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/unlock-pdf', upload.single('file'), async (req, res) => {
  try {
    const { password } = req.body;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes, { password });
    
    const unlockedPdfBytes = await pdfDoc.save();
    res.contentType('application/pdf');
    res.send(unlockedPdfBytes);
    cleanUp([req.file]);
  } catch (err) {
    res.status(500).send('Incorrect password or file is corrupted');
  }
});

app.post('/api/compress-pdf', upload.single('file'), (req, res) => {
  try {
    const { quality } = req.body;
    let gsQuality;
    
    switch(quality) {
      case 'low': gsQuality = '/screen'; break;
      case 'medium': gsQuality = '/ebook'; break;
      case 'high': gsQuality = '/printer'; break;
      default: gsQuality = '/default';
    }
    
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.pdf`);
    execSync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${gsQuality} -dNOPAUSE -dBATCH -dQUIET -sOutputFile=${outputPath} ${req.file.path}`);
    const pdfBytes = fs.readFileSync(outputPath);
    res.contentType('application/pdf');
    res.send(pdfBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/rotate-pdf', upload.single('file'), async (req, res) => {
  try {
    const { angle } = req.body;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      page.setRotation((page.getRotation().angle + parseInt(angle)) % 360);
    });
    
    const rotatedPdfBytes = await pdfDoc.save();
    res.contentType('application/pdf');
    res.send(rotatedPdfBytes);
    cleanUp([req.file]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/repair-pdf', upload.single('file'), (req, res) => {
  try {
    const outputPath = path.join(__dirname, 'uploads', `${Date.now()}.pdf`);
    execSync(`gs -o ${outputPath} -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress ${req.file.path}`);
    const pdfBytes = fs.readFileSync(outputPath);
    res.contentType('application/pdf');
    res.send(pdfBytes);
    cleanUp([req.file]);
    fs.unlinkSync(outputPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Helper function to create zip files
function createZip(files) {
  const JSZip = require('jszip');
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(file.name, file.data);
  });
  
  return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
}

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
