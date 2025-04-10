import type { Messages } from '../types';
import { defineLocale } from '../composables/define-locale';

export default defineLocale<Messages>({
  name: 'Deutsch',
  code: 'de',
  messages: {
    inputMenu: {
      noMatch: 'Nichts gefunden',
      noData: 'Keine Daten',
      create: '"{label}" erstellen',
    },
    calendar: {
      prevYear: 'Vorheriges Jahr',
      nextYear: 'Nächstes Jahr',
      prevMonth: 'Vorheriger Monat',
      nextMonth: 'Nächster Monat',
    },
    inputNumber: {
      increment: 'Erhöhen',
      decrement: 'Verringern',
    },
    commandPalette: {
      placeholder: 'Geben Sie einen Befehl ein oder suchen Sie...',
      noMatch: 'Nichts gefunden',
      noData: 'Keine Daten',
      close: 'Schließen',
    },
    selectMenu: {
      noMatch: 'Nichts gefunden',
      noData: 'Keine Daten',
      create: '"{label}" erstellen',
      search: 'Suchen...',
    },
    toast: {
      close: 'Schließen',
    },
    carousel: {
      prev: 'Zurück',
      next: 'Weiter',
      goto: 'Gehe zu {slide}',
    },
    modal: {
      close: 'Schließen',
    },
    slideover: {
      close: 'Schließen',
    },
    alert: {
      close: 'Schließen',
    },
    table: {
      noData: 'Keine Daten',
    },
  },
});
