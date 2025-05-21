import { Entity, model, property, hasMany } from '@loopback/repository';
import { Book } from './book.model';

@model()
export class Publisher extends Entity {
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

  @hasMany(() => Book)
  books: Book[];

  constructor(data?: Partial<Publisher>) {
    super(data);
  }
}

export interface PublisherRelations {
  // describe navigational properties here
}

export type PublisherWithRelations = Publisher & PublisherRelations;
