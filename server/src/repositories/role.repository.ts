import { inject } from '@loopback/core';
import { DataObject, DefaultCrudRepository, Filter, Where } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Role, RoleRelations } from '../models';
import { HttpErrors } from '@loopback/rest';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
  ) {
    super(Role, dataSource);
  }


  async findOrCreate(filter: Filter<Role>, data: DataObject<Role>): Promise<Role> {
    const { where } = filter;
    const existing = await this.findOne({ where });
    if (existing) return existing;
    return this.create(data);
  }


  async findOrThrowError(where: Where<Role>): Promise<Role> {
    const existing = await this.findOne({ where } as Filter<Role>);
    if (!existing) {
      throw new HttpErrors.Conflict(`This role is not exists`);
    }
    return existing;
  }
}
