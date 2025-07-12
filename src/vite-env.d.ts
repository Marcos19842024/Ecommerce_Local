/// <reference types="vite/client" />

declare module 'pdfjs-dist/build/pdf.worker.entry' {
  const workerSrc: string;
  export default workerSrc;
}
declare module 'pdfjs-dist/build/pdf' {
  export * from 'pdfjs-dist/types/src/pdf';
  const pdfjsLib: any;
  export  default pdfjsLib;
}