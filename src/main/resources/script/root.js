var $;
var layer;
var table;
var basePath;
var rowDataId;
// $(document).ready(function(){
//     //do something
// });
layui.use(['jquery', 'table', 'layer', 'upload'], function () {
    $ = layui.jquery;
    layer = layui.layer;
    table = layui.table;
    var data=connectRouter.selectConnect();
    //加载连接数据
    table.render({
        id: 'dataList',
        elem: '#dataList',
        height: 'full-70',
        data: JSON.parse(data),
        cols: [[
            {field: 'text', title: '名称', event: 'setSign'},
            {
                title: '主机', event: 'setSign',
                templet: function (data) {
                    if (data.type == '0') {
                        return data.rhost;
                    } else {
                        return data.shost;
                    }
                }
            },
            {field: 'rport', title: '端口', event: 'setSign'},
            {
                title: '类型', event: 'setSign',
                templet: function (data) {
                    if (data.isha == '0') {
                        return "单机";
                    } else {
                        return "集群";
                    }
                }
            },
            {
                title: 'SSH', event: 'setSign',
                templet: function (data) {
                    if (data.type == '0') {
                        return "关闭";
                    } else {
                        return "启用";
                    }
                }
            },
            {field: 'time', title: '时间', event: 'setSign'},
        ]],
        page: true,
        done: function (res) {
            var tbody = $('#tableDiv').find('.layui-table-body').find("table").find("tbody");
            //单击行选中数据
            tbody.children("tr").on('click', function () {
                var id = JSON.stringify(tbody.find(".layui-table-hover").data('index'));
                var obj = res.data[id];
                rowDataId = obj.id;
            });
            // //双击行连接服务
            tbody.children("tr").on('dblclick', function () {
                var id = JSON.stringify(tbody.find(".layui-table-hover").data('index'));
                var obj = res.data[id];
                openConnect(obj.id);
            });
            //悬浮提示信息
            /*
            tbody.children("tr").on('mouseover', function () {
                layer.tips('双击行连接服务...', this, {
                    tips: [3, '#3595CC'],
                    time: 1000
                });
            });
            */
            rowDataId = '';
        }
    });

});

/**
 * 添加连接数据
 */
function addConnectData() {
    layer.open({
        title: '新增连接',
        type: 2,
        area: ['455px', '445px'],
        fixed: true,
        maxmin: false,
        skin: 'layui-layer-lan',
        content: basePath + '/root/save'
    });
}

/**
 * 刷新连接列表
 */
function getConnectData() {
    layer.load(2);
    table.reload("dataList", {
        done: function (res) {
            var tbody = $('#tableDiv').find('.layui-table-body').find("table").find("tbody");
            //单击行选中数据
            tbody.children("tr").on('click', function () {
                var id = JSON.stringify(tbody.find(".layui-table-hover").data('index'));
                var obj = res.data[id];
                rowDataId = obj.id;
            });
            // //双击行连接服务
            tbody.children("tr").on('dblclick', function () {
                var id = JSON.stringify(tbody.find(".layui-table-hover").data('index'));
                var obj = res.data[id];
                openConnect(obj.id);
            });
            //悬浮提示信息
            /*
            tbody.children("tr").on('mouseover', function () {
                layer.tips('双击行连接服务...', this, {
                    tips: [3, '#3595CC'],
                    time: 1000
                });
            });
            */
            rowDataId = '';
            layer.closeAll('loading');
        }
    });
}

/**
 * 编辑连接数据
 */
function updConnectData() {
    if (rowDataId == "" || rowDataId == null) {
        layer.alert("请选择要操作的数据行！", {
            skin: 'layui-layer-lan',
            closeBtn: 0
        });
        return false;
    }
    layer.open({
        title: '编辑连接',
        type: 2,
        area: ['455px', '445px'],
        fixed: true,
        maxmin: false,
        skin: 'layui-layer-lan',
        content: basePath + '/root/edit?id=' + rowDataId
    });
}

/**
 * 删除连接数据
 */
function delConnectData() {
    if (rowDataId == "" || rowDataId == null) {
        layer.alert("请选择要操作的数据行！", {
            skin: 'layui-layer-lan',
            closeBtn: 0
        });
        return false;
    }
    var index = layer.confirm('确认删除连接？', {
        btn: ['确定', '取消'],
        skin: 'layui-layer-lan',
        closeBtn: 0
    }, function () {
        var xhr = $.ajax({
            type: "post",
            url: basePath + '/api/connect/delete',
            data: {"id": rowDataId},
            timeout: 10000,
            success: function (data) {
                layer.close(index);
                if (data.code == 200) {
                    getConnectData();
                } else {
                    layer.alert(data.msgs, {
                        skin: 'layui-layer-lan',
                        closeBtn: 0
                    });
                }
            },
            complete: function (XMLHttpRequest, status) {
                //请求完成后最终执行参数
                if (status == 'timeout') {
                    //超时,status还有success,error等值的情况
                    xhr.abort();
                    layer.alert("请求超时，请检查网络连接", {
                        skin: 'layui-layer-lan',
                        closeBtn: 0
                    });
                }
            }
        });
    });
}


/**
 * 操作连接数据
 */
function setConnectData() {
    if (rowDataId == "" || rowDataId == null) {
        layer.alert("请选择要操作的数据行！", {
            skin: 'layui-layer-lan',
            closeBtn: 0
        });
        return false;
    }
    layer.open({
        title: '操作连接',
        type: 2,
        area: ['455px', '500px'],
        fixed: true,
        maxmin: false,
        skin: 'layui-layer-lan',
        content: basePath + '/root/node?id=' + rowDataId
    });
}

/**
 * 导入连接
 */
function impConnectData() {
    layer.msg('正在导入连接数据操作');
}

/**
 * 导出连接
 */
function expConnectData() {
    var index = layer.confirm('确认导出连接？', {
        btn: ['确定', '取消'],
        skin: 'layui-layer-lan',
        closeBtn: 0
    }, function () {
        var xhr = $.ajax({
            type: "post",
            url: basePath + '/api/connect/export',
            timeout: 10000,
            success: function (data) {
                layer.close(index);
                layer.open({
                    content: data.msgs,
                    skin: 'layui-layer-lan',
                    closeBtn: 0
                });
            },
            complete: function (XMLHttpRequest, status) {
                //请求完成后最终执行参数
                if (status == 'timeout') {
                    //超时,status还有success,error等值的情况
                    xhr.abort();
                    layer.alert("请求超时，请检查网络连接", {
                        skin: 'layui-layer-lan',
                        closeBtn: 0
                    });
                }
            }
        });
    });
}


/**
 * 打开连接数据
 */
function openConnect(id) {
    var result = 0;
    layer.load(2);
    var xhr = $.ajax({
        type: "post",
        url: basePath + '/api/connect/create',
        timeout: 15000,
        data: {"id": id},
        async: false,
        success: function (data) {
            var imgObj = $(".status-message img");
            var msgObj = $(".status-message .conn");
            if (data.code != 200) {
                msgObj.removeClass("conn-ok");
                msgObj.addClass("conn-no").text(data.data);
                imgObj.attr("src", basePath + "/image/conn-no.png");
                layer.alert(data.msgs, {
                    skin: 'layui-layer-lan',
                    closeBtn: 0
                });
            } else {
                msgObj.removeClass("conn-no");
                msgObj.addClass("conn-ok").text(data.data);
                imgObj.attr("src", basePath + "/image/conn-ok.png");
                result = 1;
            }
            layer.closeAll('loading');
        },
        complete: function (XMLHttpRequest, status) {
            //请求完成后最终执行参数
            layer.closeAll('loading');
            if (status == 'timeout') {
                //超时,status还有success,error等值的情况
                xhr.abort();
                layer.alert("请求超时，请检查网络连接", {
                    skin: 'layui-layer-lan',
                    closeBtn: 0
                });
            }
        }
    });
    return result;
}


function closeConnect(id) {
    var result = 0;
    $.ajax({
        type: "post",
        url: basePath + '/api/connect/discon',
        data: {
            "id": id
        },
        async: false,
        success: function (data) {
            var imgObj = $(".status-message img");
            var msgObj = $(".status-message .conn");
            if (data.code == 200) {
                result = 1;
                msgObj.removeClass("conn-ok");
                msgObj.addClass("conn-no").text("未连接服务");
                imgObj.attr("src", basePath + "/image/conn-no.png");
            } else {
                msgObj.removeClass("conn-no");
                msgObj.addClass("conn-ok").text(data.data);
                imgObj.attr("src", basePath + "/image/conn-ok.png");
            }
        }
    });
    return result;
}





