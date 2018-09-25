var trials = []
var wordlists = []
var currentTrial = null

document.addEventListener('DOMContentLoaded', function () {
    setupListeners()
    populateWordlists()
    let [a, b, seed] = selectWordLists()
    currentTrial = new Trial(a, b)
    displaySeed(seed)
    displayLists(a, b)
})

function choose(winner) {
    currentTrial.win(winner)
    trials.push(currentTrial)
    let [a, b, seed] = selectWordLists()
    currentTrial = new Trial(a, b)
    displaySeed(seed)
    displayLists(a, b)
}

function displayLists(a, b) {
    document.querySelector("#wordlist-a").innerHTML = a.toHTML()
    document.querySelector("#wordlist-b").innerHTML = b.toHTML()
}

function displaySeed(seed) {
    document.querySelector("#seed-word").innerHTML = seed
}

function selectWordLists() {
    // A little inneficient, but hopefully more intuitive
    // Clone the list
    let wl = wordlists.slice(0)
    
    // shuffle the list using the css-tricks sort shuffle
    wl = wl.sort(function() { return 0.5 - Math.random() });

    // Pick the first wordlists
    let a = wl.shift()
    let b = wl.shift()
    
    // Go through until we find a matching word
    while (wl.length > 0 && b.seed != a.seed) {
        b = wl.shift()
    }
     
    return [a, b, a.seed]
}

function setupListeners() {
    document.addEventListener('keyup', function (e) {
        if (e.keyCode === 37) { // Left arrow
          e.preventDefault()
          choose('a')
        }
        if (e.keyCode === 39) { // Right arrow
          e.preventDefault()
          choose('b')
        }
      })
}

function populateWordlists() {
    // Stub data for now
    let a = "Vectorized Collocations"
    let p = "n: 10,min: 0,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    let w = "flower"
    let wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Not Collocations"
    p = "n: 10,min: 0,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "flower"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Vectorized Collocations"
    p = "n: 10,min: 9,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "flower"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Vectorized Collocations"
    p = "n: 10,min: 9,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "flower"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Vectorized Collocations"
    p = "n: 10,min: 0,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "rat"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Not Collocations"
    p = "n: 10,min: 0,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "rat"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Vectorized Collocations"
    p = "n: 10,min: 9,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "rat"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))

    a = "Vectorized Collocations"
    p = "n: 10,min: 9,max: 101,thresh: 0,emo: none,components: keep,trim: -1"
    w = "rat"
    wl = "leaf,shade,sunny,sunshine,bright,bloom,weed,delicious,shady,green".split(",")
    wordlists.push(new Wordlist(a, p, w, wl))
}


function export_csv() {
    // TODO - based on previous tester
    // let rows = []
    // rows.push('data:text/csv;charset=utf-8,Word,Interesting,POS')
    // for (let word of good) {
    //   rows.push(word + ',' + '1,'+data[word])
    // }
    // for (let word of bad) {
    //   rows.push(word + ',' + '0,'+data[word])
    // }
    // let csv = rows.join("\n")
    // var encodedUri = encodeURI(csv);
    // var link = document.createElement("a");
    // link.setAttribute("href", encodedUri);
    // link.setAttribute("download", "list_comparison_data.csv");
    // document.body.appendChild(link);
    // link.click()
  }