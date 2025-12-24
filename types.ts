
export type ToolType = 
  | 'PDF_TO_DOC' 
  | 'PDF_TO_EXCEL' 
  | 'PDF_TO_IMAGE' 
  | 'DOC_TO_PDF' 
  | 'IMAGE_TO_PDF' 
  | 'MERGE_PDF' 
  | 'SPLIT_PDF' 
  | 'EDIT_PDF';

export interface PDFAnnotation {
  id: string;
  type: 'text' | 'signature';
  page: number;
  x: number;
  y: number;
  // Text specific
  text?: string;
  isBold?: boolean;
  isItalic?: boolean;
  // Signature specific
  imageData?: string; // base64 string
}

export interface AppFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: Uint8Array | string;
  previewUrl?: string;
}

export interface ConversionStatus {
  state: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}
