// import {AuthenticationStrategy} from '@loopback/authentication';
// import {inject} from '@loopback/context';
// import {TokenService} from '@loopback/authentication-jwt';
// import {UserProfile, securityId} from '@loopback/security';
// import {HttpErrors} from '@loopback/rest';
// import {repository} from '@loopback/repository';
// import {UsersRepository} from './repositories';

// export class JWTAuthenticationStrategy implements AuthenticationStrategy {
//   name = 'jwt';

//   constructor(
//     @inject(TokenServiceBindings.TOKEN_SERVICE)
//     public tokenService: TokenService,
//     @repository(UsersRepository)
//     private usersRepository: UsersRepository,
//   ) {}

//   async authenticate(request: Request): Promise<UserProfile | undefined> {
//     const token: string = /* Extract token from request headers or cookies */;

//     if (!token) {
//       throw new HttpErrors.Unauthorized('Token is required');
//     }

//     try {
//       const decodedToken = await this.tokenService.verifyToken(token);
//       const userId = decodedToken[securityId];

//       // Fetch the user from the repository
//       const user = await this.usersRepository.findById(userId);

//       if (!user) {
//         throw new HttpErrors.Unauthorized('Invalid user');
//       }

//       return {
//         [securityId]: userId,
//         name: user.username,
//         // Add other user-related properties if needed
//       };
//     } catch (error) {
//       throw new HttpErrors.Unauthorized('Invalid token');
//     }
//   }
// }
