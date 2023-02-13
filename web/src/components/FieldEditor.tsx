import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { useState } from 'react';
import InputBar from './InputBar';
import { Variable } from '../utils/api';
import { StepInfo } from './StepInfo.type';

export interface VariableReference {
  variable: Variable;
  step: StepInfo;
  idx: number;
}

// eslint-disable-next-line import/prefer-default-export
export function FieldEditor({
  fieldKey,
  onChange,
  value,
  variables,
}: {
  fieldKey: string;
  onChange: (value: string) => void;
  value: string;
  variables: VariableReference[];
}) {
  const [selectionVisible, setSelectionVisible] = useState(false);

  const filterOptions = (options: VariableReference[], { inputValue }: { inputValue: string }) =>
    options.filter(
      (option) =>
        option.variable.key.includes(inputValue) ||
        option.step.serviceName.includes(inputValue) ||
        option.step.stepId.includes(inputValue),
    );

  return (
    <>
      {selectionVisible && (
        <Autocomplete
          id={fieldKey}
          renderInput={(params) => (
            <TextField {...params} label="Test de fou" value={value} onFocus={() => setSelectionVisible(true)} />
          )}
          filterOptions={filterOptions}
          getOptionLabel={(option) => `${option.variable.displayName} (${option.variable.description})`}
          groupBy={(option) =>
            `${option.idx ? 'Action' : 'Event'} (${option.idx}): ${option.step.serviceName} - ${option.step.stepId}`
          }
          options={variables}
          onChange={(event, newValue) => {
            if (newValue) {
              onChange(`${value}\${${newValue.idx}.${newValue.variable.key}}`);
            }
          }}
          onFocus={() => setSelectionVisible(true)}
          onBlur={() => setSelectionVisible(false)}
        />
      )}

      <InputBar
        placeholder={'Write the wanted value and use variables if needed!'}
        backgroundColor={'#2757C9'}
        borderColor={'#2757C9'}
        isPassword={false}
        value={value}
        onChange={onChange}
        onSubmit={() => {}}
        onBlur={() => setSelectionVisible(false)}
        onFocus={() => setSelectionVisible(true)}
        textColor="black"
      />
    </>
  );
}
