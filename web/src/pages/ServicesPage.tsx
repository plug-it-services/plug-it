import { useEffect, useState } from 'react';

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
      <Typography variant="h4" fontWeight="bold" color={'primary'} style={{ paddingTop: '20px' }}>
        Services
      </Typography>
      <br />
      <SearchBar
        onChange={() => {}}
        onSearch={() => {}}
        placeholder="Search a service"
        textColor="black"
        backgroundColor="#EAF1FF"
        borderColor="#EAF1FF"
      />
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <Grid container spacing={2} columns={3} style={{ paddingTop: '20px' }}>
          {services.map((service) => (
            <Grid item key={service.name}>
              <ServiceCard service={service} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default ServicesPage;
