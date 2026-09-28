import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeNl from '@angular/common/locales/nl';
import { AppComponent } from './app/app.component';

registerLocaleData(localeNl, 'nl');

createApplication({
  providers: [{ provide: LOCALE_ID, useValue: 'nl' }],
})
  .then((app) => {
    const element = createCustomElement(AppComponent, { injector: app.injector });

    if (!customElements.get('ewfwp-chatbot-app')) {
      customElements.define('ewfwp-chatbot-app', element);
    }
  })
  .catch((err) => console.error(err));
