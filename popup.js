function selectItemByValue(elmnt, value){
    for(var i=0; i < elmnt.options.length; i++) {
        if(elmnt.options[i].value == value){
            elmnt.selectedIndex = i;
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    var submit = document.getElementById('go_search');
    var query = document.getElementById('q');
    var where = document.getElementById('where');
    document.forms['search_form'].elements['q'].focus();
    var page = "";
    chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tab) {
        var domain = tab[0].url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
        page = domain;
    });

    chrome.storage.local.get(null, function(items){
        if(items.hasOwnProperty("lastUsedEngine")){
            selectItemByValue(where, items.lastUsedEngine);
        }
    });

    function openSearch(){
        var engine = where.value;
        chrome.storage.local.set({"lastUsedEngine": engine}, function() {
            message('Settings saved');
        });
        var q = query.value;
        var url = false;
        if(q.length > 0){
            switch (engine) {
                case "google":
                    url = "https://google.com/search?client=opera&sourceid=opera&ie=UTF-8&oe=UTF-8&q="+q+" site:"+page
                break;
                case "yandex":
                    url = "http://yandex.ru/yandsearch?text="+q+"&l10n="+window.navigator.language+"&site="+page
                break;
            }
            if(url){
                chrome.tabs.create( { "url": "" + url} );
                window.close();
            }
        }
    }
    submit.addEventListener('click', openSearch);
});
