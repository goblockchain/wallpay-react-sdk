import en from './common/en.json';
import pt from './common/pt.json';
import es from './common/es.json';

let defaultLanguage = {} as Record<string, string>;

export const setLanguage = (language: string = '') => {
  if (language.toLowerCase() === 'en') {
    defaultLanguage = en;
  } else if (language.toLowerCase() === 'es') {
    defaultLanguage = es;
  } else {
    defaultLanguage = pt;
  }
};

export const t = (key: string) => {
  return defaultLanguage[key];
};