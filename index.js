'use strict';

const fs = require('fs');
const path = require('path');
const ask = require('./libs/ask');

const rootDir = process.cwd();

const askQuestions = (questions, files) => {
    ask(questions, answers => {
        processAnswers(answers, files);
    });
};

const processAnswers = (answers, files, overwrite) => {
    files.forEach(file => {
        const createFile = checkCreateFile(file, answers);
        let destination;

        if (createFile) {
            destination = performReplacements(file.destination, answers);

            ensureDirs(destination);

            if (!fs.existsSync(destination) || overwrite) {
                const output = performReplacements(file.template, answers, true);
                fs.writeFile(destination, output, { encoding: 'utf8' });
            }
        }
    });
};

const checkCreateFile = (file, answers) => {
    let createFile = true;

    if (typeof file.check === 'function') {
        createFile = file.check(answers);
    }

    return createFile;
};


const ensureDirs = filePath => {
    const paths = filePath.replace(rootDir, '').split(path.sep).slice(1, -1);

    paths.reduce((previousPath, directory) => {
        const currentPath = path.resolve(previousPath, directory);

        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }

        return currentPath;
    }, rootDir);
};

const performReplacements = (template, answers, checkIsFile) => {
    let output = '';

    if (template && typeof template === 'string') {
        template = getTemplate(template, checkIsFile);
        output = answers.reduce(replaceAnswer, template);
    }

    return output;
};

const getTemplate = (template, checkIsFile) => {
    if (checkIsFile && fs.existsSync(template)) {
        template = fs.readFileSync(template, 'utf8');
    }

    return template;
};

const replaceAnswer = (template, answer) => {
    const regex = new RegExp(`\\{\\{\\s*${answer.name}\\s*\\}\\}`, 'g');
    const newTemplate = template.replace(regex, answer.answer);

    return newTemplate;
};

module.exports = {
    ask: askQuestions,
    process: processAnswers
};