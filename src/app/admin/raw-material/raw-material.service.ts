import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { RawMaterial } from './raw-material';
import { Observable, throwError } from 'rxjs';
import { ErrorHandlerService } from 'src/app/components/common-service/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {

  constructor(private http: HttpClient, private errorHandler : ErrorHandlerService) { }

  save(rawMaterial : RawMaterial) {
    return this.http.post("admin/raw-material", rawMaterial);
   }
 
    findAll() : Observable<RawMaterial[]> {
     return this.http.get<RawMaterial[]>("admin/materials");
   } 

   findAllProducts() : Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>("admin/products");
  }

  findAllRawMaterials() : Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>("admin/raw-materials");
  }
}
