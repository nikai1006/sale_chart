$(function () {


    /**
     * fresh Chart Date
     *
     * @param startDate
     * @param endDate
     */
    function freshChartDate(startDate, endDate, date, flush) {
        showLoading();
        $.ajax({
            type: 'POST',
            url: '/count/chart/',
            data: {
                'startDate': startDate,
                'endDate': endDate,
                'date': date,
                'flush': flush
            },
            dataType: "json",
            success: function (data) {
                hideLoading();
                if (data.code == 0) {
                    // lineChartInit(data.data);
                    pieChartInit(data.data);
                    barChartInit(data.data);
                    large_scale_area(data.data)
                } else {
                    layer.open({
                        title: system_tips,
                        btn: [system_ok],
                        content: (data.msg || job_dashboard_report_loaddata_fail),
                        icon: '2'
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideLoading();
                layer.open({
                    title: system_tips,
                    btn: [system_ok],
                    content: ('系统异常:' + textStatus),
                    icon: '2'
                });
            }
        });
    }


    /**
     * pie Chart Init
     */
    function pieChartInit(data) {
        var option = {
            title: {
                text: job_dashboard_group_report,
                /*subtext: 'subtext',*/
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ["带电话正常", "无电话登录",
                    "带电话异常", "无电话异常"]
            },
            series: [
                {
                    //name: '分布比例',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {
                            name: "带电话正常",
                            // value: data..triggerCountSucTotal
                            value: data.phone_normal_total
                        },
                        {
                            name: "无电话登录",
                            value: data.non_phone_normal
                        },
                        {
                            name: "带电话异常",
                            value: data.phone_err
                        },
                        {
                            name: "无电话异常",
                            value: data.non_phone_err_total
                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color: ['#00A65A', '#c23632', '#0d10f3', '#e1f32b']
        };
        var pieChart = echarts.init(document.getElementById('pieChart'));
        pieChart.setOption(option);
    }

    function barChartInit(data) {
        var option = {
            title: {
                text: '异常走势图',
                subtext: data.subject
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ["新增异常数", "登录数"]
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {show: false, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: data.hours
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '新增异常数',
                    type: 'bar',
                    data: data.nums,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name: '登录数',
                    type: 'bar',
                    data: data.vists,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ],
            color: ['#c23632', '#00A65A']
        };

        var barChart = echarts.init(document.getElementById('lineChart'));
        barChart.setOption(option);
    }

    function large_scale_area(data) {

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

        var barChart = echarts.init(document.getElementById('commitItems'));
        barChart.setOption(option);

    }

    function initFileInput() {
        $("#file-4").fileinput({
            // 'theme': 'fas',
            // 'showUpload': false,
            // 'showPreview': false,
            // 'allowedFileExtensions': ['jpg', 'png', 'gif', 'xlsx'],
            // 'elErrorContainer': '#errorBlock',
            // 'uploadUrl': "/chart/upload/",
            // 'maxFileCount': 5

            language: 'zh', //设置语言
            uploadUrl: "/chart/upload/", //上传的地址
            allowedFileExtensions: ['jpg', 'png', 'gif', 'xlsx'],//接收的文件后缀
            // showUpload: false, //是否显示上传按钮
            // showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        });
    }

    $('#flushBtn').click(function () {
        var date = $('#date').val()
        var start = date + " 00:00:00";
        var end = date + " 23:59:59";
        freshStaticsData(start, end, date, true);
        freshChartDate(start, end, date, true);
    });
    $('#date').change(function () {
        var date = $('#date').val()
        var start = date + " 00:00:00";
        var end = date + " 23:59:59";
        freshStaticsData(start, end, date, false);
        freshChartDate(start, end, date, false);
    });

    $('#importBtn').click(function () {
        $('#addModal').modal({backdrop: false, keyboard: true}).modal('show');
    });


    // 隐藏弹框
    $("#addModal").on('hide.bs.modal', function () {
         $("#file-4").fileinput('clear');
        $("#addModal .form .form-group").removeClass("has-error");
    });

    // freshChartDate($('#date').val() + " 00:00:00", $('#date').val() + " 23:59:59", $('#date').val(), false);

    // initFileInput();

});


/**
 * 显示加载等待
 */
function showLoading() {
    document.getElementById("over").style.display = "block";
    document.getElementById("layout").style.display = "block";
}

/**
 * 隐藏加载
 */
function hideLoading() {
    document.getElementById("over").style.display = "none";
    document.getElementById("layout").style.display = "none";
}