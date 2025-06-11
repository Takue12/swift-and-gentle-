npm install xlsx file-saver jspdf docx

// src/utils/exportUtils.ts
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export function exportToExcel(data: any, fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet([data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(file, `${fileName}.xlsx`);
}

export function exportToCSV(data: any, fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet([data]);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
}

export function exportToPDF(data: any, fileName: string) {
  const doc = new jsPDF();
  const entries = Object.entries(data);
  entries.forEach(([key, value], index) => {
    doc.text(`${key}: ${value}`, 10, 10 + index * 10);
  });
  doc.save(`${fileName}.pdf`);
}

export function exportToWord(data: any, fileName: string) {
  const doc = new Document({
    sections: [
      {
        children: Object.entries(data).map(([key, value]) =>
          new Paragraph({
            children: [new TextRun(`${key}: ${value}`)],
          })
        ),
      },
    ],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${fileName}.docx`);
  });
}
