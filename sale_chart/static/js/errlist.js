$(function () {

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
    });
    // init date tables
    var tableView = $("#table-list").dataTable({
        "deferRender": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "/count/err/list",
            type: "get",
            data: function (param) {
                var obj = {};
                obj.count = $('#count').val()
                obj.start = param.start;
                obj.length = param.length;
                obj.filter_time = $('#filterTime').val();
                // var splits = $('#filterTime').val().split(" - ");
                obj.date = $('#date').val();
                obj.begin = moment(new Date(obj.date)).format("YYYY-MM-DD 00:00:00");
                obj.end = moment(new Date(obj.date)).format("YYYY-MM-DD 23:59:59");
                obj.flush = $("[name='my-checkbox']").val();
                return obj;
            },
            contentType: 'application/json;charset=UTF-8'

        },
        "searching": false,
        "ordering": false,
        // "scrollX": true,	// scroll x，close self-adaption
        "columns": [
            {"data": 'ip', "width": '2%', "visible": true},
            {
                data: 'ip',
                visible: true,
            },
            {
                "data": 'user_id',
                "visible": true,
                // "width": '5%',
                "render": function (data, type, row) {
                    return data ? data : "无";
                }
            },
            {
                data: 'num',
                visible: true,
                // width: '5%',
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


    $("#count").change(function () {
        tableView.fnDraw();
    });

    $('#filterTime').change(function () {
        tableView.fnDraw();
    });

    $('#date').change(function () {
        tableView.fnDraw();
    });


});