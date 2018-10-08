/** D3 engine flag */
var ENGINE_D3 = "d3";

/** Class to encapsulate charts creation */
function ChartsFactory() {
  function createLabel(container, mainText, secondaryText) {
    $("#"+container).append("<div class='col-md-12'><h1>"+mainText+"<small>"+secondaryText+"</small></h1></div>");
  }

  function createBarChart(container, data, bType) {
    var ctitle = data.title || "";
    var xAxisTitle = data.xAxisTitle || "";
    var yAxisTitle = data.yAxisTitle || "";
    var cats = data.categories || [];
    var colValues = data.series[0].values;
    var chartType = bType || "column";

    var chartOptions = {
      title: {
        text: ctitle
      },
      xAxis: {
          categories: cats
      },
      yAxis: {
  	    title: {
        	text: yAxisTitle
        }
      },

      series: [{
          type: chartType,
          colorByPoint: false,
          data: colValues,
          showInLegend: false
      }]
    };

    var ret = Highcharts.chart(container, chartOptions);
    ret.reflow();

    return ret;

  }

  function createLineChart(container, data) {
    var ctitle = data.title || "";
    var xAxisTitle = data.xAxisTitle || "";
    var yAxisTitle = data.yAxisTitle || "";
    var cats = data.categories || [];
    var colValues = data.series[0].values;

    var chartOptions = {
      chart: {
        type: 'line'
      },
      legend: {
            enabled: false
        },
      title: {
        text: ctitle
      },
      xAxis: {
          categories: cats
      },
      yAxis: {
  	    title: {
        	text: yAxisTitle
        }
      },
      plotOptions: {
        line: {
            dataLabels: {
                enabled: false
            },
            enableMouseTracking: true
        }
    },
      series: [{
          name:"",
          data: colValues
      }]
    };

    var ret = Highcharts.chart(container, chartOptions);
    ret.reflow();

    return ret;

  }

  function createGauge(container, title, val, min, max, unit, starth, startw) {
    if (!Highcharts) return;

    var gaugeOptions = {
      chart: {
        type: 'solidgauge'
      },
      title: title,

      credits: {
        enabled: false
      },

      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },

      yAxis: {
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
            y: 16
        },
        min: min,
        max: max,
        title: {
            y: -70,
            text: title
        }
      },

      series: [{
        name: 's',
        data: [val],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
               '<span style="font-size:12px;color:silver">'+unit+'</span></div>'
        },
        tooltip: {
          valueSuffix: ' '+unit
        }
      }],

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };

    var ret = Highcharts.chart(container, gaugeOptions);
    ret.reflow();
    return ret;
  }

  function createBubbleChart(container, data, labelField) {
    var ctitle = data.title || "";
    var xAxisTitle = data.xAxisTitle || "";
    var yAxisTitle = data.yAxisTitle || "";
    var values = data.series[0].values;

    var bubbleOptions = {
      chart: {
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy'
      },

      legend: {
          enabled: false
      },

      title: {
          text: ctitle
      },

      xAxis: {
          gridLineWidth: 1,
          title: {
              text: xAxisTitle
          }
      },

      yAxis: {
          gridLineWidth: 1,
          title: {
              text: yAxisTitle
          }
      },
      plotOptions: {
          series: {
              dataLabels: {
                  enabled: true,
                  format: '{point.name}'
              }
          }
      },
      series: [{data: values}]
    };

    var ret = Highcharts.chart(container, bubbleOptions);
    ret.reflow();
    return ret;
  }

  function createScatterChart(container, data) {
    var ctitle = data.title || "";
    var xAxisTitle = data.xAxisTitle || "";
    var yAxisTitle = data.yAxisTitle || "";
    var values = data.series[0].values;

    var chartOptions = {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: ctitle
      },
      legend:false,
      xAxis: {
        title: {
            enabled: true,
            text: xAxisTitle
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
            text: yAxisTitle
        }
      },
      series: [{data:values}]
      };

      var ret = Highcharts.chart(container, chartOptions);
      ret.reflow();
      return ret;
    }

  //TODO: Place specific code from here
  function createChart(container, data, engine, options) {
    console.log("Must create a chart");

    if (options.height && options.width) {
      var width = options.width;
      var height = options.height;
    } else {
      var width = 960;
      var height = 500;
    }
    var radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.population; });

    var svg = d3.select("#"+container).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.age); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.age; });

    function type(d) {
      d.population = +d.population;
      return d;
    }
  }
}
