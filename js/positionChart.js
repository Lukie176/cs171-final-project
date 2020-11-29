
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
        this.years = [2016, 2017, 2018, 2019, 2020];

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 40, left: 40};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Scales and axes
        vis.x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, vis.width - vis.margin.right])
        vis.y = d3.scaleLinear()
            .domain([0, 100])
            .range([0, vis.height])

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        console.log(vis.data);

        let yearData = d3.rollups(vis.data, v => v.length, d => d.position, d => d.year);
        let injuryData = d3.rollups(vis.data, v => v.length, d => d.position, d => d.injury);

        vis.totalPos = Object.fromEntries(d3.rollups(vis.data, v => v.length, d => d.position));
        injuryData.forEach(d => d[1].sort((x, y) => y[1] - x[1]));

        vis.yearData = Object.fromEntries(yearData);
        vis.injuryData = Object.fromEntries(injuryData);

        console.log(vis.yearData);
        // Update the visualization
        vis.updateVis();
        }

    updateVis() {
        let vis = this;
        let dPositions = [["DB", 40, 5], ["DB", 60, 5], ["DB", 5, 33], ["DB", 95, 33], ["DB", 15, 35], ["DB", 85, 35],
                         ["DE", 30, 40], ["DE", 70, 40], ["DT", 40, 40], ["DT", 60, 40], ["LB", 50, 35], ["ALL", 5, 5]];
        let oPositions = [["WR", 5, 70], ["WR", 95, 70], ["TE", 15, 60], ["OT", 30, 60], ["OT", 70, 60],
                          ["OG", 40, 60], ["OG", 60, 60], ["C", 50, 60], ["QB", 50, 75], ["RB", 45, 83],
                          ["K", 80, 85], ["P", 90, 85]];

        vis.dPosCirc = vis.svg.selectAll(".dPosCirc")
            .data(dPositions)
            .enter().append("circle")
            .attr('class', 'dPosCirc')
            .attr('cx', d => vis.x(d[1]))
            .attr('cy', d => vis.y(d[2]))
            .attr('r', 20)
            .attr('fill', 'black')
            .on('click', d => this.updateTable(d.target.__data__[0]));

        vis.dPosLabels = vis.svg.selectAll(".dPosLabels")
            .data(dPositions)
            .enter().append("text")
            .attr('class', 'dPosLabels')
            .attr('x', d => vis.x(d[1]))
            .attr('y', d => vis.y(d[2]) + 5)
            .attr('text-anchor', "middle")
            .attr('fill', "white")
            .text(d => d[0])
            .on('click', d => this.updateTable(d.target.__data__[0]));


        vis.oPosCirc = vis.svg.selectAll(".oPosCirc")
            .data(oPositions)
            .enter().append("circle")
            .attr('class', 'oPosCirc')
            .attr('cx', d => vis.x(d[1]))
            .attr('cy', d => vis.y(d[2]))
            .attr('r', 20)
            .attr('fill', 'grey')
            .on('click', d => this.updateTable(d.target.__data__[0]));


        vis.oPosLabels = vis.svg.selectAll(".oPosLabels")
            .data(oPositions)
            .enter().append("text")
            .attr('class', 'oPosLabels')
            .attr('x', d => vis.x(d[1]))
            .attr('y', d => vis.y(d[2]) + 5)
            .attr('text-anchor', "middle")
            .attr('fill', "white")
            .text(d => d[0])
            .on('click', d => this.updateTable(d.target.__data__[0]));

        vis.svg.append("line")
            .attr('x1', vis.x(0))
            .attr('x2', vis.x(100))
            .attr('y1', vis.y(50))
            .attr('y2', vis.y(50))
            .attr('stroke', "black")
            .attr('stroke-width', 3);
        vis.svg.append("line")
            .attr('x1', vis.x(0))
            .attr('x2', vis.x(0))
            .attr('y1', vis.y(48))
            .attr('y2', vis.y(52))
            .attr('stroke', "black")
            .attr('stroke-width', 3);
        vis.svg.append("line")
            .attr('x1', vis.x(100))
            .attr('x2', vis.x(100))
            .attr('y1', vis.y(48))
            .attr('y2', vis.y(52))
            .attr('stroke', "black")
            .attr('stroke-width', 3);
    }
    updateTable(pos) {
        lineChart.filterData(pos);
        barVis.filterData(pos);
    }
}