import React, { useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardFooter } from 'mdb-react-ui-kit';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { authOAuth2, authService, authServiceSecret, disconnectService, Service } from '../utils/api';
import MessageBox from './MessageBox';
import InputBar from './InputBar';

export interface IServiceCardProps {
  service: Service;
  setConnection: (connected: boolean) => void;
}

function ServiceCard({ service, setConnection }: IServiceCardProps, props: any) {
  const navigate = useNavigate();
  const [openApiKey, setOpenApiKey] = useState(false);
  const [openClientSecret, setOpenClientSecret] = useState(false);
  const onClose = () => {
    setOpenApiKey(false);
  };
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const handleOnClick = async () => {
    if (service.connected) {
      await disconnectService(service);
      setConnection(false);
      return;
    }
    if (service.authType === 'apiKey') {
      setOpenApiKey(true);
    } else if (service.authType === 'clientSecret') {
      setOpenClientSecret(true);
    } else if (service.authType === 'oauth2') {
      const authUrl = await authOAuth2(service);
      if (authUrl.length > 0) {
        window.location.href = authUrl;
      }
    }
  };

  return (
    <MDBCard
      className={'service-card flex-fill border-0'}
      style={{
        backgroundColor: service.color,
      }}
    >
      <MDBCardBody className={'border-0 p-1'}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '10px' }}>
          <img
            src={service.icon}
            alt="service"
            style={{ maxWidth: '25%', maxHeight: '75px', objectFit: 'contain', margin: '10px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" component="div" color={'white'}>
              {service.name}
            </Typography>
          </div>
        </div>
      </MDBCardBody>
      <MDBCardFooter className={'border-0 p-1'}>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <Button color="primary" text={service.connected ? 'Disconnect' : 'Connect'} onClick={handleOnClick} />
          <MessageBox
            title={'Login'}
            description={'Please log in to your account.'}
            type={'info'}
            isOpen={openApiKey}
            onClose={onClose}
          >
            <InputBar
              onChange={setKey}
              placeholder="apiKey"
              textColor="black"
              backgroundColor="#EAF1FF"
              borderColor="#EAF1FF"
              isPassword={false}
              onSubmit={() => {}}
            />
            <br />
            <Button
              text={'Submit'}
              onClick={async () => {
                await authService(service, key);
                setOpenApiKey(false);
                setConnection(true);
              }}
            />
          </MessageBox>
          <MessageBox
            title={'Login'}
            description={'Please log in to your account.'}
            type={'info'}
            isOpen={openClientSecret}
            onClose={() => setOpenClientSecret(false)}
          >
            <InputBar
              onChange={setKey}
              placeholder="Client id"
              textColor="black"
              backgroundColor="#EAF1FF"
              borderColor="#EAF1FF"
              isPassword={false}
              onSubmit={() => {}}
            />
            <br />
            <InputBar
              onChange={setSecret}
              placeholder="Client secret"
              textColor="black"
              backgroundColor="#EAF1FF"
              borderColor="#EAF1FF"
              isPassword={false}
              onSubmit={() => {}}
            />
            <br />
            <Button
              text={'Submit'}
              onClick={async () => {
                await authServiceSecret(service, key, secret);
                setOpenClientSecret(false);
                setConnection(true);
              }}
            />
          </MessageBox>
        </CardActions>
      </MDBCardFooter>
    </MDBCard>
  );
}

export default ServiceCard;
