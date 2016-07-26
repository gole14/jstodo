(function() {

  angular.module('app').controller('main',
  [ 'logger', 'datacontext', controller]);
  
  function controller(logger, datacontext) {
    var vm = this;
    vm.errorMessage = '';
    vm.logList = logger.logList;
    vm.reset = reset;
    vm.save = save;
    vm.todos = [];
    
    getTodos();
  
    function getTodos() {
     datacontext.getAllTodos()
                .then(success)
                .catch(failed); 
            
      function success(data) {
          vm.todos = data;
      }
      function failed(error) {
          vm.errorMessage = error.message;
      }
    }
    
    function save(){
      datacontext.save().catch(function(error){
        vm.errorMessage = error.message;
      })
    }
    
    function reset() {
      datacontext.reset().then(getTodos);
    }
  }

})();