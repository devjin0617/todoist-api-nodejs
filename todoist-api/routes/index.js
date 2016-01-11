var express = require('express');
var router = express.Router();

var request = require('request');
var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api/:token/:key', function(req, res, next) {

  if(!req.params.token) {
    return res.send({
      success : false,
      data : '',
      error : 'token is empty'
    });
  }

  var API_URL = {
    login : '/API/v6/login',
    api : '/API/v6/sync'
  };

  var requestList = [];

  if(req.params.key != 'result') {
    requestList.push(req.params.key);
  } else {
    requestList = ['items', 'user'];
  }

  var tokenData = {
    token : req.params.token,
    seq_no : 0,
    resource_types : JSON.stringify(requestList)
  };

  request({
    url: 'https://todoist.com' + API_URL.api,
    method: "POST",
    headers : {
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify(tokenData)
  }, function (error, response, body){

    if(error) {
      return res.send({
        success : false,
        data : '',
        error : 'todoist api error'
      })
    }

    var rootData = JSON.parse(body);

    if(req.params.key != 'result') {

      var key = 'Users';
      switch (req.params.key) {
        case 'projects' :
          key = 'Projects';
              break;
        case 'labels' :
          key = 'Labels';
              break;
      }

      return res.send({
        success : true,
        data : rootData[key]
      });
    }

    var projectList = ['159854596', '159854554', '159854580'];
    projectList = projectList.join(',');

    var myList = [];
    for(var i in rootData.Items) {
      var item = rootData.Items[i];

      var isAdd = false;

      var strLabel = item.labels.join(',');

      if(strLabel.indexOf('176470') > -1 && projectList.indexOf(item.project_id.toString()) > -1) {
        isAdd = true;
      }

      if(item.id == 15970338) {
        isAdd = false;
      }

      if(item.content.indexOf('————————————') > -1 || item.content.indexOf('공통관련 이슈') > -1) {
        isAdd = false;
      }

      if(isAdd) {

        if(new Date(item.due_date).format("yyyy-MM-dd") == new Date().format("yyyy-MM-dd")) {

          var space = '';
          for(var j=1; j<item.indent; j++) {
            space += '-';
          }

          if(space.length == 0) {
            space = '<br>';
          }

          item.content = space + item.content;

          myList.push(item);
        }

      }

    }

    myList.reverse();

    console.log(myList);

    console.log(rootData.User);

    return res.send({
      success : true,
      data : {
        date : new Date().format('yyyy-MM-dd'),
        name : rootData.User.full_name,
        list : myList
      }
    });

  });

});


Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
    switch ($1) {
      case "yyyy": return d.getFullYear();
      case "yy": return (d.getFullYear() % 1000).zf(2);
      case "MM": return (d.getMonth() + 1).zf(2);
      case "dd": return d.getDate().zf(2);
      case "E": return weekName[d.getDay()];
      case "HH": return d.getHours().zf(2);
      case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm": return d.getMinutes().zf(2);
      case "ss": return d.getSeconds().zf(2);
      case "a/p": return d.getHours() < 12 ? "오전" : "오후";
      default: return $1;
    }
  });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

module.exports = router;
