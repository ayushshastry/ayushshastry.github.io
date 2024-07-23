document.addEventListener("DOMContentLoaded", () => {
    // create slideshow

    // select all HTML elements with slide class tag
    let slides = document.querySelectorAll(".slide");
    // start at first slide
    let slideIndex = 0;

    // button to control forward motion through slideshow

    function toggleNext() {
        // if there is another slide ahead, the user is allowed to proceed
        if (slideIndex < slides.length - 1) {
            slideIndex++;
        }
        // if user is at the last slide of the slideshow, pressing next will not do anything
        else {
            slideIndex = slides.length - 1;
        }
        // show the slide
        showSlide(slideIndex);
    }

    function togglePrev() {
        // if there are slides behind the current one, the user is able to go back to them 
        if (slideIndex > 0) {
            slideIndex--;   
        }
        // if the user is at the first slide, they cannot go back any further, current slide will stay at first one
        else {
            slideIndex = 0;
        }
        showSlide(slideIndex);
    }

    function showSlide(index) {
        // set all slides to none 
        slides.forEach(slide => slide.style.display = "none");
        // display the one the user is currently on
        slides[index].style.display = "block";
    }

    // add these buttons to event listener
    document.querySelector(".next").addEventListener("click", toggleNext);
    document.querySelector(".prev").addEventListener("click", togglePrev);

    // let's start the show!

    showSlide(slideIndex);

    console.log("loading data");

    // load data in first and then the rest will execute 
    d3.csv("arrestsUse.csv").then(function(data) {
        // make sure data is loaded in
        console.log(data);
        // get all the column names
        console.log("col names:", Object.keys(data[0]));
        // define functions that will be implemented
        schoolHist(data);
        raceDist(data);
        genderHist(data);
        ageHist(data);
        ethnicHist(data);
        // defensive coding
    }).catch(function(error) {
        console.log(error);
    });

    // confirmation that data has been loaded
    console.log("data loaded");

    function schoolHist(data) {
        // create margins and dimensions
        var margin = {right: 50, left: 80, top: 30, bottom: 40};
        var width = 700 - margin.right - margin.left;
        var height = 400 - margin.top - margin.bottom;

        // create svg container

        const svg = d3.select("#schoolHistogram")
                        .append("svg")
                        // .attr("viewBox", [0, 0, width, height])
                        .attr("width", 700)
                        .attr("height", 350);
        

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

        // color the bars in the chart
        const coloring = d3.scaleOrdinal().domain(["0", "1"]).range(d3.schemeCategory10);

        const tooltip = d3.select("#tooltip");

        // create axes
        svg.append("g")
            .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
            .call(d3.axisBottom(x));
        
        svg.append("g")
            .attr("transform", "translate("+margin.left+", "+0+")")
            .call(d3.axisLeft(y));

        // now create the bar chart 
        svg.selectAll("rect")
            .data(schoolArray)
            .enter().append("rect")
            .attr("fill", function(schoolArray) { return coloring(schoolArray.key); })
            .style("border", 14)
            .attr("x", (height - margin.bottom))
            .attr("y", margin.left)
            // bars will load in separately through this transition
            .transition().delay(function(d, i) { return i * 550; })
            .attr("x", function(schoolArray) { return x(schoolArray.key); })
            .attr("y", function(schoolArray) { return y(schoolArray.value); })
            .attr("height", function(schoolArray) { return y(0) - y(schoolArray.value);})
            .attr("width", x.bandwidth());

        
        // svg.transition()
        //     .delay(function(d, i) { return i * 250; })
        //     .style('opacity', 1)
        
        svg.selectAll("rect")
            .on('mouseover', function(event, schoolArray) {
                tooltip.style("opacity", 1)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY) + "px")
                        .html("There were " + schoolArray.value + " arrests");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });
        

        // create the legends 
        svg.append("circle")
            .attr("cx",450)
            .attr("cy",40)
            .attr("r", 4)
            .style("fill", "steelblue");

        svg.append("text")
            .attr("x", 460)
            .attr("y", 40)
            .text("Not near schools")
            .style("font-size", "12px")
            .attr("alignment-baseline","middle");
        
        svg.append("circle")
            .attr("cx",450)
            .attr("cy",60).attr("r", 4)
            .style("fill", "orange");

        svg.append("text")
            .attr("x", 460)
            .attr("y", 60)
            .text("Near schools")
            .style("font-size", "12px")
            .attr("alignment-baseline","middle");
            
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", -160)
            .style('font-size', 13)
            .text("Number of Arrests")

        // create annotations
        const annotations = [
            {
                note: { label: "91.5% of all arrests were made outside of school zones "},
                data: { school: "0", count: schoolArray[0].value},
                dy: 20,
                dx: 160
            }
        ];
    
        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .accessors({
                x: d => x(d.school) + x.bandwidth() / 2.15,
                y: d => y(d.count)
            })
            .annotations(annotations);
    
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }

    function genderHist(data) {
        // create margins and dimensions
        var margin = {right: 50, left: 80, top: 30, bottom: 40};
        var width = 700 - margin.right - margin.left;
        var height = 400 - margin.top - margin.bottom;

        // create svg container

        const svg = d3.select("#genderHistogram")
                        .append("svg")
                        // .attr("viewBox", [0, 0, width, height])
                        .attr("width", 700)
                        .attr("height", 350);
        

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

        var tooltip = d3.select("#tooltip");

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
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", (height - margin.bottom))
            .attr("y", margin.left)
            .transition().delay(function(d, i) { return i * 500; })
            .attr("x", function(gendersArray) { return x(gendersArray.key); })
            .attr("y", function(gendersArray) { return y(gendersArray.value); })
            .attr("height", function(gendersArray) { return y(0) - y(gendersArray.value);})
            .attr("width", x.bandwidth());
        
        svg.selectAll("rect")
        .on('mouseover', function(event, gendersArray) {
            tooltip.style("opacity", 10)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px")
                    .html("There were " + gendersArray.value + " arrests");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

        // add y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", -160)
            .style('font-size', 13)
            .text("Number of Arrests")


        // Add annotations
        const annotations = [
            {
                note: {label: "78.9% of arrested individuals were men.\nThere is a massive imbalance between the two genders"},
                data: { gender: gendersArray[0].key, value: gendersArray[0].value },
                dy: -40,
                dx: -70,
                bgPadding: 200
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .accessors({
                x: d => x(d.gender) + x.bandwidth() / 2.15,
                y: d => y(d.value)
            })
            .annotations(annotations);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }

    function raceDist(data) {

        const svg = d3.select("#raceHistogram")
                    .append("svg")
                    // .attr("viewBox", [0, 0, width, height])
                    .attr("width", 900)
                    .attr("height", 350)
        
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

        var tooltip = d3.select("#tooltip");

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
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", (height))
            .attr("y", margin.left - 50)
            .transition().delay(function(d, i) { return i * 400; })
            .attr("x", function(d) { return x(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return y(0) - y(d.value);})
            .attr("width", x.bandwidth());
        svg.selectAll("rect")
            .on('mouseover', function(event, d) {
                tooltip.style("opacity", 10)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY + 10) + "px")
                        .html("There were " + d.value + " arrests");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", -150)
            .style('font-size', 15)
            .text("Number of Arrests")

        // Add annotations
        const annotation = [{
            note: {title: "Black Americans made up " + ((raceArray[1].value) / 23510) * 100 + "% of all arrests."},
            data: {race: raceArray[1].key, value: raceArray[1].value},
            dy: 90,
            dx: 250,
            subject: {
                radius: 30,
                radiusPadding: 3
            }
        }];
        const makeAnnotation = d3.annotation()
                                        .type(d3.annotationCalloutCircle)
                                        .accessors({
                                            x: d => x(d.race) + x.bandwidth() / 2,
                                            y: d => y(d.value)
                                        })
                                        .annotations(annotation);
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotation);

        const anotherAnnotation = [{
            note: {title: "White Americans made up " + ((raceArray[2].value) / 23510) * 100 + "% of all arrests."},
            data: {race: raceArray[2].key, value: raceArray[2].value},
            dy: -20,
            dx: 90,
            subject: {
                radius: 30,
                radiusPadding: 3
            }
        }];

        const makeAnotherAnnotation = d3.annotation()
                                        .type(d3.annotationCalloutCircle)
                                        .accessors({
                                            x: d => x(d.race) + x.bandwidth() / 2,
                                            y: d => y(d.value)
                                        })
                                        .annotations(anotherAnnotation);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnotherAnnotation);
    }

    function ageHist(data) {
        const svg = d3.select("#ageHistogram")
                    .append("svg")
                    // .attr("viewBox", [0, 0, width, height])
                    .attr("width", 700)
                    .attr("height", 350)
        
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

        var tooltip = d3.select("#tooltip");

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
            .transition().delay(function(d, i) { return i * 300; })
            .attr("x", function(d) { return x(d.x0); })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("y", function(d) { return y(d.length); })
            .attr("height", function(d) { return y(0) - y(d.length); });
        svg.selectAll("rect")
            .on('mouseover', function(event, bins) {
                tooltip.style("opacity", 10)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY + 10) + "px")
                        .html("There were " + bins.length + " arrests");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", -160)
            .style('font-size', 15)
            .text("Number of Arrests")
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", (width / 2) + 15)
            .attr("y", height)
            .style('font-size', 15)
            .text("Age Groups");
        
        const annotations = [{
            note: {label: "The most amount of arrests happened between ages 20-30. Arrests decline in older age groups"},
            bgPadding: 20,
            data: {age: 25, value : 7000},
            dy: 30,
            dx: 80
        }];

        const makeAnnotation = d3.annotation()
                                .type(d3.annotationLabel)
                                .accessors({
                                    x: function(d) { return x(d.age); },
                                    y: function(d) { return y(d.value); }
                                })
                                .annotations(annotations);
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotation);
    }

    function ethnicHist(data) {
        // create margins and dimensions
        var margin = {right: 50, left: 80, top: 30, bottom: 40};
        var width = 700 - margin.right - margin.left;
        var height = 400 - margin.top - margin.bottom;

        // create svg container

        const svg = d3.select("#ethnicHistogram")
                        .append("svg")
                        // .attr("viewBox", [0, 0, width, height])
                        .attr("width", 700)
                        .attr("height", 350);
        

        // get counts of each categorical variable

        const ethnicity = d3.rollup(data, function(v) { return v.length; }, function(d) { return d.ethnicity; });
        console.log(ethnicity.values());

        for (let key of ethnicity.keys()) {
            console.log(key);
        }

        for (let value of ethnicity.values()) {
            console.log(value);
        }

        const ethnicityArray = Array.from(ethnicity, ([key, value]) => ({key, value}));
        console.log(ethnicityArray);

        // create scales
        const x = d3.scaleBand()
            .domain(["NON-HISPANIC", "HISPANIC"])
            .range([margin.left, width - margin.right])
            .padding(0.15);

        const y = d3.scaleLinear()
            .domain([0, 18000])
            .range([height - margin.bottom, margin.top]);

        // color the bars in the chart
        const coloring = d3.scaleOrdinal().domain(["NON-HISPANIC", "HISPANIC"]).range(d3.schemeCategory10);

        const tooltip = d3.select("#tooltip");

        // create axes
        svg.append("g")
            .attr("transform", "translate(0," +(height - margin.bottom)+ ")")
            .call(d3.axisBottom(x));
        
        svg.append("g")
            .attr("transform", "translate("+margin.left+", "+0+")")
            .call(d3.axisLeft(y));

        // now create the bar chart 
        svg.selectAll("rect")
            .data(ethnicityArray)
            .enter().append("rect")
            .attr("fill", function(ethnicityArray) { return coloring(ethnicityArray.key); })
            .style("border", 14)
            .attr("x", (height - margin.bottom))
            .attr("y", margin.left)
            // bars will load in separately through this transition
            .transition().delay(function(d, i) { return i * 250; })
            .attr("x", function(ethnicityArray) { return x(ethnicityArray.key); })
            .attr("y", function(ethnicityArray) { return y(ethnicityArray.value); })
            .attr("height", function(ethnicityArray) { return y(0) - y(ethnicityArray.value);})
            .attr("width", x.bandwidth());

        
        // svg.transition()
        //     .delay(function(d, i) { return i * 250; })
        //     .style('opacity', 1)
        
        svg.selectAll("rect")
            .on('mouseover', function(event, ethnicityArray) {
                tooltip.style("opacity", 1)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY) + "px")
                        .html("There were " + ethnicityArray.value + " arrests");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });
        
            
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", -160)
            .style('font-size', 13)
            .text("Number of Arrests")

        // create annotations
        const annotations = [
            {
                note: { label: "Non-hispanics made up the majority of the arrests: 69.5% of the arrests "},
                data: { ethnicity: "NON-HISPANIC", count: ethnicityArray[0].value},
                dy: -10,
                dx: 100
            }
        ];
    
        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .accessors({
                x: d => x(d.ethnicity) + x.bandwidth() / 2.15,
                y: d => y(d.count)
            })
            .annotations(annotations);
    
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }
});

