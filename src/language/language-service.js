const LinkedList = require('../LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id });
  },

  getWord(db, language_id, word_id) {
    return db
      .from('word')
      .select(
        'original',
        'translation',
        'next',
      )
      .where({ language_id })
      .andWhere({ word_id });
  },

  getHeadWord(db, language_id, head) {
    return db
      .from('word')
      .select(
        'word.original',
        'language.total_score',
        'word.correct_count',
        'word.incorrect_count',
      )
      .join('language', 'word.language_id', 'language.id')
      .where('word.language_id', language_id)
      .andWhere('word.id', head)
      .first();
  },

  getAllWordsWithHead(db, language_id) {
    return db
      .from('word as w')
      .select(
        'l.head',
        'w.id',
        'w.language_id',
        'w.original',
        'w.translation',
        'w.next',
        'w.memory_value',
        'w.correct_count',
        'w.incorrect_count',
      )
      .join('language as l', 'w.language_id', 'l.id');
  },

  generateWordsList(db, language_id) {
    const wordList = new LinkedList();
    LanguageService.getAllWordWithHead(db, language_id)
      .then(wordArray => {
        // find head = word where word.id === word.head
        // recursively look at the word where currentWord.next === word.id
        // this gives us our sorted array.
        // wordArray.forEach(word => wordList.insertLast(word));
      });
  },
};

module.exports = LanguageService;
