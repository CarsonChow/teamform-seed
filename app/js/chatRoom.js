// inject firebase service
var app = angular.module("chatRoom", ["firebase"]); 

app.controller("chatRoomCtrl", 

	// Implementation the todoCtrl 
	function($scope, $firebaseArray) {

		$scope.input = {
			message: "",
			date: "",
			userName: ""
		}
		// sync with firebaseArray
		var ref = firebase.database().ref("chatRoom");
		$scope.chatList = $firebaseArray(ref);

		$scope.addMessage = function() {
			
			// update the date
			var user = firebase.auth().currentUser;
			var name = user.displayName;
				if ( $scope.input.message != "" ) {
					$scope.input.date = new Date().toString();
					$scope.input.userName = name;
					// add an input question
					$scope.chatList.$add($scope.input);
				}
			}
		}
);