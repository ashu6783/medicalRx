declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | number[];
      filename?: string;
      image?: { type?: string; quality?: number };
      enableLinks?: boolean;
      html2canvas?: { scale?: number; logging?: boolean };
      jsPDF?: {
        unit?: 'pt' | 'mm' | 'cm' | 'in';
        format?: string | [number, number];
        orientation?: 'portrait' | 'landscape';
      };
      pagebreak?: { mode?: string[] };
    }
  
    interface Html2PdfInstance {
      from: (element: HTMLElement) => Html2PdfFrom;
    }
  
    interface Html2PdfFrom {
      set: (options: Html2PdfOptions) => Html2PdfSave;
    }
  
    interface Html2PdfSave {
      save: () => void;
    }
  
    const html2pdf: () => Html2PdfInstance;
  
    export default html2pdf;
  }
  