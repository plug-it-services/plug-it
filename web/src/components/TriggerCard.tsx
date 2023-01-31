import React from 'react';

import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputBar from './InputBar';
import { getServiceEvents, Service, ServiceEvent, ServiceAction } from '../utils/api';

export interface ITriggerCardProps {
  services: Service[];
  actions: ServiceAction[];
  selectedService: Service | null;
  selectedEvent: ServiceEvent | null;
  selectedAction: ServiceAction | null;
  onServiceSelected: (service: Service) => void;
  onEventSelected: (event: ServiceEvent) => void;
  onActionSelected: (action: ServiceAction) => void;
  events: ServiceEvent[];
  backgroundColor: string;
}

function TriggerCard({
  services,
  selectedService,
  selectedEvent,
  onServiceSelected,
  onEventSelected,
  events,
  backgroundColor,
  selectedAction,
  onActionSelected,
  actions,
}: ITriggerCardProps) {
  return (
    <Card
      sx={{
        backgroundColor,
        width: 450,
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
      }}
    >
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          <TipsAndUpdatesIcon style={{ color: 'white', fontSize: '30px' }} />
          <Typography variant="h5" component="div" color={'white'}>
            {'Trigger'}
          </Typography>
        </div>
      </CardContent>
      <Accordion style={{ backgroundColor }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography color={'white'}>{'Action'}</Typography>
        </AccordionSummary>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FormControl fullWidth>
            <InputLabel id={'service'} style={{ color: 'white' }}>
              {'Service'}
            </InputLabel>
            <Select
              labelId={'service'}
              id={'service'}
              label={'Service'}
              style={{ color: 'white', backgroundColor, borderColor: 'white' }}
              onChange={(selected) => {
                const service = services.find((el) => el.name === selected.target.value);
                if (service) onServiceSelected(service);
              }}
            >
              {services.map((service) => (
                <MenuItem
                  value={service.name}
                  style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                  key={service.name}
                >
                  {service.name}
                </MenuItem>
              ))}
            </Select>
            {}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id={'event'} style={{ color: 'white' }}>
              {'Event'}
            </InputLabel>
            <Select
              labelId={'event'}
              id={'event'}
              label={'event'}
              style={{ color: 'white', backgroundColor, borderColor: 'white' }}
              onChange={(selected) => {
                const event = events.find((el) => el.name === selected.target.value);
                if (event) onEventSelected(event);
              }}
            >
              {events.map((event) => (
                <MenuItem
                  value={event.name}
                  style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                  key={event.name}
                >
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id={'action'} style={{ color: 'white' }}>
              {'Action'}
            </InputLabel>
            <Select
              labelId={'action'}
              id={'action'}
              label={'action'}
              style={{ color: 'white', backgroundColor, borderColor: 'white' }}
              onChange={(selected) => {
                const action = actions.find((el) => el.name === selected.target.value);
                if (action) onActionSelected(action);
              }}
            >
              {actions.map((action) => (
                <MenuItem
                  value={action.name}
                  style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                  key={action.name}
                >
                  {action.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Accordion>
      <Accordion style={{ backgroundColor }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography color={'white'}>{'Values'}</Typography>
        </AccordionSummary>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedEvent?.variables.map((event) => (
            <InputBar
              defaultDummyValue={event.displayName}
              textColor="black"
              backgroundColor="#EAF1FF"
              borderColor="#EAF1FF"
              isPassword={false}
              onChange={() => {}}
              key={event.key}
            />
          ))}
        </CardContent>
      </Accordion>
    </Card>
  );
}

export default TriggerCard;
