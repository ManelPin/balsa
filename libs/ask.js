'use strict';

const readline = require('readline');

const ask = (questions, callback) => {
    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    askQuestions(questions, [], reader, callback);
};

const askQuestions = (questions, answers, reader, callback) => {
    const question = questions[0];
    const remainingQuestions = questions.slice(1);

    if (question.question) {
        reader.question(question.question.trim() + ' ', answer => {
            answer = transformAnswer(answer, question.transform, answers);

            if (checkAnswerValid(answer, question.allowBlank)) {
                answers.push({ name: question.name, answer: answer });
                askNextQuestion(remainingQuestions, answers, reader, callback);
            } else {
                askQuestions(questions, answers, reader, callback);
            }
        });
    } else if (question.useAnswer) {
        answers.push(deriveAnswer(question, answers));
        askNextQuestion(remainingQuestions, answers, reader, callback);
    }
};

const checkAnswerValid = (answer, allowBlank) => {
    let valid = true;

    switch (getValueType(answer)) {
        case 'string':
            valid = !!answer || !!allowBlank;
            break;
        case 'null':
        case 'undefined':
            valid = false;
            break;
    }

    return valid;
};

const getValueType = value => {
    return Object.prototype.toString.call(value)
            .replace(/\[object |\]/g, '')
            .toLowerCase();
};

const deriveAnswer = (question, answers) => {
    const answerToUse = answers.filter(answer => answer.name === question.useAnswer);
    let answer = { name: question.name, answer: '' };

    if (answerToUse.length > 0) {
        answer.answer = transformAnswer(answerToUse[0].answer, question.transform, answers);
    }

    return answer;
};

const transformAnswer = (value, transform, allAnswers) => {
    if (typeof transform === 'function') {
        value = transform(value, allAnswers);
    }

    return value;
};

const askNextQuestion = (remainingQuestions, answers, reader, callback) => {
    if (remainingQuestions.length > 0) {
        askQuestions(remainingQuestions, answers, reader, callback);
    } else {
        reader.close();
        callback(answers);
    }
};

module.exports = ask;