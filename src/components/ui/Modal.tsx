import { Modal as MuiModal, Box, ModalProps } from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <MuiModal {...props}>
      <Box sx={style}>{children}</Box>
    </MuiModal>
  );
};
