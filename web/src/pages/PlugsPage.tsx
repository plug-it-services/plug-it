import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';
import Header from '../components/Header';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import PlugCard from '../components/PlugCard';
import { getPlugs, setPlugEnable, Plug } from '../utils/api';

const PlugsPage = () => {
  const [plugs, setPlugs] = useState<Plug[]>([]);

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
      <Typography variant="h4" fontWeight="bold" color={'primary'} style={{ paddingTop: '20px' }}>
        Plugs
      </Typography>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingTop: '20px' }}>
        <SearchBar
          onChange={() => {}}
          onSearch={() => {}}
          placeholder="Search a plug"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
        />
        <Button
          color="primary"
          text={'Add Plug'}
          onClick={() => {
            window.location.href = '/plugs/create';
          }}
        />
      </div>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <Grid container spacing={2} columns={3} style={{ paddingTop: '20px' }}>
          {plugs.map((plug) => (
            <Grid item key={plug.id}>
              <PlugCard plug={plug} onClickButton={() => setPlugEnable(!plug.enabled, plug.id)} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default PlugsPage;