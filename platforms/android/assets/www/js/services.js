angular.module('starter.services', [])
.factory('appInfo', function () {
    return {
        apiRoot: 'http://private-b7bcd-renata.apiary-mock.com/',
        user: {
            Foto: 'images/icon-topo-nenhum-medico.png'
        },
        especialidade_medica: {},
        localidade: {},
        estado: {},
        cidade: {},
        forma_de_pagamento: {},
        nome_do_medico: {},
        medico: {}
    }
})
.factory('especialidadeService', function ($http, appInfo) {
    return {
        getAll: function (sucessCallback, errorCallback) {
            $http({
                method: 'GET',
                url: appInfo.apiRoot + 'search/specialties'
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )
        }
    }
})
.factory('localidadeService', function ($http, appInfo) {
    return {
        getStates: function (sucessCallback, errorCallback) {
            $http({
                method: 'GET',
                url: appInfo.apiRoot + 'search/states'
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )
        },
        getCities: function (sucessCallback, errorCallback, idState) {
            $http({
                method: 'GET',
                url: appInfo.apiRoot + 'search/cities?idState=' + idState
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )
        }
    }
})
.factory('planoSaudeService', function ($http, appInfo) {
    return {
        getAll: function (sucessCallback, errorCallback) {
            $http({
                method: 'GET',
                url: appInfo.apiRoot + 'appointments/GetHealthInsurances'
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )
        }
    }
})
.factory('usuarioService', function ($http, appInfo) {
    return {
        Login: function (sucessCallback, errorCallback, login, password) {
            $http({
                method: 'POST',
                url: appInfo.apiRoot + 'users/Login',
                data: {
                    Login: login,
                    Password: password
                }
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )
        },
        ResetSenha: function (sucessCallback, errorCallback, usuario) {
            $http({
                method: 'POST',
                url: appInfo.apiRoot + 'users/RecoverPassword?usuario=' + usuario
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )
        },
        Cadastrar: function (sucessCallback, errorCallback, usuario) {
            var tel = '' + usuario.ddd + usuario.telefone;
            tel = tel.replace(/^\D+/g, '');

            var usuarioData = {
                nome: usuario.nome,
                email: usuario.email,
                telefone1: tel,
                usuario: {
                    Usuario: usuario.email,
                    Senha: usuario.senha,
                    TipoUsuario: 'paciente'
                }
            };

            if (usuario.plano_saude.id > 0)
            {
                usuarioData.planosPaciente = [
                    {
                        idPlan: usuario.plano_saude.id,
                        number: usuario.plano_saude_numero
                    }
                ]
            }

            $http({
                method: 'POST',
                url: appInfo.apiRoot + 'users/SignUp',
                data: usuarioData
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            );
        }
    }
})
.factory('buscaService', function ($http, appInfo) {
    return {
        getAll: function (sucessCallback, errorCallback, page, rowsperpage) {
            var query = '';
            if (appInfo.cidade.id > 0)
                query += '&idcity=' + appInfo.cidade.id;

            if (appInfo.especialidade_medica.id > 0)
                query += '&idspecialty=' + appInfo.especialidade_medica.id;

            if ((appInfo.forma_de_pagamento.tipo == 'plano-de-saude')
                && (appInfo.forma_de_pagamento.plano_saude.id > 0))
            {
                query += '&idinsurance=' + appInfo.forma_de_pagamento.plano_saude.id;
            }

            query += '&page=' + page + '&rowsperpage=' + rowsperpage;

            // ToDo: fix server API do avoid error "Malformed JSON: Unexpected '}'"
            /*$http({
                method: 'GET',
                url: appInfo.apiRoot + 'search?' + query.substr(1)
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            )*/

            //ToDo: remover - BEGIN
            //---------------------
            var doctors = [
                {
                    "id": 1,
                    "name": "Drauzio Varela",
                    "curriculum": "Cancerologista, nascido em S„o Paulo, no ano de 1943.",
                    "image": "https://s3.amazonaws.com/original-images-user/imagens/4226/1c7fdcf3-6a65-4e8a-b1b9-ef36a9255b5a",
                    "address": "Rua Otoni Alves 140, Centro - Pedro Leopoldo/MG",
                    "specialties": [
                        {
                            "id": 1,
                            "name": "ACUPUNTURA",
                            "nextAvailableTimes": [
                                "02/12/2014 16:00:00",
                                "02/12/2014 18:00:00",
                                "02/12/2014 18:30:00"
                            ]
                        },
                        {
                            "id": 2,
                            "name": "PATOLOGIA CLÕçNICA",
                            "nextAvailableTimes": [
                                "02/12/2014 10:00:00",
                                "02/12/2014 10:30:00",
                                "02/12/2014 11:00:00"
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Vrauzio Darela",
                    "curriculum": "Cancerologista, nascido em S„o Paulo, no ano de 1943.",
                    "address": null,
                    "specialties": [
                        {
                            "id": 1,
                            "name": "ACUPUNTURA",
                            "nextAvailableTimes": [
                                "02/12/2014 16:00:00",
                                "02/12/2014 18:00:00",
                                "02/12/2014 18:30:00"
                            ]
                        },
                        {
                            "id": 3,
                            "name": "CARDIOLOGIA",
                            "nextAvailableTimes": null
                        }
                    ]
                }
            ];

            var data = {
                doctors: doctors,
                Count: 2,
                Total: 2,
                Page: 1
            };

            var response = {
                data: data
            };

            sucessCallback(response);
            //-------------------
            //ToDo: remover - END
        }
    }
})
;
