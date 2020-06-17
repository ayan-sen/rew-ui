import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInceptorService implements HttpInterceptor { 

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string
  ) { }
  intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    
    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
      const apiReq = req.clone({
        url: `${this.baseUrl}/${req.url}`,
        setHeaders: {
          Authorization: sessionStorage.getItem('token') 
        }
      })
      return next.handle(apiReq);
    } else {
      const apiReq = req.clone({ url: `${this.baseUrl}/${req.url}` });
      return next.handle(apiReq);
    }
    throw new Error("Method not implemented.");
  }
}
