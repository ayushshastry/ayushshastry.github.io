console.log("loading data");


d3.csv("arrestsUse.csv").then(function(data) {
    schoolHist(data);
    console.log(data);
    console.log("col names:", Object.keys(data[0]));
    ageHist();
    raceDist();
    genderHist();
}).catch(function(error) {
    console.log(error);
});

console.log("data loaded");

function schoolHist(data) {
    // create margins and dimensions
    var margin = {right: 50, left: 50, top: 50, bottom: 50};
    var width = 900 - margin.right - margin.left;
    var height = 600 - margin.top - margin.bottom;

    // create svg container

    const svg = d3.select("#schoolHistogram")
                    .append("svg")
                    .attr("width", 900)
                    .attr("height", 600);
      

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
        .domain([0, 26000])
        .range([height - margin.bottom, margin.top]);


    // create axes
    svg.append("g")
        .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate("+margin.left+", "+0+")")
        .call(d3.axisLeft(y));
    
    svg.selectAll()
        .data(schoolArray)
        .join("rect")
        .attr("fill", "steelblue")
        .attr("x", function(schoolArray) { return x(schoolArray.key); })
        .attr("y", function(schoolArray) { return y(schoolArray.value); })
        .attr("height", function(schoolArray) { return y(0) - y(schoolArray.value);})
        .attr("transform", "translate("+(margin.left - 45)+", "+0+")")
        .attr("width", x.bandwidth());

}

function ageHist() {
    return 0;
}

function raceDist() {
    return 0;
}

function genderHist() {
    return 0;
}












// console.log("loading data");
//         d3.csv("newArrests.csv").then(function(data) {

//             console.log("loaded data successfully");
//             console.log(data);

//             var margin = {top : 10, right: 10, bottom: 40, left: 40},
//             width = 500 - margin.left - margin.right,
//             height = 500 - margin.top - margin.bottom;

//             var svg = d3.select("#histogram")
//                     .append("svg")
//                     .attr("width", width + margin.left + margin.right)
//                     .attr("height", height + margin.top + margin.bottom)
//                     .append("g")
//                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//             var x = d3.scaleLinear().domain([0, d3.max(data, function(d) {return +d.Age;})]).range([0, width]);

//             svg.append("g")
//             .attr("transform", "translate(0," + height + ")")
//             .call(d3.axisBottom(x));

//             var histogram = d3.histogram()
//                             .value(function(d) { return +d.Age; })
//                             .domain(x.domain())
//                             .thresholds(x.ticks(70));

//             var bins = histogram(data);

//             var y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(bins, function(d) { return d.length; })]);

//             svg.append("g").call(d3.axisLeft(y));

//             svg.selectAll("rect")
//                 .data(bins)
//                 .enter()
//                 .append("rect")
//                 .attr("x", function(d) { return x(d.x0) + 1; })
//                 .attr("y", function(d) { return y(d.length); })
//                 .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
//                 .attr("height", function(d) { return height - y(d.length); })
//                 .style("fill", "blue");
//         }).catch(function(error) {
//             console.log(error);
//         });