import { Entity, Model, model, property, belongsTo} from '@loopback/repository';
import {Book} from './book.model';
import {User} from './user.model';

@model()
export class Purchases extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  date: Date;

  @belongsTo(() => Book)
  bookId: number;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Purchases>) {
    super(data);
  }
}


export interface PurchasesRelations {
  // describe navigational properties here
}

export type PurchasesWithRelations = Purchases & PurchasesRelations;
