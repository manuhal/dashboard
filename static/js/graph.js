queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(err, salaryData) {
    var ndx = crossfilter(salaryData);
    
    
    showDisciplineSelector(ndx);
    showGenderBalance(ndx);
    
    dc.renderAll();
}


function showDisciplineSelector(ndx){
    var dim = ndx.dimension(dc.pluck("discipline"));
    var group = dim.group();
    
    dc.selectMenu("#discipline-selector")
        .dimension(dim)
        .group(group);
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
        // .elasticY(true) //this will cause the Y coor value adjust automatically, so the graph doesn't move. we don't want that in this case
        .xAxisLabel("GENDER")
        .yAxisLabel("TOTAL")
        // .yAxis().ticks(20);
        .yAxis().ticks(10);

}
