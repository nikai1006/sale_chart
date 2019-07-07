$(function () {


    /**
     * fresh Chart Date
     *
     * @param startDate
     * @param endDate
     */
    function freshChartDate() {
        showLoading();
        $.ajax({
            type: 'POST',
            url: '/chart/data/',
            data: {
                'province': $('#province').val(),
                'city': $('#city').val(),
                'date': $('#date').val()
            },
            dataType: "json",
            success: function (data) {
                hideLoading();
                if (data.code == 0) {
                    // lineChartInit(data.data);
                    // pieChartInit(data.data);
                    barChartInit(JSON.parse(data.data));
                    // large_scale_area(data.data)
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

    function barChartInit(option) {

        var barChart = echarts.init(document.getElementById('lineChart'));
        barChart.setOption(option);
    }

    function large_scale_area(data) {


        var barChart = echarts.init(document.getElementById('commitItems'));
        barChart.setOption(data);

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

    function flushCity(province) {
        $.ajax({
            type: 'GET',
            url: '/chart/city/',
            data: {
                'province': province,
            },
            // dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    var cities = data.data;
                    if (cities.length > 0) {
                        $('#city').empty();
                        $('#city').append("<option value=\"all\">all</option>");
                        for (i in cities) {
                            var city = cities[i];
                            console.log(city);
                            $('#city').append("<option value='" + city + "'>" + city + "</option>");
                        }
                        var flush = $("[name='my-checkbox']").val();
                        freshChartDate(start, end, cities[0], flush);
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

        });

    }

    $('#province').change(function () {
        var province = $('#province').val();
        if (province == 'all') {
            console.log(province)
            $('#city').empty();//清空列表
            $('#city').append("<option value=\"all\">all</option>");

        } else {
            flushCity(province);
        }
    });

    $('#city').change(function () {
        var city = $('#city').val();
        if (city == 'all') {
            $('#date').empty();//清空列表
            $('#date').append("<option value=\"all\">all</option>");
            for (i = 1; i < 7; i++) {
                $('#date').append("<option value=\"" + i + "\">" + i + "月</option>");

            }
        } else {
            $('#date').empty();//清空列表
            $('#date').append("<option value=\"all\">all</option>");
        }
        freshChartDate()
    });

    $('#date').change(function () {
        var date = $('#date').val()
        var start = date + " 00:00:00";
        var end = date + " 23:59:59";
        // freshStaticsData(start, end, date, false);
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

    freshChartDate();

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