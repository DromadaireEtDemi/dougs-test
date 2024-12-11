import { HttpStatus } from '@nestjs/common';

export const HttpMessage = {
  [HttpStatus.ACCEPTED]: 'Accepted',
  [HttpStatus.NOT_ACCEPTABLE]: 'Errors found'
} as const;
