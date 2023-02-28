import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AssetClass, Hotel, Office, Residential, Retail, Scheme, ShoppingCentre, StudentAccommodation, Unit } from 'src/app/pages/loans/loan/scheme/scheme';
import { Choice } from 'src/app/shared/shared';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = "/api/scheme";
  assetClassChoicesSub = new BehaviorSubject<string[]>([]);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  setAssetClassChoicesSub(AssetClassChoices: string[]){
    return this.assetClassChoicesSub.next(AssetClassChoices);
  }

  createScheme(scheme: Scheme) {
    const url = `${this.relativeUrl}/`;

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(url, scheme).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this._sharedService.handleError(error));
        }
      })
    })
  };

  updateScheme(scheme: Scheme) {
    const url = `${this.relativeUrl}/${scheme.id}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, scheme).subscribe({
        next: (data) => {
          const result = data as APIResult;
          
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },

        error: (error) => {
          reject(this._sharedService.handleError(error));
        }
      })
    })
  };

  deleteScheme(scheme: Scheme): Observable<any> {
    const url = `${this.relativeUrl}/${scheme.id}/`;

    const options = {
      body: scheme
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteScheme()', Math.random()))
    ); 
  }

  // createAssetClass(assetClass: AssetClass) {
  //   const schemeId = assetClass.schemeId;
  //   const url = `${this.relativeUrl}/${schemeId}/asset-class/`;

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, assetClass).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  createUnits(units: Unit[]) {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = '/api/unit/';
    // const body = JSON.stringify(units);
    // console.log("body: ", body);

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(url, units).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this._sharedService.handleError(error));
        }
      })
    })
  };

  getAssetClassChoices(): Observable<string[]>  {
    const url = `${this.relativeUrl}/asset_class_choices/`;
    return this.http.get<string[]>(url).pipe(
      tap(() => console.log('getAssetClassChoices()', Math.random())),
    );
  }

  getUnitAreaTypes(): Observable<Choice[]> {
    const url = `${this.relativeUrl}/unit_area_types/`;
    return this.http.get<Choice[]>(url).pipe(
      tap(() => console.log('getUnitAreaTypes()', Math.random())),
    );
  }
  
  getSystemTypes(): Observable<Choice[]> {
    const url = `${this.relativeUrl}/system_types/`;
    return this.http.get<Choice[]>(url).pipe(
      tap(() => console.log('getSystemTypes()', Math.random())),
    );
  }

  // createHotel(hotel: Hotel) {
  //   const url = "api/hotel/";

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, hotel).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // updateHotel(hotel: Scheme) {
  //   const url = `api/hotel/${hotel.id}/`;

  //   return new Promise<APIResult>((resolve, reject) => {

  //     this.http.put(url, hotel).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
          
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },

  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  createAssetClass(assetClass: AssetClass, assetClassType: string) {
    const url = "/api/asset_class/";
    const body = {
      assetClass,
      assetClassType
    };

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(url, body).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this._sharedService.handleError(error));
        }
      })
    })
  };

  deleteAssetClass(assetClass: AssetClass): Observable<any> {
    const url = `api/asset_class/${assetClass.id}/`;

    const options = {
      body: assetClass
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteAssetClass()', Math.random()))
    ); 
  }

  // createResidential(residential: Residential) {
  //   const url = "api/residential/";

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, residential).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // updateResidential(residential: Scheme) {
  //   const url = `api/residential/${residential.id}/`;

  //   return new Promise<APIResult>((resolve, reject) => {

  //     this.http.put(url, residential).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
          
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },

  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // createRetail(retail: Retail) {
  //   const url = "api/retail/";

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, retail).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // updateRetail(retail: Retail) {
  //   const url = `api/retail/${retail.id}/`;

  //   return new Promise<APIResult>((resolve, reject) => {

  //     this.http.put(url, retail).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
          
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },

  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // createStudentAccommodation(studentAccommodation: StudentAccommodation) {
  //   const url = "api/student_accommodation/";

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, studentAccommodation).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // updateStudentAccommodation(studentAccommodation: StudentAccommodation) {
  //   const url = `api/student_accommodation/${studentAccommodation.id}/`;

  //   return new Promise<APIResult>((resolve, reject) => {

  //     this.http.put(url, studentAccommodation).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
          
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },

  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // createOffice(office: Office) {
  //   const url = "api/office/";

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, office).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // updateOffice(office: Office) {
  //   const url = `api/office/${office.id}/`;

  //   return new Promise<APIResult>((resolve, reject) => {

  //     this.http.put(url, office).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
          
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },

  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // createShoppingCentre(shoppingCentre: ShoppingCentre) {
  //   const url = "api/shopping_centre/";

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, shoppingCentre).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  // updateShoppingCentre(shoppingCentre: ShoppingCentre) {
  //   const url = `api/office/${shoppingCentre.id}/`;

  //   return new Promise<APIResult>((resolve, reject) => {

  //     this.http.put(url, shoppingCentre).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
          
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },

  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

}
