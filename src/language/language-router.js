const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('../LinkedList');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const headWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.id,
      req.language.head
    );

    const resHeadWord = {
      nextWord: headWord.original,
      totalScore: headWord.total_score,
      wordCorrectCount: headWord.correct_count,
      wordIncorrectCount: headWord.incorrect_count,
    };

    res.json(resHeadWord);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  const { guess } = req.body;
  if (!guess) {
    return res.status(400).json({ error: `Missing 'guess' in request body` });
  }
  try {
    const words = await LanguageService.generateWordsList(
      req.app.get('db'),
      req.language.id
    );

    let headWord = words.head.value;
    let nextWord = words.head.next.value;

    let isCorrect = false;
    let totalScore = req.language.total_score;
    if (guess === headWord.translation) {
      //correct
      isCorrect = true;
      totalScore++;
    }
    const wordList = processAnswer(words, isCorrect);
    //TODO database update
    await LanguageService.updateWordList(
      req.app.get('db'),
      totalScore,
      wordList
    );
    res.json({
      nextWord: nextWord.original,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      totalScore: totalScore,
      answer: headWord.translation,
      isCorrect: isCorrect,
    });

    //res.json({ words: words });
  } catch (error) {
    next(error);
  }

  //
  {
  }
  //
});

function processAnswer(wordList, isCorrect) {
  //M value
  const headWord = wordList.head.value;
  let mVal = headWord.memory_value;

  wordList.remove(headWord);

  if (!isCorrect) {
    mVal = 1;
  } else {
    mVal *= 2;
  }

  headWord.memory_value = mVal;

  wordList.insertAt(headWord, mVal);

  return wordList;
}
module.exports = languageRouter;
