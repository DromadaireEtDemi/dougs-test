import { Injectable } from '@nestjs/common';
import { MovementDto } from '../dtos/movement.dto';
import { ValidateMovementsDto } from '../dtos/validateMovements.dto';
import { ValidationError } from 'src/errors/validationError';
import { removeDuplicate } from 'src/utils/removeDuplicate';

@Injectable()
export class SynchronizerService {
  getPeriodAmount(movements: MovementDto[], startingBalance = 0): number {
    return startingBalance + movements.reduce((accu, curr) => accu + curr.amount, 0);
  }

  getDuplicateMovements(movements: MovementDto[]): MovementDto[] {
    return Array.from(
      movements
        .reduce((dups, curr, currIndex) => {
          if (movements.findIndex((move, index) => move.id === curr.id && index != currIndex) != -1)
            dups.set(curr.id, curr);

          return dups;
        }, new Map<number, MovementDto>())
        .values()
    );
  }

  validateMovements({ balances, movements }: ValidateMovementsDto) {
    const errors: ValidationError[] = [];
    let totalAmount = 0;
    let previousDate: Date;
    const filteredMovements = removeDuplicate(movements, 'id');

    for (const currBalance of balances) {
      const currMovements = [];
      while (filteredMovements[0] && filteredMovements[0].date <= currBalance.date)
        currMovements.push(filteredMovements.shift());
      const periodAmount = this.getPeriodAmount(currMovements, totalAmount);
      if (currBalance.balance - periodAmount !== 0)
        errors.push(
          new ValidationError(
            { startingDate: previousDate, endingDate: currBalance.date },
            currBalance.balance - periodAmount
          )
        );

      totalAmount = currBalance.balance;
      previousDate = currBalance.date;
    }

    return errors;
  }
}
