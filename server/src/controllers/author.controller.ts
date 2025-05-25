import {
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
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Author } from '../models';
import { AuthorRepository } from '../repositories';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';


export class AuthorController {

  constructor(
    @repository(AuthorRepository)
    public authorRepository: AuthorRepository,
  ) { }

  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
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

  
  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @put('/authors/{id}')
  @response(204, {
    description: 'Author PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() author: Author,
  ): Promise<Author> {

    await this.authorRepository.replaceById(id, author);
    const filter = new FilterBuilder<Author>().where({ id: id }).build();
    return this.authorRepository.findById(id, filter);
  }


  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin'] })
  @del('/authors/{id}')
  @response(204, {
    description: 'Author DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authorRepository.deleteById(id);
  }

}
