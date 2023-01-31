import React, {useEffect, useState} from 'react';
import {Typography} from '@mui/material';
import Header from '../components/Header';
import TriggerCard, {StepInfo, TriggerCardType} from '../components/GenericTriggerCard';
import Button from '../components/Button';
import {
  FieldValue,
  getServiceActions,
  getServiceEvents,
  getServices,
  Service,
  ServiceAction,
  ServiceEvent
} from '../utils/api';

type ServiceDetail = {
  events: ServiceEvent[] | null;
  actions: ServiceAction[] | null;
};

const AreaCreatePage = () => {
  const [servicesPreviews, setServicesPreviews] = useState<Service[]>([]);
  const [serviceDetails, setServiceDetails] = useState<Map<string, ServiceDetail>>();
  const [selections, setSelections] = useState<StepInfo[]>([
    { service: null, step: null, type: TriggerCardType.EVENT, fields: null },
    { service: null, step: null, type: TriggerCardType.ACTION, fields: null },
  ]);

  function findStepsSet(selection: StepInfo) {
    if (!selection.service)
      return [];
    if (selection.type == TriggerCardType.EVENT)
      return serviceDetails?.get(selection.service.name)?.events ?? [];
    else
      return serviceDetails?.get(selection.service.name)?.actions ?? [];
  }

  useEffect(() => {
    async function hydrateSelections() {
      for (const selection of selections) {
        if (!serviceDetails?.has(selection.service?.name ?? '')) {
          const cpy = serviceDetails;
          const newVal = {
            actions: await getServiceActions(selection.service?.name ?? ''),
            events: await getServiceEvents(selection.service?.name ?? ''),
          }
          cpy?.set(selection.service?.name ?? '', newVal)
          setServiceDetails(cpy)
        }
      }
    }
    hydrateSelections();
  }, [selections]);

  useEffect(() => {
    async function fetchServicesPreviews() {
      setServicesPreviews(await getServices());
    }
    fetchServicesPreviews();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Plug-It" area="Areas" />
      <br />
      <Typography variant="h4" fontWeight="bold" color={'primary'}>
        Create a new AREA :D
      </Typography>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <TriggerCard
          selected={selections[0]}
          services={servicesPreviews}
          steps={findStepsSet(selections[0])}
          onServiceSelected={(service: Service) => {
            setSelections(selections.map((selection, idx) => idx === 0 ? { service, step: null, fields: null, type: TriggerCardType.EVENT} : selection))
          }}
          onStepSelected={(step: ServiceEvent) => {
            setSelections(selections.map((selection, idx) => idx === 0 ? { service: selection.service, step, fields: null, type: TriggerCardType.EVENT} : selection))
          }}
          onFieldChanged={(key: string, value: string) => {

          }}
          backgroundColor={'#2757C9'}
        />
        
      </div>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <Button
          color="secondary"
          text={'Cancel'}
          onClick={() => {
            window.location.href = '/areas';
          }}
        />
        <Button
          color="secondary"
          text={'Delete'}
          onClick={() => {
            window.location.href = '/areas';
          }}
        />
        <Button
          color="primary"
          text={'Create'}
          onClick={() => {
            window.location.href = '/areas';
          }}
        />
      </div>
    </div>
  );
};

export default AreaCreatePage;
