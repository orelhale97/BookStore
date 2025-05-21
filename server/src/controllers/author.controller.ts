import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Author } from '../models';
import { AuthorRepository } from '../repositories';

export class AuthorController {
  constructor(
    @repository(AuthorRepository)
    public authorRepository: AuthorRepository,
  ) { }

  @post('/authors')
  @response(200, {
    description: 'Author model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Author) } },
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {
            title: 'NewAuthor',
            exclude: ['id'],
          }),
        },
      },
    })
    author: Omit<Author, 'id'>,
  ): Promise<Author> {
    return this.authorRepository.createIfNotExists(author, { name: author.name });
  }


  @get('/authors')
  @response(200, {
    description: 'Array of Author model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Author, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Author) filter?: Filter<Author>,
  ): Promise<Author[]> {
    return this.authorRepository.find(filter);
  }

  @get('/authors/{id}')
  @response(200, {
    description: 'Author model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Author, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Author, { exclude: 'where' }) filter?: FilterExcludingWhere<Author>
  ): Promise<Author> {
    return this.authorRepository.findById(id, filter);
  }


  @put('/authors/{id}')
  @response(204, {
    description: 'Author PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() author: Author,
  ): Promise<void> {
    await this.authorRepository.replaceById(id, author);
  }

  @del('/authors/{id}')
  @response(204, {
    description: 'Author DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authorRepository.deleteById(id);
  }



  // @get('/authors/{id}/books', {
  //   responses: {
  //     '200': {
  //       description: 'Array of Author has many Book',
  //       content: {
  //         'application/json': {
  //           schema: {type: 'array', items: getModelSchemaRef(Book)},
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.path.number('id') id: number,
  //   @param.query.object('filter') filter?: Filter<Book>,
  // ): Promise<Book[]> {
  //   return this.authorRepository.books(id).find(filter);
  // }
}
