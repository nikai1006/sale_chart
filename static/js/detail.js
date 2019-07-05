$(function () {

    var system_tips = '系统提示';
    var system_ok = '确定';
    var fail = '失败';

    var rangesConf = {};
    rangesConf[daterangepicker_ranges_recent_hour] = [moment().subtract(1,
        'hours'), moment()];
    rangesConf[daterangepicker_ranges_today] = [moment().startOf('day'),
        moment().endOf('day')];
    rangesConf[daterangepicker_ranges_yesterday] = [moment().subtract(1,
        'days').startOf('day'), moment().subtract(1, 'days').endOf('day')];
    rangesConf[daterangepicker_ranges_this_month] = [moment().startOf('month'),
        moment().endOf('month')];
    rangesConf[daterangepicker_ranges_last_month] = [moment().subtract(1,
        'months').startOf('month'),
        moment().subtract(1, 'months').endOf('month')];
    rangesConf[daterangepicker_ranges_recent_week] = [moment().subtract(1,
        'weeks').startOf('day'), moment().endOf('day')];
    rangesConf[daterangepicker_ranges_recent_month] = [moment().subtract(1,
        'months').startOf('day'), moment().endOf('day')];

    $('#filterTime').daterangepicker({
        autoApply: false,
        singleDatePicker: false,
        showDropdowns: false,        // 是否显示年月选择条件
        timePicker: true, 			// 是否显示小时和分钟选择条件
        timePickerIncrement: 10, 	// 时间的增量，单位为分钟
        timePicker24Hour: true,
        opens: 'left', //日期选择框的弹出位置
        ranges: rangesConf,
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss',
            separator: ' - ',
            customRangeLabel: daterangepicker_custom_name,
            applyLabel: system_ok,
            cancelLabel: system_cancel,
            fromLabel: daterangepicker_custom_starttime,
            toLabel: daterangepicker_custom_endtime,
            daysOfWeek: daterangepicker_custom_daysofweek.split(','),        // '日', '一', '二', '三', '四', '五', '六'
            monthNames: daterangepicker_custom_monthnames.split(','),        // '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
            firstDay: 1
        },
        startDate: rangesConf[daterangepicker_ranges_today][0],
        endDate: rangesConf[daterangepicker_ranges_today][1]
    }, function (start, end, label) {
        var startDate = start.format('YYYY-MM-DD HH:mm:ss');
        var endDate = end.format('YYYY-MM-DD HH:mm:ss');
        generateSelection(startDate, endDate)
        // freshChartDate(startDate, endDate)
    });


    // init date tables
    var tableView = $("#table-list").dataTable({
        "deferRender": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "/count/detail/data",
            type: "get",
            data: function (data) {
                // var fileter = $('#filterTime').val();
                // var fileters = fileter.split(" - ");
                date = $('#date').val()
                start = moment(new Date(date)).format("YYYY-MM-DD 00:00:00");
                end = moment(new Date(date)).format("YYYY-MM-DD 23:59:59");
                var obj = {};
                // obj.keyword = $('#keyword').val();
                obj.start = data.start;
                obj.length = data.length;
                obj.client_host = $('#host').val();
                obj.begin = start;
                obj.end = end;
                obj.flush = $("[name='my-checkbox']").val();
                return obj;
            },
            contentType: 'application/json;charset=UTF-8'

        },
        "searching": false,
        "ordering": false,
        // "scrollX": true,	// scroll x，close self-adaption
        "columns": [
            {"data": 'id', "width": '2%', "visible": true},
            {
                "data": 'id',
                "visible": false,
                "width": '10%'
            },
            {
                "data": 'err_time',
                "visible": true,
                "width": '5%',
                "render": function (data, type, row) {
                    return data ? moment(new Date(data)).format("YYYY-MM-DD HH:mm:ss")
                        : "";
                }
            },
            {
                "data": 'user_id',
                "visible": true,
                "width": '5%',
                "render": function (data, type, row) {
                    return data ? data : "无";
                }
            },
            {
                "data": 'open_time',
                "visible": true,
                "width": '5%',
                "render": function (data, type, row) {
                    return data ? moment(new Date(data)).format("YYYY-MM-DD HH:mm:ss")
                        : "无";
                }
            },
            {
                "data": 'close_time',
                "visible": true,
                "width": '5%',
                "render": function (data, type, row) {
                    return data ? moment(new Date(data)).format("YYYY-MM-DD HH:mm:ss")
                        : "无";
                }
            }
        ],
        "fnDrawCallback": function () {
            var api = this.api();
            var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
            api.column(0).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        },
        "language": {
            "sProcessing": dataTable_sProcessing,
            "sLengthMenu": dataTable_sLengthMenu,
            "sZeroRecords": dataTable_sZeroRecords,
            "sInfo": dataTable_sInfo,
            "sInfoEmpty": dataTable_sInfoEmpty,
            "sInfoFiltered": dataTable_sInfoFiltered,
            "sInfoPostFix": "",
            "sSearch": dataTable_sSearch,
            "sUrl": "",
            "sEmptyTable": dataTable_sEmptyTable,
            "sLoadingRecords": dataTable_sLoadingRecords,
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": dataTable_sFirst,
                "sPrevious": dataTable_sPrevious,
                "sNext": dataTable_sNext,
                "sLast": dataTable_sLast
            },
            "oAria": {
                "sSortAscending": dataTable_sSortAscending,
                "sSortDescending": dataTable_sSortDescending
            }
        }
    });


    /*
    * 获取host列表
    * */
    function generateSelectionDefault() {
        // var fileter = $('#filterTime').val();
        // var splits = fileter.split(" - ");
        date = $('#date').val()
        start = moment(new Date(date)).format("YYYY-MM-DD 00:00:00");
        end = moment(new Date(date)).format("YYYY-MM-DD 23:59:59");
        generateSelection(start, end)
    }

    function generateSelection(start, end) {

        $.ajax({
            type: 'POST',
            url: '/count/detail/host',
            data: {
                'start': start,
                'end': end
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    var hostList = data.data;
                    if (hostList.length > 0) {
                        $('#host').empty();
                        for (i in hostList) {
                            var host = hostList[i];
                            console.log(host);
                            $('#host').append("<option value='" + host + "'>" + host + "</option>");
                        }
                        var flush = $("[name='my-checkbox']").val();
                        freshChartDate(start, end, hostList[0], flush);
                        tableView.fnDraw();
                    }
                } else {
                    layer.open({
                        title: system_tips,
                        btn: [system_ok],
                        content: (data.msg || fail),
                        icon: '2'
                    });
                }

            }

        })
    }

    function freshChartDateDefault() {
        // var fileter = $('#filterTime').val();
        // var splits = fileter.split(" - ");
        var date = $('#date').val()
        var start = moment(new Date(date)).format("YYYY-MM-DD 00:00:00");
        var end = moment(new Date(date)).format("YYYY-MM-DD 23:59:59");
        var host = $('#host').val();
        var flush = $("[name='my-checkbox']").val();
        freshChartDate(start, end, host, flush);
    }

    $("[name='my-checkbox']").bootstrapSwitch({
        onText: "ON",      // 设置ON文本  
        offText: "OFF",    // 设置OFF文本  
        onColor: "success",// 设置ON文本颜色     (info/success/warning/danger/primary)  
        offColor: "danger",  // 设置OFF文本颜色        (info/success/warning/danger/primary)  
        size: "normal",    // 设置控件大小,从小到大  (mini/small/normal/large)  
        // handleWidth: "35",//设置控件宽度
        // 当开关状态改变时触发  
        onSwitchChange: function (event, state) {
            $("[name='my-checkbox']").val(state);
        }
    });

    /**
     * fresh Chart Date
     *
     * @param startDate
     * @param endDate
     */
    function freshChartDate(start, end, host, flush) {
        $.ajax({
            type: 'POST',
            url: '/count/detail/statistic',
            data: {
                'host': host,
                'start': start,
                'end': end,
                'flush': flush
            },
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    drawPieChart(data.data, 'burn-chart');
                    // drawPieChart(data.data.story, 'story-chart');
                    // drawPieChart(data.data.bug, 'bug-chart');

                } else {
                    layer.open({
                        title: system_tips,
                        btn: [system_ok],
                        content: (data.msg || fail),
                        icon: '2'
                    });
                }
            }
        });
    }

    /**
     * 画饼
     * @param data 数据
     * @param id 元素id
     */
    function drawPieChart(data, id) {

        var option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '50%'];
                }
            },
            title: {
                left: 'center',
                text: '分钟密度图',
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.minutes
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name: '异常密度',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    },
                    data: data.minute_counts
                }
            ]
        };

        var pieChart = echarts.init(document.getElementById(id));
        pieChart.setOption(option);
    }

    generateSelectionDefault();
    // freshChartDateDefault();
    // search btn
    $('#searchBtn').on('click', function () {
        tableView.fnDraw();
    });

    $('#host').change(function () {
        freshChartDateDefault();
        tableView.fnDraw();
    });

    $('#date').change(function () {
        generateSelectionDefault();
    });
    // $('#filterTime').change(function () {
    //     tableView.fnDraw()
    // })
});

// Com Alert by Tec theme
var ComAlertTec = {
    html: function () {
        var html =
            '<div class="modal fade" id="ComAlertTec" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
            +
            '<div class="modal-dialog">' +
            '<div class="modal-content-tec">' +
            '<div class="modal-body"><div class="alert" style="color:#fff;"></div></div>'
            +
            '<div class="modal-footer">' +
            '<div class="text-center" >' +
            '<button type="button" class="btn btn-info ok" data-dismiss="modal" >'
            + system_ok + '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        return html;
    },
    show: function (msg, callback) {
        // dom init
        if ($('#ComAlertTec').length == 0) {
            $('body').append(ComAlertTec.html());
        }

        // init com alert
        $('#ComAlertTec .alert').html(msg);
        $('#ComAlertTec').modal('show');

        $('#ComAlertTec .ok').click(function () {
            $('#ComAlertTec').modal('hide');
            if (typeof callback == 'function') {
                callback();
            }
        });
    }
};