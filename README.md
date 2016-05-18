# Balsa

A light-weight scaffolding tool. Gives you just the basics. The API is broken into two parts: questions & files.

## Data Objects

### Questions <a name="questions"></a>

The question structure has the following attributes available:

- `name` (_required_): an ID, unique to the set of questions
- `question`: the string prompt to show the user
- `transform`: a function to transform the user's input
- `useAnswer`: if a question is not provided, this can be provided to use another question's answer. **Make sure
these questions are at the end of the list of questions!**

### Files

The files object has the following attributes available:

- `destination` (_required_): the file path to create
- `template`: the string to do replacements on; if this is omitted, a blank file will be created.

## Templates

Templates can be used to give a file scaffolded contents. The syntax for replacements is simple:

```!html
<html>
    <body>
        <h1>{{ myHeader }}</h1>
    </body>
</html>
```

If a question with the name `myHeader` is asked, its answer will replace `{{ myHeader }}`. **Note that any `{{ }}` wrapped
strings that don't have a matching answer will remain in the processed template!**

See the [Usage](#usage) section below.

## Methods

Pulling in Balsa provides you with an object of methods. They are:

- `ask(questions, files)`: Ask the array of `questions` and create the files in the `files` array, performing
any necessary replacements.
- `process(answers, files)`: Process an array of `answers` and create the files in the `files` array,
performing any necessary replacements. The `ask` method uses this to process its answered questions.
The `answers` follows the same structure as the [answers](#answers) returned by the [`ask` helper](#ask).

When files are created, Balsa will create any directories it needs to create. So if you give it a destination of
`this/is/my/file/path/location.txt` it will create every directory (`this`, `is`, `my`, `file`, `path`) before
creating the file `location.txt`.

## <a name="usage"></a>Usage

### Asking Questions
```!javascript
'use strict';

const balsa = require('balsa');

const questions = [
    { name: 'animal', question: 'Enter an animal:' },
    { name: 'unused', question: 'What\'s your age?' },
    { name: 'animalId', transform: convertSpaces, useAnswer: 'animal' }
];
const files = [
    { destination: './animal-story.txt', template: 'My favorite animal is a(n) {{ animal }} (id: {{ animalId }})' },
    { destination: './sub/blank-file' }
];

const convertSpaces = value => {
    return value.replace(/\s/g, '_');
};

balsa.ask(questions, files);
```
This will prompt the user with 2 questions:

```
Enter an animal: Tiger Shark
What's your age? 24
```

And, given the above answers, produce 1 directory (if needed) and 2 files:

```
|_sub
  |_blank-file
|_animal-story.txt
```

The contents of `animal-story.txt` will be:

```
My favorite animal is a(n) Tiger Shark (id: Tiger_Shark)
```

## Extra Helpers

### Ask <a name="ask"></a>

The mechanism used to ask questions is also available to you. To do so just include `'balsa/libs/ask'` to your script
and use the returned function to ask questions.

The API for `ask` is:

`ask(questions, callback)`

The parameter `questions` is a list of [questions](#questions) and `callback` is the callback function to use. The
callback function gets an `answers` array back and each answer uses the following data structure:

<a name="answers"></a>
- `answer`: the value the user entered
- `name`: the same name as the question the was answered.

An example of usage would be:

```!javascript
'use strict';

const ask = require('balsa/libs/ask');

const questions = [
    { name: 'favoriteFood', question: 'Name your favorite food:' },
    { name: 'drink', question: 'Anything to drink?' },
    { name: 'capsDrink', transform: value => value.toUpperCase(), useAnswer: 'drink' }
];

ask(questions, answers => {
    console.info(answers[0].answer);
    console.info(answer[1].name, answers[1].answer);
    console.info(answer[2].name, answers[2].answer);
});
```

Would ask the user 2 questions:

```
Name your favorite food: Chicken tacos
Anything to drink? Mountain Dew
```

And the callback would output the following:

```
Chicken tacos
drink Mountain Dew
capsDrink MOUNTAIN DEW
```