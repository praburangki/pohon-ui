import type { Messages } from '../types';
import { defineLocale } from '../composables/define-locale';

export default defineLocale<Messages>({
  name: 'Slovenčina',
  code: 'sk',
  messages: {
    inputMenu: {
      noMatch: 'Žiadna zhoda',
      noData: 'Žiadne dáta',
      create: 'Vytvoriť "{label}"',
    },
    calendar: {
      prevYear: 'Predchádzajúci rok',
      nextYear: 'Nasledujúci rok',
      prevMonth: 'Predchádzajúci mesiac',
      nextMonth: 'Nasledujúci mesiac',
    },
    inputNumber: {
      increment: 'Zvýšiť',
      decrement: 'Znížiť',
    },
    commandPalette: {
      placeholder: 'Zadajte príkaz alebo vyhľadajte...',
      noMatch: 'Žiadna zhoda',
      noData: 'Žiadne dáta',
      close: 'Zatvoriť',
    },
    selectMenu: {
      noMatch: 'Žiadna zhoda',
      noData: 'Žiadne dáta',
      create: 'Vytvoriť "{label}"',
      search: 'Hľadať...',
    },
    toast: {
      close: 'Zatvoriť',
    },
    carousel: {
      prev: 'Predchádzajúci',
      next: 'Nasledujúci',
      goto: 'Prejsť na {slide}',
    },
    modal: {
      close: 'Zatvoriť',
    },
    slideover: {
      close: 'Zatvoriť',
    },
    alert: {
      close: 'Zatvoriť',
    },
    table: {
      noData: 'Žiadne dáta',
    },
  },
});
