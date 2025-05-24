import { getModelSchemaRef, HttpErrors, post, requestBody, get } from "@loopback/rest";
import { User } from "../models";
import { UserRepository, RoleRepository } from "../repositories";
import { repository } from "@loopback/repository";
import { inject } from "@loopback/core";

import { CustomAuthorizationBindings, JWTService } from "../utils/auto.service";
import { authenticate } from "@loopback/authentication";
import { authorize } from "@loopback/authorization";

export class AppController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(RoleRepository) private roleRepository: RoleRepository,
    @inject(CustomAuthorizationBindings.JWTService) private JWTService: JWTService,
  ) { }


  @post('/login', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
              }
            }
          }
        },
      }
    }
  })
  async login(
    @requestBody() request: { email: 'string', password: 'string' },
  ): Promise<any> {
    const { email, password } = request || {};
    console.log("login ", email);

    const isUserExist = await this.userRepository.findOne({ where: { email, password }, include: ["role"] });
    console.log("isUserExist =", isUserExist);

    if (!isUserExist) {
      throw new HttpErrors.BadRequest("Your account email or password is incorrect.");
    }

    return this.JWTService.generateToken(isUserExist);
  }




  @post('/register', {
    responses: {
      '200': {
        content: {
          'application/json': {
            require: true,
            schema: getModelSchemaRef(User, { exclude: ['id', 'roleId'], })
          }
        }
      }
    }
  })
  async register(
    @requestBody() user: User,
  ): Promise<any> {
    const { email } = user;
    console.log("register =", email);

    const userRoleId = await this.roleRepository.findOrThrowError({ name: "user" });
    console.log("userRoleId =", userRoleId);

    user.roleId = (userRoleId.id as number);
    const newUser = await this.userRepository.createIfNotExists(user, { email });

    return newUser
  }


  @authenticate('jwt')
  @authorize({ allowedRoles: ['admin', 'manager'] })
  @get('/test')
  test(): any {

    return "test"
  }
}


