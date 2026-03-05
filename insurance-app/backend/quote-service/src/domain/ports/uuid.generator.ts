export interface UuidGenerator {
  generate(): string;
}

export const UUID_GENERATOR = Symbol('UUID_GENERATOR');
