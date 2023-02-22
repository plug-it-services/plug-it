import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
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
        fields: selections[0].fields
          .filter((el) => el.modified || el.required)
          .map((el) => ({
            key: el.key,
            value: el.value,
          })),
      },
      actions: selections.slice(1).map((selection) => ({
        serviceName: selection.serviceName,
        id: selection.stepId,
        fields: selection.fields
          .filter((el) => el.modified || el.required)
          .map((el) => ({
            key: el.key,
            value: el.value,
          })),
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
    <>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <Typography variant="h4" fontWeight="bold" color={'primary'} className={'pt-3 text-center'}>
        Create a new PLUG :D
      </Typography>
      <MDBRow className={'d-flex justify-content-center pb-3'}>
        <div className={'col-12 col-md-8 col-lg-4 py-3'}>
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
      </MDBRow>

      {selections.map((selection, selectionIdx) => (
        <MDBRow className={'d-flex justify-content-center'}>
          <div className={'col-12 col-md-8 col-lg-4'}>
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
            <div className={'d-flex justify-content-center py-2'}>
              <Button text={'Add Step'} color={'secondary'} onClick={() => addStep(selectionIdx)} />
            </div>
          </div>
        </MDBRow>
      ))}
      <MDBRow className={'d-flex justify-content-center text-center'}>
        <div className={'col-12 col-md-8 col-lg-4'}>
          <MDBRow>
            <MDBCol>
              <Button
                color="secondary"
                text={'Cancel'}
                onClick={() => {
                  window.location.href = '/plugs';
                }}
              />
            </MDBCol>
            <MDBCol>
              <Button
                color="secondary"
                text={'Delete'}
                onClick={() => {
                  window.location.href = '/plugs';
                }}
              />
            </MDBCol>
            <MDBCol>
              <Button
                color="primary"
                text={'Create'}
                onClick={() => {
                  createPlug();
                }}
              />
            </MDBCol>
          </MDBRow>
        </div>
      </MDBRow>
    </>
  );
};

export default PlugCreatePage;
