// Trigger Card Component
// A card with an icon and title at the top
// another title after in middle
// then 2 search fields with an icon before
// and finally an accordion with a title

import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchBar from './SearchBar';
import InputBar from './InputBar';

export interface ITriggerCardProps {
  icon: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
}

function TriggerCard({ icon, title, subtitle, backgroundColor }: ITriggerCardProps) {
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
          <SearchBar
            defaultDummyValue={'Search a service'}
            textColor={'black'}
            backgroundColor={'#EAF1FF'}
            borderColor={'white'}
            onSearch={() => {}}
            onChange={() => {}}
          />
          <SearchBar
            defaultDummyValue={'Search an action'}
            textColor={'black'}
            backgroundColor={'#EAF1FF'}
            borderColor={'white'}
            onSearch={() => {}}
            onChange={() => {}}
          />
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
