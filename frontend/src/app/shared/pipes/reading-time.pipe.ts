import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readingTime', standalone: true })
export class ReadingTimePipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || minutes <= 1) return '1 Min. Lesezeit';
    return `${minutes} Min. Lesezeit`;
  }
}
