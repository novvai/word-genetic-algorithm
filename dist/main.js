"use strict";
var WordData = /** @class */ (function () {
    function WordData(childLetters) {
        this.letters = "";
        this.fitness = 0;
        this.generateGenes(childLetters);
        this.calculateFitness();
    }
    WordData.prototype.setLettersData = function (letters) {
        this.letters = letters;
    };
    WordData.prototype.generateGenes = function (childLetters) {
        if (childLetters !== undefined && childLetters !== "") {
            this.mutate(childLetters);
        }
        else {
            for (var i = 0; i < Environment.word.length; i++) {
                this.letters += WordData.probability[Math.floor(Math.random() * WordData.probability.length)];
            }
        }
    };
    WordData.prototype.mutate = function (childLetters) {
        var lettersForMutation = Math.ceil(childLetters.length * Environment.mutationRate);
        var mutatedLetters = 0;
        for (var i = 0; i < lettersForMutation; i++) {
            mutatedLetters = Math.floor(Math.random() * childLetters.length);
            var buffer = childLetters.split('');
            buffer[mutatedLetters] = WordData.probability[Math.floor(Math.random() * WordData.probability.length)];
            this.letters = buffer.join('');
        }
    };
    WordData.prototype.calculateFitness = function () {
        for (var i = 0; i < Environment.word.length; i++) {
            if (this.letters[i] === Environment.word[i]) {
                this.fitness++;
            }
        }
        this.fitness /= this.letters.length;
        if (this.fitness > Environment.maxFitness) {
            Environment.maxFitness = this.fitness;
        }
        if (this.fitness === 1) {
            Environment.isThere = true;
            alert("Found it " + Environment.generations + " generation - " + this.letters);
        }
    };
    WordData.prototype.getFitnessData = function () {
        return this.fitness;
    };
    WordData.prototype.getGenes = function () {
        return this.letters;
    };
    WordData.probability = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789";
    return WordData;
}());
var Environment = /** @class */ (function () {
    function Environment() {
        this.population = [];
        this.populationVar = 200;
        this.matingPool = [];
        this.generations();
    }
    Environment.prototype.generations = function () {
        var childGenes = "";
        do {
            Environment.generations++;
            console.log(Environment.maxFitness);
            this.matingPool = [];
            this.population = [];
            for (var index = 0; index < this.populationVar; index++) {
                this.population[index] = new WordData(childGenes);
            }
            this.buildMatingPool();
            childGenes = this.mate();
        } while (!Environment.isThere);
    };
    Environment.prototype.buildMatingPool = function () {
        var _this = this;
        this.population.forEach(function (element) {
            if (element.getFitnessData() >= Environment.maxFitness) {
                _this.matingPool.push(element.getGenes());
            }
        });
        console.log(this.matingPool);
    };
    Environment.prototype.mate = function () {
        var child = "";
        if (this.matingPool.length > 1) {
            var midPoint = Math.floor(this.matingPool.length / 2);
            var parentOne = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
            var parentTwo = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
            for (var i = 0; i < Environment.word.length; i++) {
                if (i < midPoint) {
                    child += parentOne[i];
                }
                else {
                    child += parentTwo[i];
                }
            }
        }
        else if (this.matingPool.length === 1) {
            child = this.matingPool[0];
        }
        return child;
    };
    Environment.generations = 0;
    Environment.word = "To be or not to be this is the question";
    Environment.mutationRate = .10;
    Environment.isThere = false;
    Environment.maxFitness = 0.01;
    return Environment;
}());
new Environment();
