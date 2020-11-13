/**
 * @JSName index.js
 * @Description index
 * @Author 朱福盛
 * @Date 2020/11/13 11:18
 * @Version 1.0
 */
let googleMap = new Cesium.UrlTemplateImageryProvider({
    url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
    minimumLevel: 1,
    maximumLevel: 20
});
let viewer = new Cesium.Viewer("cesiumContainer", {
    //是否创建动画小器件，左下角仪表
    animation: false,
    //是否显示全屏按钮
    fullscreenButton: false,
    //放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
    geocoder: false,
    //房子图标，是否显示Home按钮，视角返回初始位置
    homeButton: true,
    //是否显示信息框
    infoBox: false,
    //经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)，是否显示3D/2D选择器
    sceneModePicker: true,
    //是否显示时间轴
    timeline: false,
    //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
    sceneMode: Cesium.SceneMode.SCENE3D,
    //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    scene3DOnly: false,
    //是否显示图层选择器，可选择要显示的地图服务和地形服务
    baseLayerPicker: false,
    // 加载本地瓦片
    imageryProvider: googleMap,
    //问号图标，右上角导航帮助按钮，显示默认的地图控制帮助
    navigationHelpButton: false,
    //虚拟现实
    vrButton: false,
    //是否显示选取指示器组件
    selectionIndicator: false,
    //设置背景透明
    orderIndependentTranslucency:false
});
//隐藏版本信息
viewer._cesiumWidget._creditContainer.style.display = "none";
//显示帧率
viewer.scene.debugShowFramesPerSecond = true;
//是否显示星空
viewer.scene.skyBox.show = true;
//是否显示太阳
viewer.scene.sun.show = true;
//是否显示有月亮
viewer.scene.moon.show = true;
//是否隐藏大气圈
viewer.scene.skyAtmosphere.show = true;

let shapedata = new Shapefile({
    shp: "/3d-data/china_counties/counties_china.shp",
    dbf: "/3d-data/china_counties/counties_china.dbf"
}, function(data) {
    console.log(data);
    var jsonData = data.geojson;
    // var count = jsonData.features.length;
    var count = 30;
    var lastEntity = null;
    for (var i = 0; i <= count; i++) {
        var ifeature = jsonData.features[i];
        if(ifeature.hasOwnProperty("geometry")){
            ifeature.geometry.coordinates[0].pop();
            lastEntity = viewer.entities.add({
                id: i+1,
                name: ifeature.hasOwnProperty("properties") && ifeature.properties.hasOwnProperty("FIRST_NAME")
                    ? ifeature.properties.FIRST_NAME : "noname_"+i,
                show: true,
                polygon: {
                    show: true,
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(ifeature.geometry.coordinates[0].flat()),
                    material: Cesium.Color.fromRandom({
                        minimumRed : 0.85,
                        minimumGreen : 0.85,
                        minimumBlue : 0.85
                    }).withAlpha(0.8),
                    extrudedHeight:Math.ceil(Math.random()*10000),
                    outline:true, //必须设置height，否则ouline无法显示
                    outlineColor:Cesium.Color.BLACK.withAlpha(1),
                    outlineWidth:2
                }
            });
        }
    }
    viewer.zoomTo(lastEntity);
});