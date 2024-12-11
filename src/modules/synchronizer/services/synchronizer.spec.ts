import { DUPLICATE_MOVEMENTS, EXCESS_MOVEMENT, MOVEMENTS_YEAR } from '../../../../tests/data/movements';
import { SynchronizerService } from './synchronizer';
import { BALANCE_YEAR } from '../../../../tests/data/balance';
import { ValidationError } from 'src/errors/validationError';

describe('SynchronizerService Unit Tests', () => {
  const service = new SynchronizerService();
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should returns the correct amount on the given period', () => {
    const offset = 200;
    const periodWithNoMovement = service.getPeriodAmount([]);
    const yearMovements = service.getPeriodAmount([...MOVEMENTS_YEAR]);
    const yearMovementsWithOffset = service.getPeriodAmount([...MOVEMENTS_YEAR], offset);

    expect(periodWithNoMovement).toBe(0);
    expect(yearMovements).toBe(BALANCE_YEAR[BALANCE_YEAR.length - 1].balance);
    expect(yearMovementsWithOffset).toBe(BALANCE_YEAR[BALANCE_YEAR.length - 1].balance + offset);
  });

  it('should returns no error if all the balances are correct', () => {
    const errors = service.validateMovements({ movements: [...MOVEMENTS_YEAR], balances: BALANCE_YEAR });

    expect(errors.length).toBe(0);
  });

  it('should returns no error if all the balances are correct (with dupes)', () => {
    const errors = service.validateMovements({
      movements: [...MOVEMENTS_YEAR, MOVEMENTS_YEAR[0]],
      balances: BALANCE_YEAR
    });

    expect(errors.length).toBe(0);
  });

  it('should returns the faulty periods if errors are found', () => {
    const movementsWithExcess = [...MOVEMENTS_YEAR];
    movementsWithExcess.splice(3, 0, EXCESS_MOVEMENT);

    const excessError = service.validateMovements({ movements: movementsWithExcess, balances: BALANCE_YEAR });

    expect(excessError).toEqual([
      new ValidationError(
        {
          startingDate: BALANCE_YEAR[2].date,
          endingDate: BALANCE_YEAR[3].date
        },
        -EXCESS_MOVEMENT.amount
      )
    ]);

    const movementsWithMissing = [...MOVEMENTS_YEAR];
    movementsWithMissing.splice(2, 1);

    const missingError = service.validateMovements({ movements: movementsWithMissing, balances: BALANCE_YEAR });

    expect(missingError).toEqual([
      new ValidationError(
        {
          startingDate: BALANCE_YEAR[2].date,
          endingDate: BALANCE_YEAR[3].date
        },
        MOVEMENTS_YEAR[2].amount
      )
    ]);
  });

  it('should returns the duplicate movements if any', () => {
    const dups = service.getDuplicateMovements([...DUPLICATE_MOVEMENTS]);
    expect(DUPLICATE_MOVEMENTS.length).toBe(4);
    expect(dups.length).toBe(2);
  });
});
