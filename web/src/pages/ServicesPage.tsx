import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';
import { getServices, Service } from '../utils/api';
import MessageBox from '../components/MessageBox';

const ServicesPage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState("Can't get services");
  const [services, setServices] = useState<Service[]>([]);
  const [searchedServices, setSearchedServices] = useState<Service[]>([]);

  const initServices = (serviceList: Service[]) => {
    setServices(serviceList);
    setSearchedServices(serviceList);
  };

  useEffect(() => {
    getServices()
      .then(initServices)
      .catch((err) => {
        setError('Cannot get services');
        setMessage(err.message);
        setOpen(true);
      });
  }, []);

  const filterResearchedServices = (searchedService: string) => {
    if (searchedService === '' || searchedService === undefined) {
      return services;
    }
    return services.filter((service) => service.name.toLowerCase().includes(searchedService.toLowerCase()));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <Header title="Plug-It" area="Services" />
      <br />
      <Typography variant="h4" fontWeight="bold" color={'primary'} style={{ paddingTop: '20px' }}>
        Services
      </Typography>
      <br />
      <SearchBar
        onChange={(value) => setSearchedServices(filterResearchedServices(value))}
        onSearch={(value) => setSearchedServices(filterResearchedServices(value))}
        placeholder="Search a service"
        textColor="black"
        backgroundColor="#EAF1FF"
        borderColor="#EAF1FF"
      />
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <Grid container spacing={2} columns={3} style={{ paddingTop: '20px' }}>
          {searchedServices.map((service) => (
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
