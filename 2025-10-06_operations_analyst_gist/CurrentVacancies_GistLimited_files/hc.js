  var hc = (function() {

      var bar = function(id, params) {
        var enableLegend = (Boolean(params.legend) || Boolean(params.showLegend));
        var yAxisTitle = (params.yAxis && params.yAxis.title && params.yAxis.title.text) ? params.yAxis.title.text : ''; 
		var xAxisReversed = (params.xAxis && params.xAxis.reversed) ? params.xAxis.reversed : false;
        var chartTitle = (params.title && params.title.text) ? params.title.text : ''; 

        Highcharts.chart(id, Highcharts.merge({
			exporting : {
				enabled: false
			},
			credits: {
				enabled: false
			},
            chart: {
                type: 'bar'
            },
            title: {
                text: chartTitle
            },
            subtitle: {
                text: null
            },
            xAxis: {
				categories: params.xAxis.categories,
                labels: {
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
				reversed: xAxisReversed
            },
            yAxis: {
                min: 0,
                max: (params.yAxis && params.yAxis.max) ? params.yAxis.max : null,
                title: {
                    text: yAxisTitle,
                }
            },
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			tooltip: {
				enabled: false
			},
            legend: {
                enabled: enableLegend
            },
            series: [params.series]
        }, params));
      };

	  var column = function(id, params) {
		var enableLegend = (Boolean(params.legend) || Boolean(params.showLegend));
		var yAxisTitle = (params.yAxis && params.yAxis.title && params.yAxis.title.text) ? params.yAxis.title.text : '';
		var chartTitle = (params.title && params.title.text) ? params.title.text : '';

        Highcharts.chart(id, Highcharts.merge({
			exporting : {
				enabled: false
			},
			credits: {
				enabled: false
			},
            chart: {
                type: 'column'
            },
            title: {
                text: chartTitle
            },
            subtitle: {
                text: null
            },
            xAxis: {
				categories: params.xAxis.categories,
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisTitle,
                }
            },
			tooltip: {
				enabled: false
			},
            legend: {
                enabled: enableLegend
            },
            series: [params.series]
        }, params));
      };

      var pie = function(id, params) {
        var enableLegend = (Boolean(params.legend) || Boolean(params.showLegend));
        var chartTitle = (params.title && params.title.text) ? params.title.text : ''; 

        Highcharts.chart(id, Highcharts.merge({
			exporting : {
				enabled: false
			},
			credits: {
				enabled: false
			},
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: null
            },
			tooltip: {
				enabled: false,
			},
            plotOptions: {
                pie: {
                    innerSize: (params.plotOptions && params.plotOptions.innerSize) ? params.plotOptions.innerSize : null,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.percentage:.2f} %'
                    }
                }
            },
            legend: {
                enabled: enableLegend
            },
            series: [params.series]
        }, params));
      };

      var stacked = function(id, params) {
        Highcharts.chart(id, Highcharts.merge({
			exporting : {
				enabled: false
			},
			credits: {
				enabled: false
			},
            chart: {
                type: 'bar'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
			tooltip: {
				enabled: false
			},
            series: []
        }, params));
      };

	  var line = function(id, params) {        

        if( params.yaxis && params.yaxis.hasCustomLabel )
        {
            var customLabels = params.yaxis.labels;
            var ctr = 0;
        }

        Highcharts.chart(id, Highcharts.merge({
			exporting : {
				enabled: false
			},
			credits: {
				enabled: false
			},
			title: {
				text: params.title.text,
			},
			subtitle: {
				text: null
			},
			yAxis: {
                max: (params.yaxis && params.yaxis.max) ? params.yaxis.max : null,
                min: (params?.yaxis?.min ?? null),
				title: {
					text: null
				},
                labels: {
                    formatter: function () 
                    {
                        if( customLabels )
                        {
                            var labelText = customLabels[ctr];
                            ctr++;

                            return labelText;    
                        }
                        else
                        {
                            return this.value;
                        }
                    }            
                }
			},
			xAxis: {
				categories: params.xAxis.categories
			},
            legend: {
                enabled: params.legend
            },
			series: params.series
		}, params));
	  };

	  var polar = function(id, params) {
		var enableLegend = (Boolean(params.legend) || Boolean(params.showLegend));
		params.series.forEach(function(part, index, s) {
			if (part.fillOpacity)
			{
				part.fillOpacity = Number(part.fillOpacity);
			}
		});

        Highcharts.chart(id, Highcharts.merge({		
			exporting : {
				enabled: false
			},
			credits: {
				enabled: false
			},
			chart: {
				polar: true,
				type: 'area'
			},
			title: {
				text: params.title.text
			},
			subtitle: {
				text: null
			},
			xAxis: {
				categories: params.xAxis.categories,
				tickmarkPlacement: 'on',
				lineWidth: 0,
				marker: {
					enabled: false
				},
			},
			yAxis: {
				ceiling: parseInt(params.xAxis.ceiling),
				gridLineInterpolation: 'polygon',
				lineWidth: 1,
				tickInterval: 1,
				labels: {
					style: {
						fontWeight: "bold"
					},
					plotLines: [{
						zIndex: 1
					}],
				}
			},
			plotOptions: {
				series: {
            		fillOpacity: 0.5,
					marker: {
						enabled: false
					},
					lineWidth: 0
				}
            },
			legend: {
				enabled: enableLegend
			},
			series: [params.series]
		}, params));
	  };

      var funnel = function(id, params) {

       //TO DO: Adjust necessary changes upon finalizing the highcharts params / options format
        Highcharts.chart(id, {
            chart: {
                type: 'funnel'
            },
            title: {
                text: params.title.text,
            },
            credits: {
                enabled: false
            },
            exporting : {
                enabled: false
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
						useHTML: true
                    },
                    center: ['40%', '50%'],
                    width: '70%',
                    neckWidth: '25%',
                }
            },
           series: [{
           		name: params.series.name,
                data: params.data
            }],
            lang: {
                noData: params.lang.noData,
            },
            noData: {
                style: {
                    color: '#6c757d',
                    fontSize: '16px'
                }
            }
        });
      };

      return {
        bar: bar,
		column: column,
        pie: pie,
        stacked: stacked,
        line: line,
		polar: polar,
        funnel: funnel
      }

  })();
