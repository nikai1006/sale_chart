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
                    // console.log(data.data)
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
        // console.log(JSON.stringify())
        barChart.setOption(option);
    }

    function large_scale_area(data) {


        var barChart = echarts.init(document.getElementById('commitItems'));
        barChart.setOption(data);

    }


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
                        freshChartDate();
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
            $('#date').append("<option value=\"all\" selected=\"selected\">all</option>");
            for (i = 1; i < 7; i++) {
                $('#date').append("<option value=\"" + i + "\">" + i + "月</option>");

            }
        } else {
            $('#date').empty();//清空列表
            $('#date').append("<option value=\"all\" selected=\"selected\">all</option>");
        }
        freshChartDate()
    });

    $('#date').change(function () {
        freshChartDate();
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