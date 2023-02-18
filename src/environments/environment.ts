// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiUrl: 'https://localhost:44346/api/',
  chatUrl: 'https://localhost:7282/',
  signalRhubUrl: 'https://localhost:7024/hub/',
  socialApiUrl: 'https://localhost:7260/',
  socialApihubUrl: 'https://localhost:7260/hub/',
  COOKIE_REFRESH_TOKEN_NAME:"Workflow-Refresh-Token",
  AUTO_LOGOUT_TIME_IN_MINUTES:10,
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
