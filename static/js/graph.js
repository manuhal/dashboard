queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(err, salaryData) {
    var ndx = crossfilter(salaryData);

    //convert salaryData to integer (when read from csv, it is )
    salaryData.forEach(function(d) {
        d.salary = parseInt(d.salary);
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
        .width(400)
        .height(300)
        // .margins({ top: 20, right: 50, bottom: 30, left: 50 })
        .margins({top: 10, right: 50, bottom: 30, left: 50})
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
    var dim = ndx.dimension(dc.pluck('sex'));

    // p is the accumulator, v is the data 

    function add_item(p, v) {
        p.count++;
        p.total += v.salary;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.salary;
            p.average = p.total / p.count;
        }
        return p;
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }

    var averageSalaryByGender = dim.group().reduce(add_item, remove_item, initialise);
    
    console.log(averageSalaryByGender.all());

    dc.barChart("#average-salary")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(averageSalaryByGender)
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(4);

}
