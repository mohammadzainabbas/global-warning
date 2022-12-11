const COUNTRY_BIG_CATEGS = ["WORLD", "ANNEXI", "NONANNEXI", "BASIC", "UMBRELLA", "EUU", "LDC", "AOSIS"]

// max value per year per country: 13000
const EMS_QUANTILES = [0, 50, 250, 1000, 5000, 10000]

// stuff
var width = 960,
    height = 500;
var svg = d3.select("body").append("svg")
  .attr("viewBox", [0, 0, width, height]);
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);
const colorScale = d3.scaleThreshold()
  .domain(EMS_QUANTILES)
  .range(d3.schemeBlues[EMS_QUANTILES.length]);

// legend
var legendData = [];
EMS_QUANTILES.forEach(q => {
  legendData.push({"size": EMS_QUANTILES.indexOf(q)*10, "value": q})
});
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 70) + "," + (height - 20) + ")")
    .selectAll("g")
    .data(legendData)
    .enter().append("g");

legend.append("rect")
    .style("fill", function(d, i) {
      return colorScale(d.value)
    })
    .attr("x", 15)
    .attr("y", function(d, i) {
      return - 2 - EMS_QUANTILES.indexOf(d.value)*20
    })
    .attr("width", 18)
    .attr("height", 18);

legend.append("text")
    .attr("y", function(d){return -2*+d.size-4})
    .attr("dy", "1.3em")
    .text(function(d) {return d.value});

legend.append("text")
    .attr("y", - EMS_QUANTILES.length*20)
    .text("GHG emissions value (MtCO2e)");


// data
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  d3.csv("../data/CW_emissions.csv", d => d)
]).then(function(promises){
  const world = promises[0];
  const csv = promises[1];

  var yearData = dataForYear(csv, 1850); // first map with the data of the first year
  drawTheMap(world, yearData);

  d3.select("input")
    .on("change", function() {
      var yearInput = +d3.select(this).node().value;
      var yearData = dataForYear(csv, yearInput);
      drawTheMap(world, yearData);
    });
});

function dataForYear(csv, year){
  var newData = new Map();
  csv.forEach(function(d) {
    if (d.gas === "KYOTOGHG" && d.sector === "Total excluding LULUCF" && !(COUNTRY_BIG_CATEGS.includes(d.country)) && +d.year === year) {
      newData.set(d.country, +d["value (MtCO2e)"])
    }
  })
  return newData;
}

function drawTheMap(world, yearData){
  svg.append("g")
  .selectAll("path")
  .data(world.features)
  .join("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function (d) {
      d.total = yearData.get(d.id) || 0;
      return colorScale(d.total);
    })
}