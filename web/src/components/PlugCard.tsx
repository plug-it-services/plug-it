import React from 'react';
import { Typography, CardActions } from '@mui/material';
import { MDBCard, MDBCardBody, MDBCardFooter, MDBCardTitle, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Button from './Button';
import { authService, Plug } from '../utils/api';
import MessageBox from './MessageBox';
import InputBar from './InputBar';

export interface IAreaCardProps {
  plug: Plug;
  onStateClickButton: () => void;
  onEditClickButton: () => void;
}

function PlugCard({ plug, onStateClickButton, onEditClickButton }: IAreaCardProps) {
  return (
    <MDBCard className={'plug-card flex-fill text-center border-0'}>
      <MDBCardTitle>
        <Typography variant="body1" component="div" color={'white'}>
          {plug.name}
        </Typography>
      </MDBCardTitle>
      <MDBCardBody className={'border-0'}>
        <MDBRow className={'justify-content-center px-1 '}>
          {plug.icons.length > 3 ? (
            <>
              <MDBCol size="4" className={'d-flex justify-content-center'}>
                <img src={plug.icons[0]} alt="icon" className={'w-50'} />
              </MDBCol>
              <MDBCol size="4" className={'d-flex justify-content-center'}>
                ...
              </MDBCol>
              <MDBCol size="4" className={'d-flex justify-content-center'}>
                <img src={plug.icons[-1]} alt="icon" className={'w-50'} />
              </MDBCol>
            </>
          ) : (
            plug.icons.map((icon, index) => (
              <MDBCol size="4" key={index} className={'d-flex justify-content-center'}>
                <img src={icon} alt="icon" className={'w-50'} />
              </MDBCol>
            ))
          )}
        </MDBRow>
      </MDBCardBody>
      <MDBCardFooter className={'border-0 pb-3'}>
        <MDBRow className={'justify-content-center px-1 '}>
          <MDBCol>
            <Button color="primary" text="Edit" onClick={onEditClickButton} />
          </MDBCol>
          <MDBCol>
            <Button color="primary" text={plug.enabled ? 'Disable' : 'Enable'} onClick={onStateClickButton} />
          </MDBCol>
        </MDBRow>
      </MDBCardFooter>
    </MDBCard>
  );
}

export default PlugCard;
