import {Pipe, PipeTransform} from '@angular/core';
import { isNullOrUndefined } from 'util';

@Pipe({
  name: 'commaSeperated'
})
export class CommaSeperatedPipe implements PipeTransform {

  transform(value: string): string {
    if (isNullOrUndefined(value)) {
      return '';
    }
    const strArr=value.toString().split('.');
    let str = '';
    if(!isNullOrUndefined(strArr) && strArr.length>0) {
      str = strArr[0];
    }
    if (str.length < 4) {
      return value;
    }
    const str1 = str.slice(0, -3);
    const str2 = str.substring(str.length - 3);
    return `${this.transform(str1)},${str2}`;
  }

}
