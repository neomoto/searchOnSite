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
    var searchOptions = [];
    document.forms['search_form'].elements['q'].focus();
    var page = "";
    chrome.tabs.query({lastFocusedWindow: true, active: true}, function(tab) {
        var domain = tab[0].url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
        page = domain;
    });

    chrome.storage.local.get(null, function(items){
        if(items.hasOwnProperty("searchExtOptions")){
            searchOptions = items.searchExtOptions;

            var html = "";
            searchOptions.forEach(function(element, index, array){
                html +='<option value="'+element.name+'">'+element.name+'</option>';
            });
            where.innerHTML = html;
        }
        if(items.hasOwnProperty("lastUsedEngine")){
            selectItemByValue(where, items.lastUsedEngine);
        }
    });

    function openSearch(){
        var engine = where.value;
        chrome.storage.local.set({"lastUsedEngine": engine}, function() {});
        var q = query.value;
        var url = false;
        searchOptions.forEach(function(element, index, array){
            if(engine === element.name){
                if(q.length > 0){
                    url = element.url.replace("%s", q).replace("%i", page);
                }
            }
        });
        if(url){
            chrome.tabs.create( { "url": "" + url} );
            window.close();
        }
    }
    submit.addEventListener('click', openSearch);
});
