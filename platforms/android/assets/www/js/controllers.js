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
            || $scope.is_Selected('localidade')
            || $scope.is_Selected('forma-de-pagamento')
            //|| $scope.is_Selected('nome-do-medico')
            )
        {
            $state.go('busca');
        }
        else
        {
            $scope.modalTitle = 'Erro';
            $scope.modalContent = 'Preencha pelo menos um dos critérios de busca.';

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
    var loading = false;

    login_sucessCallback = function (response) {
        appInfo.user.Id = response.data.Id;
        appInfo.user.Foto = response.data.Foto;
        appInfo.user.AuthenticationToken = response.data.AuthenticationToken;
        loading = false;

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

        loading = false;
    }

    $scope.Login = function () {
        if (!loading)
        {
            loading = true;
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
    var loading = false;

    esqueciSenha_sucessCallback = function (response) {
        appInfo.user.Id = response.data.Id;
        appInfo.user.Foto = response.data.Foto;
        appInfo.user.AuthenticationToken = response.data.AuthenticationToken;
        loading = false;

        $state.go('home');
    }

    esqueciSenha_errorCallback = function (response) {
        //ToDo: tratar erro
        console.log(response);

        loading = false;
    }

    $scope.Login = function () {
        if (!loading)
        {
            loading = true;
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
.controller('BuscaController', function ($scope, appInfo, buscaService) {
    var next_page = 0;
    $scope.user = appInfo.user;

    $scope.selectMedico = function (medico) {
        appInfo.medico = medico;
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
;