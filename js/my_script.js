/*
 * Name: Aylwin Sim 100074144
 * Title: COS30045 Data Visualization Project
 */

function init(){

  // Create a padding of 48 px
  var padding = 48;

  var w = 1000;
  var h = 500;

  // Declare dataset variable to store csv data
  var dataset;
  

  // Create svg element with fixed width and height
  svg = d3.select("div.all_age_bar")
              .append("svg")
              .attr('preserveAspectRatio', 'xMinYMin meet')
              .attr(
                'viewBox',
                '0 0 ' +
                  (w) +
                  ' ' +
                  (h)
              )
              .style("border-style", "dotted");

  
  
              

  // Define scales for x axis
  // Construct a band scale to
  // Take the amount of data points and split it into bands
  // Toss some paddings
  // and Create ordinal scale
  var xScale = d3.scaleBand().range([padding, w - padding]).padding(0.4);

  // Define scale for y axis
  // Construct a linear scale
  var yScale = d3.scaleLinear().range([h - padding, padding]);



  // Add a group element
  //var g = svg.append("g")
             //.attr("transform", "translate(" + 100 + "," + 100 + ")");

  // Convert csv data to json format
  var rowConverter = function(d){
    return {
      age: d.Age,
      number: parseFloat(d.Number)
    };
  }


  d3.csv('data/all_age_of_death_data.csv', rowConverter)
    .then(function(data) {

    
      // Store data as dataset
      dataset = data;
      

      //console.log(dataset);

      console.log(d3.max(dataset, function(d){
        return d.number;
      }));

      // Define the domain by import Age rows
      xScale.domain(dataset.map(function(d){
        return d.age;
      }));

      // Define the domain by import Number rows
      yScale.domain([0, d3.max(dataset, function(d){
        return d.number + 1133;
      })]);

      
      // Define X Axis
      var xAxis = d3.axisBottom().scale(xScale);

      // Define Y Axis
      var yAxis = d3.axisLeft().scale(yScale);

      // Draw X Axis 
      // Translate (0, 500 - pad)
      svg.append("g")
          .attr("transform", "translate(0, "+ (h-padding) +")")
          .call(xAxis);

      // Draw Y Axis
      // Translate (pad, 0)
      svg.append("g")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis);

      svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft()
          .ticks(5)
          .scale(yScale)
          .tickSize(-w)
          .tickFormat(''))

      
      // Draw bars
      svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.age); })
        .attr("y", function(d) {  
          console.log(d.number)
          console.log(yScale(d.number))
          return yScale(d.number); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return h - padding - yScale(d.number); })
        .on("mouseover", function(d, i){
          d3.select(this)
          .attr("fill", "orange");

          
          }).on("mouseout", function(d) {
              d3.select(this)
              .attr("fill", "black");
              
          });
    

  }).catch(function(error){
      // handle error   
      console.log(error);
      console.log("Oops");
      d3.select("div").append("p:footer").text(function(){
          return "OOPS ! Something went wrong with Data Import ---> " + error;
      }).style("color", "red");
    
  });

}

window.onload = init;