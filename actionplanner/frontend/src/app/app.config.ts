import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE, ErrorHandler,
  importProvidersFrom,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, withJsonpSupport } from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";
import { environment } from "@env";
import { removeNullQueryParamInterceptor } from "@core/interceptors/remove-null-query-param/remove-null-query-param.interceptor";
import {
  parseDateQueryParamInterceptor
} from "@core/interceptors/parse-date-query-param/parse-date-query-param.interceptor";
import { API_BASE_URL, WINDOW } from "@core/injection-tokens/injection-tokens";
import { makeBaseUrlInterceptor } from "@core/interceptors/make-base-url/make-base-url.interceptor";
import { GlobalErrorHandler } from "@core/error-handlers/global-error-handler/global.error-handler";
import { errorInterceptor } from "@core/interceptors/error-interceptor/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    { provide: WINDOW, useValue: window },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withJsonpSupport(),
      withInterceptors([
        makeBaseUrlInterceptor,
        removeNullQueryParamInterceptor,
        parseDateQueryParamInterceptor,
        errorInterceptor
      ])
    ),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          headerName: 'Authorization',
          authScheme: 'Bearer ',
          tokenGetter: () => JSON.parse(localStorage.getItem('ap_access_token') ?? 'null'),
          allowedDomains: [environment.webApiDomain],
          disallowedRoutes: [environment.apiUrl + '/auth']
        }
      })
    ])
  ]
};
