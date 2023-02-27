import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, IconButton, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

export interface IMessageBoxProps {
  title: string;
  description: string;
  type: 'error' | 'success' | 'warning' | 'info';
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

function MessageBox({ title, description, type, isOpen, onClose, children }: IMessageBoxProps) {
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className={'message-box p-3'}>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {type === 'error' && <CancelIcon sx={{ color: '#F44336' }} />}
              {type === 'success' && <CheckCircleIcon sx={{ color: '#4CAF50' }} />}
              {type === 'warning' && <WarningIcon sx={{ color: '#FF9800' }} />}
              {type === 'info' && <InfoIcon sx={{ color: 'grey' }} />}
              <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                {title}
              </Typography>
              <IconButton
                sx={{
                  marginLeft: 'auto',
                  padding: '0px',
                }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <Typography variant="body2" style={{ marginTop: '10px' }}>
              {description}
            </Typography>
          </CardContent>
          {children}
        </Card>
      </Modal>
    </div>
  );
}

export default MessageBox;
