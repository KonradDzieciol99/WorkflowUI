/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLicense } from '@syncfusion/ej2-base';


registerLicense('Mgo+DSMBaFt+QHFqVkNrXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQl5hSn9bdkBjWHhcdXI=;Mgo+DSMBPh8sVXJ1S0d+X1RPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSX1RdURrWXpecXNRRmY=;ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5QdEZiUX9bcHVSQ2Na;MTQ0MzU0MUAzMjMxMmUzMTJlMzMzNWJXSlltaUdBc2hxdjhFcUdsRjlKaTlaYytJNTBJUDZUb25QOG1UMlcvK2M9;MTQ0MzU0MkAzMjMxMmUzMTJlMzMzNWg1cjFGRk1pc1BwNktZQ2Z0b1I1M1V6REsrdmVwQThLRlJLYzVSdExCckk9;NRAiBiAaIQQuGjN/V0d+XU9Hc1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TdUdgWHdedXRUTmJeVw==;MTQ0MzU0NEAzMjMxMmUzMTJlMzMzNUJyMVl3SkNtN09IZTdISTIyT1E3endCckUyanNuM0ZhYkxBSjhEY09aTVU9;MTQ0MzU0NUAzMjMxMmUzMTJlMzMzNU9HMGlDR1RKV3dXZU1DYU1EZU1nM1ptZnNaZmJERmdMeHkzUFh5bmpSRzg9;Mgo+DSMBMAY9C3t2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5QdEZiUX9bcHVdTmla;MTQ0MzU0N0AzMjMxMmUzMTJlMzMzNW9FVm1TWGVtZWZmT3ZabjBsdGFqMDI4TVdxVHJDZ1dPNUVPRkNjbFdBbFk9;MTQ0MzU0OEAzMjMxMmUzMTJlMzMzNWJhQkN3aTRuSkFzdU9sNlhINXEyV2VCR2ZMckNKZ0pheHhjaXJyM29aT0E9;MTQ0MzU0OUAzMjMxMmUzMTJlMzMzNUJyMVl3SkNtN09IZTdISTIyT1E3endCckUyanNuM0ZhYkxBSjhEY09aTVU9');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
