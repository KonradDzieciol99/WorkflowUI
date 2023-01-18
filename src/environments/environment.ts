// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiUrl: 'https://localhost:44346/api/',
  COOKIE_REFRESH_TOKEN_NAME:"Workflow-Refresh-Token",
  AUTO_LOGOUT_TIME_IN_MINUTES:10,
  production: false,
  API_SERVER_URL:"http://localhost:6060",
  AUTH0_DOMAIN:"AUTH0-DOMAIN",
  AUTH0_CLIENT_ID:"AUTH0-CLIENT-ID",
  AUTH0_CALLBACK_URL:"http://localhost:4040/callback"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
