$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if(eventName != null && eventName !== '') {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

});

$("#btn_chat").click(function() {
    	var val = getURLParameter("q");
    	if(val !== '') {
    		var url = "chatRoom.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

angular.module('teamform-member-app', ['firebase'])
.directive('login', function() {
    return {
        restrict: 'A',
        templateUrl: 'login.html'
    };
})
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	// TODO: implementation of MemberCtrl	

	$scope.userID = "";
	$scope.userName = "";	
	$scope.teams = {};
	$scope.userInfo = "";
	$scope.memberInfo = "";
	$scope.uid = "";
	$scope.name = "";
	$scope.teamStatus = "";
	$scope.tag = "";
	$scope.tags =[];
	$scope.eventName = getURLParameter("q");

	firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if(firebaseUser) {
      	var user = firebase.auth().currentUser;
        $scope.uid = user.uid;
        $scope.name = user.displayName;
        $scope.loadFunc();
      }
      else {
      	$scope.userID = "";
      	$scope.userName = "";
      	$scope.uid = "";
      	$scope.name = "";
      	$scope.selection = [];
		$scope.tags = [];
      	$("input").prop("disabled", true);
      }
    });

	$scope.loadFuncTest = "";
    $scope.loadFuncCallback = function() {
    	if($scope.memberInfo.selection != null) {
			$scope.selection = $scope.memberInfo.selection;
		} else {
			$scope.selection = [];
		}
		if($scope.memberInfo.tags != null) {
			$scope.tags = $scope.memberInfo.tags;			
		} else {
			$scope.tags = [];
		}				
		if($scope.memberInfo.inTeam != null) {
			$("#teamStatus").html("You have joined team " + $scope.memberInfo.inTeam + ".");
			$scope.loadFuncTest = "inTeam";
		}
		else {
			$("#teamStatus").html("You haven't joined any team. Check the box below to request to join\
			 the team or <a href=\"team.html?q=" + getURLParameter("q") + "\">Click here</a> to create\
			  a team.");
			$scope.loadFuncTest = "notinTeam";
		}
		//check for invitation
		if($scope.memberInfo.invitedBy != null){
			$("#inviteStatus").html("You are invited by " + $scope.memberInfo.invitedBy.length + " teams in the event " + getURLParameter("q") + ".");
			$scope.loadFuncTest += " invite";
		}
		else{
			$("#inviteStatus").html("You have no invitation.");
			$scope.loadFuncTest += " noinvite";
		}
    };

	$scope.loadFunc = function() {
		var refPath = $scope.eventName + "/member/" + $scope.uid;		
		$scope.memberInfo = $firebaseObject(firebase.database().ref(refPath));
		$scope.memberInfo.$loaded().then($scope.loadFuncCallback);
	};
	
	$scope.addTag = function() {
		 var tag = $.trim($scope.tag);
				
		if(tag !== '' && $scope.tags.indexOf(tag) === -1) {
			$scope.tags.push(tag);
		}
		$scope.tag = "";
	};
	
	$scope.saveFunc = function() {
		var newData = {
			'tags' : $scope.tags,
			'selection': $scope.selection,
			'weight': 0 
		};
		var refPath = getURLParameter("q") + "/member/" + userID;
		var ref = firebase.database().ref(refPath);
		ref.update(newData);
		refPath = "user/" + userID;
		ref = firebase.database().ref(refPath);
		ref.update({ name: userName }, function() {
			window.location.href = "index.html";
		});
	};
	
	$scope.refreshTeams = function() {
		var refPath = getURLParameter("q") + "/team";
		var ref = firebase.database().ref(refPath);
		
		// Link and sync a firebase object
		$scope.selection = [];
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);
			if(idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}
		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then(function(data) {}) 
			.catch(function(error) {});
	};
	
	$scope.atFunc = function() {
		var url = "abilitytest.html?q=" + getURLParameter("q");
		window.location.href= url
	};
	
	$scope.acceptInv = function(teamName){
		//Get the index of teamName in team
		var index;
		for(var i=0; i<$scope.teams.length; i++){
			if(teamName == $scope.teams[i].$id){
				index = i;
				break;
			}
		}
		console.log("index: ", index);
		var x;
		x = confirm("Are you sure?");
		if (x){
			//check if the team is full, if yes, tell the user
			if($scope.teams[index].teamMembers.length >= $scope.teams[index].size){
				window.alert("Team " + teamName + " is full!");
				return;
			}
			//if no, add the user to the team
			else{
				var refPath = getURLParameter("q") + "/team/" + teamName;
				$scope.teamMember = $firebaseObject(firebase.database().ref(refPath));
				$scope.teamMember.$loaded(function(data){
					console.log("data: ",data);
					
					$scope.newMemberList = [];
					$scope.teamList = [];
					$scope.teamList = data;
					console.log("$scope.teamList ",$scope.teamList);
					if(typeof $scope.teamList != 'undefined'){
						for(var i=0; i< $scope.teamList.teamMembers.length; i++){
							//push
							console.log(i);
							$scope.newMemberList.push($scope.teamList.teamMembers[i]);
						}
					}
					$scope.newMemberList.push($scope.uid);
					console.log("$scope.newMemberList: ",$scope.newMemberList);
					var refPath = getURLParameter("q") + "/team/" + teamName;
					var ref = firebase.database().ref(refPath);
					ref.update({
						teamMembers: $scope.newMemberList
					});
					//remove invitedBy list
					var refPath1 = getURLParameter("q") + "/member/" + $scope.uid + "/invitedBy";
					var ref1 = firebase.database().ref(refPath1);
					ref1.remove();
					window.alert("Invitation accepted!");
					// update inTeam
					var refPath2 = getURLParameter("q") + "/member/" + $scope.uid;
					var ref2 = firebase.database().ref(refPath2);
					ref2.update({
						inTeam: teamName
					});
				});
			}	
		}		
	};
	
	$scope.declineInv = function(teamName){
		var x;
		x = confirm("Are you sure?");
		if (x){
			var index = $scope.userInfo.invitedBy.indexOf(teamName)
			if(index>-1){
				$scope.userInfo.invitedBy.splice(index,1);
				var refPath = getURLParameter("q") + "/member/" + $scope.userInfo.$id;
				var ref = firebase.database().ref(refPath);
				ref.update({
					invitedBy: $scope.userInfo.invitedBy
				}); 
		}}
		
	};	
	$scope.refreshTeams(); // call to refresh teams...
}])

;
