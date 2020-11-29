
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
        this.posNames = {DB: "Defensive Backs", DE: "Defensive Ends", DT: "Defensive Tackles", LB: "Linebackers",
                         WR: "Wide Receivers", TE: "Tight Ends", OT: "Offensive Tackles", OG: "Offensive Guards",
                         C: "Centers", QB: "Quarterbacks", RB: "Running Backs", K: "Kickers", P: "Punters"};
        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis() {
        let vis = this;

        vis.margin = {top: 60, right: 40, bottom: 40, left: 40};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.title = vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 0)`)
            .attr('text-anchor', 'middle')
            .text("Number of Entries on Injury Report for 2020 by Week");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .domain([1, 9])
            .range([0, vis.width - vis.margin.right])
        vis.y = d3.scaleLinear()
            .domain([0, 75])
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
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0, " + vis.height + ")")
        vis.svg.append("g")
            .attr("class", "y-axis axis")
        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData() {
        let vis = this;
        let thisYear = vis.data.filter(d => d.year === 2020)
        let yearData = d3.rollups(thisYear, v => v.length, d => d.position, d => d.week);

        vis.yearData = Object.fromEntries(yearData);

        console.log(vis.yearData);

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        console.log(vis.positions)
        vis.positions.forEach((pos) => {
            console.log(pos)
            vis.svg.append("path").datum(vis.yearData[pos])
                .attr("class", "pos-line-" + pos)
                .attr("fill", "none")
                .attr("stroke", vis.color(pos))
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(d => {
                        console.log(d);
                        return vis.x(d[0])
                    })
                    .y(d => vis.y(d[1]))
                )
        });
        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }

    filterData(category) {
        let vis = this;

        vis.positions.forEach((pos) => {
            console.log(pos)
            vis.svg.selectAll(".pos-line-" + pos)
                .attr("opacity", (category === pos || category === "ALL") ? 1 : 0.2)
        });
        if (category === "ALL") {
            vis.title.text("Number of Entries on Injury Report for 2020 by Week");
        } else {
            vis.title.text("Number of Times " + vis.posNames[category] + " are on Injury Reports for 2020 by Week")
        }
    }
}