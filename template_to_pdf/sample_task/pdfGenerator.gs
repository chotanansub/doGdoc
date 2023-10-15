function createBulkPDFs(){
  const docFile = DriveApp.getFileById("INSERT-ID-HERE");
  const tempFolder = DriveApp.getFolderById("INSERT-ID-HERE");
  const pdfFolder = DriveApp.getFolderById("INSERT-ID-HERE");
  const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  
   // start row, start column, range row, range column,
  const data = currentSheet.getRange(2,1, currentSheet.getLastRow()-1,3).getValues(); 

  data.forEach(row=> {
    let nickname = row[0];
    let firstname = row[1];
    let surname = row[2];
    let pdfName = `${nickname} ${firstname}`;

    createPDF(nickname,firstname,surname,pdfName, docFile, tempFolder, pdfFolder);
     Logger.log(`✅ Exported: ${pdfName}`);
  });
}

function createPDF(nickname, firstname, surname, pdfName,docFile, tempFolder, pdfFolder){
  const tempFile = docFile.makeCopy(tempFolder);
  const tempDocFile = DocumentApp.openById(tempFile.getId());
  const body = tempDocFile.getBody();

  body.replaceText("%NICKNAME%", nickname);
  body.replaceText("%FIRSTNAME%", firstname);
  body.replaceText("%SURNAME%", surname);

  tempDocFile.saveAndClose();

  const pdfContentBlob = tempFile.getAs(MimeType.PDF);
  pdfFolder.createFile(pdfContentBlob).setName(pdfName);
  tempFolder.removeFile(tempFile);
}