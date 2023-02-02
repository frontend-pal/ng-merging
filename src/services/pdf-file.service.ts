import * as fileSaver from 'file-saver';
import { Injectable } from '@angular/core';
import { attachment } from './api.service';
import { PDFDocument, PDFPage } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfFileService {

  constructor() {

  }

  /**
   * 
   * @param attachFile Attached file From service
   * @returns only Base64 sting
   */
  getOnlyBase64String(attachFile: attachment): string {
    return attachFile?.onBase64?.split(',').pop() || '';
  }


  /**
   * 
   * @param data Generic to transform ArrayBuffer to Blob Files
   * @return Blob
   */
  ArrayBufferBlob(data: any) {
    return new Blob([data]);
  }

  /**
   * 
   * @param base64
   * @returns Generic ArrayBuffer
   */
  base64ToArrayBuffer(base64: string) {
    const binary_string = window.atob(decodeURI(base64));
    const len = binary_string.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
  }


  /**
   * 
   * @param pdfsToMerge Merge ArrayBuffer[] to an unique ArrayBufferLike
   * @returns Promise<ArrayBufferLike>
   */
  async mergePdfs(pdfsToMerge: ArrayBuffer[]): Promise<ArrayBufferLike> {
    const mergedPdf: PDFDocument = await PDFDocument.create();
    const createInnerPromise = async (arrayBuffer: ArrayBuffer): Promise<PDFPage[]> => {
      const pdf: PDFDocument = await PDFDocument.load(arrayBuffer);
      return await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    };
    const outerPromise: Promise<PDFPage[]>[] = pdfsToMerge.map((arrayBuffer) => {
      const innerPromise: Promise<PDFPage[]> = createInnerPromise(arrayBuffer);
      return innerPromise;
    });

    const resultOuterPromise: PDFPage[][] = await Promise.all(outerPromise);

    resultOuterPromise.forEach((pageArray: PDFPage[]) => {
      pageArray.forEach((page: PDFPage) => {
        mergedPdf.addPage(page);
      });
    });

    return (await mergedPdf.save()).buffer;
  }

  /**
   * 
   * @param data Generic to save Blob Files
   */
  saveFile(data: any) {
    const blob = this.ArrayBufferBlob(data);
    const file = new Blob([blob], { type: 'application/pdf' });

    fileSaver.saveAs(file, 'nombrequeparezca.pdf');
  }

  /**
   * 
   * @param data Generic to show Blob Files
   */
  showFile(data: any) {
    const blob = this.ArrayBufferBlob(data);
    const file = new Blob([blob], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    window.open(fileURL);
  }
}
