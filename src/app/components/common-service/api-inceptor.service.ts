import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiInceptorService implements HttpInterceptor { 

  baseUrl: String = environment.baseUrl; 
  constructor() { }
  intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    
    let finalUrl = this.baseUrl + req.url;
    const apiReq = req.clone({ url: finalUrl });
    return next.handle(apiReq);
    
    throw new Error("Method not implemented.");
  }
}
