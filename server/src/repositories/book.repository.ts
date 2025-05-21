import { inject, Getter } from '@loopback/core';
import { DataObject, DefaultCrudRepository, Filter, repository, BelongsToAccessor, Where } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Book, BookRelations, Author, Publisher } from '../models';
import { AuthorRepository } from './author.repository';
import { PublisherRepository } from './publisher.repository';
import { HttpErrors } from '@loopback/rest';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.id,
  BookRelations
> {

  public readonly author: BelongsToAccessor<Author, typeof Book.prototype.id>;

  public readonly publisher: BelongsToAccessor<Publisher, typeof Book.prototype.id>;

  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
    @repository.getter('AuthorRepository') protected authorRepositoryGetter: Getter<AuthorRepository>,
    @repository.getter('PublisherRepository') protected publisherRepositoryGetter: Getter<PublisherRepository>,
  ) {
    super(Book, dataSource);
    this.publisher = this.createBelongsToAccessorFor('publisher', publisherRepositoryGetter,);
    this.registerInclusionResolver('publisher', this.publisher.inclusionResolver);
    this.author = this.createBelongsToAccessorFor('author', authorRepositoryGetter,);
    this.registerInclusionResolver('author', this.author.inclusionResolver);
  }


  async findOrCreate(filter: Filter<Book>, data: DataObject<Book>): Promise<Book> {

    const existing = await this.findOne(filter);
    if (existing) return existing;
    return this.create(data);
  }


  async createIfNotExists(data: Omit<Book, 'id'>, where: Where<Book>): Promise<Book> {
    const existing = await this.findOne({ where } as Filter<Book>);
    if (existing) {
      throw new HttpErrors.Conflict(`An entity with these details already exists`);
    }

    return this.create(data);
  }
}
