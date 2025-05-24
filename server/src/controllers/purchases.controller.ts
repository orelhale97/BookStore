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
import { Purchases } from '../models';
import { PurchasesRepository } from '../repositories';

export class PurchasesController {
  constructor(
    @repository(PurchasesRepository)
    public purchasesRepository: PurchasesRepository,
  ) { }

  @post('/purchases')
  @response(200, {
    description: 'Purchases model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Purchases) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Purchases, {
            title: 'NewPurchases',
            exclude: ['id', "date"],
          }),
        },
      },
    })
    purchases: Omit<Purchases, 'id'>,
  ): Promise<Purchases> {


    return this.purchasesRepository.createWithValidation(purchases);
  }


  @get('/purchases')
  @response(200, {
    description: 'Array of Purchases model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Purchases, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Purchases) filter?: Filter<Purchases>,
  ): Promise<Purchases[]> {
    return this.purchasesRepository.find(filter);
  }

  @get('/purchases/user/{userId}')
  @response(200, {
    description: 'Array of Purchases model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Purchases, { includeRelations: true }),
        },
      },
    },
  })
  async findAllpurchasesByUserId(
    @param.path.number('userId') userId: number,
  ): Promise<Purchases[]> {


    const filter = new FilterBuilder<Purchases>();
    filter.where({ userId })
      .include({
        relation: 'user',
        scope: { fields: { password: false, roleId: false }, },
      })
      .include({
        relation: 'book',
      });
    return this.purchasesRepository.find(filter.build());
  }


  @get('/purchases/{id}')
  @response(200, {
    description: 'Purchases model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Purchases, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Purchases, { exclude: 'where' }) filter?: FilterExcludingWhere<Purchases>
  ): Promise<Purchases> {
    return this.purchasesRepository.findById(id, filter);
  }


  @put('/purchases/{id}')
  @response(204, {
    description: 'Purchases PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() purchases: Purchases,
  ): Promise<void> {
    await this.purchasesRepository.replaceById(id, purchases);
  }

  @del('/purchases/{id}')
  @response(204, {
    description: 'Purchases DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.purchasesRepository.deleteById(id);
  }
}
