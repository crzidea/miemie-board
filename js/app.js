var db = openDatabase('scoreboard', '', '', 1024 * 1024);
db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS histories (date DATE, score INT)');
  tx.executeSql('SELECT SUM(score) sum FROM histories', null,
                function(tx, result) {
                  var sum = result.rows.item(0).sum;
                  var elem = document.querySelector('.score-total strong');
                  elem.innerHTML = sum;
                  var progressBar = document.querySelector('#scores .progress-bar');
                  progressBar.style.width = (sum / 10) + '%'
                });
  tx.executeSql('SELECT * FROM histories ORDER BY rowid DESC', null, function(tx, result) {
    var logs = '';
    for (var i = 0, l = result.rows.length; i < l; i ++) {
      var v = result.rows.item(i);
      var date = new Date(v.date);
      var dateStr = date.getFullYear() +
        '-' + (date.getMonth() || 12) +
        '-' + date.getDate();
      logs += '<div class="row log"><div class="col-xs-6 date">' +
        dateStr + '</div><div class="col-xs-6 score">获得积分<strong>' +
        v.score + '</strong></div></div>';
    }
    var container = document.querySelector('#history .container');
    container.innerHTML += logs;
  });
});

function addScore(event, form) {
  event.preventDefault();
  var select = document.querySelector('.form-score select');
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO histories (date, score) values (?, ?)',
                  [ new Date, select.value],
                  function(tx, result) {
                  });
  });
}

function changeScore(event, select) {
  var str = ('0' + select.value).slice(-3);
  var spans = document.querySelectorAll('.form-score .number');
  for (var i = 0, l = str.length; i < l; i ++) {
    spans[i].innerHTML = str[i];
  }
}
