import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initial'
})
export class InitialPipe implements PipeTransform {

  transform(text: string): string {
    return text.charAt(0).toUpperCase();
  }

}
