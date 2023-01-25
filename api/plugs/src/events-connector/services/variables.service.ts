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
      if (!field.value.startsWith('$')) {
        return field;
      }
      const completeVariable = field.value.substring(1); // remove $
      const [provider, key] = completeVariable.split('.');
      const variable = variables[provider].find((v) => v.key === key);
      if (!variable) {
        this.logger.warn(
          `Variable ${field.value} not found in variables for field ${field.key}`,
        );
        throw new Nack();
      }
      return {
        key: field.key,
        value: variable.value,
      };
    });
  }
}
