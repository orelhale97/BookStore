import { inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Purchases, PurchasesRelations, Book, User } from '../models';
import { BookRepository } from './book.repository';
import { UserRepository } from './user.repository';
import { HttpErrors } from '@loopback/rest';

export class PurchasesRepository extends DefaultCrudRepository<
  Purchases,
  typeof Purchases.prototype.id,
  PurchasesRelations
> {

  public readonly book: BelongsToAccessor<Book, typeof Purchases.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Purchases.prototype.id>;

  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
    @repository.getter('BookRepository') protected bookRepositoryGetter: Getter<BookRepository>,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
    @repository(BookRepository) private bookRepository: BookRepository,
    @repository(UserRepository) private userRepository: UserRepository,

  ) {
    super(Purchases, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.book = this.createBelongsToAccessorFor('book', bookRepositoryGetter,);
    this.registerInclusionResolver('book', this.book.inclusionResolver);
  }

  async createWithValidation(data: Omit<Purchases, 'id' | 'date'>): Promise<Purchases> {
    const { userId, bookId } = data;

    await this.userRepository.findById(userId)
      .catch(() => { throw new HttpErrors.NotFound(`User with ID ${userId} does not exist`); });


    await this.bookRepository.findById(bookId)
      .catch(() => { throw new HttpErrors.NotFound(`Book with ID ${bookId} does not exist`) })


    return this.create(data);
  }
}
