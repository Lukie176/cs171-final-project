// Variable for the visualization instance
let stackedBar,
    positionChart,
    bodyInjury,
    lineChart;


d3.csv("data/dataset0.csv")
    .then(data => {
        data.forEach(d => {
            d.year = +d.year
            d.week = +d.week
        })
        initMainPage(data)
    });

function initMainPage(data) {

    // log data
    console.log(data)

    // Instantiate visualization object (bike-sharing stations in Boston)
    stackedBar = new StackedBar("stacked-bar", data);
    positionChart = new PositionChart("positionDiv", data);
    bodyInjury = new bodyparts ("body", "bodyInfo", data);
    lineChart = new LineChart("line-chart", data);

    new fullpage('#fullpage', {
        allowScrolling: false,
        navigation: true,
        navigationPosition: "right",
        loopBottom: true
    });
}

function changedFilter() {
    let selection = document.getElementById("injury").value;
    stackedBar.selectionChanged(selection);
}

