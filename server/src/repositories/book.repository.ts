import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BookStoreDataSource} from '../datasources';
import {Book, BookRelations} from '../models';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.id,
  BookRelations
> {

  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
  ) {
    super(Book, dataSource);
  }
}
