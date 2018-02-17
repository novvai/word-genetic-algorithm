class WordData {
    private static probability: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789";
    private letters: String = "";
    private fitness: number = 0;

    constructor(childLeters?: String) {
        this.generateGenes(childLeters);
        this.calculateFitness();
    }

    setLettersData(letters: String) {
        this.letters = letters;
    }

    private generateGenes(childLeters?: String): void {
        if (childLeters !== undefined && childLeters !== "") {
            this.mutate(childLeters);
        } else {
            for (let i = 0; i < Environment.word.length; i++) {
                this.letters += WordData.probability[Math.floor(Math.random() * WordData.probability.length)];
            }
        }
    }
    private mutate(childLeters: String) {
        let lettersForMutation = Math.ceil(childLeters.length * Environment.mutationRate);
        let mutatedLetters:number = 0;
        for (let i = 0; i < lettersForMutation; i++) {
            mutatedLetters = Math.floor(Math.random() * childLeters.length);
            let buffer = childLeters.split('');
            buffer[mutatedLetters] = WordData.probability[Math.floor(Math.random() * WordData.probability.length)];
            this.letters = buffer.join('');
        }

    }

    private calculateFitness() {
        for (let i = 0; i < Environment.word.length; i++) {
            if (this.letters[i] === Environment.word[i]) {
                this.fitness++;
            }
        }
        this.fitness /= this.letters.length;
        if(this.fitness>Environment.maxFitness ){
            Environment.maxFitness = this.fitness;
        }
        if(this.fitness === 1){
            Environment.isThere = true;
            alert(`Found it ${Environment.generations} generation - ${this.letters}`);
        }
    }
    getFitnessData(): number {
        return this.fitness;
    }

    public getGenes(): String {
        return this.letters;
    }

}

class Environment {
    static generations:number = 0; 
    static word: String = "To be or not to be this is the question";
    static mutationRate: number = .10;
    static isThere:Boolean = false;
    static maxFitness: number = 0.01;

    private population: Array<WordData> = [];
    private populationVar: number = 200;
    private matingPool: Array<String> = [];

    constructor() {
            this.generations();
    }

    private generations(): void {
        let childGenes: String = "";
        
        do {
            Environment.generations++;
            console.log(Environment.maxFitness);
            
            this.matingPool = [];
            this.population = [];
            for (let index = 0; index < this.populationVar; index++) {
                this.population[index] = new WordData(childGenes);
            }
            this.buildMatingPool();
            
            childGenes = this.mate();
        } while (!Environment.isThere);
    }

    private buildMatingPool() {
        this.population.forEach(element => {
            if (element.getFitnessData() >= Environment.maxFitness) {
                this.matingPool.push(element.getGenes());
            }
        });
        console.log(this.matingPool);
    }
    private mate(): String {
        let child: String = "";
        if (this.matingPool.length > 1) {
            let midPoint = Math.floor(this.matingPool.length / 2);
            let parentOne = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
            let parentTwo = this.matingPool[Math.floor(Math.random() * this.matingPool.length)];

            for (let i = 0; i < Environment.word.length; i++) {
                if (i < midPoint) {
                    child += parentOne[i];
                } else {
                    child += parentTwo[i];
                }
            }
        } else if (this.matingPool.length === 1) {
            child = this.matingPool[0];
        }

        return child;
    }

}

new Environment();