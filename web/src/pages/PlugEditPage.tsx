import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import TriggerCard from '../components/TriggerCard';
import Button from '../components/Button';
import {
  deletePlug,
  editPlug,
  getPlugDetail,
  getServiceActions,
  getServiceEvents,
  PlugDetail,
  ServiceAction,
  ServiceEvent,
  Variable,
} from '../utils/api';
import InputBar from '../components/InputBar';
import MessageBox from '../components/MessageBox';
import { StepInfo, StepType } from '../components/StepInfo.type';
import Loading from '../components/Loading';

const PlugEditPage = () => {
  const { plugId } = useParams();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('Cannot create plug');
  const navigate = useNavigate();
  const [selections, setSelections] = useState<StepInfo[]>([
    { serviceName: '', stepId: '', type: StepType.EVENT, fields: [], variables: [] },
    { serviceName: '', stepId: '', type: StepType.ACTION, fields: [], variables: [] },
  ]);
  const [plugDetail, setPlugDetail] = useState<PlugDetail>();
  const [plugName, setPlugName] = useState<string>('');

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

  const plugDelete = async () => {
    if (!plugId) return;
    try {
      await deletePlug(plugId);
    } catch (err: any) {
      setError('Cannot delete plug');
      setMessage(err.message);
      setOpen(true);
    }
  };

  const plugEdit = async () => {
    if (!plugId) return;
    try {
      const editedPlugDetail: PlugDetail = {
        name: plugName,
        id: plugId,
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
      await editPlug(editedPlugDetail);
      navigate('/plugs');
    } catch (err: any) {
      setError('Cannot edit plug');
      setMessage(err.message);
      setOpen(true);
    }
  };

  async function fillFieldsInformations(steps: StepInfo[]): Promise<StepInfo[]> {
    const servicesToFetch: string[] = [];
    servicesToFetch.push(steps[0].serviceName);
    steps.slice(1).forEach((step) => {
      if (!servicesToFetch.includes(step.serviceName, 1)) servicesToFetch.push(step.serviceName);
    });
    const promises: Promise<ServiceEvent[] | ServiceAction[]>[] = [
      getServiceEvents(servicesToFetch[0]),
      ...servicesToFetch.slice(1).map((service) => getServiceActions(service)),
    ];
    const details: (ServiceEvent[] | ServiceAction[])[] = await Promise.all(promises);
    const eventDetail = details[0];
    const actionDetails = details.slice(1);

    console.log("servicesToFetch", servicesToFetch);
    console.log("details", details);
    console.log("eventDetail", eventDetail);
    console.log("actionDetails", actionDetails);

    return steps.map((el, idx) => {
      const step = el;
      const serviceDetails = idx ? actionDetails[servicesToFetch.indexOf(step.serviceName, 1) - 1] : eventDetail;
      console.log(`serviceDetails for ${el.serviceName}`, serviceDetails);
      if (!serviceDetails) throw new Error(`Cannot find service ${step.serviceName} details`);
      const stepDetails = serviceDetails.find((detail) => detail.id === step.stepId);
      if (!stepDetails) throw new Error(`Cannot find step ${step.stepId} in service ${step.serviceName} details`);
      step.fields = step.fields.map((field) => {
        const fieldDetails = stepDetails.fields.find((detail) => detail.key === field.key);
        if (!fieldDetails)
          throw new Error(
            `Cannot find field ${field.key} in step ${step.stepId} in service ${step.serviceName} details`,
          );
        return {
          ...field,
          required: fieldDetails.required,
          modified: field.value !== '' || field.value != null || field.required,
        };
      });
      return step;
    });
  }

  useEffect(() => {
    const getPlug = async () => {
      if (!plugId) return;
      try {
        const plug = await getPlugDetail(plugId);
        let cards: StepInfo[] = [
          {
            serviceName: plug.event.serviceName,
            stepId: plug.event.id,
            type: StepType.EVENT,
            fields: plug.event.fields,
            variables: [],
          },
          ...plug.actions.map((action) => ({
            serviceName: action.serviceName,
            stepId: action.id,
            type: StepType.ACTION,
            fields: action.fields,
            variables: [],
          })),
        ];
        cards = await fillFieldsInformations(cards);
        setPlugDetail(plug);
        setPlugName(plug.name);
        setSelections(cards);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError('Cannot get plug');
        setMessage(err.message);
        setOpen(true);
      }
    };
    getPlug();
  }, [plugId]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <Typography variant="h4" fontWeight="bold" color={'primary'} className={'pt-3 text-center'}>
        Edit a PLUG
      </Typography>
      <MDBRow className={'d-flex justify-content-center pb-3'}>
        <div className={'col-12 col-md-8 col-lg-4 py-3'}>
          <InputBar
            placeholder={'Plug Name'}
            textColor={'white'}
            backgroundColor={'#2757C9'}
            borderColor={'#2757C9'}
            isPassword={false}
            value={plugName}
            onChange={(value) => {
              setPlugName(value);
            }}
            onSubmit={() => {}}
          />
        </div>
      </MDBRow>
      {selections.map((selection, selectionIdx) => (
        <MDBRow key={selectionIdx} className={'d-flex justify-content-center'}>
          <div className={'col-12 col-md-8 col-lg-4'}>
            <TriggerCard
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
              <Button key={-selectionIdx} text={'Add Step'} color={'secondary'} onClick={() => addStep(selectionIdx)} />
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
                onClick={async () => {
                  if (!plugDetail?.id) return;
                  await plugDelete();
                  window.location.href = '/plugs';
                }}
              />
            </MDBCol>
            <MDBCol>
              <Button color="primary" text={'Save'} onClick={plugEdit} />
            </MDBCol>
          </MDBRow>
        </div>
      </MDBRow>
    </>
  );
};

export default PlugEditPage;
