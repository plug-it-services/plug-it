import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { Variable } from '../utils/api';

export interface IFieldEditorProps {
  key: string;
  onChange: (value: string) => void;
  value: string;
  variables: Variable[];
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
  variables: Variable[];
}) {
  /* const options = createFilterOptions<Variable>({
    matchFrom: 'start',
    stringify: (option) => option.key,
  }); */
  const filterOptions = (options: Variable[], { inputValue }: { inputValue: string }) => {
    const filtered = options.filter((option) => option.key.includes(inputValue));
    return filtered;
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      id={fieldKey}
      renderInput={(params) => <TextField {...params} label="Test de fou" value={value} />}
      filterOptions={filterOptions}
      options={variables}
      getOptionLabel={(option) => {
        if (option instanceof String) return option as string;
        return (option as Variable).key;
      }}
      onChange={(event, newValue) => {
        const input = newValue
          .map((el) => {
            if (el instanceof String) return el as string;
            return (el as Variable).key;
          })
          .join('');
        onChange(input);
      }}
    />
  );
}
