import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { format, isDate } from "date-fns";

export const parseDateQueryParamInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const params = req.params.keys().reduce((acc, key) => {
    const values = req.params.getAll(key) ?? [];
    values.forEach((value) => {
      if (deveFormatar(value)) {
        const formattedDate = format(new Date(value), 'yyyy-MM-dd');
        acc = acc.append(key, formattedDate);
      } else {
        acc = acc.append(key, value);
      }
    });
    return acc;
  }, new HttpParams({}));

  return next(req.clone({ params }));
};

const deveFormatar = (value: any) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return false;
  }

  return isDate(value) || [date.toString(), date.toISOString()].includes(value);
}
