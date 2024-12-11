import { PipeTransform, Injectable } from '@nestjs/common';
import { ValidateMovementsDto } from 'src/modules/synchronizer/dtos/validateMovements.dto';
import { sortByDate } from 'src/utils/sortByDate';

@Injectable()
export class OrderByDatePipe implements PipeTransform<ValidateMovementsDto, void> {
  transform(input: ValidateMovementsDto) {
    input?.balances?.sort(sortByDate);
    input?.movements?.sort(sortByDate);
    return input;
  }
}
