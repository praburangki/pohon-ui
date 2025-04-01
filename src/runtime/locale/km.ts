import type { Messages } from '../types';
import { defineLocale } from '../composables/define-locale';

export default defineLocale<Messages>({
  name: 'ភាសាខ្មែរ',
  code: 'km',
  messages: {
    inputMenu: {
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      noData: 'មិនមានទិន្នន័យ',
      create: 'បង្កើត "{label}"',
    },
    calendar: {
      prevYear: 'ឆ្នាំមុន',
      nextYear: 'ឆ្នាំបន្ទាប់',
      prevMonth: 'ខែមុន',
      nextMonth: 'ខែបន្ទាប់',
    },
    inputNumber: {
      increment: 'បង្កើន',
      decrement: 'បន្ថយ',
    },
    commandPalette: {
      placeholder: 'វាយពាក្យបញ្ជា ឬស្វែងរក...',
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      noData: 'មិនមានទិន្នន័យ',
      close: 'បិទ',
    },
    selectMenu: {
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      noData: 'មិនមានទិន្នន័យ',
      create: 'បង្កើត "{label}"',
      search: 'ស្វែងរក...',
    },
    toast: {
      close: 'បិទ',
    },
    carousel: {
      prev: 'មុន',
      next: 'បន្ទាប់',
      goto: 'លោតទៅកាន់ស្លាយ {slide}',
    },
    modal: {
      close: 'បិទ',
    },
    slideover: {
      close: 'បិទ',
    },
    alert: {
      close: 'បិទ',
    },
    table: {
      noData: 'មិនមានទិន្នន័យ',
    },
  },
});
