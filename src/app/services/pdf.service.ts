import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { vfs } from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {
  }

  public async buildPDF(form: any): Promise<Blob> {
    const pdfMake = await import('pdfmake/build/pdfmake');
    const vfs = await import('pdfmake/build/vfs_fonts');
    (pdfMake as any).vfs = vfs;

    const docDefinition: any = {
      content: [
        { text: new Date(form.invoiceDate).toDateString(), alignment: 'right' },
        { text: 'Invoice', style: 'header' },
        {
          columns: [
            { text: 'Full Name:', style: 'key', width: 200 },
            { text: form.fullName, style: 'value' }
          ], style: 'row'
        },
        {
          columns: [
            { text: 'Email:', style: 'key', width: 200 },
            { text: form.email, style: 'value' }
          ], style: 'row'
        },
        {
          columns: [
            { text: 'Phone:', style: 'key', width: 200 },
            { text: form.phone, style: 'value' }
          ], style: 'row'
        },
        {
          columns: [
            { text: 'Invoice Number:', style: 'key', width: 200 },
            { text: form.invoiceNumber, style: 'value' }
          ], style: 'row'
        },
        {
          columns: [
            { text: 'Amount:', style: 'key', width: 200 },
            { text: form.amount, style: 'value' }
          ], style: 'row2'
        },
        {
          columns: [
            { text: '', width: 240 },
            { text: 'Signature:   ', style: 'key', width: 80 },
            { image: form.signature, style: 'value', width: 100 }
          ]
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 50], alignment: 'center' },
        row: { margin: [0, 0, 0, 15] },
        row2: { margin: [0, 0, 0, 80] },
        key: { bold: true },
        value: { decoration: 'underline' }
      }
    };

    return new Promise((resolve) => {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  }

}
