// Variable for the visualization instance
let stackedBar,
    positionChart,
    bodyInjury,
    lineChart,
    barVis,
    mapVis;


d3.csv("data/dataset0.csv")
    .then(data => {
        data.forEach(d => {
            d.year = +d.year
            d.week = +d.week
        })
        initMainPage(data)
    });

function initMainPage(data) {
    // Instantiate visualization object (bike-sharing stations in Boston)
    stackedBar = new StackedBar("stacked-bar", data);
    positionChart = new PositionChart("positionDiv", data);
    bodyInjury = new bodyparts ("body", "bodyInfo", data);
    lineChart = new LineChart("pos-line-chart", data);
    barVis = new BarVis("pos-bar-chart", data);

    new fullpage('#fullpage', {
        allowScrolling: false,
        navigation: true,
        navigationPosition: "right",
        loopBottom: true
    });
}

d3.json("data/us-states.json").then(json => {
    d3.csv("data/nflData.csv").then(data => {
        mapVis = new MapVis("mapVis", data, json);
    })
})

function changedFilter() {
    let selection = document.getElementById("injury").value;
    stackedBar.selectionChanged(selection);
}