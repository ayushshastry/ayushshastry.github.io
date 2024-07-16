console.log("loading data");

d3.csv("newArrests.csv").then(function(data) {
    timeGraph(data);
    ageHist(data);
    raceHist(data);
    genderHist(data);
}).catch(function(error) {
    console.log(error);
});

console.log("data loaded");
console.log(data);













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