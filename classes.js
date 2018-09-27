class Sheet {
    constructor(sheet, gid) {
        this.sheet = sheet
        this.gid = gid
        this.data = {}
    }

    parseResponse(res) {
        // This is a very magic, specifically implemented parser
        // for the format my data sheets are in. Will need adjustment
        // with new formats

        // Use a lovely lighteweight CSV library from gkindel
        this.data = CSV.parse(res)
        // Currently, the first column is copy paste garbage. 
        this.data = this.data.map(val => val.slice(1))
        // Each batch is a header of params, a header of words, and a row for each word
        // This means a batch of words is 12 rows total
        let batches = []
        let i = 0
        while (i < this.data.length) {
            let params = this.data[i]
            params = params.slice(1, 7)
            params = params.map(val => val.split(": ")[1])
            params = params.join(":")
            let m = i
            let cell = ""
            let words = []

            while (!cell.includes("n:")) {
                m += 1
                if (m == this.data.length)
                    break
                
                cell = this.data[m][0]
            }
            words = this.data.slice(i+1, m)
            i = m

            batches.push({"params": params, "words": words})
        }
        return batches
    }

    setupData() {
        return this.getData().then(response => response.text())
                      .then(response => this.parseResponse(response))
                      .catch(err => console.error(err))
    }

    getData() {
        let url = `https://docs.google.com/spreadsheets/d/${this.sheet}/gviz/tq?gid=${this.gid}&tqx=out:csv`
        let request = new Request(url)
        return fetch(request);
    }
}

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
    HTML(list) {
        let out = ''
        for (let word of list) {
            out += `<li>${word}</li>`
        }
        return out 
    }
    toHTML() {
        return this.HTML(this.nearest)
    }
    diffHTML(other) {
        return this.HTML(this.diff(other))
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