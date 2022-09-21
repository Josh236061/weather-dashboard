var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $filter) {

    $scope.uri="https://api.openweathermap.org/data/2.5/forecast/?"
    // $scope.uri="https://pro.openweathermap.org/data/2.5/forecast/hourly?"



    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

    $scope.storeToLocal = function(value){

        if (typeof(Storage) !== "undefined") {

        let arrayOfdata = []
        if(sessionStorage.userService !=null){            
            for (var i = 0; i < angular.fromJson(sessionStorage.userService).length; i++) {                
                arrayOfdata.push(angular.fromJson(sessionStorage.userService)[i]);
            }

        }
        arrayOfdata.push(angular.fromJson(value));
   
        sessionStorage.userService = angular.toJson(arrayOfdata);
        $scope.returnDatafromLocal =angular.fromJson(sessionStorage.userService);      

    } else {
        // Sorry! No Web Storage support..
      }
    }

    $scope.getFromLocal = function(){

       $scope.returnDatafromLocal =angular.fromJson(sessionStorage.userService);      

       return $scope.returnDatafromLocal;
    }

    if( $scope.RequiredValueforUs ==null){
        if($scope.getFromLocal.length >0 ){
        
            $scope.RequiredValueforUs =$scope.getFromLocal()[$scope.getFromLocal.length - 1];
        }
    }

    $scope.getfromListFunc= function(index){

        returnVal = $scope.getFromLocal()[index];
        $scope.fetchTheWeather(returnVal.city.coord.lat, returnVal.city.coord.lon);

    }

    $scope.returnNext5Dates=    function(listobject){

        let datesArray = [];
        $scope.RequiredValueforUs = [];
        for (var i = 0; i < listobject.length; i++) {
            var datesOb =$scope.formatDate(listobject[i].dt_txt)
            var dateONLY = $filter('date')(datesOb, "dd/MM/yyyy");
            if(datesArray.includes(dateONLY )){{
            }}else{
                datesArray.push(dateONLY)
                $scope.RequiredValueforUs.push(listobject[i])
            }
        }

        return $scope.RequiredValueforUs;

    }

    $scope.searchFunc = function () {
        console.log($scope.searchText)

        $http({
            method : "GET",
            
            url : "http://api.openweathermap.org/geo/1.0/direct?q="+$scope.searchText+"&limit=1&appid=e11f5b4ae2dcc5c38dad41ca26379e1e"
          }).then(function mySuccess(response) {
            // console.log(response)
            if(response.data ){
                console.log(response.data )
                console.log(response.data[0].lat)
                console.log(response.data[0].lon)

                //   -----------------------------------------------------------------
                $scope.fetchTheWeather(response.data[0].lat, response.data[0].lon , 1)
 
                //   -----------------------------------------------------------------

            }


          }, function myError(response) {

          });


    }


    $scope.fetchTheWeather = function(lat, lon,status){

        $http({
            method : "GET",
            
            url :$scope.uri+"lat="+lat+"&lon="+lon+"&appid=e11f5b4ae2dcc5c38dad41ca26379e1e"
        }).then(function mySuccess(response) {
            console.log(response)
            $scope.weatherdata=response.data
            realData = $scope.returnNext5Dates(response.data.list);

            if(status ==1){
                $scope.storeToLocal(response.data);

            }

        }, function myError(response) {

        });

    }

});