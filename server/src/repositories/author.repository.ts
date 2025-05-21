import { inject } from '@loopback/core';
import { DataObject, DefaultCrudRepository, Filter, Where } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Author, AuthorRelations } from '../models';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {
  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
  ) {
    super(Author, dataSource);
  }


  async findOrCreate(filter: Filter<Author>, data: DataObject<Author>): Promise<Author> {

    const existing = await this.findOne(filter);
    if (existing) return existing;
    return this.create(data);
  }
}
