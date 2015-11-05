angular.module('starter.controllers', [])

/*
    ----
    HOME
    ----
*/
.controller('HomeController', function ($scope, $state, $ionicModal, appInfo) {
    $scope.user = appInfo.user;

    $scope.menuItems = [
        { ref: 'especialidade-medica', placeholder: 'Especialidade Médica' },
        { ref: 'localidade', placeholder: 'Localidade' },
        { ref: 'forma-de-pagamento', placeholder: 'Forma de Pagamento' },
        //{ ref: 'nome-do-medico', placeholder: 'Nome do Médico' }
    ];

    for (var i = 0; i < $scope.menuItems.length; i++)
    {
        $scope.menuItems[i].texto = $scope.menuItems[i].placeholder;
        $scope.menuItems[i].selected = false;
    }

    $scope.is_Selected = function (ref) {
        switch (ref) {
            case 'especialidade-medica':
                update_menuItem_texto('especialidade-medica', appInfo.especialidade_medica.name);
                return (typeof appInfo.especialidade_medica.name != 'undefined');

            case 'localidade':
                var texto = '';
                if (typeof appInfo.cidade.name != 'undefined')
                    texto = appInfo.cidade.name + ' - ';

                if (typeof appInfo.estado.name != 'undefined')
                    texto += appInfo.estado.name;

                update_menuItem_texto('localidade', texto);
                return (texto != '');

            case 'forma-de-pagamento':
                var name = '';
                if (appInfo.forma_de_pagamento.tipo == 'particular')
                    name = 'Particular';
                else if (appInfo.forma_de_pagamento.tipo == 'plano-de-saude')
                    name = appInfo.forma_de_pagamento.plano_saude.nome;

                update_menuItem_texto('forma-de-pagamento', name);
                return (name != '');

            case 'nome-do-medico':
                update_menuItem_texto('nome-do-medico', appInfo.nome_do_medico.name);
                return (typeof appInfo.nome_do_medico.name != 'undefined');

            default:
                console.warn('Valor inesperado em is_Selected(): ' + ref);
                return false;
        }
    }

    update_menuItem_texto = function(ref, texto)
    {
        if ((texto != '') && (typeof texto != 'undefined'))
        {
            for (var i = 0; i < $scope.menuItems.length; i++) {
                if ($scope.menuItems[i].ref == ref) {
                    $scope.menuItems[i].texto = texto;
                    break;
                }
            }
        }
    }

    $scope.PesquisarMedicos = function ()
    {
        if ($scope.is_Selected('especialidade-medica')
            && $scope.is_Selected('localidade')
            )
        {
            $state.go('busca');
        }
        else
        {
            $scope.modalTitle = 'Erro';

            if (!$scope.is_Selected('especialidade-medica') && !$scope.is_Selected('localidade'))
                $scope.modalContent = 'Os campos "Especialidade Médica" e "Localidade" são de preenchimento obrigatório.';
            else if (!$scope.is_Selected('especialidade-medica'))
                $scope.modalContent = 'Preencha o campo "Especialidade Médica".';
            else if (!$scope.is_Selected('localidade'))
                $scope.modalContent = 'Preencha o campo "Localidade".';

            $ionicModal.fromTemplateUrl('templates/dialog/ok.html', {
                scope: $scope,
                animation: 'slide-in-down'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
    }

    $scope.ModalOk_onClick = function () {
        $scope.modal.hide();
    }
})


/*
    ---------------------------
    BUSCA: Especialidade Médica
    ---------------------------
*/
.controller('EspecialidadeMedicaListaController', function ($scope, appInfo, especialidadeService) {
    $scope.user = appInfo.user;

    $scope.filterItems = function(item)
    {
        return ((typeof item.id == 'undefined') //item "Carregando..." é sempre exibido
                || (typeof $scope.filterHash == 'undefined')
                || ($scope.filterHash == '')
                || (item.name.toLowerCase().indexOf($scope.filterHash.toLowerCase()) !== -1));
    }

    $scope.selectEspecialidade = function (especialidade)
    {
        appInfo.especialidade_medica = especialidade;
    }

    especialidade_sucessCallback = function (response) {
        for (var i = 0; i < response.data.length; i++)
            response.data[i].link = '#/';

        $scope.especialidadeItems = response.data;
    }

    especialidade_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);
    }

    $scope.especialidadeItems = [{name: 'Carregando...', link: '#'}];
    especialidadeService.getAll(especialidade_sucessCallback, especialidade_errorCallback);
})


/*
    -----------------
    BUSCA: Localidade
    -----------------
*/
.controller('LocalidadeController', function ($scope, appInfo, localidadeService) {
    $scope.user = appInfo.user;

    $scope.selectEstado = function () {
        appInfo.estado = $scope.estado;
        appInfo.cidade = {};
    }

    $scope.estado_onChange = function () {
        localidadeService.getCities(cidade_sucessCallback, localidade_errorCallback, $scope.estado.id);
    }

    $scope.selectCidade = function (cidade) {
        appInfo.estado = $scope.estado;
        appInfo.cidade = cidade;
    }

    estado_sucessCallback = function (response) {
        $scope.estadoItems = response.data;
        $scope.estado = response.data[0];

        localidadeService.getCities(cidade_sucessCallback, localidade_errorCallback, $scope.estado.id);
    }

    $scope.filterCidadeItems = function (item) {
        return ((typeof item.id == 'undefined') //item "Carregando..." é sempre exibido
                || (typeof $scope.filterCidadeHash == 'undefined')
                || ($scope.filterCidadeHash == '')
                || (item.name.toLowerCase().indexOf($scope.filterCidadeHash.toLowerCase()) !== -1));
    }

    cidade_sucessCallback = function (response) {
        for (var i = 0; i < response.data.length; i++)
            response.data[i].link = '#/';

        $scope.cidadeItems = response.data;
    }

    localidade_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);
    }

    $scope.cidadeItems = [{ name: 'Carregando...', link: '#' }];

    localidadeService.getStates(estado_sucessCallback, localidade_errorCallback);
})


/*
    -------------------------
    BUSCA: Forma de Pagamento
    -------------------------
*/
.controller('PlanoSaudeListaController', function ($scope, $state, appInfo, planoSaudeService) {
    $scope.user = appInfo.user;

    $scope.filterItems = function (item) {
        return ((typeof item.id == 'undefined') //item "Carregando..." é sempre exibido
                || (typeof $scope.filterHash == 'undefined')
                || ($scope.filterHash == '')
                || (item.nome.toLowerCase().indexOf($scope.filterHash.toLowerCase()) !== -1));
    }

    $scope.selectFormaPagamentoParticular = function () {
        appInfo.forma_de_pagamento.tipo = 'particular';
        appInfo.forma_de_pagamento.plano_saude = {};

        $state.go('home');
    }

    $scope.selectPlanoSaude = function (plano_saude) {
        appInfo.forma_de_pagamento.tipo = 'plano-de-saude';
        appInfo.forma_de_pagamento.plano_saude = plano_saude;
    }

    planoSaude_sucessCallback = function (response) {
        for (var i = 0; i < response.data.length; i++)
            response.data[i].link = '#/';

        $scope.planoSaudeItems = response.data;
    }

    planoSaude_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);
    }

    $scope.planoSaudeItems = [{ name: 'Carregando...', link: '#' }];
    planoSaudeService.getAll(planoSaude_sucessCallback, planoSaude_errorCallback);
})


/*
    --------------
    USUÁRIO: Login
    --------------
*/
.controller('LoginController', function ($scope, $state, $ionicModal, appInfo, usuarioService) {
    $scope.loading = false;

    login_sucessCallback = function (response) {
        appInfo.user.Id = response.data.Id;
        appInfo.user.Foto = response.data.Foto;
        appInfo.user.AuthenticationToken = response.data.AuthenticationToken;
        $scope.loading = false;

        $scope.modalTitle = 'Sucesso';
        $scope.modalContent = 'Logado com sucesso! Clique em "OK" para continuar.';

        $ionicModal.fromTemplateUrl('templates/dialog/ok.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    login_errorCallback = function (response) {
        appInfo.user = {};
        appInfo.user.Foto = 'images/icon-topo-nenhum-medico.png';

        $scope.modalTitle = 'Erro';
        $scope.modalContent = response.data;

        $ionicModal.fromTemplateUrl('templates/dialog/ok.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

        $scope.loading = false;
    }

    $scope.Login = function () {
        if (!$scope.loading)
        {
            $scope.loading = true;
            usuarioService.Login(login_sucessCallback, login_errorCallback, $scope.email, $scope.senha);
        }
    }

    $scope.ModalOk_onClick = function () {
        $scope.modal.hide();
        $state.go('home');
    }
})


/*
    ------------------------
    USUÁRIO: Esqueci a Senha
    ------------------------
*/
.controller('EsqueciSenhaController', function ($scope, $state, appInfo, usuarioService) {
    $scope.loading = false;

    esqueciSenha_sucessCallback = function (response) {
        appInfo.user.Id = response.data.Id;
        appInfo.user.Foto = response.data.Foto;
        appInfo.user.AuthenticationToken = response.data.AuthenticationToken;
        $scope.loading = false;

        $state.go('home');
    }

    esqueciSenha_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);

        $scope.loading = false;
    }

    $scope.RedefinirSenha = function () {
        if (!$scope.loading)
        {
            $scope.loading = true;
            usuarioService.Login(esqueciSenha_sucessCallback, esqueciSenha_errorCallback, $scope.email);
        }
    }
})


/*
    -----------------
    USUÁRIO: Cadastro
    -----------------
*/
.controller('CadastroController', function ($scope, $state, $ionicModal, appInfo, planoSaudeService, usuarioService) {
    $scope.usuario = {};

    planoSaude_sucessCallback = function (response) {
        $scope.planoSaudeItems = response.data;
        $scope.planoSaudeItems.unshift({ id: -1, nome: 'NENHUM' });

        $scope.usuario.plano_saude = $scope.planoSaudeItems[0];
    }

    planoSaude_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);
    }

    $scope.planoSaudeItems = [{ name: 'Carregando...', link: '#' }];
    planoSaudeService.getAll(planoSaude_sucessCallback, planoSaude_errorCallback);

    cadastroUsuario_sucessCallback = function (response) {
        $scope.usuario = {};

        appInfo.user = {};
        appInfo.user.Foto = 'images/icon-topo-nenhum-medico.png';
        appInfo.user.Id = response.data.id;
        // ToDo: esse valor deve ser retornado pela API
        //appInfo.user.Foto = response.data.Foto;
        // ToDo: esse valor deve ser retornado pela API
        //appInfo.user.AuthenticationToken = response.data.AuthenticationToken;
        appInfo.user.AuthenticationToken = '123456789';

        loading = false;

        $scope.modalTitle = 'Sucesso';
        $scope.modalContent = 'Usuário cadastrado com sucesso!';

        $ionicModal.fromTemplateUrl('templates/dialog/ok.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    cadastroUsuario_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);
    }

    var loading = false;
    $scope.Cadastrar = function () {
        if (!loading)
        {
            console.log('Enviando cadastro...');
            loading = true;
            usuarioService.Cadastrar(cadastroUsuario_sucessCallback, cadastroUsuario_errorCallback, $scope.usuario);
        }
    }

    $scope.ModalOk_onClick = function () {
        $scope.modal.hide();
        $state.go('home');
    }
})


/*
    --------------
    BUSCA: Médicos
    --------------
*/
.controller('BuscaController', function ($scope, $state, appInfo, buscaService) {
    var next_page = 0;
    $scope.user = appInfo.user;
    $scope.especialidade_medica = appInfo.especialidade_medica;

    $scope.selectMedico = function (medico) {
        appInfo.medico = medico;
        $state.go('consultas-agendar');
    }

    busca_sucessCallback = function (response) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        next_page++;

        for (var i = 0; i < response.data.length; i++)
            response.data.doctors[i].link = '#/';
        
        $scope.buscaItems = response.data.doctors;
    }

    $scope.$on('$stateChangeSuccess', function () {
        buscaService.getAll(busca_sucessCallback, busca_errorCallback, next_page, 10);
    });

    busca_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);
    }

    $scope.buscaItems = [{ name: 'Carregando...', link: '#' }];
    buscaService.getAll(busca_sucessCallback, busca_errorCallback, next_page, 10);
})


/*
    -------
    AGENDAR
    -------
*/
.controller('AgendarController', function ($rootScope, $scope, $state, $ionicModal, appInfo, medicoService, agendaService) {
    $scope.user = appInfo.user;
    $scope.medico = appInfo.medico;
    $scope.especialidade_medica = appInfo.especialidade_medica;
    $scope.locations = [];
    $scope.data = '';
    $scope.horario = '';

    $scope.loading_agendar = false;

    // carrega informações completas do médico
    // ---------------------------------------
    medicoSucessCallback = function (response) {
        //ToDo: remover
        appInfo.especialidade_medica.id = 3;

        appInfo.medico = response;
        $scope.medico = appInfo.medico;

        //se o médico possuir locais de atendimento
        if ((typeof appInfo.medico.locations != 'undefined') && (appInfo.medico.locations.length > 0)) {

            //para cada local de atendimento
            for (var iLocation = 0; iLocation < appInfo.medico.locations.length; iLocation++)
            {
                var location = appInfo.medico.locations[iLocation];
                //array de horários disponíveis para o local de atendimento
                location.availableAppointmentTimes = [];
                location.appointmentTimesBlacklisted = [];

                //para cada faixa de horários do local de atendimento
                for (var iATR = 0; iATR < location.appointmentTimeRanges.length; iATR++)
                {
                    var appointmentTimeRange = location.appointmentTimeRanges[iATR];
                    //verifica se as faixas de horários atuais realizam atendimentos da especialidade selecionada
                    var realiza_atendimento_da_especialidade = false;
                    for (var iATRS = 0; iATRS < appointmentTimeRange.appointmentTimeRangeSpecialties.length; iATRS++)
                    {
                        //se a especialidade for atendida nestas faixas de horários
                        if (appointmentTimeRange.appointmentTimeRangeSpecialties[iATRS] == appInfo.especialidade_medica.id) {
                            realiza_atendimento_da_especialidade = true;
                            break;
                        }
                    }

                    //se a especialidade for atendida nestas faixas de horários
                    if (realiza_atendimento_da_especialidade)
                    {
                        //tempo em minutos de cada atendimento agendado
                        var gap = appointmentTimeRange.gap;
                        if (gap <= 0)
                            throw 'Parâmetro incorreto: gap = ' + gap + ' para location.id = ' + location.id;

                        //dia da semana do atendimento
                        //0 = domingo
                        var weekday = appointmentTimeRange.weekday;
                        if ((typeof weekday == 'undefined') || (weekday < 0) || (weekday > 6))
                            throw 'Parâmetro incorreto: weekday = ' + weekday + ' para location.id = ' + location.id;

                        var availableAppointmentTimes = {
                            weekday: weekday,
                            gap: gap,
                            appointmentTimes: []
                        };

                        //adicionar horários para atendimento
                        for (var iATRI = 0; iATRI < appointmentTimeRange.appointmentTimeRangeIntervals.length; iATRI++)
                        {
                            var appointmentTimeRangeIntervals = appointmentTimeRange.appointmentTimeRangeIntervals[iATRI];

                            var beginsAt = new Date(appointmentTimeRangeIntervals.beginsAt + appInfo.timezoneOffset);
                            var endsAt = new Date(appointmentTimeRangeIntervals.endsAt + appInfo.timezoneOffset);

                            var currentTime = beginsAt;

                            while (currentTime <= endsAt)
                            {
                                var hours = '0' + currentTime.getHours();
                                hours = hours.substr(-2);

                                var minutes = '0' + currentTime.getMinutes();
                                minutes = minutes.substr(-2);

                                availableAppointmentTimes.appointmentTimes[availableAppointmentTimes.appointmentTimes.length] = {
                                    t: hours + ':' + minutes
                                };

                                //acrescenta gap em minutos
                                currentTime = new Date(currentTime.getTime() + (gap * 60000));
                            }

                            location.availableAppointmentTimes[location.availableAppointmentTimes.length] = availableAppointmentTimes;
                        }
                    }
                }

                //adicionar datas e horários em blacklist
                if (typeof appInfo.medico.appointmentsBlacklist != 'undefined')
                {
                    for (var iABL = 0; iABL < appInfo.medico.appointmentsBlacklist.length; iABL++) {
                        var appointmentsBlacklist = appInfo.medico.appointmentsBlacklist[iABL];
                        if (appointmentsBlacklist.idHealthEntityLocation == location.id)
                        {
                            var startTime = new Date(appointmentsBlacklist.startTime + appInfo.timezoneOffset);
                            var endTime = new Date(appointmentsBlacklist.endTime + appInfo.timezoneOffset);

                            //data inicial
                            var start_year = startTime.getFullYear();

                            var start_month = '0' + (startTime.getMonth() + 1);
                            start_month = start_month.substr(-2);

                            var start_day = '0' + startTime.getDate();
                            start_day = start_day.substr(-2);

                            var start_date = start_year + '-' + start_month + '-' + start_day;

                            //data final
                            var end_year = startTime.getFullYear();

                            var end_month = '0' + (startTime.getMonth() + 1);
                            end_month = end_month.substr(-2);

                            var end_day = '0' + startTime.getDate();
                            end_day = end_day.substr(-2);

                            var end_date = end_year + '-' + end_month + '-' + end_day;

                            var blacklist = {
                                days: [],
                                startTime: startTime,
                                endTime: endTime
                            };

                            //o período de bloqueio compreende apenas um dia
                            if (start_date == end_date) {
                                blacklist.days[0] = start_date;
                            }
                            else { //o período de bloqueio compreende uma faixa de dias
                                var currentTime = startTime;

                                while (currentTime <= startTime) {
                                    var year = currentTime.getFullYear();

                                    var month = '0' + (currentTime.getMonth() + 1);
                                    month = month.substr(-2);

                                    var day = '0' + currentTime.getDate();
                                    day = day.substr(-2);

                                    blacklist.days[blacklist.days.length] = year + '-' + month + '-' + day;

                                    //acrescenta um dia
                                    currentTime = new Date(currentTime.getTime() + 86400000);
                                }
                            }

                            location.appointmentTimesBlacklisted[location.appointmentTimesBlacklisted.length] = blacklist;
                        }
                    }
                }

                appInfo.medico.locations[iLocation] = location;
            }

            $scope.locations = appInfo.medico.locations;
            if ($scope.locations.length > 0)
                $scope.location = $scope.locations[0];
        }

        $scope.horarios = [];
    }

    medicoErrorCallback = function (response) {

    }

    medicoService.get(medicoSucessCallback, medicoErrorCallback, appInfo.medico.id);

    var data_atual = new Date();
    var mes = '0' + (data_atual.getMonth() + 1);
    var dia = '0' + data_atual.getDate();
    data_atual = data_atual.getFullYear() + '-' + mes.substr(-2) + '-' + dia.substr(-2);

    $scope.datetimePicker_beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        for (var iDates = 0; iDates < $dates.length; iDates++)
        {
            var dataObj = new Date($dates[iDates].localDateValue());
            var weekday = dataObj.getDay();

            mes = '0' + (dataObj.getMonth() + 1);
            dia = '0' + dataObj.getDate();
            var data = dataObj.getFullYear() + '-' + mes.substr(-2) + '-' + dia.substr(-2);

            //datas passadas nunca são selecionáveis
            if (data < data_atual)
                $dates[iDates].selectable = false;
            else {
                //verifica se o dia está disponível para agendamento
                var dia_disponivel = false;
                for (var iAAT = 0; iAAT < $scope.location.availableAppointmentTimes.length; iAAT++)
                {
                    //é um dia disponível?
                    var availableAppointmentTimes = $scope.location.availableAppointmentTimes[iAAT];
                    if (weekday == availableAppointmentTimes.weekday)
                    {
                        //verifica se blacklist todos os horários do dia
                        var blacklist_todos_horarios_dia = false;
                        if ($scope.location.appointmentTimesBlacklisted.length > 0)
                        {
                            for (var iATBL = 0; iATBL < $scope.location.appointmentTimesBlacklisted.length; iATBL++)
                            {
                                var appointmentTimesBlacklisted = $scope.location.appointmentTimesBlacklisted[iATBL];
                                
                                //se a black list for composta por um período maior do que apenas um dia
                                //e a data atual do calendário não for nem a primeira nem a última data
                                //do período considerado pela blacklist, então a data simplesmente deve
                                //ser bloqueada por completo.
                                //ex: blaclist entre 2015-11-04T15:00 e 2015-11-06T12:00:00
                                //    significa que todo o dia 2015-11-05 com certeza estará bloqueado.
                                //
                                //    Porém, para o primeiro dia (2015-11-04) a regra não vale pois podem haver
                                //    horários disponíveis anteriores às 15h.
                                //
                                //    O mesmo vale para o último dia (2015-11-06), que pode ter horários
                                //    disponíveis a partir das 12h.
                                //
                                //    Os casos específicos de primeiro e último dia NÃO são tratados pelo
                                //    trecho a seguir
                                if ((appointmentTimesBlacklisted.days.length > 1)
                                    && (data > appointmentTimesBlacklisted.days[0])
                                    && (data < appointmentTimesBlacklisted.days[appointmentTimesBlacklisted.days.length - 1])
                                    )
                                {
                                    //dia_disponivel já é igual a "false", então apenas
                                    //interrompe o for (var iATBL; iATBL < $scope.location.appointmentTimesBlacklisted.length; iATBL++)
                                    break;
                                }
                                else
                                {
                                    var blacklistedTimes = [];

                                    var beginsAt = null;
                                    var endsAt = null;

                                    var data_em_periodo_de_blacklist = false;

                                    //se a data for o início do período
                                    if (data == appointmentTimesBlacklisted.days[0])
                                    {
                                        data_em_periodo_de_blacklist = true;

                                        //o bloqueio deve iniciar no horário informado
                                        beginsAt = appointmentTimesBlacklisted.startTime;

                                        //se o período for maior que apenas um dia
                                        if (appointmentTimesBlacklisted.days.length > 1) {
                                            //o bloqueio deve ocorrer até o final do dia
                                            endsAt = new Date(data + 'T23:59:59' + appInfo.timezoneOffset);
                                        }
                                        else { //senão, se o período for de apenas um dia
                                            //o bloqueio deve ocorrer até o horário informado
                                            endsAt = appointmentTimesBlacklisted.endTime;
                                        }
                                    }
                                    else if (data == appointmentTimesBlacklisted.days[appointmentTimesBlacklisted.days.length - 1]) //senão, se a data for o último dia do período
                                    {
                                        data_em_periodo_de_blacklist = true;

                                        //o bloqueio deve iniciar na primeira hora do dia
                                        beginsAt = new Date(data + 'T00:00:00' + appInfo.timezoneOffset);

                                        //o bloqueio deve finalizar no horário informado
                                        endsAt = appointmentTimesBlacklisted.endTime;
                                    }

                                    if (data_em_periodo_de_blacklist)
                                    {
                                        //verifica se há algum horário fora da faixa de blacklist
                                        var algum_horario_fora_faixa = false;
                                        for (var iAT = 0; iAT < availableAppointmentTimes.appointmentTimes.length; iAT++)
                                        {
                                            var horario = new Date(data + 'T' + availableAppointmentTimes.appointmentTimes[iAT].t + ':00' + appInfo.timezoneOffset);

                                            if ((horario.getTime() < beginsAt.getTime()) || (horario.getTime() > endsAt.getTime()))
                                            {
                                                algum_horario_fora_faixa = true;
                                                break;
                                            }
                                        }

                                        if (!algum_horario_fora_faixa)
                                            blacklist_todos_horarios_dia = true;
                                    }
                                }
                            }
                        }
                        else
                            dia_disponivel = true;

                        if (!blacklist_todos_horarios_dia)
                            dia_disponivel = true;

                        break;
                    }
                }

                if (!dia_disponivel)
                    $dates[iDates].selectable = false;
            }
        }
    }

    $scope.location_onChange = function () {
        $rootScope.$broadcast('datetimepicker-reload');
    }

    $scope.onTimeSet = function (newDate, oldDate) {
        $scope.horarios = [];
        var horarios_disponiveis = [];

        //data selecionada
        var mes = '0' + (newDate.getMonth() + 1);
        var dia = '0' + newDate.getDate();
        $scope.data = newDate.getFullYear() + '-' + mes.substr(-2) + '-' + dia.substr(-2);

        //percorre array de horários de agendamentos
        var weekday = newDate.getDay();
        for (var iAAT = 0; iAAT < $scope.location.availableAppointmentTimes.length; iAAT++)
        {
            //localiza o array de horários correspondente a data (weekday) selecionada
            var availableAppointmentTimes = $scope.location.availableAppointmentTimes[iAAT];
            if (availableAppointmentTimes.weekday == weekday)
            {
                //percorre array de horários para inserção em horarios_disponiveis
                for (var iAT = 0; iAT < availableAppointmentTimes.appointmentTimes.length; iAT++)
                {
                    var horario = new Date($scope.data + 'T' + availableAppointmentTimes.appointmentTimes[iAT].t + ':00' + appInfo.timezoneOffset);

                    //verifica se o horário não está em blacklist
                    var horario_esta_em_balcklist = false;
                    for (var iATB = 0; iATB < $scope.location.appointmentTimesBlacklisted.length; iATB++)
                    {
                        var appointmentTimesBlacklisted = $scope.location.appointmentTimesBlacklisted[iATB];
                        
                        //se o horário estiver dentro de uma blacklist,
                        //sinaliza isso em flag e finaliza o "for"
                        if ((horario.getTime() >= appointmentTimesBlacklisted.startTime.getTime())
                            && (horario.getTime() <= appointmentTimesBlacklisted.endTime.getTime()))
                        {
                            horario_esta_em_balcklist = true;
                            break;
                        }
                    }

                    if (!horario_esta_em_balcklist)
                    {
                        var horas = '0' + horario.getHours();
                        var minutos = '0' + horario.getMinutes();

                        horarios_disponiveis[horarios_disponiveis.length] = { t: horas.substr(-2) + ':' + minutos.substr(-2) };
                    }
                }

                $scope.horarios = horarios_disponiveis;

                //como só existe um array de horários para cada "weekday",
                //se o array já foi localizado, o "for" pode ser encerrado
                break;
            }
        }
    }

    $scope.SelectHorario = function (horario) {
        for (var i = 0; i < $scope.horarios.length; i++)
            $scope.horarios[i].selected = false;

        horario.selected = true;

        $scope.horario = horario.t;
    }

    agendaSucessCallback = function (response) {
        console.log(response);

        if (response.status == 'ok')
            $scope.modalTitle = 'Sucesso';
        else
            $scope.modalTitle = 'Erro';

        $scope.modalContent = 'Agendamento realizado com sucesso!';
        if (response.observacao != '')
            $scope.modalContent += '<br /><br /><strong>Observação:</strong> ' + response.observacao;

        if (response.erroEnvioEmail != '')
            $scope.modalContent += '<br /><br /><strong>Atenção:</strong> ' + response.erroEnvioEmail;

        $ionicModal.fromTemplateUrl('templates/dialog/ok.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });

        $scope.loading_agendar = false;
    }

    $scope.ModalOk_onClick = function () {
        $scope.modal.hide();
        $state.go('minhas-consultas');
    }

    agendaErrorCallback = function (response) {
        $scope.loading_agendar = false;
    }

    $scope.AgendarConsulta = function () {
        //ToDo: remover - INÍCIO
        //----------------------
        console.log('idUserPatient: ' + appInfo.user.Id);

        if ((appInfo.forma_de_pagamento.tipo == 'plano-de-saude')
            && (appInfo.forma_de_pagamento.plano_saude.id > 0))
        {
            console.log('patientLicenseNumber: ' + appInfo.forma_de_pagamento.plano_saude.id);
        }

        console.log('idDoctor: ' + appInfo.medico.id);
        console.log('locationId: ' + $scope.location.id);
        console.log('specialtyId: ' + appInfo.especialidade_medica.id);
        console.log('appointmentDateTime: ' + $scope.data + 'T' + $scope.horario);
        //-------------------
        //ToDo: remover - FIM

        //ToDo: se paciente não estiver logado, exibir tela para login

        if (!$scope.loading_agendar)
        {
            $scope.loading_agendar = true;

            var agendamentoInfo = {
                idUserPatient: appInfo.user.Id,
                idDoctor: appInfo.medico.id,
                locationId: $scope.location.id,
                specialtyId: appInfo.especialidade_medica.id,
                appointmentDateTime: $scope.data + 'T' + $scope.horario
            };

            if ((appInfo.forma_de_pagamento.tipo == 'plano-de-saude')
                && (appInfo.forma_de_pagamento.plano_saude.id > 0)) {

                agendamentoInfo.patientLicenseNumber = appInfo.forma_de_pagamento.plano_saude.id;
            }

            agendaService.Agendar(agendaSucessCallback, agendaErrorCallback, agendamentoInfo);
        }
    }
})



/*
    ----------------
    MINHAS CONSULTAS
    ----------------
*/
.controller('MinhasConsultasController', function ($scope, $state, $ionicModal, appInfo, usuarioService) {
    $scope.loading = false;

    usuarioSucessCallback = function (response) {
        $scope.loading = false;
    }

    usuarioErrorCallback = function (response) {
        $scope.loading = false;
    }

    if (!$scope.loading)
    {
        $scope.loading = true;

        usuarioService.getInfo(usuarioSucessCallback, usuarioErrorCallback, appInfo.user.Id);
    }
})
;

//ToDo: remover
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}