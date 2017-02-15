// CUSTOMIZAÇÕES QUATRO DIGITAL
// BKP
(function() {
    (function() {
        var script = document.createElement('script');
        var tag = document.getElementsByTagName('script')[0];
        script.src = 'https://code.jquery.com/jquery-3.1.1.min.js';
        tag.parentNode.insertBefore(script, tag);

        var r = false;
        script.onload = script.onreadystatechange = function() {
            if ( !r && (!this.readyState || this.readyState == 'complete') ) {
                r = true;
                (function() {
                    var script = document.createElement('script');
                    var tag = document.getElementsByTagName('script')[0];
                    script.src = 'https://qd-lab-cdn.github.io/qd-intranet/ponto4.js';
                    tag.parentNode.insertBefore(script, tag);
                })();
            }
        };
    })();
})();