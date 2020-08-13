function chartBar(dataset) {
  let width = 1000,
    height = 600,
    padding = 60;

  let yearsData = dataset.map((item) => item.Year),
    secondsData = dataset.map((item) => item.Seconds);

  let timeFormat = d3.timeFormat("%M:%S");

  const legendData = [
    {
      doping: "yes",
      color: "rgb(255, 72, 67)",
      text: "Riders with doping allegations",
    },
    {
      doping: "no",
      color: "rgb(89, 228, 52)",
      text: "No doping allegations",
    },
  ];

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(yearsData) - 1, d3.max(yearsData)])
    .range([padding, width - padding]);

  let yScale = d3
    .scaleLinear()
    .domain([d3.max(secondsData) + 10, d3.min(secondsData)])
    .range([height - padding, padding]);

  let tooltip = d3
    .select(".diagram-canvas")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  let svg = d3
    .select(".diagram-canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(yearsData[i]))
    .attr("cy", (d, i) => yScale(secondsData[i]))
    .attr("r", 5)
    .attr("class", "dot")
    .attr("fill", (d) => (d.URL ? legendData[0].color : legendData[1].color))
    .attr("border", 1)
    .attr("stroke", "black")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", function (d) {
      let parsedTime = d.Time.split(":");
      return (d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    })
    .on("mouseover", function (d, i) {
      d3.select(this).attr("r", 10);
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          d.Name +
            " /" +
            d.Nationality +
            "/" +
            "<br/>" +
            "Year: " +
            d.Year +
            "<br/>Time: " +
            timeFormat(d.Time) +
            (d.Doping ? "<br/><br/>" + d.Doping : "") +
            (d.URL ? "<br/><br/>" + "Click for more information" : "")
        )
        .attr("data-year", d.Year)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .attr("r", 5);
      tooltip.transition().duration(200).style("opacity", 0);
    })
    .on("click", function (d, i) {
      if (d.URL) {
        let win = window.open(d.URL, "_blank");
        win.focus();
      }
    });

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  let yAxis = d3.axisLeft(yScale).tickFormat(function (secondsData) {
    let minutes = Math.floor(secondsData / 60);
    let seconds = +(secondsData % 60).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  });

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");

  svg
    .append("text")
    .attr('transform', 'rotate(-90)')
    .attr('x', -180)
    .attr('y', 20)
    .style('font-size', 18)
    .text('Time in Minutes');

    svg
    .append("text")
    .attr('x', width - 150)
    .attr('y', height - 10)
    .style('font-size', 18)
    .text('Date in Year');

  let legendContainer = svg.append("g").attr("id", "legend");

  let legend = legendContainer
    .selectAll("#legend")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", (d, i) => "translate(0," + (height / 2 - i * 20) + ")");

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d, i) => d.color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".25em")
    .style("text-anchor", "end")
    .text((d, i) => d.text);
}

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function (error, data) {
    if (error) throw error;
    let dataset = data;
    chartBar(dataset);
  }
);
