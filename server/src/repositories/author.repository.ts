import { inject, Getter } from '@loopback/core';
import { DataObject, DefaultCrudRepository, Filter, Where, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Author, AuthorRelations, Book } from '../models';
import { BookRepository } from './book.repository';
import { HttpErrors } from '@loopback/rest';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {

  public readonly books: HasManyRepositoryFactory<Book, typeof Author.prototype.id>;

  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
    @repository.getter('BookRepository') protected bookRepositoryGetter: Getter<BookRepository>,
  ) {
    super(Author, dataSource);
    this.books = this.createHasManyRepositoryFactoryFor('books', bookRepositoryGetter,);
    this.registerInclusionResolver('books', this.books.inclusionResolver);
  }


  async findOrCreate(filter: Filter<Author>, data: DataObject<Author>): Promise<Author> {

    const existing = await this.findOne(filter);
    if (existing) return existing;
    return this.create(data);
  }

  async createIfNotExists(data: Omit<Author, 'id'>, where: Where<Author>): Promise<Author> {
    const existing = await this.findOne({ where } as Filter<Author>);
    if (existing) {
      throw new HttpErrors.Conflict(`An entity with these details already exists`);
    }
    return this.create(data);
  }

}
