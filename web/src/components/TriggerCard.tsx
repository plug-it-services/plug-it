import React, { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionSummary,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getServiceActions, getServiceEvents, getServices, Service, ServiceAction, ServiceEvent } from '../utils/api';
import MessageBox from './MessageBox';
import { FieldEditor, VariableReference } from './FieldEditor';
import { StepInfo, StepType } from './StepInfo.type';

export interface ITriggerCardProps {
  selected: StepInfo;
  availableVariables: VariableReference[];
  onSelectedChange: (infos: StepInfo) => void;
  onDelete: () => void;
  backgroundColor: string;
}

function TriggerCard({ selected, availableVariables, onSelectedChange, onDelete, backgroundColor }: ITriggerCardProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState("Cannot fetch events/actions'");
  const [servicesPreviews, setServicesPreviews] = useState<Service[]>([]);
  const [steps, setSteps] = useState<ServiceAction[] | ServiceEvent[]>([]);
  const [step, setStep] = useState<ServiceAction | ServiceEvent | null>();

  async function onServiceSelected(serviceName: string) {
    const service = servicesPreviews.find((el) => el.name === serviceName);

    if (!service) return;
    try {
      if (selected.type === StepType.EVENT) setSteps(await getServiceEvents(serviceName));
      else setSteps(await getServiceActions(serviceName));
      // eslint-disable-next-line no-param-reassign
      selected.serviceName = serviceName;
      onSelectedChange(selected);
    } catch (err: any) {
      setError('Cannot fetch events/actions');
      setMessage(err.message);
      setOpen(true);
    }
  }

  async function onStepSelected(stepId: string) {
    const found = steps.find((el) => el.id === stepId);

    if (!found) return;
    // eslint-disable-next-line no-param-reassign
    selected.stepId = stepId;
    // eslint-disable-next-line no-param-reassign
    selected.fields = found.fields.map((field) => ({
      key: field.key,
      value: '',
      description: field.description,
      modified: false,
      required: field.required ?? false,
    }));
    // eslint-disable-next-line no-param-reassign
    selected.variables = found.variables;
    setStep(found);
    onSelectedChange(selected);
  }

  function getActionServices() {
    if (!servicesPreviews.length) return <></>;
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
    if (!steps.length) return <></>;
    return (
      <>
        {selected.serviceName !== '' && (
          <FormControl fullWidth>
            <InputLabel id={selected.type === StepType.ACTION ? 'Action' : 'Event'} style={{ color: 'white' }}>
              {selected.type === StepType.ACTION ? 'Action' : 'Event'}
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

  async function onFieldChange(editedKey: string, newValue: string) {
    // eslint-disable-next-line no-param-reassign
    selected.fields = selected.fields.map(({ value, modified, ...rest }) => ({
      value: rest.key === editedKey ? newValue : value,
      modified: rest.key === editedKey ? true : modified,
      ...rest,
    }));
    onSelectedChange(selected);
  }

  useEffect(() => {
    getServices()
      .then(setServicesPreviews)
      .catch((err) => {
        setError('Cannot get services');
        setMessage(err.message);
        setOpen(true);
      });
  }, []);

  useEffect(() => {
    onServiceSelected(selected.serviceName);
  }, [servicesPreviews]);

  useEffect(() => {
    const found = steps.find((el) => el.id === selected.stepId);

    if (found) {
      // eslint-disable-next-line no-param-reassign
      selected.variables = found.variables;
      setStep(found);
      onSelectedChange(selected);
    }
  }, [steps]);

  return (
    <>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <Card className={'trigger-card'} sx={{ backgroundColor }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <TipsAndUpdatesIcon style={{ color: 'white', fontSize: '30px' }} />
              <Typography variant="h5" component="div" color={'white'}>
                {selected.type === StepType.EVENT ? 'Trigger' : 'Action'}
              </Typography>
            </div>
            {selected.type === StepType.ACTION && (
              <DeleteForeverIcon style={{ color: 'white', fontSize: '25px' }} onClick={onDelete} />
            )}
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
              <FieldEditor
                key={field.key}
                fieldKey={field.key}
                description={field.description}
                onChange={(val) => onFieldChange(field.key, val)}
                value={selected.fields.filter((el) => el.key === field.key)[0]?.value ?? ''}
                variables={availableVariables}
              />
            ))}
          </CardContent>
        </Accordion>
      </Card>
    </>
  );
}

export default TriggerCard;
