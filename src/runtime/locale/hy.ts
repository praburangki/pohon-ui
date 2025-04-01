import type { Messages } from '../types';
import { defineLocale } from '../composables/define-locale';

export default defineLocale<Messages>({
  name: 'Հայերեն',
  code: 'hy',
  messages: {
    inputMenu: {
      noMatch: 'Համընկնումներ չեն գտնվել',
      noData: 'Տվյալներ չկան',
      create: 'Ստեղծել "{label}"',
    },
    calendar: {
      prevYear: 'Նախորդ տարի',
      nextYear: 'Հաջորդ տարի',
      prevMonth: 'Նախորդ ամիս',
      nextMonth: 'Հաջորդ ամիս',
    },
    inputNumber: {
      increment: 'Ավելացնել',
      decrement: 'Պակասեցնել',
    },
    commandPalette: {
      placeholder: 'Մուտքագրեք հրաման կամ որոնեք...',
      noMatch: 'Համընկնումներ չեն գտնվել',
      noData: 'Տվյալներ չկան',
      close: 'Փակել',
    },
    selectMenu: {
      noMatch: 'Համընկնումներ չեն գտնվել',
      noData: 'Տվյալներ չկան',
      create: 'Ստեղծել "{label}"',
      search: 'Որոնում...',
    },
    toast: {
      close: 'Փակել',
    },
    carousel: {
      prev: 'Հետ',
      next: 'Առաջ',
      goto: 'Անցնել {slide}-ին',
    },
    modal: {
      close: 'Փակել',
    },
    slideover: {
      close: 'Փակել',
    },
    alert: {
      close: 'Փակել',
    },
    table: {
      noData: 'Տվյալներ չկան',
    },
  },
});
