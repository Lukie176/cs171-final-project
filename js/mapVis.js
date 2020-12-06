class MapVis {
    constructor(parentElement, NFLData, JSONData) {
        var margin = {top: -50, right: 20, bottom: 30, left: -250},
            width = 1200 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        var selections = ["Select Year", "2016", "2017", "2018", "2019", "2020", "total"]

        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(selections)
            .enter()
            .append('option')
            .text(function (d) {
                return d;
            })
            .attr("value", function (d) {
                return d;
            })

        var svg = d3.select("#" + parentElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var tooltip = d3.select("#" + parentElement)
            .append("div")
            .style("opacity", 0)
            .style("visibility", "hidden")
            .attr("class", "tooltip-map")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "3px")
            .style("border-radius", "5px")
            .style("padding", "5px");


        //Define map projection
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])
            .scale([1500]);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        svg.selectAll("path")
            .data(JSONData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function (d, i) {
                // for (let i = 0; i < d.id.length; i++) {
                if (d.id === ("04" || "06" || "08" || "11" || "12" || "13" || "17"
                    || "18" || "22" || "24" || "25" || "26" || "27" || "29"
                    || "32" || "36" || "37" || "39" || "42" || "47" || "48" || "53" || "55")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("06")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("08")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("11")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("12")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("13")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("17")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("18")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("22")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("24")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("25")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("26")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("27")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("29")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("32")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("36")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("37")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("39")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("42")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("47")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("48")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("53")) {
                    return "rgb(58,90,246)";
                } else if (d.id === ("55")) {
                    return "rgb(58,90,246)";
                } else {
                    return "rgb(177,240,246)";
                }
            });


        let nfl = svg.selectAll("#teamData")
            .data(NFLData)
            .enter()
            .append("svg:image")
            .attr("xlink:href", function (d) {
                return d.img;
            })
            .attr("width", function (d) {
                return (d.total / 5);
            })
            .attr("height", function (d) {
                return (d.total / 5) - 15;
            })
            .attr("x", function (d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("y", function (d) {
                return projection([d.lon, d.lat])[1];
            })
            .style("stroke-width", 2)
            .style("opacity", 1)
            .on("click", function (e, d) {
                tooltip.transition()
                    .style("visibility", "visible")
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html('<strong>' + d.team + '</strong>' + '<br>' + d.place +
                    '<br>' + " Number of injuries: " + '<strong>' + d.total + '</strong>' +
                    '<br>' + "W-L-T: " + '<strong>' + d.rtotal + '</strong>')
                    .style("left", (e.pageX) + "px")
                    .style("top", (e.pageY - 28) + "px");
            })
            .on("mousemove", function (e, d) {
                return tooltip.style("top", (e.pageY - 10) + "px").style("left", (e.pageX + 10) + "px");
            })
            // fade out tooltip on mouse out
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });


        function updateChart(selectedCategory) {
            nfl
                .attr("width", function (d) {
                    if (d[selectedCategory] === d.total) {
                        return (d.total / 5);
                    } else {
                        return (d[selectedCategory]);
                    }
                })
                .attr("height", function (d) {
                    if (d[selectedCategory] === d.total) {
                        return (d.total / 5) - 15;
                    } else {
                        return d[selectedCategory] - 15;
                    }
                })
                .on("click", function (e, d) {
                    tooltip.transition()
                        .style("visibility", "visible")
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html('<strong>' + d.team + '</strong>' +
                        '<br>' + d.place +
                        '<br>' + " Number of injuries in " + selectedCategory + ": " + '<strong>' + d[selectedCategory] +
                        '</strong>' + '<br>' + 'W-L-T: ' + '<strong>' + d['r' + selectedCategory] + '</strong>')
                        .style("left", (e.pageX) + "px")
                        .style("top", (e.pageY - 28) + "px");
                })
        }

        d3.select("#selectButton").on("change", function (d) {

            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // var selectedOption2 = d3.select(this).property("value2")

            // run the updateChart function with this selected option
            updateChart(selectedOption)
        })
    }
}