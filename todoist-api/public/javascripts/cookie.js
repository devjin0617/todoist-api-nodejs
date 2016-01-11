function setCookie(cookieName, value, exdays, path){

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());

    if(path != undefined) {
        cookieValue = cookieValue + '; path=' + path;
    }

    document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName, path){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);

    var c = cookieName + "= " + "; expires=" + expireDate.toGMTString();
    if(path != undefined) {
        c = c + '; path=' + path;
    }

    document.cookie = c;
}

function getCookie(cookieName, path) {

    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}