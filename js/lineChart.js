
/*
 *  LineChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class LineChart {

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
        this.positions = ["DB", "DE", "DT", "LB", "WR", "TE", "OT", "OG", "C", "QB", "RB", "K", "P"]

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
            .range([0, vis.width - vis.margin.right])
        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        vis.color = d3.scaleOrdinal()
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
    wrangleData() {
        let vis = this;

        let yearData = d3.rollups(vis.data, v => v.length, d => d.position, d => d.year);

        vis.yearData = Object.fromEntries(yearData);

        console.log(vis.yearData);

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.positions.forEach((pos) => {
            vis.svg.append("path").datum(vis.yearData[pos])
                .attr("fill", "none")
                .attr("stroke", vis.color(pos))
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => vis.x(d[0]))
                    .y(d => vis.y(d[1]))
                )
        });
    }
}