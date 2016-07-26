(function() {

angular.module('app').factory('datacontext',
       ['$http', 'logger', 'breeze',  datacontext]);

function datacontext($http, logger, breeze) {
  var log = logger.log;
  var logError = logger.logError;
  
  log("Creating datacontext");
  
  // convert server PascalCase property names to camelCase
  breeze.NamingConvention.camelCase.setAsDefault();

  // create a new manager talking to sample service 
  var host="http://sampleservice.breezejs.com";
  var serviceName = host+"/api/todos";
  var manager = new breeze.EntityManager(serviceName);

  plunkerHelpers.isCorsCapable();
  
  var service = {
    getAllTodos: getAllTodos,
    save: save,
    reset: reset
  };
  return service;
  
  /*** implementation ***/  

  function getAllTodos() {
    log("Getting Todos");
    return breeze.EntityQuery.from("Todos")
          .using(manager).execute()
          .then(success)
          .catch(function(error){ opFailed('Get Todos', error)} );
  
    function success(data) {
        log("Retrieved " + data.results.length);
        return data.results;
    }
  }
  
  function opFailed(operation, error){
    logError(operation + " failed: \n"+error);
    throw error; // re-throw so next in promise chain sees it
  }
  
  function save(){
    var changeCount = manager.getChanges().length;
    var msg = (save) 
      ? "Saving "+ changeCount + " change(s) ..."
      : "No changes to save";
      
    log(msg);
    return manager
      .saveChanges()
      .then( function (data) { 
        log("Saved  " + changeCount);} 
      )
      .catch(function(error) { opFailed('Save', error)} );
  }
  
  function reset() {
    log("Resetting the data to initial state");
    manager.clear();
    
    return $http.post(serviceName + '/reset')
      .then( function (data) { log("Database reset");} )
      .catch(function(error) { opFailed('Database reset', error)} );

  }
}

})();