describe('chatRoom test', function() {
   
	var $scope, $rootScope, $controller;
	
	beforeEach(function() {
		module('chatRoom');
		console.log("chat room module");
		beforeEach(inject(function($rootScope, $controller) {
			$scope = $rootScope.$new();
			$controller('chatRoomCtrl', {$scope: $scope});
		}));
	});
	
	describe('chat room test', function() {
		it('addMessage', function() {
			$scope.input.message = "whatever";
			$scope.input.userName = "handsome";
			$scope.input.date = "14/11/2016"
			$scope.addMessage();
			expect($scope.chatList.message).toBe("whatever");
			expect($scope.chatList.userName).toBe("handsome");
			expect($scope.chatList.date).toBe("14/11/2016");
			
		});
		
	});
	

});