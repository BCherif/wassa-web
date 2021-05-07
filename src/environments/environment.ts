// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,
    // serviceUrl: 'http://192.168.0.235:8080/erp-service/api',
    serviceUrl: 'http://localhost:8080/erp-service/api',
    authTitle: 'AUTHENTIFICATION',
    errorMessage: 'Une erreur est survenue',
    errorNetworkMessage: 'Echec de connexion au serveur',
    notAuthorizedUserMessage: 'Vous n\'êtes pas autorisé à vous connecter sur cette application'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
