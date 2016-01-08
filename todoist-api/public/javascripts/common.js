/**
 * Created by jin on 2016. 1. 9..
 */


(typeof global == 'undefined' ? window : global).commonUtils = commonUtils = {

    common : {},
    constants : {},
    value : {},
    data : {},
    net : {},
    draw : {},
    func : {},
    templates : {}
};

commonUtils.func.getList = function() {

    var apikey = $('#ti-apikey').val();

    if(apikey.length == 0) {
        alert('Todoist에 있는 APIKEY를 입력하세요.');
        return;
    }

    $.get('/form/form.html', function(form) {

        $.ajax({
            type : 'get',
            url : '/api/{token}'.replace('{token}', apikey),
            dataType : 'json',
            success : function(res) {

                if(res.success) {

                    console.log(res);

                    var content = [];
                    for(var i in res.data.list) {
                        var item = res.data.list[i];

                        content.push(item.content);

                    }

                    var resultForm = form.replace('{content}', content.join('<br>'));
                    resultForm = resultForm.replace('{date}', res.data.date).replace('{name}', res.data.name);

                    $('#ti-resut').html(resultForm);


                } else {

                    alert(res.error);

                }

            },
            error : function(err) {
                alert('네트워크오류입니다.');
            }
        });

    });



};