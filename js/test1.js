/*
 * Name: Aylwin Sim 100074144
 * Title: COS30045 Data Visualization Project
 */
var onClicked = false;
var tempPos;
var tempBar;

function init(){

  drawBarChart();

  drawRingChart();

  drawCauseChart();

}

// Convert csv data to json format
var ageConverter = function(d){
  return {
    age: d.Age,
    number: parseFloat(d.Number)
  };
} 

function drawBarChart() {
  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 600 - 1 * margin;

  // Declare dataset variable to store csv data
  var dataset;

  const svg = d3.select('div.all_age_bar')
    .append("svg")
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr(
      'viewBox',
      '0 0 ' +
        (width + 2 * margin) +
        ' ' +
        (height + 1 * margin)
        
    );


  const chart = svg
    .append('g')
    .attr('transform', "translate(" + margin + "," + 20 + ")");


  d3.csv('data/all_age_of_death_data.csv', ageConverter)
    .then(function(data) {

    // Store data as dataset
    dataset = data;

    console.log(dataset);

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(dataset, function(d){
        return d.number + 6133;
      })]);

    chart.append('g')
      .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(dataset.map((d) => d.age))
      .padding(0.1);

    chart.append('g')
      .attr('transform', "translate(0, " + height + ")")
      .call(d3.axisBottom(xScale));

    chart.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft()
          .ticks(5)
          .scale(yScale)
          .tickSize(-width, 0, 0)
          .tickFormat(''));

    chart.selectAll()
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.age))
      .attr('y', (d) => yScale(d.number))
      .attr('height', (d) => height - yScale(d.number))
      .attr('width', xScale.bandwidth())
      .attr("fill", "#1f77b4")
      .on("mousemove", function(d, i){

        var percentage = Math.round(d.number/160909*100);
        
        myTooltip
          .style("left", d3.event.pageX + "px")
          .style("top",  d3.event.pageY + "px")
            .style("display", "inline-block")
            .html("Age " + (d.age) + "<br>" + "Total: " + percentage + "%");
        
    }).on("mouseout", function(d) {

        myTooltip.style("display", "none");
        
    }).on("click",function(d, i){

      if (onClicked == false){
        onClicked = true

        tempPos = i;
        tempBar = d3.select(this);

        d3.select(this)
          .attr("fill", "#ff7f0e");

        updateRingChart(i);

        updateCauseChart(d.age);
      } else {

        

        if (tempPos == i){

          onClicked = false;

          d3.select(this)
              .attr("fill", "#1f77b4");

          updateRingChart(11);

          updateCauseChart("All");
        } else {

          tempBar.attr("fill", "#1f77b4");

          onClicked = true
          tempPos = i;
          tempBar = d3.select(this);

          d3.select(this)
              .attr("fill", "#ff7f0e");

          updateRingChart(i);

          updateCauseChart(d.age);
        }


      }


        
    });

    
    svg.append('text')
      .attr('x', -(height / 2.5) - margin)
      .attr('y', margin / 3.5)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Number of Death');

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 0.8)
      .attr('text-anchor', 'middle')
      .text('Age Group');

    

    

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