import { inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor, Filter, DataObject, Where } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { User, UserRelations, Role } from '../models';
import { RoleRepository } from './role.repository';
import { HttpErrors } from '@loopback/rest';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }


  async findOrCreate(filter: Filter<User>, data: DataObject<User>): Promise<User> {
    const { where } = filter;
    const existing = await this.findOne({ where });
    if (existing) return existing;
    return this.create(data);
  }


  async createIfNotExists(data: User, where: Where<User>): Promise<User> {
    const existing = await this.findOne({ where } as Filter<User>);
    if (existing) {
      throw new HttpErrors.Conflict(`This email is already exists`);
    }
    return this.create(data);
  }
}
