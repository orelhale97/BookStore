import { inject, Getter } from '@loopback/core';
import { DataObject, DefaultCrudRepository, Filter, repository, HasManyRepositoryFactory, Where } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Publisher, PublisherRelations, Book } from '../models';
import { BookRepository } from './book.repository';
import { HttpErrors } from '@loopback/rest';

export class PublisherRepository extends DefaultCrudRepository<
  Publisher,
  typeof Publisher.prototype.id,
  PublisherRelations
> {

  public readonly books: HasManyRepositoryFactory<Book, typeof Publisher.prototype.id>;

  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource, @repository.getter('BookRepository') protected bookRepositoryGetter: Getter<BookRepository>,
  ) {
    super(Publisher, dataSource);
    this.books = this.createHasManyRepositoryFactoryFor('books', bookRepositoryGetter,);
    this.registerInclusionResolver('books', this.books.inclusionResolver);
  }

  async findOrCreate(filter: Filter<Publisher>, data: DataObject<Publisher>): Promise<Publisher> {

    const existing = await this.findOne(filter);
    if (existing) return existing;
    return this.create(data);
  }


  async createIfNotExists(data: Omit<Publisher, 'id'>, where: Where<Publisher>): Promise<Publisher> {
    const existing = await this.findOne({ where } as Filter<Publisher>);
    if (existing) {
      throw new HttpErrors.Conflict(`An entity with these details already exists`);
    }
    return this.create(data);
  }
}
