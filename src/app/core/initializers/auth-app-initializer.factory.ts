import { IdentityServerService } from 'src/app/core/authentication/identity-server.service';
export function authAppInitializerFactory(
  authService: IdentityServerService,
): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}

//   import { IdentityServerService } from "src/app/authentication/identity-server.service";
// export function authAppInitializerFactory(authService: IdentityServerService): () => Promise<void> {
//     return () => authService.runInitialLoginSequence();
//   }
