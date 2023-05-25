import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Choice } from 'src/app/_interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private http: HttpClient
    ) {}


  handleError(errorRes: HttpErrorResponse): Array<string> {
    let errors = errorRes.error;
    console.log("errors:", errors)

    // one error message set in view
    if(!!errors.message) {
      return [errors.message]
    }
    
    // 
    if(!!errors.response) {
      // serailizers.errors from view
      errors = errors.response;
    };

    // extract all messages from error
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

  getChoices(choiceType: string): Observable<Choice[]> {
    const url = `/api/choices/${choiceType}/`;
    return this.http.get<Choice[]>(url).pipe(
      tap(() => console.log('getChoices()', Math.random()))
    );
  }

  getChoiceLabel(choice_value: string, choices: Choice[]): string {
    const choice = choices.find((choice) => choice.value === choice_value);
    return choice ? choice.label : '';
  }

  getFields(name: string):Observable<string[]> {
    const url = `/api/fields/${name}/`;
    return this.http.get<string[]>(url).pipe(
      tap(() => console.log('getFields()', Math.random()))
    );
  }



}
