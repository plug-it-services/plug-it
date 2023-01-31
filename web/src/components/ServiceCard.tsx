import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from './Button';
import api, { Service } from '../utils/api';
import MessageBox from './MessageBox';
import InputBar from './InputBar';

export interface IServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: IServiceCardProps) {
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const [key, setKey] = useState('');

  const onSubmit = async () => {
    try {
      await api.post(
        `/service/${service.name}/apiKey`,
        {
          apiKey: key,
        },
        {
          headers: {
            'crsf-token': localStorage.getItem('crsf-token'),
          },
          withCredentials: true,
        },
      );
    } catch (err) {
      console.log(err);
      return;
    }
    setOpen(false);
  };

  return (
    <Card
      sx={{
        backgroundColor: `#718CDE`,
        width: 320,
        height: 170,
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '10px' }}>
        <img
          src={service.icon}
          alt="service"
          style={{ maxWidth: '100px', maxHeight: '75px', objectFit: 'contain', margin: '10px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" component="div" color={'white'}>
            {service.name}
          </Typography>
          <Typography variant="body2" color={'white'}>
            {'This is a description'}
          </Typography>
        </div>
      </div>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          color="primary"
          text={service.connected ? 'Disconnect' : 'Connect'}
          onClick={async () => {
            if (service.connected) {
              try {
                await api.post(
                  `/service/${service.name}/disconnect`,
                  {},
                  {
                    headers: {
                      'crsf-token': localStorage.getItem('crsf-token'),
                    },
                    withCredentials: true,
                  },
                );
              } catch (err) {
                console.log(err);
              }
              return;
            }
            if (service.authType === 'apiKey') {
              setOpen(true);
            } else if (service.authType === 'oauth2') {
              let res: any;
              try {
                res = await api.post(
                  `/service/${service.name}/oauth2`,
                  {
                    redirectUrl: `${process.env.REACT_APP_BASE_URL}/services`,
                  },
                  {
                    headers: {
                      'crsf-token': localStorage.getItem('crsf-token'),
                    },
                    withCredentials: true,
                  },
                );
              } catch (err) {
                console.log(err);
                return;
              }
              window.location.href = res.data.url;
            }
          }}
        />
        <MessageBox title={'Login '} description={'Cheh'} type={'info'} isOpen={open} onClose={onClose}>
          <InputBar
            onChange={setKey}
            defaultDummyValue="apiKey"
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
          />
          <br />
          <Button text={'Submit'} onClick={onSubmit} />
        </MessageBox>
      </CardActions>
    </Card>
  );
}

export default ServiceCard;
