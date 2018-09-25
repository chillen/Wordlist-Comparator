var trials = []
var wordlists = []
var currentTrial = null

document.addEventListener('DOMContentLoaded', function () {
    setupListeners()
    populateWordlists().then(wordlists => {
        let [a, b, seed] = selectWordLists()
        currentTrial = new Trial(a, b)
        displaySeed(seed)
        displayLists(a, b)
    }).catch(err => console.log(err))
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
    document.querySelector("#wordlist-a").innerHTML = a.diffHTML(b)
    document.querySelector("#wordlist-b").innerHTML = b.diffHTML(a)
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
    
    let seed = a.seed

    if (a.diff(b).length == 0)
        [a, b, seed] = selectWordLists()

    return [a, b, seed]
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

function buildWordlists(data, algorithm) {
    // Data is coming in with params and a 2D array of words
    // Wordlists are stored columnwise
    for (let batch of data) {
        let params = batch["params"]
        let lists = batch["words"][0].map( (col, index) => batch["words"].map(row => row[index]))
        
        for (let list of lists) {
            let seed = list.shift()
            wordlists.push(new Wordlist(algorithm, params, seed, list))
        }
    }
    return wordlists
}
var d = {}
function populateWordlists() {
    let sheets = [
        new Sheet("11sz6r_DTmFgsvBre17OvQ1Onm_Mth10N4VaoeF-3GKU", "97436287"),
        new Sheet("11sz6r_DTmFgsvBre17OvQ1Onm_Mth10N4VaoeF-3GKU", "1513377307"),
        new Sheet("11sz6r_DTmFgsvBre17OvQ1Onm_Mth10N4VaoeF-3GKU", "1297878941")]
        
    return Promise.all([
        sheets[0].setupData().then(data => buildWordlists(data, "Vectorized Collocations")),
        sheets[1].setupData().then(data => buildWordlists(data, "TF-IDF Weighting")),
        sheets[2].setupData().then(data => buildWordlists(data, "LLR"))
    ])
}


function export_csv() {
    // TODO - based on previous tester
    let rows = []
    rows.push('data:text/csv;charset=utf-8,Won,Algorithm,min,max,thresh,emo,components,trim,Diff Words...')
    for (let trial of trials) {
        rows.push(`${trial.winner == 'a'},${trial.a.algorithm},${trial.a.params},${trial.a.diff(trial.b)}`)
        rows.push(`${trial.winner == 'b'},${trial.b.algorithm},${trial.b.params},${trial.b.diff(trial.a)}`)
    }
    let csv = rows.join("\n")
    var encodedUri = encodeURI(csv);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "list_comparison_data.csv");
    document.body.appendChild(link);
    link.click()
  }

var hammertime = new Hammer(document.querySelector('html'))
hammertime.on('swipeleft', function (ev) {
    choose("a")
})

hammertime.on('swiperight', function (ev) {
    choose("b")
})
