// Convert csv data to json format

var _currentAngle;

var _currentGender;

var _genders;

var _currentArcs;

var _pie;

var _arc;

var _genderPercentage;

var genderConverter = function(d){
    return {
      age: d.Age,
      male: parseFloat(d.Male),
      female: parseFloat(d.Female),
      total: parseFloat(d.Total)
    };
  } 
  
function drawRingChart(){
  
    //var color = d3.scaleOrdinal(d3.schemeCategory10);
    var color = ["#24A1DE", "#ff7f0e"];
  
    const margin = 40;
    const width = 500 - 2 * margin;
    const height = 640 - 1 * margin;
    var outerRadius = width / 2;
    var innerRadius = width / 3;

    var legendRectSize = 18;                                  
    var legendSpacing = 4;   
    var legendTitle = ["Male", "Female"];
  
    _arc = d3.arc().outerRadius(outerRadius)
                      .innerRadius(innerRadius);
  
    
  
    var svg = d3.select("div.gender_ring")
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
    .attr('transform', "translate(" + margin + "," + 2 * margin + ")");
  
    d3.csv('data/gender_of_death.csv', genderConverter)
      .then(function(data) {

        
  
        // dataset = [5, 10, 20, 45, 6, 25];
        _genders = data;
  
        _currentGender = _genders[11]; // All by default

        // Define the default pie layout
        _pie = d3.pie()
            .sort(null);

        console.log(_currentGender);
  
        _currentArcs = chart.selectAll("g.arc")
                      .data(_pie([_currentGender.male, _currentGender.female]))
                      .enter()
                      .append("path")
                      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
        
        // Draw arc paths
        _currentArcs
            .attr("fill", function(d, i){
                return color[i]
            })
            .attr("d", function(d, i){
                return _arc(d, i);
            })
            .each(function(d) { _currentAngle = d; })
            .on("mousemove", function(d, i){
                  
                myTooltip
                .style("left", d3.event.pageX + "px")
                .style("top",  d3.event.pageY + "px")
                .style("display", "inline-block")
                .html(function(){

                    var percentage = Math.round(d.data/_currentGender.total*100);

                    
                    if (i == 0){

                        return ("<span>Male</span><br>" + percentage + "%")
                    } else {
                        return ("<span>Female</span><br>" + percentage + "%")
                    }
                });

                
            }).on("mouseout", function(d) {
                
              
                myTooltip.style("display", "none");
            });

        

        /*var textG = _currentArcs.selectAll(".labels")
            .data(_pie(["M", "F"]))
            .enter().append("g")
            .attr("class", "labels");

        textG.append("text")
            .attr("transform", function(d) {
              return "translate(" + _arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("fill", "black")
            .text(function(d, i) {
              console.log(d);
              return d.value;
            });*/

        var legend = svg.selectAll(".legend")
                        .data(legendTitle)
                        .enter()
                        .append('g')
                        .attr("class", "legend")
                        .attr("transform", function(d, i){

                            var height = legendRectSize + legendSpacing;          // NEW
                            var offset =  height * 2 / 2;     // NEW
                            var horz = -2 * legendRectSize + 250;                       // NEW
                            var vert = i * height - offset + 290;
                                                   
                            return 'translate(' + horz + ',' + vert + ')';        
                        });

        legend.append('rect')                                   
            .attr('width', legendRectSize)                         
            .attr('height', legendRectSize)                        
            .style('fill', function(d, i){
                return color[i]
            });                              

        legend.append('text')                                     
            .attr('x', legendRectSize+10)       
            .attr('y', legendRectSize-5)    
                        
            .text(function(d) { return d; });

        
            
        

        /*// Generate text
        _currentArcs.append("text")
            .text(function(d){
                return ["Male", "Female"];
            }).attr("transform", function(d){
                return "translate(" + _arc.centroid(d) + ")";
            });*/

        
  
    });
}

function updateRingChart(i) {

    // _gender.male[i] / _gender.female[i]

    _currentGender = _genders[i];

    console.log(_currentGender);

    _currentArcs.data(_pie([_currentGender.male, _currentGender.female]));

    _currentArcs.transition().duration(1000).attrTween("d", arcTween);
    
}

function arcTween(a) {
    var i = d3.interpolate(_currentAngle, a);
    _currentAngle = i(0);
    return function(t) {
      return _arc(i(t));
    };
}
