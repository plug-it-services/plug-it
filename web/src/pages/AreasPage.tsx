import React, { useEffect, useState } from 'react';

import {Grid, Typography} from '@mui/material';
import Header from '../components/Header';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import AreaCard from '../components/AreaCard';
import { getPlugs, Plug } from '../utils/api';
import ServiceCard from "../components/ServiceCard";

const AreasPage = () => {
  const [areas, setPlugs] = useState<Plug[]>([]);

  useEffect(() => {
    async function fetchPlugs() {
      setPlugs(await getPlugs());
    }
    fetchPlugs();
  }, []);

  return (
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
        <Grid container spacing={2} columns={3}>
          {areas.map((area) => (
            <Grid item key={area.name}>
              <AreaCard
                title={area.name}
                buttonLabel={'Connect'}
                onClick={() => {}}
                date={'2001-09-11'}
                iconList={area.icons}
                key={area.name}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default AreasPage;
