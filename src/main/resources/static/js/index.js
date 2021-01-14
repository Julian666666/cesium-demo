/**
 * @JSName index.js
 * @Description index
 * @Author 朱福盛
 * @Date 2020/11/13 11:18
 * @Version 1.0
 */

var viewer = new Cesium.Viewer("cesiumContainer");
var scene = viewer.scene;

var tileset = scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: "tile/tileset.json",
    })
);

tileset.readyPromise
    .then(function (tileset) {
        viewer.zoomTo(
            tileset,
            new Cesium.HeadingPitchRange(
                0.5,
                -0.2,
                tileset.boundingSphere.radius * 4.0
            )
        );
    })
    .otherwise(function (error) {
        console.log(error);
    });

tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE;

var selectedFeature;
var picking = false;

// Sandcastle.addToggleButton("Per-feature selection", false, function (
//     checked
// ) {
//     picking = checked;
//     if (!picking) {
//         unselectFeature(selectedFeature);
//     }
// });

function selectFeature(feature) {
    var element = feature.getProperty("element");
    setElementColor(element, Cesium.Color.YELLOW);
    selectedFeature = feature;
}

function unselectFeature(feature) {
    if (!Cesium.defined(feature)) {
        return;
    }
    var element = feature.getProperty("element");
    setElementColor(element, Cesium.Color.WHITE);
    if (feature === selectedFeature) {
        selectedFeature = undefined;
    }
}

var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction(function (movement) {
    if (!picking) {
        return;
    }

    var feature = scene.pick(movement.endPosition);

    unselectFeature(selectedFeature);

    if (feature instanceof Cesium.Cesium3DTileFeature) {
        selectFeature(feature);
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function(e){
    var feature = scene.pick(e.position);
    console.log(getElement(feature));
},Cesium.ScreenSpaceEventType.LEFT_CLICK);

// In this tileset every feature has an "element" property which is a global ID.
// This property is used to associate features across different tiles and LODs.
// Workaround until 3D Tiles has the concept of global batch ids: https://github.com/CesiumGS/3d-tiles/issues/265
var elementMap = {}; // Build a map of elements to features.
var hiddenElements = [
    112001,
    113180,
    131136,
    113167,
    71309,
    109652,
    111178,
    113156,
    113170,
    124846,
    114076,
    131122,
    113179,
    114325,
    131134,
    113164,
    113153,
    113179,
    109656,
    114095,
    114093,
    39225,
    39267,
    113149,
    113071,
    112003,
    39229,
    113160,
    39227,
    39234,
    113985,
    39230,
    112004,
    39223,

    123642,
    21489,
    107865,
    21337,
    21317,
    21372,
    131198,
    107838,
    104973,
    123643,
    123648,
    123346,
    107864,
    130715,
    103226,
    131157
];

function getElement(feature) {
    return parseInt(feature.getProperty("element"), 10);
}

function setElementColor(element, color) {
    var featuresToColor = elementMap[element];
    var length = featuresToColor.length;
    for (var i = 0; i < length; ++i) {
        var feature = featuresToColor[i];
        feature.color = Cesium.Color.clone(color, feature.color);
    }
}

function unloadFeature(feature) {
    unselectFeature(feature);
    var element = getElement(feature);
    var features = elementMap[element];
    var index = features.indexOf(feature);
    if (index > -1) {
        features.splice(index, 1);
    }
}

function loadFeature(feature) {
    var element = getElement(feature);
    var features = elementMap[element];
    if (!Cesium.defined(features)) {
        features = [];
        elementMap[element] = features;
    }
    features.push(feature);

    if (hiddenElements.indexOf(element) > -1) {
        feature.show = false;
    }
}

function processContentFeatures(content, callback) {
    var featuresLength = content.featuresLength;
    for (var i = 0; i < featuresLength; ++i) {
        var feature = content.getFeature(i);
        callback(feature);
    }
}

function processTileFeatures(tile, callback) {
    var content = tile.content;
    var innerContents = content.innerContents;
    if (Cesium.defined(innerContents)) {
        var length = innerContents.length;
        for (var i = 0; i < length; ++i) {
            processContentFeatures(innerContents[i], callback);
        }
    } else {
        processContentFeatures(content, callback);
    }
}

tileset.tileLoad.addEventListener(function (tile) {
    processTileFeatures(tile, loadFeature);
});

tileset.tileUnload.addEventListener(function (tile) {
    processTileFeatures(tile, unloadFeature);
});

// let googleMap = new Cesium.UrlTemplateImageryProvider({
//     // url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
//     url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
//     minimumLevel: 1,
//     maximumLevel: 20
// });
// var viewer = new Cesium.Viewer("cesiumContainer", {
//     // 加载本地瓦片
//     imageryProvider: googleMap,
// });
// viewer.clock.currentTime = new Cesium.JulianDate(2457522.154792);
//
// var tileset = new Cesium.Cesium3DTileset({
//     url:
//         "tile/tileset.json",
// });
//
// viewer.scene.primitives.add(tileset);
// viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0));
//
// var styles = [];
// function addStyle(name, style) {
//     styles.push({
//         name: name,
//         style: style,
//     });
// }
//
// addStyle("No style", {});
//
// addStyle("Color by building", {
//     color: {
//         conditions: [
//             ["${building_name} === 'building0'", "color('purple')"],
//             ["${building_name} === 'building1'", "color('red')"],
//             ["${building_name} === 'building2'", "color('orange')"],
//             ["true", "color('blue')"],
//         ],
//     },
// });
//
// addStyle("Color all doors", {
//     color: {
//         conditions: [
//             ["isExactClass('door')", "color('orange')"],
//             ["true", "color('white')"],
//         ],
//     },
// });
//
// addStyle("Color all features derived from door", {
//     color: {
//         conditions: [
//             ["isClass('door')", "color('orange')"],
//             ["true", "color('white')"],
//         ],
//     },
// });
//
// addStyle("Color features by class name", {
//     defines: {
//         suffix: "regExp('door(.*)').exec(getExactClassName())",
//     },
//     color: {
//         conditions: [
//             ["${suffix} === 'knob'", "color('yellow')"],
//             ["${suffix} === ''", "color('lime')"],
//             ["${suffix} === null", "color('gray')"],
//             ["true", "color('blue')"],
//         ],
//     },
// });
//
// addStyle("Style by height", {
//     color: {
//         conditions: [
//             ["${height} >= 10", "color('purple')"],
//             ["${height} >= 6", "color('red')"],
//             ["${height} >= 5", "color('orange')"],
//             ["true", "color('blue')"],
//         ],
//     },
// });
//
// function setStyle(style) {
//     return function () {
//         tileset.style = new Cesium.Cesium3DTileStyle(style);
//     };
// }
//
// var styleOptions = [];
// for (var i = 0; i < styles.length; ++i) {
//     var style = styles[i];
//     styleOptions.push({
//         text: style.name,
//         onselect: setStyle(style.style),
//     });
// }
//
// // Sandcastle.addToolbarMenu(styleOptions);
//
// var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
//
// // When a feature is left clicked, print its class name and properties
// handler.setInputAction(function (movement) {
//     var feature = viewer.scene.pick(movement.position);
//     if (!Cesium.defined(feature)) {
//         return;
//     }
//     console.log("Class: " + feature.getExactClassName());
//     console.log("Properties:");
//     var propertyNames = feature.getPropertyNames();
//     var length = propertyNames.length;
//     for (var i = 0; i < length; ++i) {
//         var name = propertyNames[i];
//         var value = feature.getProperty(name);
//         console.log("  " + name + ": " + value);
//     }
// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//
// // When a feature is middle clicked, hide it
// handler.setInputAction(function (movement) {
//     var feature = viewer.scene.pick(movement.position);
//     if (!Cesium.defined(feature)) {
//         return;
//     }
//     feature.show = false;
// }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);


// let viewer = new Cesium.Viewer("cesiumContainer", {
//     //是否创建动画小器件，左下角仪表
//     animation: false,
//     //是否显示全屏按钮
//     fullscreenButton: false,
//     //放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
//     geocoder: false,
//     //房子图标，是否显示Home按钮，视角返回初始位置
//     homeButton: true,
//     //是否显示信息框
//     infoBox: false,
//     //经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)，是否显示3D/2D选择器
//     sceneModePicker: true,
//     //是否显示时间轴
//     timeline: false,
//     //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
//     sceneMode: Cesium.SceneMode.SCENE3D,
//     //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
//     scene3DOnly: false,
//     //是否显示图层选择器，可选择要显示的地图服务和地形服务
//     baseLayerPicker: false,
//     // 加载本地瓦片
//     imageryProvider: googleMap,
//     //问号图标，右上角导航帮助按钮，显示默认的地图控制帮助
//     navigationHelpButton: false,
//     //虚拟现实
//     vrButton: false,
//     //是否显示选取指示器组件
//     selectionIndicator: false,
//     //设置背景透明
//     orderIndependentTranslucency:false
// });
// //隐藏版本信息
// viewer._cesiumWidget._creditContainer.style.display = "none";
// //显示帧率
// viewer.scene.debugShowFramesPerSecond = true;
// //是否显示星空
// viewer.scene.skyBox.show = true;
// //是否显示太阳
// viewer.scene.sun.show = true;
// //是否显示有月亮
// viewer.scene.moon.show = true;
// //是否隐藏大气圈
// viewer.scene.skyAtmosphere.show = true;

// let shapedata = new Shapefile({
//     shp: "/3d-data/china_counties/counties_china.shp",
//     dbf: "/3d-data/china_counties/counties_china.dbf"
// }, function(data) {
//     console.log(data);
//     var jsonData = data.geojson;
//     // var count = jsonData.features.length;
//     var count = 30;
//     var lastEntity = null;
//     for (var i = 0; i <= count; i++) {
//         var ifeature = jsonData.features[i];
//         if(ifeature.hasOwnProperty("geometry")){
//             ifeature.geometry.coordinates[0].pop();
//             lastEntity = viewer.entities.add({
//                 id: i+1,
//                 name: ifeature.hasOwnProperty("properties") && ifeature.properties.hasOwnProperty("FIRST_NAME")
//                     ? ifeature.properties.FIRST_NAME : "noname_"+i,
//                 show: true,
//                 polygon: {
//                     show: true,
//                     hierarchy: Cesium.Cartesian3.fromDegreesArray(ifeature.geometry.coordinates[0].flat()),
//                     material: Cesium.Color.fromRandom({
//                         minimumRed : 0.85,
//                         minimumGreen : 0.85,
//                         minimumBlue : 0.85
//                     }).withAlpha(0.8),
//                     extrudedHeight:Math.ceil(Math.random()*10000),
//                     outline:true, //必须设置height，否则ouline无法显示
//                     outlineColor:Cesium.Color.BLACK.withAlpha(1),
//                     outlineWidth:2
//                 }
//             });
//         }
//     }
//     viewer.zoomTo(lastEntity);
// });