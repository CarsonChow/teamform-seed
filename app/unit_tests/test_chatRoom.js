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
			$scope.addMessage();
			expect($scope.chatList.message).toBeUndefined();
			expect($scope.chatList.userName).toBeUndefined();
			expect($scope.chatList.date).toBeUndefined();
		});
		
	});
	

});