var logContainer = document.querySelector('#history .container.logs');
var scoreElem = document.querySelector('.score-total strong');
var scoreProgressBar = document.querySelector('#scores .progress-bar');
var selectElem = document.querySelector('.form-score select');
var submitElem = document.querySelector('.form-score button');
var db = openDatabase('scoreboard', '0.0.1', '', 1024 * 1024);
db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS histories (date, score)');
  tx.executeSql('SELECT * FROM histories ORDER BY rowid DESC', null,
                function(tx, result) {
                  var logs = '';
                  for (var i = 0, l = result.rows.length; i < l; i ++) {
                    var item = result.rows.item(i);
                    logs += renderLog(item);
                    updateRow(item);
                  }
                  logContainer.innerHTML += logs;
                });
  function updateRow(item) {
    if (!/^\d+$/.test(item.date)) {
      var date  = +new Date(item.date);
      tx.executeSql('UPDATE histories SET date=? WHERE date=?',
                    [date, item.date]);
    }
  }
  updateScore(tx);
});

function updateScore(tx) {
  tx.executeSql('SELECT SUM(score) sum FROM histories', null,
    function(tx, result) {
      var sum = result.rows.item(0).sum;
      scoreElem.innerHTML = sum;
      scoreProgressBar.style.width = (sum / 10) + '%'
    }
  );
}

function renderLog(log) {
  var date = new Date(log.date);
  var dateStr = date.getFullYear() +
    '-' + (date.getMonth() || 12) +
    '-' + date.getDate();
  return '<div class="row log"><div class="col-xs-6 date">' +
    dateStr + '</div><div class="col-xs-6 score">' +
    (0 < log.score ? '获得' : '扣除') + '积分<strong>' +
    Math.abs(log.score) + '</strong></div></div>';
}

function addScore(event, form) {
  event.preventDefault();
  var colorEnable = '#95a5a6';
  var colorDisable = 'whitesmoke';
  submitElem.style.background = colorDisable;
  submitElem.disabled = true;
  db.transaction(function(tx) {
    var date = new Date();
    tx.executeSql('INSERT INTO histories (date, score) VALUES (?, ?)',
                  [ date, selectElem.value],
                  function(tx, result) {
                    setTimeout(function () {
                      submitElem.style.background = colorEnable;
                      submitElem.disabled = false;
                    }, 1000);

                    updateScore(tx);
                    logContainer.innerHTML = renderLog({
                      date: date,
                      score: selectElem.value
                    }) + logContainer.innerHTML;
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
