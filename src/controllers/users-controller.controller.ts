import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Users} from '../models';
import {UsersRepository} from '../repositories';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class UsersControllerController {
  constructor(
    @repository(UsersRepository)
    public UsersRepository : UsersRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<Users> {
    return this.UsersRepository.create(users);
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.UsersRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Users) filter?: Filter<Users>,
  ): Promise<Users[]> {
    return this.UsersRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.UsersRepository.updateAll(users, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Users, {exclude: 'where'}) filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.UsersRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    await this.UsersRepository.updateById(id, users);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.UsersRepository.replaceById(id, users);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.UsersRepository.deleteById(id);
  }

  @patch('/updateStatus/{id}')
  async updateStatus(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              isActive: {type: 'boolean'}, 
            },
            required: ['isActive'],
          },
        },
      },
    })
    user: { isActive: boolean },
  ): Promise<void> {
    await this.UsersRepository.updateById(id, { isActive: user.isActive });
  }

  @post('/addUsers')
  async createUser(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              phoneNumber: {type: 'number'},
              password: {type: 'string'},
              isActive: {type: 'boolean'},
            },
            required: ['phoneNumber', 'password', 'isActive'],
          },
        },
      },
    })
    user: Users,
  ): Promise<Users> {
    // Hash the password before saving it
    user.password = await this.hashPassword(user.password);
    return this.UsersRepository.create(user);
  }
  @post('/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              phoneNumber: {type: 'number'},
              password: {type: 'string'},
            },
            required: ['phoneNumber', 'password'],
          },
        },
      },
    })
    credentials: { phoneNumber: number, password: string },
  ): Promise<{token: string}> {
    // Find the user by phoneNumber
    const user = await this.UsersRepository.findOne({
      where: { phoneNumber: credentials.phoneNumber },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify the provided password against the hashed password
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    // Generate and return a JWT token
    const token = jwt.sign({ userId: user.id }, 'secretKey', {
      expiresIn: '1h', // Set the token expiration time as needed
    });

    return { token };
  }
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Adjust as needed
    return bcrypt.hash(password, saltRounds);
  }
}
