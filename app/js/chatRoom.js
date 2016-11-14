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
		var eventName = getURLParameter("q");
		if(eventName != null && eventName !== ''){
			var ref = firebase.database().ref("chatRoom" + eventName);
			}
		$scope.chatList = $firebaseArray(ref);

		$scope.addMessage = function() {
			
			// update the date
				if ( $scope.input.message != "" ) {
					var user = firebase.auth().currentUser;
					$scope.input.date = new Date().toString();
					$scope.input.userName = user.displayName;
					$scope.chatList.$add($scope.input);
					// add an input question
				}
			}
		}
);