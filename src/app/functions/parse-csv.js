export default function parseCSV(csvText) {
  const rows = csvText.split(/\r?\n/); 
  const headers = rows[0].split(','); 
  const data = []; 
  for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(','); 
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
          rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
  }
  return data;
}