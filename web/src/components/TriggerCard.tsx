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

export interface ITriggerCardProps {
  services: string[];
  actions: string[];
  backgroundColor: string;
}

function TriggerCard({ services, actions, backgroundColor }: ITriggerCardProps) {
  return (
    <Card
      sx={{
        backgroundColor,
        width: 450,
        maxHeight: 500,
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
              labelId={'action'}
              id={'action'}
              label={'Action'}
              style={{ color: 'white', backgroundColor, borderColor: 'white' }}
            >
              {actions.map((action) => (
                <MenuItem value={action} style={{ color: 'white', backgroundColor, borderColor: 'white' }}>
                  {action}
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
          <InputBar
            defaultDummyValue={'Value 1'}
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
            onChange={() => {}}
          />
          <InputBar
            defaultDummyValue={'Value 2'}
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
            onChange={() => {}}
          />
          <InputBar
            defaultDummyValue={'Value 3'}
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
            onChange={() => {}}
          />
        </CardContent>
      </Accordion>
    </Card>
  );
}

export default TriggerCard;
