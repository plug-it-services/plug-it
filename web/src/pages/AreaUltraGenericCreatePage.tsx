import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Header from '../components/Header';
import UltraGenericTriggerCard, { StepInfo, TriggerCardType } from '../components/UltraGenericTriggerCard';
import Button from '../components/Button';
import { PlugDetail, postPlug, ServiceAction, ServiceEvent } from '../utils/api';
import InputBar from '../components/InputBar';

type ServiceDetail = {
  events: ServiceEvent[] | null;
  actions: ServiceAction[] | null;
};

const AreaUltraGenericCreatePage = () => {
  const [selections, setSelections] = useState<StepInfo[]>([
    { serviceName: '', stepId: '', type: TriggerCardType.EVENT, fields: [] },
    { serviceName: '', stepId: '', type: TriggerCardType.ACTION, fields: [] },
  ]);

  const [plugName, setPlugName] = useState<string>('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Plug-It" area="Plugs" />
      <Typography variant="h4" fontWeight="bold" color={'primary'} style={{ marginTop: 30 }}>
        Create a new PLUG :D
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: 30 }}>
        <InputBar
          defaultDummyValue={'Plug Name'}
          textColor={'white'}
          backgroundColor={'#2757C9'}
          borderColor={'#2757C9'}
          isPassword={false}
          onChange={(value) => {
            setPlugName(value);
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: 30 }}>
        {selections.map((selection, selectionIdx) => (
          <>
            <UltraGenericTriggerCard
              key={selectionIdx}
              selected={selection}
              onSelectedChange={(selected: StepInfo) => {
                setSelections(selections.map((elem, idx) => (idx === selectionIdx ? selected : elem)));
              }}
              backgroundColor={'#2757C9'}
            />
          </>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: 30 }}>
        <Button
          color="secondary"
          text={'Cancel'}
          onClick={() => {
            window.location.href = '/plugs';
          }}
        />
        <Button
          color="secondary"
          text={'Delete'}
          onClick={() => {
            window.location.href = '/plugs';
          }}
        />
        <Button
          color="primary"
          text={'Create'}
          onClick={() => {
            // Create PlugDetail
            const plugDetail: PlugDetail = {
              name: plugName,
              enabled: true,
              event: {
                serviceName: selections[0].serviceName,
                id: selections[0].stepId,
                fields: selections[0].fields,
              },
              actions: [
                {
                  serviceName: selections[1].serviceName,
                  id: selections[1].stepId,
                  fields: selections[1].fields,
                },
              ],
            };
            // Post Plug
            postPlug(plugDetail).then((res) => {
              console.log(res);
            });
            // Redirect to Plugs
            // on check que ça marche avant mdr window.location.href = '/plugs';
          }}
        />
      </div>
    </div>
  );
};

export default AreaUltraGenericCreatePage;
