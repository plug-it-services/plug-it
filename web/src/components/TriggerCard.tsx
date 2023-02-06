import React, { useEffect, useState } from 'react';

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
import {
  Service,
  ServiceEvent,
  ServiceAction,
  FieldValue,
  getServices,
  getServiceEvents,
  getServiceActions,
} from '../utils/api';

export enum TriggerCardType {
  EVENT,
  ACTION,
}

export type StepInfo = {
  type: TriggerCardType;
  serviceName: string;
  stepId: string;
  fields: FieldValue[];
};

export interface ITriggerCardProps {
  selected: StepInfo;
  onSelectedChange: (infos: StepInfo) => void;
  backgroundColor: string;
}

function TriggerCard({ selected, onSelectedChange, backgroundColor }: ITriggerCardProps) {
  const [servicesPreviews, setServicesPreviews] = useState<Service[]>([]);
  const [steps, setSteps] = useState<ServiceAction[] | ServiceEvent[]>([]);
  const [step, setStep] = useState<ServiceAction | ServiceEvent | null>();

  async function onServiceSelected(serviceName: string) {
    const service = servicesPreviews.find((el) => el.name === serviceName);

    if (!service) return;
    if (selected.type === TriggerCardType.EVENT) setSteps(await getServiceEvents(serviceName));
    else setSteps(await getServiceActions(serviceName));
    // eslint-disable-next-line no-param-reassign
    selected.serviceName = serviceName;
    onSelectedChange(selected);
  }

  async function onStepSelected(stepId: string) {
    console.log(stepId);
    const found = steps.find((el) => el.id === stepId);

    if (!found) return;
    // eslint-disable-next-line no-param-reassign
    selected.stepId = stepId;
    // eslint-disable-next-line no-param-reassign
    selected.fields = found.fields.map((field) => ({
      key: field.key,
      value: '',
    }));
    setStep(found);
    onSelectedChange(selected);
  }

  function getActionServices() {
    return (
      <FormControl fullWidth>
        <InputLabel id={'service'} style={{ color: 'white' }}>
          {'Service'}
        </InputLabel>
        <Select
          labelId={'service'}
          id={'service'}
          label={'Service'}
          style={{ color: 'white', backgroundColor, borderColor: 'white' }}
          value={selected.serviceName}
          onChange={(elem) => onServiceSelected(elem.target.value as string)}
        >
          {servicesPreviews.map((service) => (
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
    );
  }

  function getReactionsOptions() {
    return (
      <>
        {selected.serviceName !== '' && (
          <FormControl fullWidth>
            <InputLabel id={selected.type === TriggerCardType.ACTION ? 'Action' : 'Event'} style={{ color: 'white' }}>
              {selected.type === TriggerCardType.ACTION ? 'Action' : 'Event'}
            </InputLabel>
            <Select
              labelId={'step'}
              id={'step'}
              label={'step'}
              style={{ color: 'white', backgroundColor, borderColor: 'white' }}
              value={selected.stepId}
              onChange={(elem) => onStepSelected(elem.target.value as string)}
            >
              {steps.map((elem) => (
                <MenuItem
                  value={elem.id}
                  style={{ color: 'white', backgroundColor, borderColor: 'white' }}
                  key={elem.id}
                >
                  {elem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </>
    );
  }

  async function onFieldChange(key: string, value: string) {
    // eslint-disable-next-line no-param-reassign
    selected.fields = selected.fields.map((field) => ({
      key: field.key,
      value: field.key === key ? value : field.value,
    }));
    onSelectedChange(selected);
  }

  useEffect(() => {
    async function fetchServicesPreviews() {
      setServicesPreviews(await getServices());
    }
    fetchServicesPreviews();
  }, []);

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
          {getActionServices()}
          {getReactionsOptions()}
        </CardContent>
      </Accordion>
      <Accordion style={{ backgroundColor }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography color={'white'}>{'Values'}</Typography>
        </AccordionSummary>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {step?.fields.map((field) => (
            <InputBar
              defaultDummyValue={field.displayName}
              textColor="black"
              backgroundColor="#EAF1FF"
              borderColor="#EAF1FF"
              isPassword={false}
              onChange={(val) => onFieldChange(field.key, val)}
              key={field.key}
            />
          ))}
        </CardContent>
      </Accordion>
    </Card>
  );
}

export default TriggerCard;
