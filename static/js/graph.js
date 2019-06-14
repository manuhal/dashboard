queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(err, salaryData) {
    var ndx = crossfilter(salaryData);
    
    //convert salaryData to integer (when read from csv, it is )
    salaryData.forEach(function(d){
        return parseInt(d.salary);
    })


    showDisciplineSelector(ndx);
    showGenderBalance(ndx);
    showAverageSalary(ndx);

    dc.renderAll();
}


function showDisciplineSelector(ndx) {
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
        .xAxisLabel("Gender")
        .yAxisLabel("Total Person")
        // .yAxis().ticks(20);
        .yAxis().ticks(10);
}


function showAverageSalary(ndx) {
    var dim = ndx.dimension(dc.pluck("sex"));

    // p is the accumulator, v is the data 

    function addItem(p, v) {
        p.count++;
        p.total += v.salary;
        p.avg = p.total / p.count;
        return p;
    }

    function removeItem(p, v) {
        p.count--;
        if (p.count == 0) {
            p.count = 0;
            p.total = 0;
        }
        else {
            p.total -= v.salary;
            p.average = p.total / p.count;
        }
        return p;

    }

    function initialize() {
        //to initialize the p
        return { count: 0, total: 0, average: 0 };
    }

    var groupAvgSalaryByGender = dim.group().reduce(addItem, removeItem, initialize);

    dc.barChart("#average-salary")
        .width(500)
        .height(400)
        .margins({ top: 20, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(groupAvgSalaryByGender)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(1000)
        .x(d3.scale.ordinal)
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
        .yAxisLabel("Salary in $")
        .yAxis().ticks(5);  


}
