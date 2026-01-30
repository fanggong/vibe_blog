(function(){
  function setLangLabel(code) {
    var match = code.className.match(/language-([^\s]+)/);
    if (!match) return;
    var lang = match[1];
    if (!lang) return;
    var label = lang.length <= 3 ? lang.toUpperCase() : lang.replace(/-/g, ' ');
    var pre = code.parentElement;
    if (pre && !pre.dataset.lang) {
      pre.dataset.lang = label;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve, reject){
      try {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function addCopyButton(pre, code) {
    if (!pre || pre.querySelector('.code-copy')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.setAttribute('aria-label', 'Copy code');
    button.textContent = 'Copy';
    button.addEventListener('click', function(){
      var text = code.textContent || '';
      copyText(text).then(function(){
        var original = button.textContent;
        button.textContent = 'Copied';
        button.setAttribute('data-copied', 'true');
        setTimeout(function(){
          button.textContent = original;
          button.removeAttribute('data-copied');
        }, 1600);
      });
    });
    pre.classList.add('has-copy');
    pre.appendChild(button);
  }

  function enhanceCodeBlocks(){
    document.querySelectorAll('pre > code').forEach(function(code){
      setLangLabel(code);
      addCopyButton(code.parentElement, code);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
  } else {
    enhanceCodeBlocks();
  }
})();
