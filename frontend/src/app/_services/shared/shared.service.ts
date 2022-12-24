import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }


  handleError(errorRes: HttpErrorResponse): Array<string> {
    console.log("errorRes:", errorRes);
    
    let errors = errorRes.error.response

    if('token' in errors) {
      errors = [errors.token.message]
    } {
      errors = Object.values(errors)
    }
    
    return errors;
  }

}
