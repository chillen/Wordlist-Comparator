// I really wish import was universal alread
// class Sheet {
//     // Quick sheet class to pull google spreadsheets
//     constructor(id, name) {
//         this.id = id
//         this.name = name
//     }

//     fetch() {
        
//     }
// }

class Wordlist {
    constructor(algorithm, params, seed, nearest) {
        this.algorithm = algorithm
        this.params = params
        this.seed = seed
        this.nearest = nearest
    }
    diff(other) {
        let compare = other.nearest
        return this.nearest.filter(function(i) {return compare.indexOf(i) < 0;});
    }
    toHTML() {
        let out = ''
        for (let word of this.nearest) {
            out += `<li>${word}</li>`
        }
        return out
    }
}

class Trial {
    constructor(a, b, winner = "") {
        this.a = a
        this.b = b
        this.winner = winner
    }
    win(winning) {
        this.winner = winning
    }
    toString() {
        return `${this.a.algorithm},${this.b},${this.a.seed},${this.winner}`
    }
}