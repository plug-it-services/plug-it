import { Test, TestingModule } from '@nestjs/testing';
import { PlugsService } from './plugs.service';
import { getModelToken } from '@nestjs/mongoose';
import { ServicesService } from '../services/services/services.service';
import { HttpException } from '@nestjs/common';

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
      try {
        service['validateFieldType']('ok', 'boolean');
        fail('Should throw an error');
      } catch (error) {}
    });
  });
});
