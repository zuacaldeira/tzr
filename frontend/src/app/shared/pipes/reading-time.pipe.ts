import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readingTime', standalone: true, pure: true })
export class ReadingTimePipe implements PipeTransform {
  transform(minutes: number, lang: string = 'de'): string {
    const min = !minutes || minutes <= 1 ? 1 : minutes;
    switch (lang) {
      case 'pt': return `${min} min. de leitura`;
      case 'en': return `${min} min read`;
      default: return `${min} Min. Lesezeit`;
    }
  }
}
