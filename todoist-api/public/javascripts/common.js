/**
 * Created by jin on 2016. 1. 9..
 */


(typeof global == 'undefined' ? window : global).commonUtils = commonUtils = {

    common : {},
    constants : {},
    value : {},
    data : {},
    net : {},
    util : {},
    draw : {},
    func : {},
    modal : {},
    templates : {}
};

$(function() {
    $(document).ready(function() {
        commonUtils.common.init();
    });
});

commonUtils.templates.modal = undefined;

commonUtils.common.init = function() {

    var token = getCookie('token');

    if(token.length > 0) {
        $('#ti-apikey').val(token);
    }

};

commonUtils.net.getList = function(data) {

    var apiKey = $('#ti-apikey').val();

    setCookie('token', apiKey, 7);

    if(apiKey.length == 0) {
        alert('Todoist에 있는 APIKEY를 입력하세요.');
        return;
    }

    $.ajax({
        type : 'get',
        url : '/api/{token}/{key}'.replace('{token}', apiKey).replace('{key}', data.key),
        dataType : 'json',
        success : function(res) {

            if(res.success) {

                if(data.success != undefined) {
                    data.success(res);
                } else {
                    console.log(res);
                }

            } else {

                commonUtils.util.progress({
                    show : false
                });


                if(data.error != undefined) {
                    data.error(res);
                } else {
                    alert('데이터를 받아오지 못했습니다.');
                    console.log(res);
                }

            }

        },
        error : function(err) {

            commonUtils.util.progress({
                show : false
            });


            if(data.error != undefined) {
                data.error(err);
            } else {
                console.log(err);
                alert('네트워크오류입니다.');
            }
        }
    });

};

commonUtils.util.progress = function(params) {

    if(params.show == undefined) {
        return;
    }

    if(params.show) {

        $('.ti-progress').removeClass('hide');

    } else {

        $('.ti-progress').addClass('hide');

    }

};

commonUtils.modal.open = function(key) {

    commonUtils.util.progress({
        show : true
    });

    var doModal = function() {

        commonUtils.util.progress({
            show : true
        });

        commonUtils.net.getList({
            key : key,
            success : function(res) {

                commonUtils.util.progress({
                    show : false
                });

                var replaceForm = commonUtils.templates.modal;

                var li = '<li class="list-group-item list-row" data-id="{id}">{row}</li>';
                var content = '';
                switch (key) {
                    case 'projects' :
                        replaceForm = replaceForm.replace('{title}', '프로젝트목록');
                        replaceForm = replaceForm.replace('{key}', 'projects');
                        for (var i in res.data) {
                            var item = res.data[i];
                            content += li.replace('{row}', item.name).replace('{id}', item.id);
                        }

                        break;
                    case 'labels' :
                        replaceForm = replaceForm.replace('{title}', '라벨목록');
                        replaceForm = replaceForm.replace('{key}', 'labels');
                        for (var i in res.data) {
                            var item = res.data[i];
                            content += li.replace('{row}', item.name).replace('{id}', item.id);
                        }

                        break;
                    default :
                        break;

                }

                replaceForm = replaceForm.replace('{content}', content);

                $('#ti-modal-warp').html(replaceForm);

                $('.list-row').click(function() {

                    if($(this).hasClass('active')) {
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                    }

                });

                $('#ti-modal').modal();

            }
        });

    };


    if(commonUtils.templates.modal == undefined) {

        $.get('/form/modal.html', function(form) {

            commonUtils.util.progress({
                show : false
            });

            commonUtils.templates.modal = form;

            doModal();
        });

    } else {
        doModal();
    }

};

commonUtils.func.saveItem = function(key) {

    var self = '';
    switch (key) {
        case 'projects' :
            self = '#ti-project-list';
            break;
        case 'labels' :
            self = '#ti-label-list';
            break;
        case 'string' :
            self = '#ti-string-list';
            break;
        default :
            break;
    }

    $(self).html('');
    for(var i=0; i<$('.modal-body .list-group').find('li.active').length; i++) {
        var $item = $('.modal-body .list-group').find('li.active').eq(i);


        $(self).html($item);

    }



};

commonUtils.func.getList = function() {

    commonUtils.util.progress({
        show : true
    });

    $.get('/form/form.html', function(form) {

        commonUtils.net.getList({
            key : 'result',
            success : function(res) {

                commonUtils.util.progress({
                    show : false
                });

                var content = [];
                for(var i in res.data.list) {
                    var item = res.data.list[i];

                    content.push(item.content);

                }

                var resultForm = form.replace('{content}', content.join('<br>'));
                resultForm = resultForm.replace('{date}', res.data.date).replace('{name}', res.data.name);

                $('#ti-resut').html(resultForm);

            }
        });


    });



};