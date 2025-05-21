import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Author } from './author.model';
import { Publisher } from './publisher.model';

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
    default: 1,
  })
  description?: string;

  @property({
    type: 'number',
    default: 1
  })
  availableQuantity?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: Date;


  @belongsTo(() => Author)
  authorId: number;

  @belongsTo(() => Publisher)
  publisherId: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
