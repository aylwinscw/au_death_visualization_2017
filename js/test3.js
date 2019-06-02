var _causes;

var _totalOfCause = []; // The number of individual cause
var _causeOfAge = []; // The title of the cause

var _selectedAgeGroup = [];

var svg;

var chart;

var xScale;
var yScale;

var horBar;
var myTooltip;

var texts;

var causeConverter = function(d){
    return {
      age: d.Age,
      cause: d.Cause,
      brief: d.Brief,
      male: parseFloat(d.Male),
      female: parseFloat(d.Female),
      total: parseFloat(d.Total)
    };
}

function drawCauseChart(){
    const margin = 60;

    const width = 1000 - 2 * margin;
    const height = 500 - 1 * margin;

    svg = d3.select("div.cause_bar")
        .append("svg")
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
        'viewBox',
        '0 0 ' +
            (width + 2 * margin) +
            ' ' +
            (height + 1 * margin)
        );
        

    myTooltip = d3.select("body")
        .append("div")
        .attr("class", "myToolTip");

    chart = svg
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin/4 + ")");

    d3.csv('data/cause_of_death.csv', causeConverter)
        .then(function(data) {

        _causes = data;

        for(var i = 0; i < _causes.length; i++){

            if(_causes[i].age == "All"){
                
                _selectedAgeGroup.push(_causes[i]);
            }
        }
    
        console.log(_selectedAgeGroup);
    
        xScale = d3.scaleLinear()
                .domain([0, d3.max(_selectedAgeGroup, function(d){
                    return d.total;
                })])
                .range([0, width])
    
        yScale = d3.scaleBand()  
            .range([0, height])
            .domain(_selectedAgeGroup.map((d) => d.cause))
            .padding(0.1);
    
        chart.append('g')
            .attr("class", "x-axis grid")
            .attr('transform', "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale)
                .ticks(5)
                .scale(xScale)
                .tickSize(-height, 0, 0)
                
            );

        
        chart.append('g')
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale))
            .attr("visibility","hidden");



        horBar = chart.selectAll(".bar")
                    .data(_selectedAgeGroup)
                    .enter();
        
        horBar    
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => 0)
            .attr('y', (d) => yScale(d.cause))
            .attr('width', (d) => xScale(d.total))
            .attr('height', yScale.bandwidth())
            .attr("fill", "#1f77b4")
            .on("mousemove", function(d, i){
              d3.select(this)
              .attr("fill", "#ff7f0e");
                
              myTooltip
              .style("left", d3.event.pageX + "px")
              .style("top",  d3.event.pageY + "px")
                .style("display", "inline-block")
                .html((d.cause) + "<br>" + "Total: " + (d.total));

            
              
          }).on("mouseout", function(d) {
              d3.select(this)
              .attr("fill", "#1f77b4");
            
              myTooltip.style("display", "none");
          });

        texts = horBar
            
          .append("text")
          .attr("class", "below")
          .attr("x", (d) => 12)
          .attr("y", (d) => yScale(d.cause)+24)
          .attr("text-anchor", "left")
          .text(function(d) { return d.brief; })
          .style("fill", "black")
          .style("font-size", "18px");


    });

}

function updateCauseChart(ageGroup) {

    const margin = 60;

    const width = 1000 - 2 * margin;
    const height = 500 - 1 * margin;

    _selectedAgeGroup = [];

    for(var i = 0; i < _causes.length; i++){

        if(_causes[i].age == ageGroup){
            
            _selectedAgeGroup.push(_causes[i]);
        }
    }

    console.log(_selectedAgeGroup);

    xScale = d3.scaleLinear()
            .domain([0, d3.max(_selectedAgeGroup, function(d){
                return d.total;
            })])
            .range([0, width]);


    yScale = d3.scaleBand()  
        .range([0, height])
        .domain(_selectedAgeGroup.map((d) => d.cause))
        .padding(0.1);


    horBar = chart.selectAll(".bar")
        .data(_selectedAgeGroup);
    
    
    horBar
        .transition()
        .duration(1000)
        .attr('x', (d) => 0)
        .attr('y', (d) => yScale(d.cause))
        .attr('width', (d) => xScale(d.total))
        .attr('height', yScale.bandwidth());
        

    chart.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale)
            .ticks(5)
            .scale(xScale)
            .tickSize(-height, 0, 0)     
        );

    texts
    .data(_selectedAgeGroup)
    .attr("x", (d) => 12)
    .attr("y", (d) => yScale(d.cause)+24)
    .attr("text-anchor", "left")
    .text(function(d) { return d.brief; })
    .style("fill", "black")
    .style("font-size", "18px");
        
        
    
            
          
}