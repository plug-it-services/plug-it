import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TriggerCard from '../components/TriggerCard';
import Button from '../components/Button';
import { PlugDetail, postPlug, Variable } from '../utils/api';
import InputBar from '../components/InputBar';
import MessageBox from '../components/MessageBox';
import { StepInfo, StepType } from '../components/StepInfo.type';

const PlugCreatePage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('Cannot create plug');
  const navigate = useNavigate();
  const [selections, setSelections] = useState<StepInfo[]>([
    { serviceName: '', stepId: '', type: StepType.EVENT, fields: [], variables: [] },
    { serviceName: '', stepId: '', type: StepType.ACTION, fields: [], variables: [] },
  ]);

  const [plugName, setPlugName] = useState<string>('');

  const createPlug = async () => {
    // Create PlugDetail
    // Redirect to Plugs
    const plugDetail: PlugDetail = {
      name: plugName,
      enabled: true,
      event: {
        serviceName: selections[0].serviceName,
        id: selections[0].stepId,
        fields: selections[0].fields,
      },
      actions: selections.slice(1).map((selection) => ({
        serviceName: selection.serviceName,
        id: selection.stepId,
        fields: selection.fields,
      })),
    };
    // Post Plug
    postPlug(plugDetail)
      .then((res) => {
        navigate('/plugs');
      })
      .catch((err) => {
        setError('Cannot create plug');
        setMessage(err.message);
        setOpen(true);
      });
  };

  const addStep = (previousIdx: number) => {
    const newSelections = [
      ...selections.slice(0, previousIdx + 1),
      { serviceName: '', stepId: '', type: StepType.ACTION, fields: [], variables: [] },
      ...selections.slice(previousIdx + 1),
    ];
    setSelections(newSelections);
  };

  const deleteStep = (idx: number) => {
    const newSelections = [...selections.slice(0, idx), ...selections.slice(idx + 1)];
    setSelections(newSelections);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <Header title="Plug-It" area="Plugs" />
      <Typography variant="h4" fontWeight="bold" color={'primary'} style={{ marginTop: 30 }}>
        Create a new PLUG :D
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: 30 }}>
        <InputBar
          placeholder={'Plug Name'}
          textColor={'white'}
          backgroundColor={'#2757C9'}
          borderColor={'#2757C9'}
          isPassword={false}
          onChange={(value) => {
            setPlugName(value);
          }}
          onSubmit={() => {}}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: 30 }}>
        {selections.map((selection, selectionIdx) => (
          <>
            <TriggerCard
              key={selectionIdx}
              selected={selection}
              availableVariables={selections
                .slice(0, selectionIdx)
                .map((step, idx) => step.variables.map((variable) => ({ step, variable, idx })))
                .flat()}
              onSelectedChange={(selected: StepInfo) => {
                setSelections(selections.map((elem, idx) => (idx === selectionIdx ? selected : elem)));
              }}
              onDelete={() => deleteStep(selectionIdx)}
              backgroundColor={'#2757C9'}
            />
            <Button text={'Add Step'} color={'secondary'} onClick={() => addStep(selectionIdx)} />
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
            createPlug();
          }}
        />
      </div>
    </div>
  );
};

export default PlugCreatePage;
