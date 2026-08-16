declare module '@pdfsmaller/pdf-encrypt' {
  export interface EncryptOptions {
    ownerPassword?: string;
    algorithm?: 'AES-256' | 'RC4';
    allowPrinting?: boolean;
    allowModifying?: boolean;
    allowCopying?: boolean;
    allowAnnotating?: boolean;
    allowFillingForms?: boolean;
    allowExtraction?: boolean;
    allowAssembly?: boolean;
    allowHighQualityPrint?: boolean;
  }

  export function encryptPDF(
    pdfBytes: Uint8Array,
    userPassword?: string,
    options?: EncryptOptions
  ): Promise<Uint8Array>;
}
