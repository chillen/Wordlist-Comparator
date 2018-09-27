var trials = []
var wordlists = []
var currentTrial = null
var session = Math.random().toString(36).substring(7) // Random enough session key

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
        new Sheet("146dM4fORoxKjB5R8CLTfSaNGw37UehCd0ILB_04tJ6U", "920849493"),
        new Sheet("1JqMiPB0PGTGq0i_xxraZtzd2WuJPDlPRQZF7KNrbMFA", "1447064900"),
        new Sheet("14tHZ9VCGSUtT-mIMUUoVS_WclZRbYnQdNfDofbMKVeo", "6964893")]
        
    return Promise.all([
        sheets[0].setupData().then(data => buildWordlists(data, "Vectorized Collocations")),
        sheets[1].setupData().then(data => buildWordlists(data, "TF-IDF Weighting")),
        sheets[2].setupData().then(data => buildWordlists(data, "LLR"))
    ])
}

function data_to_csv_string(meta=true, header=true) {
    let rows = []
    let meta_text = meta?"data:text/csv;charset=utf-8":""
    if (header)
        rows.push(`${meta_text}Won,Algorithm,min:max:thresh:emo:components:trim,Diffs`)
    for (let trial of trials) {
        rows.push(`${trial.winner == 'a'},${trial.a.algorithm},${trial.a.params},${trial.a.diff(trial.b)}`)
        rows.push(`${trial.winner == 'b'},${trial.b.algorithm},${trial.b.params},${trial.b.diff(trial.a)}`)
    }
    let csv = rows.join("\n")
    return csv
}

function submit_data() {
    let scriptURL = "https://script.google.com/macros/s/AKfycbxgBa0l3eUOTrE4-k6t3sRoA_wmjjOZcczDMuxd38KPOohJues/exec"
    let data = new FormData()

    data.append("session", session)
    data.append("data", data_to_csv_string(meta=false, header=false))
    fetch(scriptURL, { method: 'POST', mode: 'cors', body: data})
      .then(response => {
          swal("Sent Data", "Successfully sent out and cleared your data. Thanks for your help!", "success")
          trials = []
        })
      .catch(error => {
        swal("Uh oh!", "Something went wrong sending the data. You can try again or download the data as a CSV.", "error")
        console.log(error)
    })
}

function export_csv() {
    // TODO - based on previous tester
    let csv = data_to_csv_string()
    var encodedUri = encodeURI(csv);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "list_comparison_data.csv");
    document.body.appendChild(link);
    link.click()
    trials = []
  }

var hammertime = new Hammer(document.querySelector('html'), {
    inputClass: Hammer.TouchInput
})
hammertime.on('swipeleft', function (ev) {
    choose("a")
})

hammertime.on('swiperight', function (ev) {
    choose("b")
})
