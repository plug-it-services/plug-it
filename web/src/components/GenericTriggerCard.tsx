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
import { Service, ServiceEvent, ServiceAction, FieldValue } from '../utils/api';

export enum TriggerCardType {
  EVENT,
  ACTION,
}

export type StepInfo = {
  service: Service | null;
  step: ServiceEvent | ServiceAction | null;
  fields: FieldValue[] | null;
  type: TriggerCardType;
};

export interface ITriggerCardProps {
  services: Service[];
  steps: ServiceEvent[] | ServiceAction[];
  selected: StepInfo;
  onServiceSelected: (service: Service) => void;
  onStepSelected: (step: ServiceAction | ServiceEvent) => void;
  onFieldChanged: (key: string, newValue: string) => void;
  backgroundColor: string;
}

function GenericTriggerCard({
  services,
  steps,
  selected,
  onServiceSelected,
  onStepSelected,
  onFieldChanged,
  backgroundColor,
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
          <>
            <FormControl fullWidth>
              <InputLabel id={'service'} style={{ color: 'white' }}>
                {'Service'}
              </InputLabel>
              <Select
                labelId={'service'}
                id={'service'}
                label={'Service'}
                style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                onChange={(elem) => {
                  const service = services.find((el) => el.name === elem.target.value);
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
            </FormControl>
            {selected.service ?? (
              <FormControl fullWidth>
                <InputLabel id={'service'} style={{ color: 'white' }}>
                  {selected.type === TriggerCardType.ACTION ? 'Action' : 'Event'}
                </InputLabel>
                <Select
                  labelId={'step'}
                  id={'step'}
                  label={'step'}
                  style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                  onChange={(elem) => {
                    const step = steps.find((el) => el.id === elem.target.value);
                    if (step) onStepSelected(step);
                  }}
                >
                  {steps.map((step) => (
                    <MenuItem
                      value={step.id}
                      style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                      key={step.id}
                    >
                      {step.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        </CardContent>
      </Accordion>
      <Accordion style={{ backgroundColor }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography color={'white'}>{'Values'}</Typography>
        </AccordionSummary>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selected.step &&
            selected.step.fields.map((field) => (
              <InputBar
                defaultDummyValue={field.displayName}
                textColor="black"
                backgroundColor="#EAF1FF"
                borderColor="#EAF1FF"
                isPassword={false}
                onChange={() => {}}
                key={field.key}
              />
            ))}
        </CardContent>
      </Accordion>
    </Card>
  );
}

export default GenericTriggerCard;
