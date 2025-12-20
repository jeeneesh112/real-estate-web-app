import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PdfViewerProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ open, onClose, url, title = 'Document' }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: 720 }}>
        <iframe
          src={url}
          title={title}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;
