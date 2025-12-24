
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  FileText, 
  Files, 
  Scissors, 
  Edit3, 
  FileImage, 
  FileSpreadsheet, 
  ArrowRightLeft, 
  Download, 
  Plus, 
  Trash2, 
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ScanText,
  Search,
  Lock,
  Eye,
  EyeOff,
  Hash,
  Layout,
  Layers,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw,
  PlusCircle,
  History,
  Printer,
  Bold,
  Italic,
  Settings,
  Pencil,
  Eraser,
  X
} from 'lucide-react';
import { ToolType, AppFile, ConversionStatus, PDFAnnotation } from './types';
import { PDFEngine } from './services/pdfEngine';
import { extractDocumentContent, performOCR } from './services/aiService';

const STORAGE_KEY = 'documorph_pdf_editor_session';

const SignaturePad = ({ onSave, onCancel }: { onSave: (data: string) => void, onCancel: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Pencil size={20} className="text-[#0088cc]" />
            Draw Signature
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <canvas
            ref={canvasRef}
            width={440}
            height={200}
            className="w-full h-[200px] border-2 border-dashed border-slate-200 rounded-2xl cursor-crosshair touch-none bg-slate-50"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={clear}
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-semibold px-4 py-2 transition-colors"
            >
              <Eraser size={18} /> Clear
            </button>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#0088cc] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-[#0088cc]/20 hover:bg-[#0077bb] active:scale-95 transition-all"
              >
                Add to PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reconstructed MJ Logo Component
const MJLogo = () => (
  <div className="flex flex-col items-center">
    <div className="relative w-24 h-20 mb-1">
      <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Antennas/Cables */}
        <path d="M10 20C25 15 45 15 60 25" stroke="#0088cc" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M15 10C35 5 55 10 65 20" stroke="#b0b0b0" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="10" cy="20" r="4" fill="#0088cc"/>
        
        {/* Main Body (Satellite/Mouse) */}
        <ellipse cx="70" cy="40" rx="30" ry="25" fill="#0088cc" transform="rotate(-15 70 40)"/>
        <path d="M50 35C60 30 80 30 90 45" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M65 20C65 30 65 50 65 60" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="65" cy="30" r="3" fill="white"/>
        
        {/* Shadow accent */}
        <path d="M85 60C75 65 55 65 45 55" stroke="#b0b0b0" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
      </svg>
    </div>
    <div className="flex flex-col items-center leading-none">
      <div className="flex items-end gap-1">
        <span className="text-4xl font-black text-[#0088cc] italic">m</span>
        <span className="text-4xl font-black text-slate-800">J</span>
      </div>
      <div className="mt-1 tracking-[0.2em] text-[10px] font-bold text-slate-600 uppercase">
        Internet Café
      </div>
    </div>
  </div>
);

const TOOLS = [
  { id: 'PDF_TO_DOC', name: 'PDF to Word', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'AI-powered text extraction to .docx' },
  { id: 'PDF_TO_EXCEL', name: 'PDF to Excel', icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50', desc: 'Analyze and extract tables to .xlsx' },
  { id: 'PDF_TO_IMAGE', name: 'PDF to Image', icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Convert PDF pages to high-res PNGs' },
  { id: 'MERGE_PDF', name: 'Merge PDF', icon: Files, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Combine multiple PDFs into one' },
  { id: 'SPLIT_PDF', name: 'Split PDF', icon: Scissors, color: 'text-red-600', bg: 'bg-red-50', desc: 'Split a PDF into separate files' },
  { id: 'EDIT_PDF', name: 'Edit PDF', icon: Edit3, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Add annotations and text to PDFs' },
  { id: 'IMAGE_TO_PDF', name: 'Image to PDF', icon: ArrowRightLeft, color: 'text-teal-600', bg: 'bg-teal-50', desc: 'Convert JPG/PNG to PDF (OCR optional)' },
  { id: 'DOC_TO_PDF', name: 'Word to PDF', icon: FileText, color: 'text-pink-600', bg: 'bg-pink-50', desc: 'Generate PDF from Word files' },
] as const;

export default function App() {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [files, setFiles] = useState<AppFile[]>([]);
  const [status, setStatus] = useState<ConversionStatus>({ state: 'idle', progress: 0 });
  
  // PDF Edit State with localStorage initialization
  const getInitialEditorState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          annotations: parsed.annotations || [],
          history: parsed.history || [[]],
          historyIndex: parsed.historyIndex || 0
        };
      }
    } catch (e) {
      console.warn("Failed to load saved session", e);
    }
    return { annotations: [], history: [[]], historyIndex: 0 };
  };

  const initialEditorState = getInitialEditorState();
  const [editPrompt, setEditPrompt] = useState('');
  const [editTargetPage, setEditTargetPage] = useState('1');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>(initialEditorState.annotations);
  const [history, setHistory] = useState<PDFAnnotation[][]>(initialEditorState.history);
  const [historyIndex, setHistoryIndex] = useState(initialEditorState.historyIndex);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const [splitRanges, setSplitRanges] = useState('1, 2-3');
  const [excelSheetName, setExcelSheetName] = useState('Sheet1');
  const [ocrEnabled, setOcrEnabled] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save feature
  useEffect(() => {
    const session = {
      annotations,
      history,
      historyIndex
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [annotations, history, historyIndex]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    selectedFiles.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (result) {
          const newFile: AppFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: f.name,
            size: f.size,
            type: f.type,
            data: new Uint8Array(result as ArrayBuffer),
            previewUrl: URL.createObjectURL(new Blob([result], { type: f.type }))
          };
          setFiles(prev => [...prev, newFile]);
        }
      };
      reader.readAsArrayBuffer(f);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return updated;
    });
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setFiles(prev => {
      const newFiles = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newFiles.length) {
        [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      }
      return newFiles;
    });
  };

  const addAnnotation = () => {
    if (!editPrompt.trim()) return;
    const newAnn: PDFAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      text: editPrompt,
      page: parseInt(editTargetPage) || 1,
      x: 50,
      y: 50,
      isBold,
      isItalic
    };
    const newAnnotations = [...annotations, newAnn];
    updateAnnotations(newAnnotations);
    setEditPrompt('');
  };

  const addSignature = (data: string) => {
    const newAnn: PDFAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'signature',
      imageData: data,
      page: parseInt(editTargetPage) || 1,
      x: 50,
      y: 50
    };
    const newAnnotations = [...annotations, newAnn];
    updateAnnotations(newAnnotations);
    setShowSignaturePad(false);
  };

  const updateAnnotations = (newAnnotations: PDFAnnotation[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAnnotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setAnnotations(newAnnotations);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAnnotations(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAnnotations(history[newIndex]);
    }
  };

  const removeAnnotation = (id: string) => {
    const newAnnotations = annotations.filter(a => a.id !== id);
    updateAnnotations(newAnnotations);
  };

  const downloadBlob = (data: Uint8Array | Blob, filename: string) => {
    const blob = data instanceof Blob ? data : new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToBase64 = (data: Uint8Array): string => {
    const binary = Array.from(data).map(b => String.fromCharCode(b)).join('');
    return `data:image/png;base64,${btoa(binary)}`;
  };

  const handlePrint = async () => {
    if (files.length === 0) return;
    setStatus({ state: 'processing', progress: 0, message: 'Preparing print document...' });
    const passwordToUse = passwordEnabled ? pdfPassword : undefined;
    
    try {
      const currentFile = files[0];
      const edited = await PDFEngine.applyAnnotationsToPDF(
        currentFile.data as Uint8Array, 
        annotations,
        passwordToUse
      );
      
      const blob = new Blob([edited], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      };

      setStatus({ state: 'completed', progress: 100, message: 'Print dialog ready!' });
      setTimeout(() => setStatus({ state: 'idle', progress: 0 }), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ state: 'error', progress: 0, message: 'Print failed. Check file access.' });
    }
  };

  const runProcess = async () => {
    if (files.length === 0) return;
    setStatus({ state: 'processing', progress: 0, message: 'Initializing...' });
    const passwordToUse = passwordEnabled ? pdfPassword : undefined;

    try {
      if (selectedTool === 'MERGE_PDF') {
        setStatus({ state: 'processing', progress: 50, message: 'Merging all files in sequence...' });
        const merged = await PDFEngine.mergePDFs(files.map(f => f.data as Uint8Array), passwordToUse);
        downloadBlob(merged, 'merged_document.pdf');
        setStatus({ state: 'completed', progress: 100, message: 'Merge complete!' });
      } 
      else if (selectedTool === 'IMAGE_TO_PDF') {
        let ocrTexts: string[] | undefined = undefined;
        if (ocrEnabled) {
          ocrTexts = [];
          for (let i = 0; i < files.length; i++) {
            const batchProgress = Math.floor((i / files.length) * 80);
            setStatus({ 
              state: 'processing', 
              progress: batchProgress, 
              message: `Gemini OCR: Analyzing image ${i+1} of ${files.length}...` 
            });
            const base64 = convertToBase64(files[i].data as Uint8Array);
            const text = await performOCR(base64);
            ocrTexts.push(text);
          }
        }
        setStatus({ state: 'processing', progress: 90, message: 'Compiling PDF...' });
        const imgUrls = files.map(f => f.previewUrl!);
        const pdf = await PDFEngine.imagesToPDF(imgUrls, ocrTexts, passwordToUse);
        downloadBlob(pdf, 'compiled_images.pdf');
        setStatus({ state: 'completed', progress: 100, message: 'Images compiled to PDF!' });
      } 
      else {
        for (let i = 0; i < files.length; i++) {
          const currentFile = files[i];
          const fileNameBase = currentFile.name.replace(/\.[^/.]+$/, "");
          const batchProgress = Math.floor((i / files.length) * 100);
          
          setStatus({ 
            state: 'processing', 
            progress: batchProgress, 
            message: `Processing ${i + 1}/${files.length}: ${currentFile.name}` 
          });

          switch (selectedTool) {
            case 'SPLIT_PDF': {
              const results = await PDFEngine.splitPDF(currentFile.data as Uint8Array, splitRanges || "1", passwordToUse);
              results.forEach((data, j) => downloadBlob(data, `${fileNameBase}_part_${j+1}.pdf`));
              break;
            }

            case 'PDF_TO_IMAGE': {
              const images = await PDFEngine.pdfToImages(currentFile.data as Uint8Array);
              images.forEach((dataUrl, j) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${fileNameBase}_page_${j+1}.png`;
                link.click();
              });
              break;
            }

            case 'DOC_TO_PDF': {
              const pdf = await PDFEngine.convertDocToPdf(currentFile.data as Uint8Array, passwordToUse);
              downloadBlob(pdf, `${fileNameBase}.pdf`);
              break;
            }

            case 'EDIT_PDF': {
              const edited = await PDFEngine.applyAnnotationsToPDF(
                currentFile.data as Uint8Array, 
                annotations,
                passwordToUse
              );
              downloadBlob(edited, `${fileNameBase}_edited.pdf`);
              break;
            }

            case 'PDF_TO_DOC':
            case 'PDF_TO_EXCEL': {
              const images = await PDFEngine.pdfToImages(currentFile.data as Uint8Array);
              const allSections = [];
              const allTables = [];
              
              for (let j = 0; j < images.length; j++) {
                const aiData = await extractDocumentContent(images[j], selectedTool === 'PDF_TO_DOC' ? 'DOC' : 'EXCEL');
                if (selectedTool === 'PDF_TO_DOC' && aiData.sections) {
                  allSections.push(...aiData.sections);
                } else if (selectedTool === 'PDF_TO_EXCEL' && aiData.tables) {
                  allTables.push(...aiData.tables);
                }
              }
              
              if (selectedTool === 'PDF_TO_EXCEL') {
                const wb = (window as any).XLSX.utils.book_new();
                const baseSheetName = excelSheetName || 'Sheet1';
                allTables.forEach((t: any, idx: number) => {
                  const ws = (window as any).XLSX.utils.aoa_to_sheet(t.rows);
                  const finalSheetName = allTables.length > 1 
                    ? `${baseSheetName} ${idx + 1}`.substring(0, 31) 
                    : baseSheetName.substring(0, 31);
                  (window as any).XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
                });
                const excelBuffer = (window as any).XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                downloadBlob(new Uint8Array(excelBuffer), `${fileNameBase}.xlsx`);
              } else {
                const { Document, Packer, Paragraph, TextRun, HeadingLevel } = (window as any).docx;
                const doc = new Document({
                  sections: [{
                    children: allSections.map((s: any) => {
                      return new Paragraph({
                        text: s.content,
                        heading: s.type === 'heading1' ? HeadingLevel.HEADING_1 : 
                                 s.type === 'heading2' ? HeadingLevel.HEADING_2 : undefined,
                        spacing: { after: 200 }
                      });
                    })
                  }]
                });
                const buffer = await Packer.toUint8Array(doc);
                downloadBlob(buffer, `${fileNameBase}.docx`);
              }
              break;
            }
          }
        }
        setStatus({ state: 'completed', progress: 100, message: `Successfully processed ${files.length} files!` });
      }

      setTimeout(() => setStatus({ state: 'idle', progress: 0 }), 5000);
    } catch (err) {
      console.error(err);
      setStatus({ state: 'error', progress: 0, message: 'Processing error. Check console for details.' });
    }
  };

  const isPDFOutput = selectedTool && ['MERGE_PDF', 'SPLIT_PDF', 'EDIT_PDF', 'IMAGE_TO_PDF', 'DOC_TO_PDF'].includes(selectedTool);

  const clearEditorSession = () => {
    setAnnotations([]);
    setHistory([[]]);
    setHistoryIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {showSignaturePad && (
        <SignaturePad 
          onSave={addSignature} 
          onCancel={() => setShowSignaturePad(false)} 
        />
      )}
      
      <header className="text-center mb-12">
        <div className="flex flex-col items-center gap-4 mb-6">
          <MJLogo />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
            DocuMorph AI
          </h1>
        </div>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto italic">
          High-performance document processing suite with Gemini Intelligence.
        </p>
      </header>

      {!selectedTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className="group glass-panel p-6 rounded-3xl text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#0088cc]/30"
            >
              <div className={`${tool.bg} ${tool.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tool.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{tool.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
            <button 
              onClick={() => { 
                setSelectedTool(null); 
                setFiles([]); 
                setOcrEnabled(false); 
                setPasswordEnabled(false);
                setPdfPassword('');
                setEditPrompt('');
                setEditTargetPage('1');
                setIsBold(false);
                setIsItalic(false);
                setSplitRanges('1, 2-3');
                setExcelSheetName('Sheet1');
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-[#0088cc] font-medium transition-colors"
            >
              <ChevronLeft size={20} /> Back to Tools
            </button>
            <div className="flex items-center gap-3">
              <span className="bg-[#0088cc]/10 text-[#0088cc] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                {selectedTool.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-6">
              <div 
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all
                  ${files.length === 0 ? 'border-slate-300 bg-slate-50 py-16' : 'border-[#0088cc]/30 bg-[#0088cc]/5'}`}
              >
                <div className="bg-white p-4 rounded-full shadow-sm">
                  <Upload className="text-[#0088cc]" size={32} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 mb-1">Upload Documents</p>
                  <p className="text-sm text-slate-500">PDF, DOC, JPG or PNG</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#0088cc] hover:bg-[#0077bb] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#0088cc]/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus size={18} /> Select Files
                </button>
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>

              {files.length > 1 && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                  <Layers className="text-orange-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-bold text-orange-800">
                      {selectedTool === 'MERGE_PDF' ? 'Sequential Merger' : 'Batch Mode Active'}
                    </p>
                    <p className="text-[11px] text-orange-700 leading-tight mt-1">
                      {selectedTool === 'MERGE_PDF' || selectedTool === 'IMAGE_TO_PDF' 
                        ? 'Files will be combined in the order listed below.' 
                        : 'Files will be processed individually and downloaded as a sequence.'}
                    </p>
                  </div>
                </div>
              )}

              {selectedTool === 'PDF_TO_EXCEL' && files.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Settings size={16} className="text-[#0088cc]" />
                    Output Sheet Name
                  </label>
                  <input
                    type="text"
                    value={excelSheetName}
                    onChange={(e) => setExcelSheetName(e.target.value)}
                    placeholder="e.g., MonthlyReport"
                    className="w-full rounded-xl border-slate-200 bg-white p-3 text-sm text-slate-700 focus:ring-2 focus:ring-[#0088cc] outline-none shadow-sm"
                  />
                </div>
              )}

              {selectedTool === 'EDIT_PDF' && files.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Edit3 size={14} /> Annotation Workspace
                    </h5>
                    <div className="flex gap-2">
                      <button 
                        onClick={undo} 
                        title="Undo"
                        disabled={historyIndex === 0}
                        className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-[#0088cc] disabled:opacity-30 transition-all shadow-sm"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={redo} 
                        title="Redo"
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-[#0088cc] disabled:opacity-30 transition-all shadow-sm"
                      >
                        <RotateCw size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Layout size={16} className="text-[#0088cc]" />
                      Target Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editTargetPage}
                      onChange={(e) => setEditTargetPage(e.target.value)}
                      placeholder="e.g., 1"
                      className="w-full rounded-xl border-slate-200 bg-white p-3 text-sm text-slate-700 focus:ring-2 focus:ring-[#0088cc] outline-none shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Edit3 size={16} className="text-[#0088cc]" />
                        Text Content
                      </label>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setIsBold(!isBold)}
                          className={`p-1.5 rounded-lg border transition-all ${isBold ? 'bg-[#0088cc] text-white border-[#0088cc]' : 'bg-white text-slate-400 border-slate-100 hover:border-[#0088cc]'}`}
                          title="Bold"
                        >
                          <Bold size={14} />
                        </button>
                        <button 
                          onClick={() => setIsItalic(!isItalic)}
                          className={`p-1.5 rounded-lg border transition-all ${isItalic ? 'bg-[#0088cc] text-white border-[#0088cc]' : 'bg-white text-slate-400 border-slate-100 hover:border-[#0088cc]'}`}
                          title="Italic"
                        >
                          <Italic size={14} />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="Enter text to overlay..."
                      className={`w-full rounded-2xl border-slate-200 bg-white p-4 text-sm text-slate-700 focus:ring-2 focus:ring-[#0088cc] outline-none h-24 shadow-sm ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={addAnnotation}
                      className="flex items-center justify-center gap-2 bg-[#0088cc]/10 text-[#0088cc] py-3 rounded-xl font-bold hover:bg-[#0088cc] hover:text-white transition-all active:scale-95"
                    >
                      <PlusCircle size={18} /> Add Text
                    </button>
                    <button 
                      onClick={() => setShowSignaturePad(true)}
                      className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                    >
                      <Pencil size={18} /> Signature
                    </button>
                  </div>

                  <button 
                    onClick={clearEditorSession}
                    className="w-full flex items-center justify-center gap-2 text-slate-400 py-2 rounded-xl text-xs font-medium hover:text-red-500 transition-all"
                  >
                    <Trash2 size={12} /> Reset Editor Session
                  </button>
                </div>
              )}

              {selectedTool === 'SPLIT_PDF' && files.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Hash size={16} className="text-[#0088cc]" />
                    Page Ranges
                  </label>
                  <input
                    type="text"
                    value={splitRanges}
                    onChange={(e) => setSplitRanges(e.target.value)}
                    placeholder="e.g., 1, 3, 5-10"
                    className="w-full rounded-xl border-slate-200 bg-white p-3 text-sm text-slate-700 focus:ring-2 focus:ring-[#0088cc] outline-none shadow-sm"
                  />
                </div>
              )}

              {selectedTool === 'IMAGE_TO_PDF' && files.length > 0 && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ScanText size={18} className="text-[#0088cc]" />
                      <span className="font-bold text-slate-700 text-sm">Gemini OCR</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={ocrEnabled}
                        onChange={(e) => setOcrEnabled(e.target.checked)}
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0088cc]"></div>
                    </label>
                  </div>
                </div>
              )}

              {isPDFOutput && files.length > 0 && (
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock size={18} className="text-blue-600" />
                      <span className="font-bold text-slate-700 text-sm">Password Protect</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={passwordEnabled}
                        onChange={(e) => setPasswordEnabled(e.target.checked)}
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {passwordEnabled && (
                    <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={pdfPassword}
                        onChange={(e) => setPdfPassword(e.target.value)}
                        placeholder="Enter PDF password..."
                        className="w-full text-sm rounded-xl border-slate-200 bg-white py-2.5 pl-4 pr-10 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-8">
                {selectedTool === 'EDIT_PDF' && annotations.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                      <History size={18} className="text-[#0088cc]" />
                      Auto-saved Annotations ({annotations.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {annotations.map((ann) => (
                        <div key={ann.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-sm group">
                          <div className="flex-1 truncate">
                            <span className="text-[10px] font-bold text-[#0088cc] bg-[#0088cc]/10 px-2 py-0.5 rounded-full mr-2">
                              Page {ann.page}
                            </span>
                            {ann.type === 'signature' ? (
                              <img src={ann.imageData} alt="Signature" className="h-8 inline-block object-contain" />
                            ) : (
                              <span className={`text-sm text-slate-700 truncate inline-block max-w-[150px] align-middle ${ann.isBold ? 'font-bold' : ''} ${ann.isItalic ? 'italic' : ''}`}>
                                {ann.text}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeAnnotation(ann.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-700">Selected Documents ({files.length})</h4>
                    {files.length > 0 && (
                      <button 
                        onClick={() => setFiles([])}
                        className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {files.length === 0 ? (
                      <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-slate-400">No files uploaded yet.</p>
                      </div>
                    ) : (
                      files.map((file, idx) => (
                        <div key={file.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 group hover:border-[#0088cc]/30 transition-all shadow-sm">
                          <div className="flex flex-col gap-1 items-center shrink-0">
                            <button 
                              disabled={idx === 0}
                              onClick={() => moveFile(idx, 'up')}
                              className="p-1 text-slate-300 hover:text-[#0088cc] disabled:opacity-20 transition-colors"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <span className="text-[10px] font-bold text-[#0088cc] bg-[#0088cc]/10 w-6 h-6 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <button 
                              disabled={idx === files.length - 1}
                              onClick={() => moveFile(idx, 'down')}
                              className="p-1 text-slate-300 hover:text-[#0088cc] disabled:opacity-20 transition-colors"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          
                          <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-[#0088cc]/10 transition-colors">
                            <FileText className="text-slate-400 group-hover:text-[#0088cc]" size={24} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase()}</p>
                          </div>
                          
                          <button 
                            onClick={() => removeFile(file.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1 w-full">
                        {status.state !== 'idle' && (
                          <div className="animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 mb-3">
                              {status.state === 'processing' && <Loader2 className="animate-spin text-[#0088cc]" size={20} />}
                              {status.state === 'completed' && <CheckCircle2 className="text-green-500" size={20} />}
                              {status.state === 'error' && <AlertCircle className="text-red-500" size={20} />}
                              <span className="font-semibold text-slate-700 text-sm truncate">{status.message}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#0088cc] transition-all duration-500 rounded-full"
                                style={{ width: `${status.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {selectedTool === 'EDIT_PDF' && (
                          <button
                            disabled={status.state === 'processing'}
                            onClick={handlePrint}
                            className={`
                              flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all
                              ${status.state === 'processing' 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-[#0088cc] hover:text-[#0088cc] active:scale-95'}
                            `}
                          >
                            Print
                            <Printer size={22} />
                          </button>
                        )}
                        <button
                          disabled={status.state === 'processing'}
                          onClick={runProcess}
                          className={`
                            flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all
                            ${status.state === 'processing' 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                              : 'bg-[#0088cc] text-white hover:bg-[#0077bb] active:scale-95 shadow-[#0088cc]/20'}
                          `}
                        >
                          {status.state === 'processing' ? 'Processing...' : (selectedTool === 'MERGE_PDF' ? 'Merge & Download' : (selectedTool === 'EDIT_PDF' ? 'Apply & Download' : 'Start Batch Process'))}
                          <Download size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 text-center text-slate-400 text-sm">
        <p>&copy; 2024 MJ DocuMorph. All processing happens locally in your browser for privacy.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-[#0088cc] transition-colors">MJ Café Portal</a>
          <a href="#" className="hover:text-[#0088cc] transition-colors">Privacy</a>
          <a href="https://ai.google.dev/gemini-api/docs/billing" className="hover:text-[#0088cc] transition-colors" target="_blank" rel="noopener noreferrer">Billing Docs</a>
        </div>
      </footer>
    </div>
  );
}
