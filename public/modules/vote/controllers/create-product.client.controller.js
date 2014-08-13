'use strict';

angular.module('vote').controller('createProductController', ['$scope', '$stateParams', '$location', '$upload', '$timeout', '$http', 'Authentication',
  function($scope, $stateParams, $location, $upload, $timeout, $http, Authentication) {
    $scope.authentication = Authentication;

    var uploadUrl = 'http://angular-file-upload-cors-srv.appspot.com/upload';

    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
      window.location.hash = $scope.angularVersion;
      window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
      return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
      $scope.upload[index].abort();
      $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
      window.location.hash.substring(2): window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
      $scope.selectedFiles = [];
      $scope.progress = [];
      if ($scope.upload && $scope.upload.length > 0) {
        for (var i = 0; i < $scope.upload.length; i++) {
          if ($scope.upload[i] != null) {
            $scope.upload[i].abort();
          }
        }
      }
      $scope.upload = [];
      $scope.uploadResult = [];
      $scope.selectedFiles = $files;
      $scope.dataUrls = [];
      for ( var i = 0; i < $files.length; i++) {
        var $file = $files[i];
        if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL($files[i]);
          var loadFile = function(fileReader, index) {
            fileReader.onload = function(e) {
              $timeout(function() {
                $scope.dataUrls[index] = e.target.result;
              });
            }
          }(fileReader, i);
        }
        $scope.progress[i] = -1;
        $scope.start(i);
      }
    };



    $scope.imageUploads = [];
    $scope.abort = function(index) {
      $scope.upload[index].abort();
      $scope.upload[index] = null;
    };

    $scope.start = function(index) {
      $scope.errorMsg = null;

      (function (file, i) {
        $http.get('/api/s3Policy?mimeType='+ file.type).success(function(response) {
          var s3Params = response;
          $scope.upload[i] = $upload.upload({
            url: 'http://vote.products.s3.amazonaws.com/',
            method: 'POST',
            data: {
              'key' : 'images/' + Math.round(Math.random()*10000) + '$$' + file.name,
              'acl' : 'public-read',
              'Content-Type' : file.type,
              'AWSAccessKeyId': s3Params.AWSAccessKeyId,
              'success_action_status' : '201',
              'Policy' : s3Params.s3Policy,
              'Signature' : s3Params.s3Signature
            },
            file: file
          });
          $scope.upload[i]
            .then(function(response) {
              if (response.status === 201) {
                console.log('response', response);
                var data = xml2json.parser(response.data),
                  parsedData;
                parsedData = {
                  location: data.postresponse.location,
                  bucket: data.postresponse.bucket,
                  key: data.postresponse.key,
                  etag: data.postresponse.etag
                };
                $scope.imageUploads.push(parsedData);

              } else {
                alert('Upload Failed');
              }
            }, null, function(evt) {
            });
        });
      }($scope.selectedFiles[index], index));
//      if ($scope.howToSend == 1) {
//        $scope.upload[index] = $upload.upload({
//          url: uploadUrl,
//          method: $scope.httpMethod,
//          headers: {'my-header': 'my-header-value'},
//          data : {
//            myModel : $scope.myModel
//          },
//          /* formDataAppender: function(fd, key, val) {
//           if (angular.isArray(val)) {
//           angular.forEach(val, function(v) {
//           fd.append(key, v);
//           });
//           } else {
//           fd.append(key, val);
//           }
//           }, */
//          /* transformRequest: [function(val, h) {
//           console.log(val, h('my-header')); return val + '-modified';
//           }], */
//          file: $scope.selectedFiles[index],
//          fileFormDataName: 'myFile'
//        });
//        $scope.upload[index].then(function(response) {
//          $timeout(function() {
//            $scope.uploadResult.push(response.data);
//          });
//        }, function(response) {
//          if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
//        }, function(evt) {
//          // Math.min is to fix IE which reports 200% sometimes
//          $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//        });
//        $scope.upload[index].xhr(function(xhr){
////				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
//        });
//      } else {
//        var fileReader = new FileReader();
//        fileReader.onload = function(e) {
//          $scope.upload[index] = $upload.http({
//            url: uploadUrl,
//            headers: {'Content-Type': $scope.selectedFiles[index].type},
//            data: e.target.result
//          }).then(function(response) {
//              $scope.uploadResult.push(response.data);
//            }, function(response) {
//              if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
//            }, function(evt) {
//              // Math.min is to fix IE which reports 200% sometimes
//              $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//            });
//        }
//        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
//      }
    };

    $scope.dragOverClass = function($event) {
      var items = $event.dataTransfer.items;
      var hasFile = false;
      if (items != null) {
        for (var i = 0 ; i < items.length; i++) {
          if (items[i].kind == 'file') {
            hasFile = true;
            break;
          }
        }
      } else {
        hasFile = true;
      }
      return hasFile ? "dragover" : "dragover-err";
    };

  }
]);