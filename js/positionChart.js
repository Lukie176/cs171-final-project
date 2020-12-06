
/*
 *  PositionChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class PositionChart {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.categories = ["Abdomen", "Achilles", "Ankle", "Back", "Biceps", "Calf", "Chest", "Concussion", "Elbow",
            "Fibula", "Finger", "Foot", "Forearm", "Groin", "Hamstring", "Hand", "Heel", "Hip", "Illness", "Knee",
            "Multiple", "Neck", "Oblique", "Other", "Pectoral", "Quadricep", "Rib", "Shin", "Shoulder",
            "Thigh", "Thumb", "Toe", "Tricep", "Wrist"];
        this.positions = ["DB", "DE", "DT", "LB", "WR", "TE", "OT", "OG", "C", "QB", "RB", "K", "P"];
        this.posNames = {DB: "Defensive Backs", DE: "Defensive Ends", DT: "Defensive Tackles", LB: "Linebackers",
            WR: "Wide Receivers", TE: "Tight Ends", OT: "Offensive Tackles", OG: "Offensive Guards",
            C: "Centers", QB: "Quarterbacks", RB: "Running Backs", K: "Kickers", P: "Punters", ALL: "Reset"};
        this.playerNames = {DB: "Byron Jones", DE: "Takkarist McKinley", DT: "Derrick Nnadi", LB: "Dante Fowler Jr",
            WR: "Julio Jones", TE: "Will Dissly", OT: "Lane Johnson", OG: "Trai Turner",
            C: "J.C. Tretter", QB: "Tyrod Taylor", RB: "Phillip Lindsay", K: "Sam Ficken", P: "Jamie Gillan", ALL: "All Players"};
        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 0, bottom: 40, left: 40};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);
        vis.title = vis.svg.append('g')
            .attr('class', 'title field-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, -10)`)
            .attr('text-anchor', 'middle')
            .text("Interactive Football Field");
        // Scales and axes
        vis.x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, vis.width - vis.margin.right])
        vis.y = d3.scaleLinear()
            .domain([0, 100])
            .range([0, vis.height])
        vis.color = d3.scaleOrdinal()
            .domain(vis.positions)
            .range(["#d4ad3f",
                "#757bd5",
                "#62bd5d",
                "#b86aca",
                "#adc263",
                "#d6528d",
                "#6cd1a8",
                "#d06e36",
                "#4ec0d3",
                "#d06766",
                "#4e9164",
                "#cc8ec0",
                "#7e8537",
                "#6898d3",
                "#c69563"]);


        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        let yearData = d3.rollups(vis.data, v => v.length, d => d.position, d => d.year);
        let injuryData = d3.rollups(vis.data, v => v.length, d => d.position, d => d.injury);

        vis.totalPos = Object.fromEntries(d3.rollups(vis.data, v => v.length, d => d.position));
        injuryData.forEach(d => d[1].sort((x, y) => y[1] - x[1]));

        vis.yearData = Object.fromEntries(yearData);
        vis.injuryData = Object.fromEntries(injuryData);

        // Update the visualization
        vis.updateVis();
        }

    updateVis() {
        let vis = this;
        let positions = [["DB", 40, 5], ["DB", 60, 5], ["DB", 5, 33], ["DB", 95, 33], ["DB", 15, 35], ["DB", 85, 35],
                         ["DE", 30, 40], ["DE", 70, 40], ["DT", 40, 40], ["DT", 60, 40], ["LB", 50, 35], ["ALL", 5, 5],
                         ["WR", 5, 70], ["WR", 95, 70], ["TE", 15, 60], ["OT", 30, 60], ["OT", 70, 60], ["OG", 40, 60],
                         ["OG", 60, 60], ["C", 50, 60], ["QB", 50, 75], ["RB", 45, 83], ["K", 80, 85], ["P", 90, 85]];

        // Field colorings
        [0, 50].forEach(val => {
            vis.svg.append("rect")
                .attr('x', 0)
                .attr('y', vis.y(val))
                .attr('width', vis.x(100))
                .attr('height', vis.y(25))
                .attr('fill', "#658d29");
            vis.svg.append("rect")
                .attr('x', 0)
                .attr('y', vis.y(val + 25))
                .attr('width', vis.x(100))
                .attr('height', vis.y(25))
                .attr('fill', "#79a834");
        })

        // Yard Lines
        let yardLines = [25, 50, 75]
        yardLines.forEach(height => {
            vis.svg.append("line")
                .attr('x1', vis.x(0))
                .attr('x2', vis.x(100))
                .attr('y1', vis.y(height))
                .attr('y2', vis.y(height))
                .attr('stroke', "white")
                .attr('stroke-width', 3);
        });

        for (let i = 0; i < 105; i += 5) {
            vis.svg.append("line")
                .attr('x1', vis.x(0))
                .attr('x2', vis.x(2.5))
                .attr('y1', vis.y(i))
                .attr('y2', vis.y(i))
                .attr('stroke', "white")
                .attr('stroke-width', 3);
            vis.svg.append("line")
                .attr('x1', vis.x(60))
                .attr('x2', vis.x(65))
                .attr('y1', vis.y(i))
                .attr('y2', vis.y(i))
                .attr('stroke', "white")
                .attr('stroke-width', 3);
            vis.svg.append("line")
                .attr('x1', vis.x(35))
                .attr('x2', vis.x(40))
                .attr('y1', vis.y(i))
                .attr('y2', vis.y(i))
                .attr('stroke', "white")
                .attr('stroke-width', 3);
            vis.svg.append("line")
                .attr('x1', vis.x(97.5))
                .attr('x2', vis.x(100))
                .attr('y1', vis.y(i))
                .attr('y2', vis.y(i))
                .attr('stroke', "white")
                .attr('stroke-width', 3);

        }

        vis.posCirc = vis.svg.selectAll(".posCirc")
            .data(positions)
            .enter().append("circle")
            .attr('class', 'posCirc')
            .attr('cx', d => vis.x(d[1]))
            .attr('cy', d => vis.y(d[2]))
            .attr('r', 20)
            .attr('fill', d => vis.color(d[0]))
            .on('click', (e, d) => vis.updateTable(d[0]))
            .on("mouseover", (event, d) => {
                vis.tooltip
                    .style("display", null)
                    .style("opacity",1)
                    .select("#text1").text(vis.posNames[d[0]])
                vis.tooltip.select("#posPhoto").attr("xlink:href", "img/"+ d[0] + ".png");
                vis.tooltip.select("#text2").text(vis.playerNames[d[0]])
                if (d[2] < 50) {
                    vis.tooltip.attr("transform", `translate( ${ vis.x(d[1]) - 60 } , ${ vis.y(d[2]) + 40 } )`)
                } else {
                    vis.tooltip.attr("transform", `translate( ${ vis.x(d[1]) - 60 } , ${ vis.y(d[2]) - 160 } )`)
                }
            })
            .on("mouseout", () => {
                vis.tooltip.style("display", "none").style("opacity",0);
            });

        vis.posLabels = vis.svg.selectAll(".posLabels")
            .data(positions)
            .enter().append("text")
            .attr('class', 'posLabels')
            .attr('x', d => vis.x(d[1]))
            .attr('y', d => vis.y(d[2]) + 5)
            .attr('text-anchor', "middle")
            .attr('fill', "white")
            .text(d => d[0])
            .on('click', (e, d) => vis.updateTable(d[0]))
            .on("mouseover", (event, d) => {
                vis.tooltip
                    .style("display", null)
                    .style("opacity",1)
                    .select("#text1").text(vis.posNames[d[0]])
                vis.tooltip.select("#posPhoto").attr("xlink:href", "img/"+ d[0] + ".png");
                vis.tooltip.select("#text2").text(vis.playerNames[d[0]])
                if (d[2] < 50) {
                    vis.tooltip.attr("transform", `translate( ${ vis.x(d[1]) - 60 } , ${ vis.y(d[2]) + 40 } )`)
                } else {
                    vis.tooltip.attr("transform", `translate( ${ vis.x(d[1]) - 60 } , ${ vis.y(d[2]) - 160 } )`)
                }
            })
            .on("mouseout", () => {
                vis.tooltip.style("display", "none").style("opacity",0);
            });

        let fieldTitles = vis.svg.append('g')
            .attr('class', 'position-titles')
        fieldTitles.append('text')
            .attr('transform', `translate(5, ${vis.height / 2 - 12})`)
            .attr('text-anchor', 'left')
            .attr('fill', 'white')
            .text("Defensive Positions")
        fieldTitles.append('text')
            .attr('transform', `translate(5, ${vis.height / 2 + 24})`)
            .attr('text-anchor', 'left')
            .attr('fill', 'white')
            .text("Offensive Positions")

        // Prep the tooltip bits, initial display is hidden
        vis.tooltip = vis.svg.append("g")
            .attr("class", "tooltip")
            .style("opacity", 0)

        vis.tooltip.append("rect")
            .attr("width", 120)
            .attr("height", 120)
            .attr("fill", "white")
            .style("opacity", 0.5);
        vis.tooltip.append("text")
            .attr("id", "text1")
            .attr("x", 60)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
        vis.tooltip.append("image")
            .attr("id", "posPhoto")
            .attr("xlink:href", "img/QB.png")
            .attr("width", "120")
            .attr("height", "120")
        vis.tooltip.append("text")
            .attr("id", "text2")
            .attr("x", 60)
            .attr("y", 100)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
    }
    updateTable(pos) {
        lineChart.filterData(pos);
        barVis.filterData(pos);
    }
}