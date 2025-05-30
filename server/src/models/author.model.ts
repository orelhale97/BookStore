import { Entity, model, property, hasMany } from '@loopback/repository';
import { Book } from './book.model';

@model()
export class Author extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @hasMany(() => Book)
  books: Book[];

  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  // describe navigational properties here
}

export type AuthorWithRelations = Author & AuthorRelations;
