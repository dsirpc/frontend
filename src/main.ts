import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Device bootstrap
document.addEventListener('deviceready', () => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
}, false);

// Browser bootstrap
// platformBrowserDynamic().bootstrapModule(AppModule)
//  .catch(err => console.log(err));
