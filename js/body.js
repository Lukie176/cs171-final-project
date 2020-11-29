
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
            "Multiple", "Neck", "Oblique", "Other", "Pectoral", "Quadricep", "Rib", "Shin", "Shoulder",
            "Thigh", "Thumb", "Toe", "Tricep", "Wrist"];
        this.years = [2016, 2017, 2018, 2019, 2020];

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;

        vis.margina = {top: 40, right: 100, bottom: 40, left: 40};
        vis.widtha = $("#" + vis.parentElementa).width() - vis.margina.left - vis.margina.right;
        vis.heighta = $("#" + vis.parentElementa).height() - vis.margina.top - vis.margina.bottom;

        vis.marginb = {top: 40, right: 100, bottom: 40, left: 40};
        vis.widthb = $("#" + vis.parentElementb).width() - vis.marginb.left - vis.marginb.right;
        vis.heightb = $("#" + vis.parentElementb).height() - vis.marginb.top - vis.marginb.bottom;

        // init drawing area
        vis.svga = d3.select("#" + vis.parentElementa).append("svg")
            .attr("width", vis.widtha + vis.margina.left + vis.margina.right)
            .attr("height", vis.heighta + vis.margina.top + vis.margina.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margina.left}, ${vis.margina.top})`);

        vis.svgb = d3.select("#" + vis.parentElementb).append("svg")
            .attr("width", vis.widthb + vis.marginb.left + vis.marginb.right)
            .attr("height", vis.heightb + vis.marginb.top + vis.marginb.bottom)
            .append('g')
            .attr('transform', `translate (${vis.marginb.left}, ${vis.marginb.top})`);

        vis.head = vis.svga.append("circle")
            .attr("cx", 85)
            .attr("cy", 30)
            .attr("r", 20)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.neck = vis.svga.append("circle")
            .attr("cx", 85)
            .attr("cy", 85)
            .attr("r", 20)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.chest = vis.svga.append("circle")
            .attr("cx", 85)
            .attr("cy", 140)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.pec = vis.svga.append("circle")
            .attr("cx", 50)
            .attr("cy", 140)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.shoulder = vis.svga.append("circle")
            .attr("cx", 150)
            .attr("cy", 120)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.bicep = vis.svga.append("circle")
            .attr("cx", 10)
            .attr("cy", 180)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.rib = vis.svga.append("circle")
            .attr("cx", 120)
            .attr("cy", 180)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.elbow = vis.svga.append("circle")
            .attr("cx", 170)
            .attr("cy", 220)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.forearm = vis.svga.append("circle")
            .attr("cx", 3)
            .attr("cy", 245)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.wrist = vis.svga.append("circle")
            .attr("cx", 175)
            .attr("cy", 305)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.hand = vis.svga.append("circle")
            .attr("cx", -8)
            .attr("cy", 335)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.groin = vis.svga.append("circle")
            .attr("cx", 85)
            .attr("cy", 320)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.hip = vis.svga.append("circle")
            .attr("cx", 130)
            .attr("cy", 305)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.thigh = vis.svga.append("circle")
            .attr("cx", 50)
            .attr("cy", 375)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.knee = vis.svga.append("circle")
            .attr("cx", 120)
            .attr("cy", 450)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.shin = vis.svga.append("circle")
            .attr("cx", 120)
            .attr("cy", 520)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.calf = vis.svga.append("circle")
            .attr("cx", 50)
            .attr("cy", 500)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.shin = vis.svga.append("circle")
            .attr("cx", 115)
            .attr("cy", 580)
            .attr("r", 18)
            .attr("fill", "blue")
            .attr("opacity", 0.5);

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.displayData = [];
        vis.usedCats = new Set();

        vis.years.forEach(year => {
            let temp = {"year": year};
            vis.categories.forEach(category => temp[category] = 0)
            vis.displayData.push(temp);
        })

        vis.data.forEach(d => {
            vis.displayData[d.year - 2016][d.injury]++;
        })

        vis.displayData.forEach(yearData => {
            vis.categories.forEach(category => {
                if (yearData[category] < 100) {
                    yearData["Other"] += yearData[category]
                    yearData[category] = 0
                }
                else {
                    vis.usedCats.add(category)
                }
            })
        })

        vis.usedCats = Array.from(vis.usedCats)
        console.log(vis.usedCats)
        console.log(vis.displayData);

        vis.stackData = d3.stack()
            .keys(vis.categories)(vis.displayData)

        console.log(vis.stackData)

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;
    }
}