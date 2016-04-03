/**
  @author Denis Baskovsky
  @description консоль на которой отображаются все cc.warn, cc.error и catch ошибки
 */
window.addEventListener('load', function () {
  var $gameCanvas = cc.$('#gameCanvas');

  var $console = (function () {
    var div = cc.$new('div');
    div.style.display = 'block';
    div.style.zIndex = '999';
    div.style.display = 'block';
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.top = '0';

    return div;
  }());

  var $textarea = (function () {
    var textarea = cc.$new('textarea');
    textarea.id = 'textarea';
    textarea.style.width = '100%';
    textarea.style.height = '200px';
    textarea.style.background = 'rgba(0,0,0,0.5)';
    textarea.style.color = '#FFF';
    textarea.hidden = true;

    return textarea;
  }());
  $console.appendChild($textarea);
  $gameCanvas.parentElement.appendChild($console);

  var $checkbox = (function () {
    var input = cc.$new('input');
    input.type = 'checkbox';
    input.id = 'checkbox';
    input.value = 'off';
    input.onchange = function() {
      var isHidden = input.value !== 'off';
      input.value = (isHidden ? 'off' : 'on');
      $textarea.hidden = isHidden;
    };

    return input;
  }());
  $console.appendChild($checkbox);

  var $label = (function () {
    var label = cc.$new('label');
    label.htmlFor = 'checkbox';
    label.style.color = '#FF0';
    label.textContent = 'Open/Close debug panel';

    return label;
  }());
  $console.appendChild($label);

  getVersion();

  /**
   * Получить версию из манифеста
   */
  function getVersion() {
    cc.loader.loadJson('manifest.webapp', function (err, data) {
      cc.log(data.name);
      cc.log('Ver: ' + data.version);
      cc.log('----------------------');
    });
  }

  /**
   * Добавить новую надпись на панели дебага
   * @param text {string|object|array}
   * @param type {string} на основе типа выводится цвет текста
   */
  function appendNewLine(text, type) {
    var value = '';

    switch (typeof text) {
      case 'string':
        value = text;
        break;
      case 'object':
        value = [].join.apply(text);
        break;
      default:
        break;
    }

    if (type === 'log') {
      value = value + '\n';
    } else {
      value = type.toUpperCase() + ': ' + value + '\n';
    }

    $textarea.value += value;
    $textarea.scrollTop = $textarea.scrollHeight;
  }

  cc.log = function () {
    console.log.apply(console, arguments);

    return appendNewLine(arguments, 'log');
  };

  cc.warn = function () {
    console.warn.apply(console, arguments);

    return appendNewLine(arguments, 'warn');
  };

  cc.error = function () {
    console.error.apply(console, arguments);

    return appendNewLine(arguments, 'error');
  };

  window.onerror = function () {
    return appendNewLine(arguments, 'error');
  };

});