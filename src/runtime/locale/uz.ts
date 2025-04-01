import type { Messages } from '../types';
import { defineLocale } from '../composables/define-locale';

export default defineLocale<Messages>({
  name: 'Oʻzbek',
  code: 'uz',
  messages: {
    inputMenu: {
      noMatch: 'Mos keluvchi natija topilmadi',
      noData: 'Maʼlumot yoʻq',
      create: '"{label}" yaratish',
    },
    calendar: {
      prevYear: 'Oldingi yil',
      nextYear: 'Keyingi yil',
      prevMonth: 'Oldingi oy',
      nextMonth: 'Keyingi oy',
    },
    inputNumber: {
      increment: 'Qoʻshish',
      decrement: 'Ayirish',
    },
    commandPalette: {
      placeholder: 'Buyruq kiriting yoki qidiring...',
      noMatch: 'Mos keluvchi natija topilmadi',
      noData: 'Maʼlumot yoʻq',
      close: 'Yopish',
    },
    selectMenu: {
      noMatch: 'Mos keluvchi natija topilmadi',
      noData: 'Maʼlumot yoʻq',
      create: '"{label}" yaratish',
      search: 'Qidirish...',
    },
    toast: {
      close: 'Yopish',
    },
    carousel: {
      prev: 'Ortga',
      next: 'Oldinga',
      goto: '{slide}-slaydga o‘tish',
    },
    modal: {
      close: 'Yopish',
    },
    slideover: {
      close: 'Yopish',
    },
    alert: {
      close: 'Yopish',
    },
    table: {
      noData: 'Maʼlumot yoʻq',
    },
  },
});
