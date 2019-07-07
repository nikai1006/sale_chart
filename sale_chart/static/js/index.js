$(function () {


    /**
     * fresh Chart Date
     *
     * @param startDate
     * @param endDate
     */
    function freshChartDate() {
        showLoading();
        var province = $('#province').val();
        var city = $('#city').val();
        var date = $('#date').val();
        $.ajax({
            type: 'POST',
            url: '/chart/data/',
            data: {
                'province': province,
                'city': city,
                'date': date
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
        var pieChart = echarts.init(document.getElementById('pieChart'));
        pieChart.setOption(data);
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
                        $('#city').append("<option value=\"all\" selected='selected'>all</option>");
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
        freshChartDate();
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