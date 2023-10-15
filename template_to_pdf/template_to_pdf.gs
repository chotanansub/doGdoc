function generatePDFsFromTemplate(docFileId, tempFolderId, pdfFolderId, sheetName, placeholders) {
    const docFile = DriveApp.getFileById(docFileId);
    const tempFolder = DriveApp.getFolderById(tempFolderId);
    const pdfFolder = DriveApp.getFolderById(pdfFolderId);
    const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    
  if (!currentSheet) {
      Logger.log(`❌ Sheet "${sheetName}" not found.`);
      return;
  }

    const data = currentSheet.getRange(2, 1, currentSheet.getLastRow() - 1, placeholders.length).getValues();

  data.forEach(row => {
      const values = placeholders.map(placeholder => row[placeholder.index]);
      const pdfName = placeholder.nameFunction(...values);

      createPDF(docFile, tempFolder, pdfFolder, pdfName, placeholders, ...values);
      Logger.log(`✅ Exported: ${pdfName}`);
  });
}

function createPDF(docFile, tempFolder, pdfFolder, pdfName, placeholders, ...values) {
    const tempFile = docFile.makeCopy(tempFolder);
    const tempDocFile = DocumentApp.openById(tempFile.getId());
    const body = tempDocFile.getBody();

    placeholders.forEach(placeholder => {
      const searchPattern = new RegExp(`%${placeholder.name}%`, 'g');
      const value = values[placeholder.index];
      body.replaceText(searchPattern, value);
    });

    tempDocFile.saveAndClose();
    const pdfContentBlob = tempFile.getAs(MimeType.PDF);
    pdfFolder.createFile(pdfContentBlob).setName(pdfName);
    tempFolder.removeFile(tempFile);
  }

    // Example usage:
    const placeholders = [
      { name: 'NICKNAME', nameFunction: (nickname) => nickname, index: 0 },
      { name: 'FIRSTNAME', nameFunction: (firstname) => firstname, index: 1 },
      { name: 'SURNAME', nameFunction: (surname) => surname, index: 2 },
    ];

  //Replacec --docFile, --tempFolder, and --pdfFolder with thier ID
  generatePDFsFromTemplate(--docFile, --tempFolder, --pdfFolder, "Sheet1", placeholders);