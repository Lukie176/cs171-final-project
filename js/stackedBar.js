
/*
 *  StackedBar - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class StackedBar {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;
		this.displayData = data;

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

		vis.margin = {top: 40, right: 100, bottom: 40, left: 60};
		vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
		vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

		// init drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append('g')
			.attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

		// Visualization title
		vis.svg.append('g')
			.attr('class', 'title bar-title')
			.append('text')
			.attr('transform', `translate(${vis.width / 2}, 5)`)
			.attr('text-anchor', 'middle')
			.text('Prevalence of Injuries by Year');
		vis.svg
			.append('text')
			.attr('class', 'title bar-title')
			.attr('transform', `translate(${(vis.width  - vis.margin.right) / 2}, ${vis.height + 40})`)
			.attr('text-anchor', 'middle')
			.text('Year');
		vis.svg
			.append('text')
			.attr('class', 'title bar-title')
			.attr('text-anchor', 'middle')
			.attr('transform', `translate(-40, ${vis.height / 2}) rotate(270)`)
			.text('Appearances on Injury Report');
		// Scales and axes
		vis.x = d3.scaleBand()
			.domain(vis.years)
			.range([0, vis.width - vis.margin.right])
			.padding(0.1);
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
		vis.xAxis = d3.axisBottom()
			.scale(vis.x);
		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0, " + vis.height + ")")
		vis.svg.append("g")
			.attr("class", "y-axis axis")
		vis.legendGroup = vis.svg.append("g")
			.attr("class", "legend")
			.attr("transform", "translate(" + (vis.width - 2 * vis.margin.right + 50) + ",0)")

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;
		let filteredData = [];
		vis.usedCats = new Set();

		// Initialize data structure
		vis.years.forEach(year => {
			let temp = {"year": year};
			vis.categories.forEach(category => temp[category] = 0)
			filteredData.push(temp);
		})

		vis.displayData.forEach(d => {
			filteredData[d.year - 2016][d.injury]++;
		})

		if (vis.displayData.length === vis.data.length){
			filteredData.forEach(yearData => {
				vis.categories.forEach(category => {
					if (yearData[category] < 55 && category !== "Other") {
						yearData["Other"] += yearData[category]
						yearData[category] = 0
					}
					else {
						vis.usedCats.add(category)
					}
				})
			})
		} else {
			vis.usedCats.add(vis.selection)
		}

		vis.usedCats = Array.from(vis.usedCats).sort()

		vis.stackData = d3.stack()
			.keys(vis.categories)(filteredData)
		if (vis.displayData.length === vis.data.length) {
			vis.color.domain(vis.usedCats);
		}

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.y.domain([0, Math.ceil(d3.max(vis.stackData[vis.stackData.length - 1], d => d[1]) / 100.0) * 100])


		vis.categories.forEach((cat, i) => {
			let bar = vis.svg.selectAll(".bar-" + cat)
				.data(vis.stackData[i], (d) => d.data.year + "-" + cat);
			bar.transition()
				.attr("x", d => vis.x(d.data.year))
				.attr("y", d => vis.y(d[1]))
				.attr("height", d => vis.y(d[0]) - vis.y(d[1]));
			bar.enter().append('rect')
				.attr("class", d => "bar bar-" + cat)
				.attr("x", d => vis.x(d.data.year))
				.attr("y", d => vis.y(d[1]))
				.attr("height", d => vis.y(d[0]) - vis.y([d[1]]))
				.attr("width", vis.x.bandwidth)
				.attr("fill", vis.color(cat))
				.on("mouseover", (event, d) => {
					vis.tooltip
						.style("display", null)
						.style("opacity",1)
						.attr("transform", `translate( ${vis.x(d.data.year) + vis.x.bandwidth() / 2 - 50} , ${vis.y(d[1]) - 40} )`)
						.select("#text1").text("Type: " + cat)
					vis.tooltip.select("#text2").text("Injuries: " + (d[1] - d[0]));
				})
				.on("mouseout", () => {
					vis.tooltip
						.style("display", "none")
						.style("opacity",0);
				})
				// .on("mouseover", (event, d) => {
				// 	vis.tooltip.style("display", null)
				// })
				// .on("mouseout", function () {
				// 	vis.tooltip.style("display", "none");
				// })
				// .on("mousemove", (event, d) => {
				// 	let xPosition = event.pageX - 100;
				// 	let yPosition = event.pageY - 260;
				// 	vis.tooltip.style("opacity",1)
				// 	vis.tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
				// 	vis.tooltip.select("#text1").text("Type: " + cat)
				// 	vis.tooltip.select("#text2").text("Injuries: " + (d[1] - d[0]));
				// });
		})

		// Add one dot in the legend for each name.
		let catCircs = vis.legendGroup.selectAll(".mydots")
			.data(vis.usedCats, d => d)
		catCircs.enter().append("circle")
			.attr("class", "mydots")
			.attr("cx", 100)
			.attr("r", 7)
			.merge(catCircs)
			.attr("fill", (d) => vis.color(d))
			.attr("cy", (d, i) => 100 + 25 * vis.usedCats.length - i * 25)
		catCircs.exit().remove();

		// Add one dot in the legend for each name.
		let catLables = vis.legendGroup.selectAll(".mylabels")
			.data(vis.usedCats)
		catLables.enter().append("text")
			.attr("class", "mylabels")
			.attr("x", 120)
			.merge(catLables)
			.attr("y", (d, i) => 100 + 25 * vis.usedCats.length - i * 25)
			.attr("fill", d => vis.color(d))
			.text(d => d)
			.attr("text-anchor", "left")
			.style("alignment-baseline", "middle")
		catLables.exit().remove();

		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);

		// Prep the tooltip bits, initial display is hidden
		vis.tooltip = vis.svg.append("g")
			.attr("class", "tooltip")
			.style("opacity", 0)

		vis.tooltip.append("rect")
			.attr("width", 100)
			.attr("height", 40)
			.attr("fill", "white")
			.style("opacity", 0.5);

		vis.tooltip.append("text")
			.attr("id", "text1")
			.attr("x", 50)
			.attr("dy", "1.2em")
			.style("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("font-weight", "bold")
		vis.tooltip.append("text")
			.attr("id", "text2")
			.attr("x", 50)
			.attr("dy", "2.4em")
			.style("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("font-weight", "bold")
	}

	selectionChanged(selection) {
		let vis = this;
		vis.selection = selection;
		// Filter data accordingly without changing the original data
		vis.displayData = vis.data.filter(d => (vis.selection === "All") ? true : d.injury === vis.selection);
		// Update the visualization
		vis.wrangleData();
	}
}

