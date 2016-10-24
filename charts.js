function drawVisualization() {
    var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1zRWmhJSyulz6cltrTIQgvkjpVtLphh0RiY3F_gwgrFw/edit?usp=sharing');

    query.setQuery('SELECT A, B');

    query.send(function (response) {
        if (response.isError()) {
            alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
            return;
        }
        var data = response.getDataTable();

        // create a NumberFilter control.
        var filter = new google.visualization.ControlWrapper({
            controlType: 'ChartRangeFilter',
            containerId: 'control_div',
                'options': {
                // Filter by the date axis.
                'filterColumnIndex': 0,
                    'ui': {
                    'chartType': 'LineChart',
                        'chartOptions': {
                        'chartArea': {
                            'height': '35%'
                        },
                            'hAxis': {
                            'baselineColor': 'none'
                        }
                    },

                    // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
                    'minRangeSize': 86400000
                }
            },
            // Initial range: 2012-02-09 to 2012-03-20.
            'state': {
                'range': {
                    'start': new Date('2015, 9, 5'),
                        'end': new Date('2015, 9, 6')
                }
            }
        });

        // create a Table visualization
        var table = new google.visualization.ChartWrapper({
            chartType: 'LineChart',
            containerId: 'table_div',

            options: {
                height: '400',
                width: 'auto',
                vAxis: {
                    title: 'Temprature',
                    format: '## F'
                },
                hAxis: {
                    title: 'Date',
                    format: 'MM/dd h:mma',
                    gridlines: {
                        count: -1, 
                        units: {
                          days: {format: ['MMM dd']},
                          hours: {format: ['ha']}
                        }
                      },
                    minorGridlines: {
                        units: {
                            hours: {format: ['hh:mm:ss a', 'ha']},
                            minutes: {format: ['hh:mm a Z', ':mm']}
                        }
                    }
                }

                }
            }
        );

        // Create the dashboard.
        var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard')).
        // Configure the string filter to affect the table contents
        bind([filter], [table]).
        // Draw the dashboard
        draw(data);
    });
    
    var query2 = new google.visualization.Query('http://docs.google.com/spreadsheet/tq?key=1zRWmhJSyulz6cltrTIQgvkjpVtLphh0RiY3F_gwgrFw&gid=1569309500');
    //query.setQuery('SELECT A');
    query2.send(function (response) {
        if (response.isError()) {
            alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
            return;
        }

        var data = response.getDataTable();

        var gauge = new google.visualization.ChartWrapper({
            chartType: 'Gauge',
            containerId: 'gauge_div',
            dataTable: data,
            options: {
                greenFrom: 68, greenTo: 74,
                yellowFrom:74, yellowTo: 78,
                redFrom: 78, redTo: 100,
                minorTicks: 5
            }
        });
        
        gauge.draw();
        
    });
}

google.load('visualization', '1', {
    'packages': ['controls']
});
google.setOnLoadCallback(drawVisualization);