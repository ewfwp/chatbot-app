import { createApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { createCustomElement } from '@angular/elements';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeNl from '@angular/common/locales/nl';

registerLocaleData(localeNl, 'nl');

createApplication({
  providers: [{ provide: LOCALE_ID, useValue: 'nl' }],
})
  .then((app) => {
    const element = createCustomElement(App, { injector: app.injector });

    if (!customElements.get('ewfwp-example-app')) {
      customElements.define('ewfwp-example-app', element);
    }
  })
  .catch((err) => console.error(err));
