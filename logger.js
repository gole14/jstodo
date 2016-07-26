(function() {

  angular.module('app').factory('logger', ['$log', logger]);
  
  function logger ($log){
    var msgCounter = 1;
    var service = {
      log: log,
      logError: logError,
      logList: []
    };
    return service;
    

    function log (text) {
      text = mkMsg(text);
      service.logList.push(text);     
      $log.log(text); 
    }
    function logError (text) {
      text = mkMsg(text);
      service.logList.push(text);     
      $log.error(text); 
    }
    
    function mkMsg(text){
      return msgCounter++ + ": " + text;
    }
  }

})();