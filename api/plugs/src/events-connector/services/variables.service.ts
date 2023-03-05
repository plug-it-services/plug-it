import { Injectable, Logger } from '@nestjs/common';
import { Variable } from '../../dto/Variable.dto';
//import { Variable as VariableWithoutField } from '../../dto/Variable.dto';
//import { Variable } from '../../services/dto/InitializeRequest.dto';
import { Nack } from '@golevelup/nestjs-rabbitmq';
import { Field } from '../../dto/Field.dto';

@Injectable()
export class VariablesService {
  private logger = new Logger(VariablesService.name);
  /*
  addDataTypes(
    toFill: VariableWithoutField[],
    typed: Variable[],
    stepId: string,
    serviceName: string,
  ) {
    return toFill.map((variable) => {
      const typedVariable = typed.find(
        (v) => v.key === variable.key,
      );
      if (!typedVariable) {
        this.logger.warn(
          `Variable ${variable.key} not found in typed variables of step ${stepId} of service ${serviceName}`,
        );
        throw new Nack();
      }
      return {
        ...variable,
        type: typedVariable.type,
      };
    });
  }
  */

  fillFields(fields: Field[], variables: Variable[][]) {
    return fields.map((field) => {
      let idx = field.value.indexOf('$');

      while (idx !== -1) {
        const rest = field.value.substring(idx + 2); // get rest of string
        const endVariableIdx = rest.indexOf('}'); // get end of variable

        if (endVariableIdx !== -1) {
          const completeVariable = rest.substring(0, endVariableIdx); // get complete variable
          const [provider, key] = completeVariable.split('.');
          const variable = variables[provider].find((v) => v.key === key);

          if (variable) {
            field.value = field.value.replace(
              '${' + completeVariable + '}',
              variable.value,
            );
          }
        }
        idx = field.value.indexOf('$', idx + 1);
      }
      return {
        key: field.key,
        value: field.value,
      };
    });
  }
}
