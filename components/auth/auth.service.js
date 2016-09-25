function Auth($http, localStorageService, $rootScope) {
  
  var API_URL = 'https://driveoff.herokuapp.com'
  return {
    isAuthenticated: function() {
      return localStorageService.get('auth_token');
    },
    
    login: function(credentials) {
      var login = $http.post(API_URL + '/login', credentials);
        login.success(function(result) {
          localStorageService.set('auth_token', result.token);
          var user = { 
            id: result.id, 
            name: result.name,
            avatar: result.avatar,
            points: result.points,
            email: result.email
          }
          localStorageService.set('user', JSON.stringify(user)); 
        });

        return login;
    },
    
    logout: function(){
      localStorageService.unset('auth_token');
      localStorageService.unset('user');
    },

    register: function(formData) {
      localStorageService.unset('auth_token');
      var register = $http.post(API_URL + '/users', formData);
      register.success(function(result) {
        localStorageService.set('auth_token', result.token);
      });

      return register;
    }
  }
}