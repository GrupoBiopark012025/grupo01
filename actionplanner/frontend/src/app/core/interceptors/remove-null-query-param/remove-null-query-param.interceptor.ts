import { HttpInterceptorFn, HttpParams } from '@angular/common/http';

export const removeNullQueryParamInterceptor: HttpInterceptorFn = (req, next) => {
  /*
   HttpClient não remove null dos parameters da query, ainda...
   https://github.com/angular/angular/issues/20564
  */

  if (req.method !== 'GET') {
    return next(req);
  }

  const params = req.params.keys().reduce((acc, key) => {
    const values = req.params.getAll(key) ?? [];
    values.forEach((value) => {
      if (![null, 'null', undefined, 'undefined'].includes(value)) {
        acc = acc.append(key, value);
      }
    });
    return acc;
  }, new HttpParams({}));

  const modifiedReq = req.clone({ params });
  return next(modifiedReq);
};
