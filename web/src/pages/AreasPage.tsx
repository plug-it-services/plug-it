import React from 'react';

import { Typography } from '@mui/material';
import Header from '../components/Header';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import AreaCard from '../components/AreaCard';

const AreasPage = () => (
  // Title and SearchBar
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Header title="Plug-It" area="Areas" />
    <br />
    <Typography variant="h4" fontWeight="bold" color={'primary'}>
      Areas
    </Typography>
    <br />
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <SearchBar
        onChange={() => {}}
        onSearch={() => {}}
        defaultDummyValue="Search an area"
        textColor="black"
        backgroundColor="#EAF1FF"
        borderColor="#EAF1FF"
      />
      <Button
        color="primary"
        text={'Add Area'}
        onClick={() => {
          window.location.href = '/areas/create';
        }}
      />
    </div>
    <br />
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <AreaCard
        title={'Youtube'}
        date={'2021-10-10'}
        iconList={[
          'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
          'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
          'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
        ]}
        buttonLabel={'Disable'}
        onClick={() => {}}
      />
      <AreaCard
        title={'Youtube'}
        date={'2021-10-10'}
        iconList={[
          'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
          'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
          'https://clipart.info/images/ccovers/1590430652red-youtube-logo-png-xl.png',
        ]}
        buttonLabel={'Disable'}
        onClick={() => {}}
      />
    </div>
  </div>
);

export default AreasPage;
