import { Test, TestingModule } from '@nestjs/testing';
import { PlugsService } from './plugs.service';
import { getModelToken } from '@nestjs/mongoose';
import { ServicesService } from '../services/services/services.service';
import { HttpException } from '@nestjs/common';
import { ElementType, Variable } from '../services/dto/InitializeRequest.dto';

const PlugModel = {};
const ServicesServiceValue = {};

describe('PlugsService', () => {
  let service: PlugsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('Plug'),
          useValue: PlugModel,
        },
        {
          provide: ServicesService,
          useValue: ServicesServiceValue,
        },
        PlugsService,
      ],
    }).compile();

    service = module.get<PlugsService>(PlugsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFieldWithVariables', () => {
    beforeEach(() => {
      jest.spyOn(service as any, 'validateVariableReference');
    });

    it('should not call validateVariableReference if not variable reference is present', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      service['validateFieldWithVariables'](
        'this is a value without variable references',
        variables,
        field,
      );

      expect(service['validateVariableReference']).not.toHaveBeenCalled();
    });

    it('should call validateVariableReference once if a single variable reference is present', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      service['validateFieldWithVariables'](
        'this is a ${1.var1} variable references',
        variables,
        field,
      );

      expect(service['validateVariableReference']).toHaveBeenCalledTimes(1);
    });

    it('should call validateVariableReference multiple times if multiple variable references are present', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      service['validateFieldWithVariables'](
        'this is a ${1.var1} ${1.var1} variable references',
        variables,
        field,
      );

      expect(service['validateVariableReference']).toHaveBeenCalledTimes(2);
    });

    it('should call validateVariableReference two times if variable references are collapsed', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      service['validateFieldWithVariables'](
        'this is a ${1.var1}${1.var1} variable references',
        variables,
        field,
      );

      expect(service['validateVariableReference']).toHaveBeenCalledTimes(2);
    });

    it('should call validateVariableReference once if a single variable reference is present at the beginning', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      service['validateFieldWithVariables'](
        '${1.var1} is a variable references',
        variables,
        field,
      );

      expect(service['validateVariableReference']).toHaveBeenCalledTimes(1);
    });

    it('should call validateVariableReference once if a single variable reference is present at the end', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      service['validateFieldWithVariables'](
        'is a variable references ${1.var1}',
        variables,
        field,
      );

      expect(service['validateVariableReference']).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateVariableReference', () => {
    it('should not throw if the variable reference is valid', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      try {
        service['validateVariableReference']('1.var1', variables, field);
      } catch (error) {
        fail("Shouldn't throw an error");
      }
    });

    it('should throw if the provider does not exists', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('0', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      expect(() =>
        service['validateVariableReference']('1.var1', variables, field),
      ).toThrowError(HttpException);
    });

    it('should throw if the variable does not exists', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('1', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.STRING,
        displayName: 'field1',
        required: false,
      };

      expect(() => {
        service['validateVariableReference']('1.var2', variables, field);
      }).toThrow(HttpException);
    });

    it('should throw if the type does not match', () => {
      const variables = new Map<string, Variable[]>();
      variables.set('0', [
        {
          key: 'var1',
          type: ElementType.STRING,
          displayName: 'var1',
          description: 'var1',
        },
      ]);
      const field = {
        key: 'field1',
        type: ElementType.NUMBER,
        displayName: 'field1',
        required: false,
      };

      expect(() => {
        service['validateVariableReference']('1.var1', variables, field);
      }).toThrow(HttpException);
    });
  });

  describe('validateFieldType', () => {
    it('should not throw if the number is valid', () => {
      try {
        service['validateFieldType']('123', 'number');
      } catch (error) {
        fail("Shouldn't throw an error");
      }
    });

    it('should throw if field type is invalid', () => {
      expect(() => service['validateFieldType']('abc', 'number')).toThrowError(
        HttpException,
      );
    });

    it('should not throw if the string is valid', () => {
      try {
        service['validateFieldType']('abc', 'string');
      } catch (error) {
        fail("Shouldn't throw an error");
      }
    });

    it('should throw if field type is invalid', () => {
      expect(() =>
        service['validateFieldType']('ok', 'dontExists'),
      ).toThrowError(HttpException);
    });

    it('should not throw if the falsy boolean is valid', () => {
      try {
        service['validateFieldType']('false', 'boolean');
      } catch (error) {
        fail("Shouldn't throw an error");
      }
    });

    it('should not throw if the truthy boolean is valid', () => {
      try {
        service['validateFieldType']('true', 'boolean');
      } catch (error) {
        fail("Shouldn't throw an error");
      }
    });

    it('should throw if boolean type is invalid', () => {
      expect(() => service['validateFieldType']('ok', 'boolean')).toThrowError(
        HttpException,
      );
    });
  });
});
