/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var appCordova = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);


        //document.getElementById('scan').addEventListener('click', this.scan, false);
        // document.getElementById('encode').addEventListener('click', this.encode, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        if (typeof cordova !== 'undefined') {
            cordova.plugins.camerapreview.startCamera({
                x: 0,
                y: 0,
                width: 1,
                height: 1
            }, "back", tapEnabled, dragEnabled, toBack);
            cordova.plugins.camerapreview.stopCamera();
        }
        //destinationType = navigator.camera.DestinationType;
    },


    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function () {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);

            console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
             if (args.format == "QR_CODE") {
             window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
             }
             */

        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    },

    encode: function () {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function (success) {
                alert("encode success: " + success);
            }, function (fail) {
                alert("encoding failed: " + fail);
            }
        );

    },


};

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL
    });
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        destinationType: navigator.camera.DestinationType.DATA_URL
    });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: source
    });
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}


appCordova.initialize();


var app = angular.module("myPageApp", [])
    .controller("myPageCtrl", function ($scope) {
        $scope.page = 'home';
        $scope.graph = 'view';
        $scope.topics = [
            {k: 'A', v: 20, n: 'ชานมน้ำผึ้ง+ไข่มุก'},
            {k: 'M1', v: 45, n: 'น้ำส้ม'},
            {k: 'J2', v: 10, n: 'Blue drill'},
            {k: 'O', v: 58, n: 'โซดา'},
            {k: 'N', v: 94, n: 'โซดา'},
            {k: 'D', v: 71, n: 'กาแฟ'},
            {k: 'F', v: 66, n: 'ขนมขบเคี้ยว'},


        ];
        $scope.activeIndex = 0;
        $scope.setTopic = function (index) {
            $scope.activeIndex = index;
        }

        setTimeout(function () {
            if (navigator.splashscreen)
                navigator.splashscreen.hide();
        }, 100);


        $scope.$watch('page', function (newValue, oldValue) {
            if (oldValue == 'qr') {
                $('body').removeClass('cam');
                $('body').addClass('normal');
                if (typeof cordova !== 'undefined') {
                    setTimeout(function () {
                        cordova.plugins.camerapreview.stopCamera();
                    }, 100);
                }
            }
            if (newValue == 'qr') {
                $('body').removeClass('normal');
                $('body').addClass('cam');
                var tapEnabled = true;
                var dragEnabled = true;
                var toBack = true;
                if (typeof cordova !== 'undefined') {
                    //cordova.plugins.camerapreview.stopCamera();
                    setTimeout(function () {
                        cordova.plugins.camerapreview.startCamera({
                            x: 0,
                            y: 0,
                            width: bodyWidth,
                            height: bodyHeight
                        }, "back", tapEnabled, dragEnabled, toBack);
                    }, 100);
                }
            }
        });
    });


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var viewCircle = function () {
    Circles.create({
        id: 'box-view',
        radius: 35,
        value: 12200,
        maxValue: 20000,
        width: 3,
        text: function (value) {
            return numberWithCommas(value) + '<br/><span>VIEWs</span>';
        },
        colors: ['#5472B2', '#FFF'],
        duration: 500,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        valueStrokeClass: 'circles-valueStroke',
        maxValueStrokeClass: 'circles-maxValueStroke',
        styleWrapper: true,
        styleText: true
    });
}

var clickCircle = function () {
    Circles.create({
        id: 'box-click',
        radius: 35,
        value: 1586,
        maxValue: 2000,
        width: 3,
        text: function (value) {
            return numberWithCommas(value) + '<br/><span>CLICKs</span>';
        },
        colors: ['#2AC2F8', '#FFF'],
        duration: 500,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        valueStrokeClass: 'circles-valueStroke',
        maxValueStrokeClass: 'circles-maxValueStroke',
        styleWrapper: true,
        styleText: true
    });
}


var redeemCircle = function () {
    Circles.create({
        id: 'box-redeem',
        radius: 35,
        value: 496,
        maxValue: 1000,
        width: 3,
        text: function (value) {
            return numberWithCommas(value) + '<br/><span>REDEEMs</span>';
        },
        colors: ['#B49685', '#FFF'],
        duration: 500,
        wrpClass: 'circles-wrp',
        textClass: 'circles-text',
        valueStrokeClass: 'circles-valueStroke',
        maxValueStrokeClass: 'circles-maxValueStroke',
        styleWrapper: true,
        styleText: true
    });
};

var bodyWidth;
var bodyHeight;
$(function () {
    bodyWidth = $(window).width();
    bodyHeight = $(window).height();
    $('.crop').width(bodyWidth);
    $('.crop').height(bodyWidth * 2);

    $('.crop').css('top', (-1 * (bodyWidth * 2 - bodyHeight) / 4) - 20);
    //$("#myNavmenu").offcanvas({ autohide: false ,recalc:false})
    // Bind the swipeleftHandler callback function to the swipe event on div.box
    $(".page-home").on("swipeleft", swipeLeftHandler);
    $(".page-home").on("swiperight", swipeRightHandler);

    $(".graph").on("swipeleft", function () {
    });
    $(".graph").on("swiperight", function () {
    });
    // Callback function references the event target and adds the 'swipeleft' class to it
    function swipeLeftHandler(event) {
        $('#myNavmenu').offcanvas('hide')
    }

    function swipeRightHandler(event) {
        $('#myNavmenu').offcanvas('show')
    }


    //Morris.Line({
    //    element: 'graph-view',
    //    data: [
    //        { y: '10', a: 100},
    //        { y: '11', a: 75 },
    //        { y: '12', a: 50},
    //        { y: '13', a: 75 },
    //        { y: '14', a: 50 },
    //        { y: '15', a: 75 },
    //        { y: '16', a: 100 }
    //    ],
    //    xkey: 'y',
    //    ykeys: ['a'],
    //    labels: ['Series A', 'Series B']
    //});

    //Morris.Donut({
    //    element: 'box-view',
    //    data: [
    //        {label: "VIEWs", value: 12200},
    //        {label: "", value: 5000}
    //    ],
    //    colors:[
    //        '#FFF','#000'
    //    ]
    //});
    new Chartist.Line('#graph-view', {
        labels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        series: [
            [556, 588, 1010, 886, 742, 588, 444, null, null, null, 1220, 1440, 788, 834, 665, 914],
        ]
    }, {
        fullWidth: true,
        chartPadding: {
            right: 10
        },
        low: 0,
        width: '1000px',
        height: '100px'
    });

    new Chartist.Line('#graph-click', {
        labels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        series: [
            [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null],
        ]
    }, {
        fullWidth: true,
        chartPadding: {
            right: 10
        },
        low: 0,
        width: '1000px',
        height: '100px'
    });

    new Chartist.Line('#graph-redeem', {
        labels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        series: [
            [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null]
        ]
    }, {
        fullWidth: true,
        chartPadding: {
            right: 10
        },
        low: 0,
        width: '1000px',
        height: '100px'
    });


    viewCircle();
    clickCircle();
    redeemCircle();
});