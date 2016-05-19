'use strict';

// === require('balsa')
const balsa = require('../index');

const convertSpaces = value => value.replace(/\s/g, '');
const convertYesNo = value => {
    const isString = typeof value === 'string';
    const yesNoLookup = {
        n: false,
        y: true
    };

    if (isString && value.length > 0) {
        value = value[0].toLowerCase();
        value = yesNoLookup[value] !== undefined ?  yesNoLookup[value] : '';

        if (value) {
            value = '\nHey Baby!';
        } else {
            value = '';
        }
    } else {
        value = null;
    }

    return value;
};
const files = [
    { destination: __dirname + '/outputs/questions/animal-story.txt', template: 'My favorite food is {{ food }} (id: {{ foodId }}){{ yesNo }}' },
    { destination: __dirname + '/outputs/questions/sub/blank-file' }
];
const questions = [
    { name: 'food', question: 'What is your favorite food?' },
    { allowBlank: true, name: 'unused', question: 'What is your age?' },
    { allowBlank: true, name: 'yesNo', question: 'Answer yes/no?', transform: convertYesNo },
    { name: 'foodId', transform: convertSpaces, useAnswer: 'food' }
];

balsa.ask(questions, files);