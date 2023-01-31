import React from 'react';

import { Typography } from '@mui/material';
import Header from '../components/Header';
import TriggerCard from '../components/TriggerCard';
import Button from '../components/Button';

const AreaCreatePage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Header title="Plug-It" area="Areas" />
    <br />
    <Typography variant="h4" fontWeight="bold" color={'primary'}>
      Create a new AREA :D
    </Typography>
    <br />
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <TriggerCard
        services={['Test Service', 'MVP Service']}
        actions={['Test Action', 'MVP Action']}
        backgroundColor={'#2757C9'}
      />
    </div>
    <br />
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <Button
        color="secondary"
        text={'Cancel'}
        onClick={() => {
          window.location.href = '/areas';
        }}
      />
      <Button
        color="secondary"
        text={'Delete'}
        onClick={() => {
          window.location.href = '/areas';
        }}
      />
      <Button
        color="primary"
        text={'Create'}
        onClick={() => {
          window.location.href = '/areas';
        }}
      />
    </div>
  </div>
);

export default AreaCreatePage;
