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
        'language.total_score'
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
        'incorrect_count'
      )
      .where({ language_id });
  },

  getWord(db, language_id, word_id) {
    return db
      .from('word')
      .select('original', 'translation', 'next')
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
        'word.incorrect_count'
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
        'w.incorrect_count'
      )
      .join('language as l', 'w.language_id', 'l.id')
      .where('w.language_id', language_id);
  },

  generateWordsList(db, language_id) {
    const wordList = new LinkedList();
    return LanguageService.getAllWordsWithHead(db, language_id).then(
      (wordArray) => {
        const headWord = wordArray.find((word) => word.head === word.id);
        wordList.insertFirst(headWord);

        this.addNextWordToList(wordArray, headWord, wordList);

        /* CONTINUE PROCESSING ARRAY */
        // recursively look at the word where currentWord.next === word.id
        // this gives us our sorted array.
        // wordArray.forEach(word => wordList.insertLast(word));
        return wordList;
      }
    );
  },

  addNextWordToList(wordArray, currentWord, wordList) {
    if (currentWord.next === null) {
      return wordList;
    }
    const nextWord = wordArray.find((word) => currentWord.next === word.id);
    wordList.insertLast(nextWord);
    return this.addNextWordToList(wordArray, nextWord, wordList);
  },

  updateWord(db, fieldsToUdate, id) {
    return db('word')
      .update(fieldsToUdate)
      .where({ id });
  },

  async updateWordList(db, totalScore, wordList, languageId) {
    await db('language')
      .update({
        total_score: totalScore,
        head: wordList.head.value.id,
      })
      .where('id', languageId);

    let currentNode = wordList.head;

    while (currentNode) {
      let { correct_count, incorrect_count, memory_value, id } = currentNode.value;
      let next = null;
      if (currentNode.next) {
        next = currentNode.next.value.id;
      }

      let wordFieldsToUpdate = {
        correct_count,
        incorrect_count,
        memory_value,
        next,
      };

      await this.updateWord(db, wordFieldsToUpdate, id);
      currentNode = currentNode.next;
    }
    //word updates:
    //correct_count
    //incorrect_count
    //memory_value
    //next

    //.where('id', wordId)
  },
};

module.exports = LanguageService;
