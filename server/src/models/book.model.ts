import { Entity, model, property } from '@loopback/repository';

@model()
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: "",
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
    default: 1
  })
  availableQuantity: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: Date;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
