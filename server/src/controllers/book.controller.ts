import {
  Count,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  repository,
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
  HttpErrors,
} from '@loopback/rest';
import { Book } from '../models';
import { AuthorRepository, BookRepository, PublisherRepository } from '../repositories';

export class BookController {
  constructor(
    @repository(BookRepository) public bookRepository: BookRepository,
    @repository(AuthorRepository) public authorRepository: AuthorRepository,
    @repository(PublisherRepository) public publisherRepository: PublisherRepository,
  ) { }

  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Book) } },
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id'],
          }),
        },
      },
    })
    book: Omit<Book, 'id'>,
  ): Promise<Book> {
    const { name, authorId, publisherId } = book;

    const authorExists = await this.authorRepository.exists(authorId);
    if (!authorExists) {
      throw new HttpErrors.BadRequest(`Author with id ${authorId} does not exist`);
    }

    const publisherExists = await this.publisherRepository.exists(publisherId);
    if (!publisherExists) {
      throw new HttpErrors.BadRequest(`Publisher with id ${publisherId} does not exist`);
    }


    return this.bookRepository.createIfNotExists(book, { name });
  }


  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.query.string('search') search?: string,
  ): Promise<Book[]> {
    const filter = new FilterBuilder<Book>().include(['author', 'publisher']);

    if (search) {
      search = search.trim();
      filter.where({ name: { like: `%${search}%` } });
      // return (await this.searchBookOrAuther(search))
    }

    return this.bookRepository.find(filter.build());
  }


  async searchBookOrAuther(search: string): Promise<Book[]> {
    const query = `
      SELECT 
        b.id
      FROM book b
      JOIN author a ON b.authorId = a.id
      WHERE b.name LIKE '%${search}%' OR a.name LIKE '%${search}%'
    `;
    const result = await this.bookRepository.dataSource.execute(query);
    const bookIds = result.map((item: any) => item.id);

    if (!bookIds.length) {
      return [];
    }

    const filter = new FilterBuilder<Book>()
      .include(['author', 'publisher'])
      .where({ id: { inq: bookIds } })
      .build();

    return this.bookRepository.find(filter);
  }


  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Book, { exclude: 'where' }) filter?: FilterExcludingWhere<Book>
  ): Promise<Book> {
    return this.bookRepository.findById(id, filter);
  }


  @put('/books/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() book: Book,
  ): Promise<void> {
    await this.bookRepository.replaceById(id, book);
  }

  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bookRepository.deleteById(id);
  }
}
