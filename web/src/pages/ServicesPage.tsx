import React from 'react';

import { Typography } from '@mui/material';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';

const ServicesPage = () => (
  // Title and SearchBar
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Header title="Plug-It" area="Services" />
    <br />
    <Typography variant="h4" fontWeight="bold" color={'primary'}>
      Services
    </Typography>
    <br />
    <SearchBar
      onChange={() => {}}
      onSearch={() => {}}
      defaultDummyValue="Search a service"
      textColor="black"
      backgroundColor="#EAF1FF"
      borderColor="#EAF1FF"
    />
    <br />
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <ServiceCard
        img={'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png'}
        title={'Youtube'}
        description={'Youtube is a video sharing platform.'}
        buttonLabel={'Connect'}
        onClick={() => alert('Add')}
      />
      <ServiceCard
        img={'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png'}
        title={'Youtube'}
        description={'Youtube is a video sharing platform.'}
        buttonLabel={'Connect'}
        onClick={() => alert('Add')}
      />
      <ServiceCard
        img={'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png'}
        title={'Youtube'}
        description={'Youtube is a video sharing platform.'}
        buttonLabel={'Connect'}
        onClick={() => alert('Add')}
      />
    </div>
  </div>
);

export default ServicesPage;