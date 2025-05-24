import { Entity, model, property, belongsTo, hasMany } from '@loopback/repository';
import { Role } from './role.model';
import { Purchases } from './purchases.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @belongsTo(() => Role)
  roleId: number;

  @hasMany(() => Purchases)
  purchases: Purchases[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here

}

export type UserWithRelations = User & UserRelations;
