import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date): string {
    const date = new Date(value);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) return `hace ${Math.floor(diff)} segundos`;
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)} días`;
    if (diff < 2629800) return `hace ${Math.floor(diff / 604800)} semamnas`;
    if (diff < 31557600) return `hace ${Math.floor(diff / 2629800)} meses`;
    return `hace ${Math.floor(diff / 31557600)} año(s)`;
  }
}
