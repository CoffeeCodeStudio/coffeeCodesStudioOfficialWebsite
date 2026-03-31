import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crop as CropIcon, Loader2 } from 'lucide-react';

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

async function getCroppedFile(image: HTMLImageElement, crop: PixelCrop): Promise<File> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0,
    canvas.width, canvas.height,
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'cropped.webp', { type: 'image/webp' }));
    }, 'image/webp', 0.9);
  });
}

const ASPECT = 4 / 3;

export function ImageCropModal({ open, imageSrc, onClose, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, ASPECT));
  }, []);

  const handleSave = async () => {
    if (!imgRef.current || !completedCrop) return;
    setSaving(true);
    try {
      const file = await getCroppedFile(imgRef.current, completedCrop);
      onCropComplete(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="w-4 h-4" /> Beskär bild
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Beskär"
              onLoad={onImageLoad}
              style={{ maxHeight: '55vh' }}
            />
          </ReactCrop>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Avbryt</Button>
          <Button onClick={handleSave} disabled={saving || !completedCrop}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CropIcon className="w-4 h-4 mr-1" />}
            Använd beskärning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
