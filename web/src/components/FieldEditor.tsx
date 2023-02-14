import { Autocomplete, TextField } from '@mui/material';
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
    <div
      tabIndex={0}
      onBlur={({ currentTarget, relatedTarget }) => {
        if (currentTarget.contains(relatedTarget)) return;
        setSelectionVisible(false);
      }}
      onFocus={() => setSelectionVisible(true)}
    >
      {selectionVisible && (
        <Autocomplete
          id={fieldKey}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <TextField {...params} label="Select variable" value={value} />
            </div>
          )}
          renderGroup={(params) => (
            <div>
              <strong>{params.group}</strong>
              {params.children}
            </div>
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
          color={'#2757C9'}
          sx={{
            '& .MuiAutocomplete-option': {
              color: '#2757C9',
            },
          }}
        />
      )}

      <InputBar
        placeholder={'Write the wanted value and use variables if needed!'}
        backgroundColor={'#2757C9'}
        borderColor={'#2757C9'}
        textColor={'white'}
        isPassword={false}
        value={value}
        onChange={onChange}
        onSubmit={() => {}}
      />
    </div>
  );
}
