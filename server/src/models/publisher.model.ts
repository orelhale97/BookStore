import { Entity, model, property } from '@loopback/repository';

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


  constructor(data?: Partial<Publisher>) {
    super(data);
  }
}

export interface PublisherRelations {
  // describe navigational properties here
}

export type PublisherWithRelations = Publisher & PublisherRelations;
