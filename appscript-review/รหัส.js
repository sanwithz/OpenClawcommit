function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
  .setTitle("Multiple File Upload + Tabulator")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDataFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data");
  var data = sheet.getDataRange().getValues();
  var headers = data.shift(); // Extract headers
  data.reverse();
  return data.map(row => headers.reduce((obj, header, i) => (obj[header] = row[i], obj), {}));
}


// Free short-link providers (no token needed)

function uploadFileToDrive(fileName, base64Data) {
  try {
    var folder = DriveApp.getFolderById('1QzexC5fl1kByaH4Rk5usG3iRBkb6J6yE');
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data");
    var uid = Utilities.getUuid();
    var contentType = getContentType(fileName.split('.').pop().toLowerCase());
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), contentType, fileName);
    var file = folder.createFile(blob);
    var fileId = file.getId();
    var fileUrl = "https://lh3.googleusercontent.com/d/" + fileId; // for image preview
    var shareUrl = "https://drive.google.com/file/d/" + fileId + "/view?usp=drivesdk"; // better for TinyURL

    // ensure link is accessible when shared
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var qrUrl = 'https://quickchart.io/qr?text=' + encodeURIComponent(shareUrl) + '&size=150&margin=1';

    normalizeSheetColumns_(sheet);
    sheet.appendRow([uid, fileName, fileUrl, qrUrl]);

    return {
      status: 'success',
      message: 'File uploaded successfully: ' + fileName,
      url: fileUrl,
      qrUrl: qrUrl
    };
  } catch (e) {
    Logger.log(e.toString());
    return {
      status: 'error',
      message: 'Error uploading file: ' + e.toString()
    };
  }
}

function normalizeSheetColumns_(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data || data.length === 0) {
    sheet.getRange(1, 1, 1, 4).setValues([['UID', 'NAME', 'URL', 'QR_URL']]);
    return;
  }

  var headers = data[0].map(function(h) { return String(h || '').trim().toUpperCase(); });
  var idxUID = headers.indexOf('UID');
  var idxName = headers.indexOf('NAME');
  var idxUrl = headers.indexOf('URL');
  var idxQr = headers.indexOf('QR_URL');

  var rebuilt = [['UID', 'NAME', 'URL', 'QR_URL']];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    rebuilt.push([
      idxUID > -1 ? row[idxUID] : '',
      idxName > -1 ? row[idxName] : '',
      idxUrl > -1 ? row[idxUrl] : '',
      idxQr > -1 ? row[idxQr] : ''
    ]);
  }

  sheet.clearContents();
  sheet.getRange(1, 1, rebuilt.length, 4).setValues(rebuilt);
}

function getContentType(fileExtension) {
  switch (fileExtension) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'pdf': return 'application/pdf';
    case 'txt': return 'text/plain';
    default: return 'application/octet-stream';
  }
}

function deleteFile(uid) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data");
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === uid) {
      var fileUrl = data[i][2];
      var fileId = fileUrl.split("/d/")[1].split("/")[0];
      var file = DriveApp.getFileById(fileId);
      file.setTrashed(true);
      sheet.deleteRow(i + 1);

      return {
        status: 'success',
        message: 'File deleted successfully.'
      };
    }
  }

  return {
    status: 'error',
    message: 'File not found.'
  };
}
