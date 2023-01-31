import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';
import { getServices, Service } from '../utils/api';

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      setServices(await getServices());
    }
    fetchServices();
  }, []);

  return (
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
        <Grid container spacing={2} columns={3}>
          {services.map((service) => (
            <Grid item key={service.name}>
              <ServiceCard
                img={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fimages%2Fe3452993e179156393e2928cb3927185%2Ftenor.gif%3Fitemid%3D16107418&f=1&nofb=1&ipt=f05d099307d6059931ab88ac72c5eee5358a6d7f3f81904b337e7734c798f618&ipo=images'}
                title={service.name}
                description={'MVP description'}
                buttonLabel={'Connect'}
                onClick={() => {}}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default ServicesPage;
