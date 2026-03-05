import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UuidGenerator } from '../../../domain/ports/uuid.generator';

@Injectable()
export class UuidGeneratorAdapter implements UuidGenerator {
  generate(): string {
    return randomUUID();
  }
}
