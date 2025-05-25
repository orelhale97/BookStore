import {
  Count,
  CountSchema,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Publisher } from '../models';
import { PublisherRepository } from '../repositories';

import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';


export class PublisherController {
  constructor(
    @repository(PublisherRepository)
    public publisherRepository: PublisherRepository,
  ) { }

  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @post('/publishers')
  @response(200, {
    description: 'Publisher model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Publisher) } },
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: getModelSchemaRef(Publisher, {
            title: 'NewPublisher',
            exclude: ['id'],
          }),
        },
      },
    })
    publisher: Omit<Publisher, 'id'>,
  ): Promise<Publisher> {
    const { name } = publisher;
    return this.publisherRepository.createIfNotExists(publisher, { name });
  }


  @get('/publishers')
  @response(200, {
    description: 'Array of Publisher model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Publisher, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Publisher) filter?: Filter<Publisher>,
  ): Promise<Publisher[]> {
    return this.publisherRepository.find(filter);
  }



  @get('/publishers/{id}')
  @response(200, {
    description: 'Publisher model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Publisher, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Publisher, { exclude: 'where' }) filter?: FilterExcludingWhere<Publisher>
  ): Promise<Publisher> {
    return this.publisherRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @put('/publishers/{id}')
  @response(204, {
    description: 'Publisher PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() publisher: Publisher,
  ): Promise<Publisher> {
    await this.publisherRepository.replaceById(id, publisher);;
    const filter = new FilterBuilder<Publisher>().where({ id: id }).build();
    return this.publisherRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @del('/publishers/{id}')
  @response(204, {
    description: 'Publisher DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.publisherRepository.deleteById(id);
  }
}
