BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'German', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'die Frau', 'woman, wife', 2),
  (2, 1, 'der Mann', 'man, husband', 3),
  (3, 1, 'das Kind', 'child', 4),
  (4, 1, 'die Eltern', 'parents', 5),
  (5, 1, 'die Leute', 'people', 6),
  (6, 1, 'die Erde', 'earth', 7),
  (7, 1, 'das Land', 'country', 8),
  (8, 1, 'der Name', 'name', 9),
  (9, 1, 'schön', 'beautiful', 10),
  (10, 1, 'leben', 'to live', 11),
  (11, 1, 'lernen', 'to learn', 12),
  (12, 1, 'die Schule', 'school', 13),
  (13, 1, 'möglich', 'possible', 14),
  (14, 1, 'die Möglichkeit', 'possibility', 15),
  (15, 1, 'können', 'can, to be able to', 16),
  (16, 1, 'lesen', 'to read', 17),
  (17, 1, 'das Buch', 'book', 18),
  (18, 1, 'das Ding', 'thing', 19),
  (19, 1, 'stellen', 'to place', 20),
  (20, 1, 'darstellen', 'to depict', 21),
  (21, 1, 'schreiben', 'to write', 22),
  (22, 1, 'die Seite', 'side, page', 23),
  (23, 1, 'die Sprache', 'language', 24),
  (24, 1, 'viel', 'a lot', 25),
  (25, 1, 'die Bedeutung', 'meaning', null);
UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
