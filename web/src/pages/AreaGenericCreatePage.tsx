import React, { useEffect, useState } from 'react';

import { Typography } from '@mui/material';
import Header from '../components/Header';
import TriggerCard from '../components/TriggerCard';
import Button from '../components/Button';
import { getServices, getServiceEvents, Service, ServiceEvent, ServiceAction, getServiceActions } from '../utils/api';

const AreaCreatePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceEvents, setServiceEvents] = useState<ServiceEvent[]>([]);
  const [serviceActions, setServiceActions] = useState<ServiceAction[]>([]);
  const [eventSelectedService, setEventSelectedService] = useState<Service | null>(null);
  const [eventSelectedServiceEvent, setEventSelectedServiceEvent] = useState<ServiceEvent | null>(null);
  const [eventSelectedServiceAction, setEventSelectedServiceAction] = useState<ServiceAction | null>(null);

  useEffect(() => {
    if (!eventSelectedService) return;
    async function fetchServiceEvents() {
      const events = await getServiceEvents(eventSelectedService ? eventSelectedService.name : '');
      console.log(events);
      setServiceEvents(events);
    }
    fetchServiceEvents();
  }, [eventSelectedService]);

  useEffect(() => {
    if (!eventSelectedService) return;
    async function fetchServiceActions() {
      const actions = await getServiceActions(eventSelectedService ? eventSelectedService.name : '');
      setServiceActions(actions);
    }
    fetchServiceActions();
  }, [eventSelectedService]);

  useEffect(() => {
    async function fetchServices() {
      setServices(await getServices());
    }
    fetchServices();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Plug-It" area="Areas" />
      <br />
      <Typography variant="h4" fontWeight="bold" color={'primary'}>
        Create a new AREA :D
      </Typography>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <TriggerCard
          services={services}
          actions={serviceActions}
          selectedService={eventSelectedService}
          selectedEvent={eventSelectedServiceEvent}
          selectedAction={eventSelectedServiceAction}
          onServiceSelected={(service: Service) => setEventSelectedService(service)}
          onEventSelected={(event: ServiceEvent) => setEventSelectedServiceEvent(event)}
          onActionSelected={(action: ServiceAction) => setEventSelectedServiceAction(action)}
          events={serviceEvents}
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
};

export default AreaCreatePage;
