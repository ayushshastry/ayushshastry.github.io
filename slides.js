console.log("loading data");


d3.csv("arrestsUse.csv").then(function(data) {
    console.log(data);
    console.log("col names:", Object.keys(data[0]));
    schoolHist(data);
    raceDist(data);
    genderHist(data);
    ageHist(data);
}).catch(function(error) {
    console.log(error);
});

console.log("data loaded");

function schoolHist(data) {
    // create margins and dimensions
    var margin = {right: 50, left: 80, top: 30, bottom: 40};
    var width = 700 - margin.right - margin.left;
    var height = 400 - margin.top - margin.bottom;

    // create svg container

    const svg = d3.select("#schoolHistogram")
                    .append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", 700)
                    .attr("height", 400);
      

    // get counts of each categorical variable

    const arrestBySchoolZone = d3.rollup(data, function(v) { return v.length; }, function(d) { return d.School; });
    console.log(arrestBySchoolZone.values());

    for (let key of arrestBySchoolZone.keys()) {
        console.log(key);
    }

    for (let value of arrestBySchoolZone.values()) {
        console.log(value);
    }

    const schoolArray = Array.from(arrestBySchoolZone, ([key, value]) => ({key, value}));
    console.log(schoolArray);

    // create scales
    const x = d3.scaleBand()
        .domain(["0", "1"])
        .range([margin.left, width - margin.right])
        .padding(0.15);

    const y = d3.scaleLinear()
        .domain([0, 24000])
        .range([height - margin.bottom, margin.top]);
    
    const coloring = d3.scaleOrdinal().domain(["0", "1"]).range(d3.schemeCategory10);


    // create axes
    svg.append("g")
        .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate("+margin.left+", "+0+")")
        .call(d3.axisLeft(y));
    var tooltip = d3.select("#tooltip");

    svg.selectAll()
        .data(schoolArray)
        .join("rect")
        .attr("fill", function(schoolArray) { return coloring(schoolArray.key); })
        .attr("x", function(schoolArray) { return x(schoolArray.key); })
        .attr("y", function(schoolArray) { return y(schoolArray.value); })
        .attr("height", function(schoolArray) { return y(0) - y(schoolArray.value);})
        .attr("width", x.bandwidth());
}

function genderHist(data) {
    // create margins and dimensions
    var margin = {right: 50, left: 80, top: 30, bottom: 40};
    var width = 700 - margin.right - margin.left;
    var height = 400 - margin.top - margin.bottom;

    // create svg container

    const svg = d3.select("#genderHistogram")
                    .append("svg")
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", 700)
                    .attr("height", 400);
      

    // get counts of each categorical variable

    const genders = d3.rollup(data, function(v) { return v.length; }, function(d) { return d.gender; });
    console.log(genders.values());

    for (let key of genders.keys()) {
        console.log(key);
    }

    for (let value of genders.values()) {
        console.log(value);
    }

    const gendersArray = Array.from(genders, ([key, value]) => ({key, value}));
    console.log(gendersArray);

    // create scales
    const x = d3.scaleBand()
        .domain(["Male", "Female"])
        .range([margin.left, width - margin.right])
        .padding(0.15);

    const y = d3.scaleLinear()
        .domain([0, 21000])
        .range([height - margin.bottom, margin.top]);

    const coloring = d3.scaleOrdinal().domain(["Male", "Female"]).range(d3.schemeCategory10);

    // create axes
    svg.append("g")
        .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate("+margin.left+", "+0+")")
        .call(d3.axisLeft(y));
    
    svg.selectAll()
        .data(gendersArray)
        .join("rect")
        .attr("fill", function(gendersArray) { return coloring(gendersArray.key); })
        .attr("x", function(gendersArray) { return x(gendersArray.key); })
        .attr("y", function(gendersArray) { return y(gendersArray.value); })
        .attr("height", function(gendersArray) { return y(0) - y(gendersArray.value);})
        .attr("width", x.bandwidth());
}

function raceDist(data) {

    const svg = d3.select("#raceHistogram")
                .append("svg")
                .attr("width", 1000)
                .attr("height", 600)
    
    var margin = {right: 50, left: 80, top: 30, bottom: 150};
    var width = 1000 - margin.right - margin.left;
    var height = 600 - margin.top - margin.bottom;
    
    const race = d3.rollup(data, function(v) { return v.length; }, function(d) { return d.race; });
    console.log(race);

    for (let key of race.keys()) {
        console.log(key);
    }

    for (let value of race.values()) {
        console.log(value);
    }

    const raceArray = Array.from(race, ([key, value]) => ({key, value}));
    console.log(raceArray);

    const x = d3.scaleBand()
            .domain(raceArray.map(function(d) { return d.key; }))
            .range([margin.left, width])
            .padding(0.15)

    const y = d3.scaleLinear()
    .domain([0, d3.max(raceArray, function(d) { return d.value + 2000; })]) // Corrected domain definition
    .range([height - margin.bottom, margin.top]);

    const coloring = d3.scaleOrdinal().domain(raceArray.map(function(d) { return d.key; })).range(d3.schemeCategory10);

    svg.append("g")
        .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
        .call(d3.axisBottom(x))
    
    svg.append("g")
        .attr("transform", "translate("+margin.left+", "+0+")")
        .call(d3.axisLeft(y))



    svg.selectAll()
        .data(raceArray)
        .join("rect")
        .attr("fill", function(d) { return coloring(d.key); })
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return y(0) - y(d.value);})
        .attr("width", x.bandwidth());

}

function ageHist(data) {
    const svg = d3.select("#ageHistogram")
                .append("svg")
                .attr("width", 700)
                .attr("height", 400)
    
    var margin = {right: 50, left: 80, top: 30, bottom: 40};
    var width = 700 - margin.right - margin.left;
    var height = 400 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d.age; })])
                .range([margin.left, width - margin.right]);

    
    const histogram = d3.histogram()
                        .value(function(d) { return d.age; })
                        .domain(x.domain())
                        .thresholds(x.ticks(10));

    const bins = histogram(data)

    console.log(bins);

    const y = d3.scaleLinear()
                .domain([0, d3.max(bins, function(d) { return d.length + 1000; })])
                .range([height - margin.bottom, margin.top]);


    svg.append("g")
        .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate("+margin.left+", "+0+")")
        .call(d3.axisLeft(y));
    
    svg.selectAll()
        .data(bins)
        .join("rect")
        .attr("fill", "steelblue")
        .attr("height", 20)
        .attr("width", 20)
        .attr("x", (height - margin.bottom))
        .attr("y", margin.left)
        .transition().delay(function(d, i) { return i * 250; })
        .attr("x", function(d) { return x(d.x0); })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("y", function(d) { return y(d.length); })
        .attr("height", function(d) { return y(0) - y(d.length); });
    
}