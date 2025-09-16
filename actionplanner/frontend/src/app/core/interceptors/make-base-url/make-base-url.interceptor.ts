import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { API_BASE_URL } from "@core/injection-tokens/injection-tokens";

export const makeBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/assets/')) {
    return next(req);
  }

  if (req.url.startsWith('http')) {
    return next(req);
  }

  let apiEndpoint = req.url;
  if (!req.url.startsWith('/')){
    apiEndpoint = "/" + apiEndpoint;
  }

  const apiReq = req.clone({ url: `${inject(API_BASE_URL)}${apiEndpoint}` });
  return next(apiReq);
};
