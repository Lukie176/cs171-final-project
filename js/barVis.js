/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class BarVis {

    constructor(parentElement, data) {

        this.parentElement = parentElement;
        this.data = data.filter(d => d.year === 2020);
        this.displayData = this.data;
        this.selectedPosition = "ALL";
        this.positions = ["DB", "DE", "DT", "LB", "WR", "TE", "OT", "OG", "C", "QB", "RB", "K", "P"];
        this.posNames = {DB: "Defensive Backs", DE: "Defensive Ends", DT: "Defensive Tackles", LB: "Linebackers",
            WR: "Wide Receivers", TE: "Tight Ends", OT: "Offensive Tackles", OG: "Offensive Guards",
            C: "Centers", QB: "Quarterbacks", RB: "Running Backs", K: "Kickers", P: "Punters"};
        this.initVis();
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 60, right: 40, bottom: 50, left: 100};
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
            .text("Top 3 Injuries in the NFL for 2020");
        vis.svg
            .append('text')
            .attr('class', 'title bar-title')
            .attr('transform', `translate(${(vis.width  - vis.margin.right) / 2}, ${vis.height + 40})`)
            .attr('text-anchor', 'middle')
            .text('Appearances on 2020 Injury Reports');
        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width])

        vis.y = d3.scaleBand()
            .range([0, vis.height])
            .padding(0.1);

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

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0, " + vis.height + ")")
            .attr("font-size", "8px")
        vis.svg.append("g")
            .attr("class", "y-axis axis")

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        if (vis.selectedPosition === "ALL") {
            vis.displayData = vis.data;
            vis.title.text("Top 3 Injuries in the NFL for 2020");
        } else {
            vis.displayData = vis.data.filter(d => d.position === vis.selectedPosition);
            vis.title.text("Top 3 Injuries among " + vis.posNames[vis.selectedPosition] + " for 2020");
        }

        let filteredData = d3.rollups(vis.displayData, v => v.length, d => d.injury);

        filteredData.sort((a,b) => {return b[1] - a[1]})


        vis.topThreeData = filteredData.slice(0, 3)

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // update domains
        vis.y.domain(vis.topThreeData.map(d => d[0]));
        vis.x.domain([0, d3.max(vis.topThreeData, d => d[1])])

        // update bars with data
        let rects = vis.svg.selectAll("rect").data(vis.topThreeData, d => d[0])
        rects.enter().append("rect")
            .attr("class", "bar")
            .merge(rects)
            .transition()
            .duration(500)
            .attr("fill", vis.color(vis.selectedPosition))
            .attr("y", d => vis.y(d[0]))
            .attr("x", 0)
            .attr("height", vis.y.bandwidth())
            .attr("width", d => vis.x(d[1]))
        rects.exit().remove();

        // Update each axis
        vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);
        vis.svg.select(".x-axis").transition().duration(500).call(vis.xAxis);
    }
    filterData(category) {
        let vis = this;
        vis.selectedPosition = category;

        vis.wrangleData();
    }

}