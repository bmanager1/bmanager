function doPost(e) {
  try {
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheets()[0];
    const dados = JSON.parse(e.postData.contents);
    const nome = dados.nome || "";
    const email = dados.email || "";
    const material = dados.material || "";
    if (!nome || !email) {
      return ContentService.createTextOutput(JSON.stringify({sucesso:false,mensagem:"Nome e e-mail são obrigatórios."})).setMimeType(ContentService.MimeType.JSON);
    }
    aba.appendRow([new Date(), nome, email, material]);
    return ContentService.createTextOutput(JSON.stringify({sucesso:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (erro) {
    return ContentService.createTextOutput(JSON.stringify({sucesso:false,mensagem:erro.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
