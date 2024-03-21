/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.0, "KoPercent": 5.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "ListProcurmentDepartments"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateRequest"], "isController": false}, {"data": [1.0, 500, 1500, "CreateRequest"], "isController": false}, {"data": [0.5, 500, 1500, "ListProcurementProjects"], "isController": false}, {"data": [0.0, 500, 1500, "Procurement Homepage-2"], "isController": false}, {"data": [0.75, 500, 1500, "Procurement Homepage-1"], "isController": false}, {"data": [0.25, 500, 1500, "Procurement Homepage-0"], "isController": false}, {"data": [0.0, 500, 1500, "Procurement Homepage"], "isController": false}, {"data": [0.0, 500, 1500, "Procurement Homepage-5"], "isController": false}, {"data": [1.0, 500, 1500, "ListProcurementCategories"], "isController": false}, {"data": [0.5, 500, 1500, "Procurement Homepage-4"], "isController": false}, {"data": [0.0, 500, 1500, "Procurement Homepage-3"], "isController": false}, {"data": [1.0, 500, 1500, "ListUsersRequests"], "isController": false}, {"data": [0.0, 500, 1500, "Upload Image"], "isController": false}, {"data": [0.5, 500, 1500, "ListRequisitionStatus"], "isController": false}, {"data": [1.0, 500, 1500, "ListCurrency"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20, 1, 5.0, 1129.4500000000003, 214, 4362, 730.0, 2820.200000000001, 4287.5999999999985, 4362.0, 1.7226528854435832, 159.95841408268734, 41.90740067829458], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ListProcurmentDepartments", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 48.90269011699507, 2.209292256773399], "isController": false}, {"data": ["UpdateRequest", 1, 1, 100.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 4.8943467027559056, 9.5580093503937], "isController": false}, {"data": ["CreateRequest", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 6.517198350694445, 8.707682291666668], "isController": false}, {"data": ["ListProcurementProjects", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 86.78229244752623, 2.6895731821589206], "isController": false}, {"data": ["Procurement Homepage-2", 1, 0, 0.0, 1642.0, 1642, 1642, 1642.0, 1642.0, 1642.0, 1642.0, 0.6090133982947624, 172.04331132003654, 0.35803326735688185], "isController": false}, {"data": ["Procurement Homepage-1", 2, 0, 0.0, 482.0, 214, 750, 482.0, 750.0, 750.0, 750.0, 0.8561643835616438, 7.24144504494863, 0.5275778574486302], "isController": false}, {"data": ["Procurement Homepage-0", 2, 0, 0.0, 1556.5, 1149, 1964, 1556.5, 1964.0, 1964.0, 1964.0, 0.6299212598425197, 32.795275590551185, 0.37401574803149606], "isController": false}, {"data": ["Procurement Homepage", 1, 0, 0.0, 4362.0, 4362, 4362, 4362.0, 4362.0, 4362.0, 4362.0, 0.22925263640531865, 194.01713305249885, 0.9676073188904172], "isController": false}, {"data": ["Procurement Homepage-5", 1, 0, 0.0, 2336.0, 2336, 2336, 2336.0, 2336.0, 2336.0, 2336.0, 0.4280821917808219, 22.34346572666952, 0.5313402985873288], "isController": false}, {"data": ["ListProcurementCategories", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 2.1096731870229006, 4.256619751908397], "isController": false}, {"data": ["Procurement Homepage-4", 1, 0, 0.0, 1096.0, 1096, 1096, 1096.0, 1096.0, 1096.0, 1096.0, 0.9124087591240876, 77.16091183850364, 0.5488708941605839], "isController": false}, {"data": ["Procurement Homepage-3", 1, 0, 0.0, 1850.0, 1850, 1850, 1850.0, 1850.0, 1850.0, 1850.0, 0.5405405405405406, 193.62067145270268, 0.33044763513513514], "isController": false}, {"data": ["ListUsersRequests", 3, 0, 0.0, 326.3333333333333, 260, 394, 325.0, 394.0, 394.0, 394.0, 0.45955882352941174, 1.3544419232536766, 0.9972067440257354], "isController": false}, {"data": ["Upload Image", 1, 0, 0.0, 2874.0, 2874, 2874, 2874.0, 2874.0, 2874.0, 2874.0, 0.3479471120389701, 0.1773714770354906, 158.95780325765483], "isController": false}, {"data": ["ListRequisitionStatus", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 1.1223591549295775, 2.3299955985915495], "isController": false}, {"data": ["ListCurrency", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 2.5178840361445785, 6.655528363453815], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 100.0, 5.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["UpdateRequest", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
