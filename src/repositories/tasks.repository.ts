import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Tasks, TasksRelations} from '../models';

export class TasksRepository extends DefaultCrudRepository<
  Tasks,
  typeof Tasks.prototype.id,
  TasksRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Tasks, dataSource);
  }
}
