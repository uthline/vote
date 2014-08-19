'use strict';

angular.module('vote').controller('createProductController', ['$scope', '$stateParams', '$location', '$upload', '$timeout', '$http', 'Authentication', 'Products',
  function($scope, $stateParams, $location, $upload, $timeout, $http, Authentication, Products) {
    $scope.authentication = Authentication;

    $scope.usingFlash = FileAPI && FileAPI.upload !== null;
    $scope.fileReaderSupported = window.FileReader !== null && (window.FileAPI === null || FileAPI.html5 !== false);

    $scope.hasUploader = function(index) {
      return $scope.upload[index] !== null;
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
          if ($scope.upload[i] !== null) {
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
            };
          }(fileReader, i);
        }
      }
    };


    $scope.imageUploads = [];

    // New product
    $scope.product = {
      image: '',
      name: '',
      description: '',
      macros: {
        fat: 0,
        protein: 0,
        carbs: 0
      },
      votes: {
        up: 0,
        down: 0
      }
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
                var data = xml2json.parser(response.data),
                  parsedData = {
                    location: data.postresponse.location,
                    bucket: data.postresponse.bucket,
                    key: data.postresponse.key,
                    etag: data.postresponse.etag
                  };
                $scope.imageUploads.push(parsedData);
                $scope.product.image = data.postresponse.location;
                var product = new Products($scope.product);
                product.$save(function(response) {
                  console.log('saved response', response);
                }, function(errorResponse) {
                  $scope.error = errorResponse.data.message;
                });

              } else {
                alert('Upload Failed');
              }
            }, null, function(evt) {
            });
        });
      }($scope.selectedFiles[index], index));
    };

    $scope.submitProduct = function() {
      if (selectedFiles !== null) {
        $scope.start(0);
      }
      $scope.selectedFiles = null;
    }

  }
]);