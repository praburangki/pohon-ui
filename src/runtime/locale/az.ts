import type { Messages } from '../types';
import { defineLocale } from '../composables/define-locale';

export default defineLocale<Messages>({
  name: 'Azərbaycanca',
  code: 'az',
  messages: {
    inputMenu: {
      noMatch: 'Uyğun məlumat tapılmadı',
      noData: 'Məlumat yoxdur',
      create: '"{label}" yarat',
    },
    calendar: {
      prevYear: 'Əvvəlki il',
      nextYear: 'Növbəti il',
      prevMonth: 'Əvvəlki ay',
      nextMonth: 'Növbəti ay',
    },
    inputNumber: {
      increment: 'Artır',
      decrement: 'Azalt',
    },
    commandPalette: {
      placeholder: 'Əmr daxil edin və ya axtarın...',
      noMatch: 'Uyğun məlumat tapılmadı',
      noData: 'Məlumat yoxdur',
      close: 'Bağla',
    },
    selectMenu: {
      noMatch: 'Uyğun məlumat tapılmadı',
      noData: 'Məlumat yoxdur',
      create: '"{label}" yarat',
      search: 'Axtar...',
    },
    toast: {
      close: 'Bağla',
    },
    carousel: {
      prev: 'Əvvəlki',
      next: 'Növbəti',
      goto: 'Slayd {slide} keç',
    },
    modal: {
      close: 'Bağla',
    },
    slideover: {
      close: 'Bağla',
    },
    alert: {
      close: 'Bağla',
    },
    table: {
      noData: 'Məlumat yoxdur',
    },
  },
});
