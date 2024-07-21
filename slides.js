document.addEventListener("DOMContentLoaded", () => {
    let slides = document.querySelectorAll(".slide");
    let slideIndex = 0;

    document.querySelector(".next").addEventListener("click", toggleNext);
    document.querySelector(".prev").addEventListener("click", togglePrev);

    function toggleNext() {
        if (slideIndex < slides.length - 1) {
            slideIndex++;
        }
        else {
            slideIndex = slides.length - 1;
        }
        showSlide(slideIndex);
    }

    function togglePrev() {
        if (slideIndex > 0) {
            slideIndex--;   
        }
        else {
            slideIndex = 0;
        }
        showSlide(slideIndex);
    }

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = "none");
        slides[index].style.display = "block";
    }

    showSlide(slideIndex);

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
        //var tooltip = d3.select("#tooltip");

        svg.selectAll()
            .data(schoolArray)
            .join("rect")
            .attr("fill", function(schoolArray) { return coloring(schoolArray.key); })
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", (height - margin.bottom))
            .attr("y", margin.left)
            .transition().delay(function(d, i) { return i * 250; })
            .attr("x", function(schoolArray) { return x(schoolArray.key); })
            .attr("y", function(schoolArray) { return y(schoolArray.value); })
            .attr("height", function(schoolArray) { return y(0) - y(schoolArray.value);})
            .attr("width", x.bandwidth());
        
        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 30)
        .attr("x", -160)
        .style('font-size', 13)
        .text("Number of Arrests")
        
            const annotations = [
                {
                    note: { label: "Not near schools: 21,508 arrests "},
                    data: { school: "0", count: schoolArray[0].value},
                    dy: 20,
                    dx: 160
                },
                {
                    note: { label: "Near school zones: 2,002 arrests " },
                    data: { school: "1", count: schoolArray[1].value },
                    dy: -40,
                    dx: 70
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
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", (height - margin.bottom))
            .attr("y", margin.left)
            .transition().delay(function(d, i) { return i * 500; })
            .attr("x", function(gendersArray) { return x(gendersArray.key); })
            .attr("y", function(gendersArray) { return y(gendersArray.value); })
            .attr("height", function(gendersArray) { return y(0) - y(gendersArray.value);})
            .attr("width", x.bandwidth());

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
                note: {title: "Number of arrested Men: " + gendersArray[0].value},
                data: { gender: gendersArray[0].key, value: gendersArray[0].value },
                dy: -10,
                dx: 10
            },
            {
                note: {title: "Number of arrested Females: " + gendersArray[1].value},
                data: { gender: gendersArray[1].key, value: gendersArray[1].value },
                dy: -125,
                dx: 25
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationCallout)
            .accessors({
                x: d => x(d.gender) + x.bandwidth() / 2,
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
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", (height))
            .attr("y", margin.left - 50)
            .transition().delay(function(d, i) { return i * 400; })
            .attr("x", function(d) { return x(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return y(0) - y(d.value);})
            .attr("width", x.bandwidth());
        
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("y", 30)
                .attr("x", -200)
                .style('font-size', 15)
                .text("Number of Arrests")

        // Add annotations
        const annotations = [
            {
                note: {title: "Highest Number of Arrests: " + raceArray[1].value},
                data: { race: raceArray[1].key, value: raceArray[1].value },
                dy: -20,
                dx: -100
            },
            {
                note: {title: "Lowest Number of Arrests: " + raceArray[5].value},
                data: { race: raceArray[5].key, value: raceArray[5].value },
                dy: -125,
                dx: 25
            },
        ];

        const anotherAnnotation = [{
            note: {title: "Black and White Americans made up " + ((raceArray[1].value + raceArray[2].value) / 23510) * 100 + "% of all arrests from 2021-2023"},
            data: {race: raceArray[2].key, value: raceArray[2].value},
            dy: 0,
            dx: 90,
            subject: {
                radius: 30,
                radiusPadding: 3
            }
        }];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationCallout)
            .accessors({
                x: d => x(d.race) + x.bandwidth() / 2,
                y: d => y(d.value)
            })
            .annotations(annotations);
        const makeAnotherAnnotation = d3.annotation()
                                        .type(d3.annotationCalloutCircle)
                                        .accessors({
                                            x: d => x(d.race) + x.bandwidth() / 2,
                                            y: d => y(d.value)
                                        })
                                        .annotations(anotherAnnotation);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnotherAnnotation);


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
                    .domain([0, d3.max(bins, function(d) { return d.length; })])
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
            .transition().delay(function(d, i) { return i * 300; })
            .attr("x", function(d) { return x(d.x0); })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("y", function(d) { return y(d.length); })
            .attr("height", function(d) { return y(0) - y(d.length); });
        
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
                                    x: function(d) { return x(d.age)},
                                    y: function(d) { return y(d.value)}
                                })
                                .annotations(annotations);
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotation);
    }
});

