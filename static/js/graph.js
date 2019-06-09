queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(err, salaryData) {
    var ndx = crossfilter(salaryData);
    showGenderBalance(ndx);
    dc.renderAll();
}


function showGenderBalance(ndx) {
    var dim = ndx.dimension(dc.pluck("sex"));
    var group = dim.group();

    dc.barChart("#gender-balance")
        .width(500)
        .height(400)
        .margins({ top: 20, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("GENDER")
        .yAxisLabel("TOTAL")
        .yAxis().ticks(10);

}
