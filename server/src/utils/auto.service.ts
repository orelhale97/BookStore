import { User } from "../models";
import { sign, verify, decode } from "jsonwebtoken";
import { UserProfile, securityId } from '@loopback/security';
import { AuthenticationStrategy, TokenService, } from '@loopback/authentication';
import { HttpErrors, Request } from '@loopback/rest';
import { service, Provider } from '@loopback/core';

import { AuthorizationContext, AuthorizationMetadata, AuthorizationDecision } from '@loopback/authorization';
import { BindingKey } from '@loopback/core';
import { Authorizer } from '@loopback/authorization';



export class JWTService {
  private secret = process.env.JWT_SECRET || "default-secret";

  public generateToken(user: User): { token: string } {
    const { id, email, name, roleId } = user || {};

    const payload = { id, email, name, roleId, role: (user as any).role.name };

    const token = sign(payload, this.secret, { expiresIn: '8h' });
    return { token };
  }


  public async verifyToken(token: string): Promise<UserProfile> {
    try {
      const user = verify(token, this.secret);
      console.log("user ===== ", user);

      if (typeof user === 'string') {
        throw new HttpErrors.Unauthorized('Invalid token format');
      }

      const userProfile: UserProfile = {
        [securityId]: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: user.roleId,
      };

      return userProfile;
    } catch (err) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
}


export namespace CustomAuthorizationBindings {
  export const ROLE_AUTHORIZER = BindingKey.create<Authorizer>('authorization.roleAuthorizer');
  export const JWTService = BindingKey.create('service.JWTService');
}


export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @service(JWTService)
    public jwtService: JWTService,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);

    const user: UserProfile = await this.jwtService.verifyToken(token);
    console.log("user ==== ", user);

    return user || undefined;
  }

  extractCredentials(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new HttpErrors.Unauthorized('Missing Authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpErrors.Unauthorized('Authorization header is not valid');
    }

    return parts[1];
  }
}


export class RoleAuthorizerProvider implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {

    const allowedRoles = metadata.allowedRoles;
    const { principals } = authorizationCtx;
    const user = principals[0];

    if (!user || !user.role)
      return AuthorizationDecision.DENY;

    if (!allowedRoles?.length)
      return AuthorizationDecision.ALLOW;

    const userRole = user.role;
    console.log(`RoleAuthorizer > user: ${user.email}, role: ${userRole}, allowedRoles: ${allowedRoles.join(', ')}`);

    return allowedRoles.includes(userRole) ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }
}

