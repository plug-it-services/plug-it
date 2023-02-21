import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { MDBCard, MDBCardTitle, MDBCol, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
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
      setSearchedServices(services);
    } else {
      const filtered = services.filter((service) => service.name.toLowerCase().includes(searchedService.toLowerCase()));
      setSearchedServices(filtered);
    }
  };

  return (
    <>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <MDBTypography tag="h4" variant="h1" color={'primary'} className="text-center fw-bold pt-3">
        Services
      </MDBTypography>
      <div className="d-flex justify-content-center py-2">
        <SearchBar
          onChange={(value) => filterResearchedServices(value)}
          onSearch={(value) => filterResearchedServices(value)}
          placeholder="Search a service"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
        />
      </div>
      <MDBRow className={'d-flex justify-content-center'}>
        {searchedServices.map((service, index) => (
          <MDBCol xs="12" md="4" lg="3" key={index} className={'py-3 d-flex'}>
            <ServiceCard service={service} />
          </MDBCol>
        ))}
      </MDBRow>
    </>
  );
};
export default ServicesPage;
