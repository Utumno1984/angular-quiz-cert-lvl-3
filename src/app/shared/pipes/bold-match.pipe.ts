import { Pipe, PipeTransform } from '@angular/core';

const WHOLE_MATCH = '$&';

@Pipe({
  name: 'boldMatch',
  standalone: true
})
export class BoldMatchPipe implements PipeTransform {

  transform(value: string, filter: string): string {
    return value.replace(new RegExp(filter, 'ig'), `<b>${WHOLE_MATCH}</b>`);
  }

}
