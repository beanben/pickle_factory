import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }


  handleError(errorRes: HttpErrorResponse): Array<string> {
    let errors = errorRes.error;
    console.log("errors:", errors)
    
    if(!!errors.response) {
      // errors generated from views
      errors = errors.response;
    }

    // extract messages from error
    let errorValues = Object.values(Object.values(errors));
    let errorMessages = errorValues.map((item: any) => {
      if('message' in item){
        return item.message
      }
    })
    if (errorMessages.length !== 0 ){
      errors = errorMessages

    } else {
      errors = Object.values(errors)
    }

    return errors;
  }

}
