import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { CustomAuthorizationBindings, JWTAuthenticationStrategy, JWTService, RoleAuthorizerProvider } from './utils/auto.service';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';


export { ApplicationConfig };

export class BookStoreApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.bind('rest.cors').to({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    });

    this.bindClasses();
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../assets'));
    this.static('/uploads', path.join(__dirname, '../assets/uploads'));


    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }



  bindClasses() {
    this.bind(CustomAuthorizationBindings.JWTService)
      .toClass(JWTService);

    this.bind(CustomAuthorizationBindings.ROLE_AUTHORIZER)
      .toProvider(RoleAuthorizerProvider)
      .tag('authorizer');
  }
}
