import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateDe', standalone: true })
export class DateDePipe implements PipeTransform {
  private months = ['Januar', 'Februar', 'M\u00e4rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  transform(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    return `${d.getDate()}. ${this.months[d.getMonth()]} ${d.getFullYear()}`;
  }
}
