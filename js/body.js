
/*
 *  StackedBar - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class bodyparts {

    /*
     *  Constructor method
     */
    constructor(parentElementa, parentElementb, data) {
        this.parentElementa = parentElementa;
        this.parentElementb = parentElementb;
        this.data = data;
        this.displayData = [];

        // Categories and years based on dataset
        this.categories = ["Abdomen", "Achilles", "Ankle", "Back", "Biceps", "Calf", "Chest", "Concussion", "Elbow",
            "Fibula", "Finger", "Foot", "Forearm", "Groin", "Hamstring", "Hand", "Heel", "Hip", "Illness", "Knee",
            "Multiple Injuries", "Neck", "Oblique", "Other", "Pectoral", "Quadricep", "Rib", "Shin", "Shoulder",
            "Thigh", "Thumb", "Toe", "Tricep", "Wrist"];
        this.years = [2016, 2017, 2018, 2019, 2020];

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;


        vis.widtha = $("#" + vis.parentElementa).width();
        vis.heighta = $("#" + vis.parentElementa).height();



        // init drawing area
        vis.svga = d3.select("#" + vis.parentElementa).append("svg")
            .attr("width", vis.widtha)
            .attr("height", vis.heighta );

        vis.x = d3.scaleLinear()
            .domain([0,100])
            .range([0, vis.widtha]);

        vis.y = d3.scaleLinear()
            .domain([0,100])
            .range([0, vis.heighta]);

        vis.r = d3.scaleLinear()
            .domain([0,2026])
            .range([10, 30]);

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.displayData = [];

        // vis.filtered = vis.data.filter((d)=>
        //     {if (d.year == 2020) {return d};}
        // )

        vis.rollyear = d3.rollup(vis.data, v => v.length, d => d.year, d => d.injury);
        vis.roll = d3.rollup(vis.data, v => v.length, d => d.injury);


        vis.structure = [
            {name: "head", x: 50, y: 4, injuries: ["Concussion"], number: [vis.roll.get("Concussion")]},
            {name: "neck", x: 50, y: 13, injuries: ["Neck"], number: [vis.roll.get("Neck")]},
            {name: "chest/back", x: 50, y: 21, injuries: ["Chest", "Back"], number: [vis.roll.get("Chest"), vis.roll.get("Back")]},
            {name: "pec", x: 35, y: 21, injuries: ["Pectoral"], number: [vis.roll.get("Pectoral")]},
            {name: "shoulder", x: 75, y: 19, injuries: ["Shoulder"], number: [vis.roll.get("Shoulder")]},
            {name: "upperarm", x: 20, y: 30, injuries: ["Biceps", "Tricep"], number: [vis.roll.get("Biceps"), vis.roll.get("Tricep")]},
            {name: "elbow", x: 83, y: 35, injuries: ["Elbow"], number: [vis.roll.get("Elbow")]},
            {name: "forearm", x: 16, y: 40, injuries: ["Forearm"], number: [vis.roll.get("Forearm")]},
            {name: "rib", x: 65, y: 30, injuries: ["Rib"], number: [vis.roll.get("Rib")]},
            {name: "ab", x: 50, y: 36, injuries: ["Abdomen"], number: [vis.roll.get("Abdomen")]},
            {name: "oblique", x: 35, y: 36, injuries: ["Oblique"], number: [vis.roll.get("Oblique")]},
            {name: "wrist", x: 86, y: 48, injuries: ["Wrist"], number: [vis.roll.get("Wrist")]},
            {name: "hip", x: 67, y: 48, injuries: ["Hip"], number: [vis.roll.get("Hip")]},
            {name: "knee", x: 64, y: 70, injuries: ["Knee"], number: [vis.roll.get("Knee")]},
            {name: "groin", x: 50, y: 50, injuries: ["Groin"], number: [vis.roll.get("Groin")]},
            {name: "lowerleg", x: 37, y: 79, injuries: ["Shin", "Calf"], number: [vis.roll.get("Shin"), vis.roll.get("Calf")]},
            {name: "upperleg", x: 37, y: 60, injuries: ["Thigh", "Hamstring", "Quadricep"], number: [vis.roll.get("Thigh"), vis.roll.get("Hamstring"), vis.roll.get("Quadricep")]},
            {name: "ankle", x: 62, y: 91, injuries: ["Ankle", "Achilles"], number: [vis.roll.get("Ankle"), vis.roll.get("Achilles")]},
            {name: "hand", x: 12, y: 52, injuries: ["Hand", "Finger", "Thumb"], number: [vis.roll.get("Hand"), vis.roll.get("Finger"), vis.roll.get("Thumb")]},
            {name: "foot", x: 37, y: 97, injuries: ["Foot", "Toe", "Heel"], number: [vis.roll.get("Foot"), vis.roll.get("Toe"), vis.roll.get("Heel")]}
        ]

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.structure.forEach(row => {
            vis.svga.append("circle")
                .attr("cx", vis.x(row.x))
                .attr("cy", vis.y(row.y))
                .attr("r", vis.r(row.number.reduce(function(a, b){
                    return a + b;
                }, 0)))
                .attr("fill", "blue")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("opacity", 0.5)
                .attr("class", "bodybubble")
                .on("click", d => {
                    d3.select("#toprow").html(`<th scope="col">Year</th>`)
                    row.injuries.forEach(injury => {
                        d3.select("#toprow").append("th").text(injury);
                    })
                    d3.select("#toprow").append("th").text("Total")
                    for(let i = 2016; i < 2021; i++){
                        d3.select("#year" + i).html(`<th scope="row">${i}</th>`)
                        let acc = 0;
                        row.injuries.forEach(injury => {
                            d3.select("#year" + i).append("td").text(vis.rollyear.get(i).get(injury));
                            acc += vis.rollyear.get(i).get(injury)
                        })
                        d3.select("#year" + i).append("th").text(acc)
                    }
                });
        })
    }
}