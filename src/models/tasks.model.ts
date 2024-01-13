import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Tasks extends Entity {
  @property({
    type: 'string',
    id: true, // Indicates this property is the primary key
    generated: true, // Automatically generates a value for this property
    required: false, // Optional, but it's common for IDs to be optional
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  titleName: string;

  @property({
    type: 'string',
    default: '',
  })
  description?: string;

  @property({
    type: 'date',
    default: () => new Date(), // Use a function to set the default date
  })
  createdOn?: string;

  constructor(data?: Partial<Tasks>) {
    super(data);
  }
}

export interface TasksRelations {
  // describe navigational properties here
}

export type TasksWithRelations = Tasks & TasksRelations;
