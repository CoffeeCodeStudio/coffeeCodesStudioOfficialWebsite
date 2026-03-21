import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface FilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  filePath: string;
}

const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const pdfExts = ['pdf'];
const textExts = ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'log'];

function getExt(name: string) {
  return name.split('.').pop()?.toLowerCase() || '';
}

export function FilePreviewModal({ open, onOpenChange, fileName, filePath }: FilePreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ext = getExt(fileName);
  const isImage = imageExts.includes(ext);
  const isPdf = pdfExts.includes(ext);
  const isText = textExts.includes(ext);
  const canPreview = isImage || isPdf || isText;

  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
      setBlobUrl(null);
      setTextContent(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      const { data } = await supabase.storage.from('project-files').download(filePath);
      if (data) {
        if (isText) {
          setTextContent(await data.text());
        } else {
          const url = URL.createObjectURL(data);
          blobUrlRef.current = url;
          setBlobUrl(url);
        }
      }
      setLoading(false);
    };
    load();

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [open, filePath, isText]);

  const handleDownload = async () => {
    const { data } = await supabase.storage.from('project-files').download(filePath);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium truncate">{fileName}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : canPreview ? (
            <>
              {isImage && blobUrl && (
                <img src={blobUrl} alt={fileName} className="max-w-full max-h-[60vh] mx-auto rounded-lg object-contain" />
              )}
              {isPdf && blobUrl && (
                <iframe src={blobUrl} className="w-full h-[60vh] rounded-lg border border-border/30" title={fileName} />
              )}
              {isText && textContent !== null && (
                <pre className="text-xs text-foreground bg-muted/30 p-4 rounded-lg overflow-auto max-h-[60vh] whitespace-pre-wrap break-words font-mono">
                  {textContent}
                </pre>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-sm text-muted-foreground">Förhandsgranskning stöds inte för denna filtyp.</p>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Ladda ner fil
              </Button>
            </div>
          )}
        </div>

        {canPreview && !loading && (
          <div className="pt-3 border-t border-border/30 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Ladda ner
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
