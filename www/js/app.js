// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngSanitize', 'ui.mask', 'ui.bootstrap.datetimepicker', 'starter.controllers', 'starter.services'])

.run(function ($ionicPlatform) {

  $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      //change status bar color
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'templates/home.html'
    })
    .state('pesquisa-especialidade-medica', {
        url: '/pesquisa/especialidade-medica',
        templateUrl: 'templates/pesquisa/especialidade-medica.html'
    })
    .state('pesquisa-localidade', {
        url: '/pesquisa/localidade',
        templateUrl: 'templates/pesquisa/localidade.html'
    })
    .state('pesquisa-forma-de-pagamento', {
        url: '/pesquisa/forma-de-pagamento',
        templateUrl: 'templates/pesquisa/forma-de-pagamento.html'
    })
    .state('pesquisa-nome-do-medico', {
        url: '/pesquisa/nome-do-medico',
        templateUrl: 'templates/pesquisa/nome-do-medico.html'
    })
    .state('login', {
        url: '/usuario/login',
        templateUrl: 'templates/usuario/login.html'
    })
    .state('cadastro', {
        url: '/usuario/cadastro',
        templateUrl: 'templates/usuario/cadastro.html'
    })
    .state('esqueci-senha', {
        url: '/usuario/esqueci-senha',
        templateUrl: 'templates/usuario/esqueci-senha.html'
    })
    .state('busca', {
        url: '/pesquisa/busca',
        templateUrl: 'templates/pesquisa/busca.html'
    })
    .state('consultas-agendar', {
        url: '/consultas/agendar',
        templateUrl: 'templates/consultas/agendar.html'
    })
    .state('minhas-consultas', {
        url: '/consultas/minhas-consultas',
        templateUrl: 'templates/consultas/minhas-consultas.html'
    });

    $urlRouterProvider.otherwise('/');

});
