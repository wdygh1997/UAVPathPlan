/*-----------------------------------------------初始化-----------------------------------------------------------*/
var ctrlBtn = document.getElementById('ctrlBtn');//绘制凸多边形地块按钮
var crtStepBtn = document.getElementById('crtStepBtn');//生成航线按钮
var spaceInp = document.getElementById('spaceInp');//飞行间隔输入框
var stepRotate = document.getElementById('stepRotate');//旋转角度拖动条
var stepRotateBox = document.getElementById('stepRotateBox');//旋转角度输入框
var stepRotateValue = document.getElementById('stepRotateValue');//旋转角度值显示
var sendDBBtn = document.getElementById('sendDBBtn');
var sendUAVBtn = document.getElementById('sendUAVBtn');
var crtBestBtn = document.getElementById('crtBestBtn');
var showPreBtn = document.getElementById('showPreBtn');
var send2DBBtn = document.getElementById('send2DBBtn');
var show2PreBtn = document.getElementById('show2PreBtn');
var show0PreBtn = document.getElementById('show0PreBtn');

var map = new BMap.Map("app");//创建地图实例

var state = {//状态标志，用来区分两种不同的页面
    isReadyDrawPolygon: false,
    isReadyShowPre: false
};
var polygon = {//凸多边形地块
    layer: new BMap.Polygon([], {
        strokeColor: '#f00',//边界颜色
        fillColor: '#f5f5f5',//地块颜色
        strokeWeight: 2,//边界宽度
        fillOpacity: 0.5,//地块透明度
        strokeOpacity: 1//边界透明度
    }),
    latlngs: []//凸多边形顶点的经纬度坐标
};

var polyline = {//航线折线
    layer: new BMap.Polyline([], {
        strokeColor: '#0f0',//折线颜色
        strokeWeight: 3,//折线宽度
        strokeOpacity: 1//折线透明度
    }),
    latlngs: []//折线中的点的经纬度坐标
};

map.centerAndZoom("西安", 15);//设置地图中心位置和缩放级别
map.enableScrollWheelZoom(true);//启动鼠标滚轮缩放操作

/*----------------------------------------------事件监听器--------------------------------------------------------*/

//添加旋转角度拖动条事件监听器，可以实时旋转，input改成change就是不实时旋转
stepRotate.addEventListener('input', function() {
    stepRotateValue.innerText = this.value;
    renderPolyline();
});

//添加绘制多边形地块/清除事件监听器
ctrlBtn.addEventListener('click', function() {
    state.isReadyDrawPolygon = !state.isReadyDrawPolygon;
    if (state.isReadyDrawPolygon) {
        this.innerText = "清除";//把按钮文字改成清除
        map.addOverlay(polygon.layer);//绘制覆盖物，画凸多边形地块
        map.addOverlay(polyline.layer);//绘制覆盖物，画航线折线
    } else {
        this.innerText = "绘制凸多边形地块";//把按钮文字改成绘制凸多边形地块
        initDraw();//清空地图上的凸多边形
    }
});

show0PreBtn.addEventListener('click', function () {
    state.isReadyShowPre = !state.isReadyShowPre;
    if(state.isReadyShowPre){
        this.innerText = "清除";
        map.addOverlay(polygon.layer);//绘制覆盖物，画凸多边形地块
        map.addOverlay(polyline.layer);//绘制覆盖物，画航线折线
        showPreBtn.className = show2PreBtn.className = "";
    }else{
        this.innerText = "显示上次规划";
        map.clearOverlays();//清除地图上的覆盖物
        polygon.latlngs = polyline.latlngs = [];//将经纬度集合数组清空
        polygon.layer.setPath(polygon.latlngs);//将polygon.latlngs中的点set到多边形polygon.layer对象中
        polyline.layer.setPath(polyline.latlngs);//将polyline.latlngs中的点set到折线polyline.layer对象中
        showPreBtn.className = show2PreBtn.className = "hide";
    }
});

//显示上次规划边界按钮事件监听器
show2PreBtn.addEventListener('click', function () {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var json=JSON.parse(ajax.responseText);
            for(var i=0; i<json.length; i++)
            {
                var point = {};
                point.lng = json[i].lng;
                point.lat = json[i].lat;
                polygon.latlngs.push(point);
            }
            //alert(JSON.stringify(polygon.latlngs));
            polygon.layer.setPath(polygon.latlngs);
            map.addOverlay(polygon.layer);
        }
    };
    ajax.open("get", "ShowPre2");
    ajax.send(null);
});

//显示上次规划路径按钮事件监听器
showPreBtn.addEventListener('click', function () {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var json=JSON.parse(ajax.responseText);
            for(var i=0; i<json.length; i++)
            {
                var point = {};
                point.lng = json[i].lng;
                point.lat = json[i].lat;
                polyline.latlngs.push(point);
            }
            //alert(JSON.stringify(polyline.latlngs));
            polyline.layer.setPath(polyline.latlngs);
            map.addOverlay(polyline.layer);
        }
    };
    ajax.open("get", "ShowPre");
    ajax.send(null);
});

//生成航线按钮事件监听器
crtStepBtn.addEventListener('click', function() {
    renderPolyline();//绘制航线折线
});

//发送路径到数据库按钮事件监听器
sendDBBtn.addEventListener('click', function () {
    var json = JSON.stringify(polyline.latlngs);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            alert(ajax.responseText);
        }
    };
    ajax.open("post", "WebToDB");
    ajax.setRequestHeader("Content-type","application/json");
    ajax.send(json);
    sendUAVBtn.className = "";
});

//发送边界到数据库按钮事件监听器
send2DBBtn.addEventListener('click', function () {
    var json = JSON.stringify(polygon.latlngs);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            alert(ajax.responseText);
        }
    };
    ajax.open("post", "WebToDB2");
    ajax.setRequestHeader("Content-type","application/json");
    ajax.send(json);
});

//发送到无人机按钮事件监听器
sendUAVBtn.addEventListener('click', function () {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            alert(ajax.responseText);
        }
    };
    ajax.open("get", "DBToPort");
    ajax.send(null);
});

//地图上点击事件监听器
map.addEventListener('click', function(e) {
    if (state.isReadyDrawPolygon) {
        if(polygon.latlngs.length >= 3)
        {
            var result = BMapLib.GeoUtils.isPointInPolygon(e.point, polygon.layer);
            var ans1 = (polygon.latlngs[1].lng-polygon.latlngs[0].lng)*(polygon.latlngs[2].lat-polygon.latlngs[0].lat)-(polygon.latlngs[2].lng-polygon.latlngs[0].lng)*(polygon.latlngs[1].lat-polygon.latlngs[0].lat);
            var len = polygon.latlngs.length;
            var ans2 = (polygon.latlngs[len-1].lng-polygon.latlngs[len-2].lng)*(e.point.lat-polygon.latlngs[len-2].lat)-(e.point.lng-polygon.latlngs[len-2].lng)*(polygon.latlngs[len-1].lat-polygon.latlngs[len-2].lat);
            if(result === true)
            {
                alert("所绘为凹多边形，请绘制凸多边形！");
            }
            else if((ans1>0 && ans2<0) || (ans1<0 && ans2>0))
            {
                alert("所绘图形不是多边形，请重新绘制！")
            }
            else
            {
                polygon.latlngs.push(e.point);//将该点加入polygon的经纬度集合数组中
                polygon.layer.setPath(polygon.latlngs);//将polygon.latlngs中的点set到多边形polygon.layer对象中
            }
        }
        else
        {
            polygon.latlngs.push(e.point);//将该点加入polygon的经纬度集合数组中
            polygon.layer.setPath(polygon.latlngs);//将polygon.latlngs中的点set到多边形polygon.layer对象中
        }
    }
    if (polygon.latlngs.length > 2) {//如果经纬度集合中的点超过两个
        crtBestBtn.className = send2DBBtn.className = sendDBBtn.className = crtStepBtn.className = spaceInp.className = stepRotateBox.className = "";//把生成航线/输入飞行间隔/角度拖动条的class都不再设置为hide，这样可以显示出来
    }
});

//生成最优航线
crtBestBtn.addEventListener('click', function(){
    var len=360;
    var Rotate;
    for(var i=0; i<polygon.latlngs.length; i++)
    {
        var x1=i, x2=(i+1)%polygon.latlngs.length;
        for(var j=0; j<polygon.latlngs.length; j++)
        {
            if(j!==x1 && j!==x2)
            {
                var curLen = getLen(polygon.latlngs[x1], polygon.latlngs[x2], polygon.latlngs[j]);
                if(curLen < len)
                {
                    len = curLen;
                    var p1 = latlng2Px(polygon.latlngs[x1]);
                    var p2 = latlng2Px(polygon.latlngs[x2]);
                    var curRotate = Math.atan2(p1.y-p2.y, p1.x-p2.x)*180/Math.PI;
                    if(p1.x>=p2.x && p1.y>=p2.y)
                        Rotate = curRotate;
                    if(p1.x>=p2.x && p1.y<p2.y)
                        Rotate = curRotate+180;
                    if(p1.x<p2.x && p1.y>=p2.y)
                        Rotate = curRotate;
                    if(p1.x<p2.x && p1.y<p2.y)
                        Rotate = curRotate+180;
                }
            }
        }
    }
    stepRotate.value = Rotate;
    stepRotateValue.innerText = String(Rotate);
    renderPolyline()
});

/*-----------------------------------------事件监听器中调用的方法--------------------------------------------------*/
//计算点p3到直线p1p2的距离
function getLen(p1, p2, p3)
{
    var len;
    //如果是条竖着的线
    if(p1.lng===p2.lng)
        len=Math.abs(p3.lng-p1.lng);
    else
    {
        var A=(p1.lat-p2.lat)/(p1.lng-p2.lng);
        var B=p1.lat-A*p1.lng;
        len=Math.abs((A*p3.lng+B-p3.lat)/Math.sqrt(A*A+1))
    }
    return len;
}

//清空地图上的多边形，重新绘图，在清除事件监听器中调用
function initDraw() {
    map.clearOverlays();//清除地图上的覆盖物
    polygon.latlngs = polyline.latlngs = [];//将经纬度集合数组清空
    polygon.layer.setPath(polygon.latlngs);//将polygon.latlngs中的点set到多边形polygon.layer对象中
    polyline.layer.setPath(polyline.latlngs);//将polyline.latlngs中的点set到折线polyline.layer对象中
    crtBestBtn.className = sendUAVBtn.className = send2DBBtn.className = sendDBBtn.className = crtStepBtn.className = spaceInp.className = stepRotateBox.className = "hide";//把生成航线/输入飞行间隔/角度拖动条的class都设置为hide，这样可以隐藏出来
}

//绘制航线折线，在生成航线按钮事件监听器中调用
function renderPolyline() {
    polyline.latlngs = /*cpRPA.*/setOptions({
        polygon: polygon.latlngs,//凸多边形顶点经纬度坐标
        rotate: parseFloat(stepRotate.value) || 0,//旋转角度
        space: parseFloat(spaceInp.value) || 5//飞行间隔
    });
    polyline.layer.setPath(polyline.latlngs)//将polyline.latlngs中的点set到折线polyline.layer对象中
}

/*--------------------事件监听器中调用绘制航线函数renderPolyline()的依赖函数setOptions()---------------------------*/

//设置输入参数，返回航线点集
function setOptions(opt) {
    var bounds = createPolygonBounds(opt.polygon);//计算凸多边形外接矩阵四个顶角
    var rPolygon = createRotatePolygon(opt.polygon, bounds, -opt.rotate || 0);//计算旋转凸多边形顶角，rotate为旋转角度值，如果没有输入，默认设置为0，前面的负号是因为这个凸多边形是要倒着旋转角度把它转正
    var rBounds = createPolygonBounds(rPolygon);//计算旋转凸多边形外接矩阵四个顶角
    var latline = createLats(rBounds, opt.space || 5);//计算水平线的数目和两条水平线之间的距离，space是飞行间隔的值，如果没有输入，默认设置为5
    var line = [];//水平线
    var polyline = [];//折线
    var check = null;
    for (var i = 0; i < latline.len; i++) {//遍历每一条水平线
        line = [];
        for (var j = 0; j < rPolygon.length; j++) {//遍历每一个多边形顶点
            var nt = si(j + 1, rPolygon.length);//j+1必须在[0,rPolygon.length]之间，若在0左边，j+1 += rPolygon.length，若在rPolygon.length右边，j+1 -= rPolygon.length
            check = createInlinePoint([rPolygon[j].lng, rPolygon[j].lat], [rPolygon[nt].lng, rPolygon[nt].lat], rBounds.northLat - i * latline.lat);//算出凸多边形边框与水平线的交点
            if (check) {
                line.push(check)//将交点加入水平线集合中
            }
        }
        if (line.length < 2) {//去掉只有一个交点的水平线
            continue;
        }
        if (line[0][0] === line[1][0]) {//去掉两个交点重合的水平线
            continue;
        }
        if (i % 2) {//如果该水平线的序号是偶数，则反方向向polyline送入点坐标
            polyline.push({
                lat: line[0][1],
                lng: Math.max(line[0][0], line[1][0])
            }, {
                lat: line[0][1],
                lng: Math.min(line[0][0], line[1][0])
            })
        } else {//否则正方向向polyline送入点坐标
            polyline.push({
                lat: line[0][1],
                lng: Math.min(line[0][0], line[1][0])
            }, {
                lat: line[0][1],
                lng: Math.max(line[0][0], line[1][0])
            })
        }
    }
    return createRotatePolygon(polyline, bounds, opt.rotate || 0)//计算旋转凸多边形顶角，把原来倒着转正的凸多边形在转回去
}

/*--------------------------------------------setOptions()的依赖函数----------------------------------------------*/

//防止索引溢出，在setOptions中调用
//i必须在[0,l]之间，如果在0左边，那就i+=l，如果在l右边，那就i-=l
function si(i, l) {
    if (i > l - 1) {
        return i - l;
    }
    if (i < 0) {
        return l + i;
    }
    return i;
}

//求出直线p1，p2上纬度为y的点的坐标[x,y]，即凸多边形边框与水平线的交点，在setOptions中调用
//p1，p2是两个点，y是要求的点的纬度
function createInlinePoint(p1, p2, y) {
    var s = p1[1] - p2[1];
    var x;
    if (s) {//如果两点纵坐标不相同
        x = (y - p1[1]) * (p1[0] - p2[0]) / s + p1[0]//x为要求的点的横坐标，即经度值
    } else {//如果两点的纵坐标相同
        return false;
    }
    //判断x是否在p1,p2在x轴的投影里，不是的话返回false
    if (x > p1[0] && x > p2[0]) {
        return false;
    }
    if (x < p1[0] && x < p2[0]) {
        return false;
    }
    return [x, y]
}

//计算多边形外接矩形四个顶角的经纬度坐标和最北端的纬度值，在setOptions中调用
//输入的latlngs为[{lat,lng}]的经纬度数组，数组每个元素为凸多边形的顶点集合
//返回的center为外接矩形的中心；返回的northLat为最大维度即最北端纬度
function createPolygonBounds(latlngs) {
    var lats = [];//纬度
    var lngs = [];//经度
    for (var i = 0; i < latlngs.length; i++) {
        lats.push(latlngs[i].lat);
        lngs.push(latlngs[i].lng);
    }
    var maxLat = Math.max.apply(Math, lats);//最大纬度
    var maxLng = Math.max.apply(Math, lngs);//最大经度
    var minLat = Math.min.apply(Math, lats);//最小纬度
    var minLng = Math.min.apply(Math, lngs);//最小经度
    return {
        center: {//外接矩形的中心
            lat: (maxLat + minLat) / 2,
            lng: (maxLng + minLng) / 2
        },
        latlngs: [{//最大纬度最小经度为西北
            lat: maxLat,
            lng: minLng
        }, {//最大纬度最大经度为东北
            lat: maxLat,
            lng: maxLng
        }, {//最小纬度最大经度为东南
            lat: minLat,
            lng: maxLng
        }, {//最小纬度最小经度为西南
            lat: minLat,
            lng: minLng
        }],
        northLat: maxLat//最大维度最北端
    }
}

//计算凸多边形顶角的经纬度
function createRotatePolygon(latlngs, bounds, rotate) {
    var res = [],
        a, b;
    var c = latlng2Px(bounds.center);//经纬度转换为像素
    for (var i = 0; i < latlngs.length; i++) {
        a = latlng2Px(latlngs[i]);//经纬度转换为像素
        b = transform(a.x, a.y, c.x, c.y, rotate);//旋转变换四个顶角坐标
        res.push(px2Latlng(b));//将变换后的像素坐标转换为经纬度，存入res中
    }
    return res;//返回变换后的四个顶角的经纬度
}

//在计算凸多边形顶角createRotatePolygon中调用
//(x,y)变换前坐标，绕(tx,ty)为中心点旋转deg度
function transform(x, y, tx, ty, deg) {
    var deg = deg * Math.PI / 180;
    return [
        ((x - tx) * Math.cos(deg) - (y - ty) * Math.sin(deg)) + tx,
        ((x - tx) * Math.sin(deg) + (y - ty) * Math.cos(deg)) + ty
    ]
}

//经纬到像素
function latlng2Px(latlng) {
    return map.pointToPixel(new BMap.Point(latlng.lng, latlng.lat))
}

//像素到经纬
function px2Latlng(px) {
    return map.pixelToPoint(new BMap.Pixel(px[0], px[1]))
}

//计算水平线之间的纬度差，bounds是外接矩形边界的四个角的经纬度坐标，space是飞行间隔
function createLats(bounds, space) {
    var nw = bounds.latlngs[0];//西北
    var sw = bounds.latlngs[3];//西南

    //计算西北和西南之间的距离，即凸多边形外接矩形的高度
    var distance = Distance({
        lat: nw.lat,
        lng: nw.lng
    }, {
        lat: sw.lat,
        lng: sw.lng
    });
    var steps = parseInt(distance / space / 2);//praseInt字符串转十进制整数，steps是飞行的折返步数
    var lats = (nw.lat - sw.lat) / steps;//lats是每次折返的纬度差
    return {
        len: steps,//折返步数，也即水平线数
        lat: lats//每条水平线之间的纬度差
    }
}

//获得p1和p2两点坐标之间的距离，在createLats函数中调用，主要是用来计算凸多边形外接矩形的高度
function Distance(p1, p2) {
    return map.getDistance(new BMap.Point(p1.lng, p1.lat), new BMap.Point(p2.lng, p2.lat))
}