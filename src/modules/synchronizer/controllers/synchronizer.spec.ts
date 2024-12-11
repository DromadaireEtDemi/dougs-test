import { Test, TestingModule } from '@nestjs/testing';
import { UnitTestsModule } from '../../../../tests/utils/unit-test.module';
import { SynchronizerController } from './synchronizer';
import { SynchronizerService } from '../services/synchronizer';
import { HttpStatus } from '@nestjs/common';

describe('SynchronizerController Unit Tests', () => {
  let controller: SynchronizerController;
  let isValid = true;
  let hasDuplicate = false;

  const mockedService = {
    validateMovements() {
      return isValid
        ? []
        : [
            {
              period: {
                startingDate: new Date('2024-01-01'),
                endingDate: new Date('2024-01-31')
              },
              errorAmount: 100
            }
          ];
    },
    getDuplicateMovements() {
      return hasDuplicate ? [1] : [];
    }
  };

  beforeEach(async () => {
    isValid = true;
    hasDuplicate = false;
    const module: TestingModule = await Test.createTestingModule({
      imports: [UnitTestsModule],
      controllers: [SynchronizerController],
      providers: [
        {
          provide: SynchronizerService,
          useValue: mockedService
        }
      ]
    }).compile();

    controller = module.get<SynchronizerController>(SynchronizerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 200 if no error found', () => {
    const response = controller.validateMovements({} as any);
    expect(response.status).toEqual(HttpStatus.ACCEPTED);
  });
  it('should return 400 if errors found', () => {
    isValid = false;
    const responseNotValid = controller.validateMovements({} as any);
    expect(responseNotValid.status).toEqual(HttpStatus.NOT_ACCEPTABLE);
  });

  it('should return 400 if duplicates found', () => {
    hasDuplicate = true;

    const responseDup = controller.validateMovements({} as any);
    expect(responseDup.status).toEqual(HttpStatus.NOT_ACCEPTABLE);
  });

  it('should return 200 if duplicates are found but queryParam proceedWithDuplicate is true', () => {
    hasDuplicate = true;

    const responseDup = controller.validateMovements({} as any, true);
    expect(responseDup.status).toEqual(HttpStatus.ACCEPTED);
  });
});
