import { Body, Controller, HttpCode, HttpStatus, Post, Logger, UsePipes, Query } from '@nestjs/common';
import { ValidateMovementsDto } from '../dtos/validateMovements.dto';
import { HttpMessage } from 'src/constants/httpMessage';
import { OrderByDatePipe } from 'src/pipes/transform/orderByDate';
import { SynchronizerService } from '../services/synchronizer';
import { DuplicateError } from 'src/errors/duplicateError';

@Controller()
export class SynchronizerController {
  private readonly logger = new Logger('SynchronizerController');

  constructor(private synchronizerService: SynchronizerService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/movements/validate')
  @UsePipes(new OrderByDatePipe())
  validateMovements(
    @Body()
    validateMovements: ValidateMovementsDto,
    @Query('proceedWithDuplicate')
    proceedWithDuplicate = false
  ): { status: number; message: string; reasons?: string[] } {
    const errors: Error[] = proceedWithDuplicate
      ? []
      : this.synchronizerService
          .getDuplicateMovements(validateMovements.movements)
          .map((dup) => new DuplicateError(dup.id));

    errors.push(...this.synchronizerService.validateMovements(validateMovements));
    if (errors.length) {
      return {
        message: HttpMessage[HttpStatus.NOT_ACCEPTABLE],
        status: HttpStatus.NOT_ACCEPTABLE,
        reasons: errors.map((err) => err.toString())
      };
    }
    return {
      message: HttpMessage[HttpStatus.ACCEPTED],
      status: HttpStatus.ACCEPTED
    };
  }
}
