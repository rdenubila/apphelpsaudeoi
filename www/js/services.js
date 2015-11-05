angular.module('starter.services', [])
.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {
        'X-HSApiAuth-Username': 'api.sistema',
        'X-HSApiAuth-Password': 'nz/sSHqURKEaR18FOmVzS6yznDJoJoVziGh5a+cLohx6ehBLYd+OYTh2nfuQytJ2PVB5pq1Plw6drUm0Mn6tNg==',
        'X-HSApiAuth-Date': '2015-10-28 18:13',
        'Authorization': 'HSApiAuth'
    };
})
.factory('appInfo', function () {
    var timezoneOffset_hours = new Date().getTimezoneOffset() / 60;
    var timezoneOffset = ('0' + timezoneOffset_hours).substr(-2) + '00';
    if (timezoneOffset_hours > 0)
        timezoneOffset = '-' + timezoneOffset;

    return {
        apiRoot: 'http://private-b7bcd-renata.apiary-mock.com/',
        //apiRoot: 'http://api.helpsaude.com/',
        //apiRoot: 'http://dev.helpsaude.com/',
        //Login: MARCEL BENATO
        //Senha: 12345678
        user: {
            Foto: 'images/icon-topo-nenhum-medico.png'
        },
        timezoneOffset: timezoneOffset,
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
            );
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
            );
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
            );
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
            );
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
            );
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
            );
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
        },
        getInfo: function (sucessCallback, errorCallback, idUserPatient) {
            /*$http({
                method: 'GET',
                url: appInfo.apiRoot + 'patient?idUserPatient=' + idUserPatient
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            );*/

            //ToDo: remover - BEGIN
            //---------------------
            var response = {
                id: 1,
                fullName: "Arthur Antunes Coimbra",
                appointmets: [
                    {
                        "id": 601,
                        "iddoctor": 1,
                        "doctor": "CARLOS CHEGAS",
                        "idspecialty": 6,
                        "specialty": "ANESTESIOLOGIA",
                        "idserviceplace": 8,
                        "serviceplace": "CLINICA SA",
                        "address": "DR CRISTIANO OTONI 327, CENTRO - Pedro Leopoldo/MG",
                        "datetime": "2014-09-27T10:30:00"
                    },
                    {
                        "id": 602,
                        "iddoctor": 1,
                        "doctor": "CARLOS CHEGAS",
                        "idspecialty": 7,
                        "specialty": "CARDIOLOGIA",
                        "idserviceplace": 8,
                        "serviceplace": "CLINICA SA",
                        "address": "DR CRISTIANO OTONI 327, CENTRO - Pedro Leopoldo/MG",
                        "datetime": "2014-09-30T17:30:00"
                    }
                ]
            };

            sucessCallback(response);
            //-------------------
            //ToDo: remover - END
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
            );*/

            //ToDo: remover - BEGIN
            //---------------------
            var doctors = [
                {
                    "id": 1,
                    "name": "Drauzio Varela",
                    "curriculum": "Cancerologista, nascido em São Paulo, no ano de 1943.",
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
                            "name": "PATOLOGIA CLÍNICA",
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
                    "curriculum": "Cancerologista, nascido em São Paulo, no ano de 1943.",
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
.factory('medicoService', function ($http, appInfo) {
    return {
        get: function (sucessCallback, errorCallback, id) {
            /*$http({
                method: 'GET',
                url: appInfo.apiRoot + 'doctor?id=' + id
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            );*/

            //ToDo: remover - BEGIN
            //---------------------
            var response = {
                id: 1,
                fullName: "Carlos Chegas",
                curriculum: "Especialista em Cirurgia Cardiovascular",
                image: "https://s3.amazonaws.com/original-images-user/imagens/4226/1c7fdcf3-6a65-4e8a-b1b9-ef36a9255b5a",
                specialties: [
                    {
                        id: 1,
                        name: "CARDIOLOGIA"
                    },
                    {
                        id: 2,
                        name: "ANGIOLOGIA"
                    },
                    {
                        id: 3,
                        name: "ANESTESIOLOGIA"
                    }
                ],
                locations: [
                    {
                        id: 8,
                        road: "Cristiano Otoni 6",
                        number: "327",
                        complement: "",
                        cep: "33600-000",
                        googlePoint: "-19,616612,-44,043936",
                        deleted: false,
                        city: {
                            name: "Pedro Leopoldo",
                            state: {
                                uF: "MG",
                                name: "Minas Gerais"
                            }
                        },
                        neighborhood: {
                            name: "CENTRO",
                        },
                        phoneNumbers: [
                          {
                              areaCode: "31",
                              number: "3665-5000"
                          },
                          {
                              areaCode: "31",
                              number: "36655005"
                          }
                        ],
                        appointmentTimeRanges:
                          [
                              {
                                  weekday: 4,
                                  isOpen: true,
                                  gap: 30,
                                  appointmentTimeRangeIntervals:
                                  [
                                    {
                                        beginsAt: "1900-01-01T18:30:00",
                                        endsAt: "1900-01-01T20:30:00"
                                    }
                                  ],
                                  appointmentTimeRangeSpecialties:
                                  [
                                    2,
                                    3
                                  ]
                              },
                              {
                                  weekday: 1,
                                  isOpen: true,
                                  gap: 30,
                                  appointmentTimeRangeIntervals:
                                  [
                                    {
                                        beginsAt: "1900-01-01T08:00:00",
                                        endsAt: "1900-01-01T18:00:00"
                                    }
                                  ],
                                  appointmentTimeRangeSpecialties:
                                  [
                                    1,
                                    3
                                  ]
                              },
                              {
                                  weekday: 2,
                                  isOpen: true,
                                  gap: 30,
                                  appointmentTimeRangeIntervals:
                                  [
                                    {
                                        beginsAt: "1900-01-01T08:00:00",
                                        endsAt: "1900-01-01T18:00:00"
                                    }
                                  ],
                                  appointmentTimeRangeSpecialties:
                                  [
                                    3
                                  ]
                              }
                          ]
                    }
                ],
                appointmentsBlacklist:
                    [
                        {
                            id: 1,
                            startTime: "2015-11-16T09:00:00",
                            endTime: "2015-11-16T17:30:00",
                            idHealthEntity: 1,
                            idHealthEntityLocation: 8,
                            type: 0
                        },
                        {
                            id: 2,
                            startTime: "2015-11-17T07:30:00",
                            endTime: "2015-11-17T18:00:00",
                            idHealthEntity: 1,
                            idHealthEntityLocation: 8,
                            type: 2 
                        },
                        {
                            id: 3,
                            startTime: "2015-11-19T00:00:00",
                            endTime: "2015-11-19T23:59:00",
                            idHealthEntity: 1,
                            idHealthEntityLocation: -1,
                            type: 1 
                        }
                    ]
            };

            sucessCallback(response);
            //-------------------
            //ToDo: remover - END
        }
    }
})
.factory('agendaService', function ($http, appInfo) {
    return {
        Agendar: function (sucessCallback, errorCallback, agendamentoInfo) {
            /*$http({
                method: 'POST',
                url: appInfo.apiRoot + 'appointment',
                data: agendamentoInfo
            }).then(
                function successHandle(response) {
                    sucessCallback(response);
                },
                function errorHandle(response) {
                    errorCallback(response);
                }
            );*/

            //ToDo: remover - BEGIN
            //---------------------
            var response = {
                id: 1,
                observacao: "Levar bermuda e tênis para o teste ergométrico.",
                erroEnvioEmail: "Não foi possível enviar o e-mail de confirmação do agendamento.",
                status: "ok"
            };

            sucessCallback(response);
            //-------------------
            //ToDo: remover - END
        }
    }
})
;
