// Google Reader Content Retrieve
// version 2.0
// 2010-09-06
// ==UserScript==
// @name          Google Reader Content Retrieve
// @namespace     http://google.com/reader/greasemonkey/content
// @description   Retrieve content in Google Reader.
// @include    http*://reader.google.com/*
// @include    http*://www.google.com/reader/*
// @include    http*://google.com/reader/*
// ==/UserScript==

(function(){
    var siteParser = {
        "hk.rd.yahoo.com": function(syhidden, text){
            return contentParse(syhidden, text, {search:"id=\"ynstory\"", stripTags:["table","script"]});
        },
        "mysinablog.com": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"post_content\""});
        },
        "blog.xuite.net": function(syhidden, text){
            return contentParse(syhidden, text, {search: "class=\"blogbody\""});
        },
        "blog.roodo.com": function(syhidden, text){
            return contentParse(syhidden, text, {search: "class=\"blogbody\""});
        },
        "hk.myblog.yahoo.com": function(syhidden, text){
            return contentParse(syhidden, text, {search: "class=\"main-bd\""});
        },
        "www.zonaeuropa.com": function(syhidden, text){
            text = text.replace("<body>","<body><div id=\"zonaeuropa-com-body\">");
            text = text.replace("</body>","</div></body>");
            return contentParse(syhidden, text, {search: "id=\"zonaeuropa-com-body\""});
        },
        "blog.yam.com": function(syhidden, text){
            return contentParse(syhidden, text, {search: "class=\"articleBody\""});
        },
        "www.littleoslo.com": function(syhidden, text){
            return contentParse(syhidden, text, {search: "class=\"hentry-content clear\"", stripTags:["script","iframe"]});
        },
        "feeds.feedburner.com/~r/moliu-OLOGY/": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"post_content\""});
        },
        "feeds.feedburner.com/~r/mr6/": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"contenttext\""});
        },
        "wanszezit.wordpress.com": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"storycontent\""});
        },
        "hompy.netvigator.com": function(syhidden, text){
            return contentParse(syhidden, text, {search:/class="body"/});
        },
        "www.wretch.cc/blog": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"innertext\""});
        },
        "feeds.feedburner.com/~r/danjalin/": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class='post-body'"});
        },
        "www.appleactionews.com": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"article\""});
        },
        "feeds.feedburner.com/~r/mmdays/": function(syhidden, text){
            return contentParse(syhidden, text, {search:"class=\"entry\""});
        }
    };

    function contentParse(syhidden, text, params){
        //params: search, replace, id, stripTags
        params.stripTags = params.stripTags || []; //default value
        params.replace = params.replace || "id=\"google-reader-content-retrieve-siteParser-content\"";
        params.id = params.id || "google-reader-content-retrieve-siteParser-content";
        var text2 = extractTagByStr(text,"body"); //detect body content and only include them
        text2 = text2.replace(params.search,params.replace);
        syhidden.innerHTML = text2;
        var content = document.getElementById(params.id);
        stripTagsFromNode(content, params.stripTags);
        return content.innerHTML;
    }

    function extractTagByStr(t,tag){
        if(tag && t.match(new RegExp("<"+tag+"[^>]*>","gim")) && t.match(new RegExp("<\/"+tag+">","gim"))){
            var t2 = t.substring(t.indexOf("<"+tag),t.indexOf("</"+tag+">")).replace(new RegExp("<"+tag+"[^>]*>","gim"));
            if(t2) return t2;
        }
        return t;
    }

    function stripTagsFromNode(node,tags){
        for(var i=0; i<tags.length; i++){
            var ts = node.getElementsByTagName(tags[i]);
            for(var j=0; j<ts.length; j++){
               ts[j].parentNode.removeChild(ts[j]);
            }
            ts = null;
        }
        return node;
    }

    function parseCurrentEntry() {
        var currentEntry = document.getElementById("current-entry");
        if (!currentEntry) return null;
        
        //return null if already retrieved
        var entryDivs = currentEntry.getElementsByTagName("DIV");
        for(var i=0; i<entryDivs.length; i++){
            if(entryDivs[i].className && entryDivs[i].className == "rssget-fullContent") 
                return null;
        }

        var articleLink = currentEntry.getElementsByTagName("A")[0];
        var key = null;
        if (articleLink) {
            for(var k in siteParser){
                if(articleLink.href.indexOf(k)!=-1){
                    key = k;
                    break;
                }
            }
        }

        if (key) {
            var divs = currentEntry.getElementsByTagName("DIV");
            var currentContent = null;
            for(var i=0; i<divs.length; i++){
                if(divs[i].className && divs[i].className == "item-body"){
                    currentContent = divs[i].firstChild; //div.item-body > div:eq(0)
                }
            }

            return {key:key, currentEntry:currentEntry, articleLink:articleLink, currentContent:currentContent };
        }
        else {
          return null;
        }
    }

    function addMarker(event) {
    	var isCurrentEntry = (event.relatedNode.ownerElement.tagName == "DIV") && (event.attrName == "id") && (event.new_Value == "current-entry");
	    if(isCurrentEntry){
			var result = parseCurrentEntry();
			//console.log(result);
			if (result) {
				var rssgetdiv = document.getElementById("rssget-getdiv");
		        if(!rssgetdiv){
					rssgetdiv = document.createElement('DIV');
					rssgetdiv.id = "rssget-getdiv";
		        	rssgetdiv.className = "rssget-getdiv";
		        	rssgetdiv.style.marginBottom = "10px";
		        	rssgetdiv.innerHTML = "<img src='data:image/gif;base64,R0lGODlhCwALALMAAFHGKVLGKsXrucrtvkvFIvX781PGLFXHL/f89fD67cntvVLGK////1XHLgAAAAAAACH5BAAAAAAALAAAAAALAAsAAAQ2kKVxmm0qMbSW7d6CKF7DnJ8SlCfzAQeLNosRt3jdmThtEDIXDSDYmT4LRcF46SBOioslw4gAADs=' style='margin-right:5px;'/>";

		        	var rssgetlink = document.createElement("a");
		        	rssgetlink.innerHTML = "Retrieve content";
		        	rssgetlink.href = "javascript:void(0)";
		        	rssgetlink.addEventListener("click", doRssget, false);

		        	rssgetdiv.appendChild(rssgetlink);
		        }
				result.currentContent.appendChild(rssgetdiv);
			}
	    }
    }

    function doRssget() {
        var result = parseCurrentEntry();
        if (result) {
          //alert(result.currentContent.getElementsByClassName);
			if (result.currentContent.getElementsByClassName) {
				var rssgetlink = result.currentContent.getElementsByClassName("rssget-getdiv");
				if (rssgetlink && rssgetlink.length > 0) rssgetlink[0].style.display = "none";
			}

            result.currentContent.innerHTML += "<img src='data:image/gif;base64,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%3D%3D'/>";
            GM_xmlhttpRequest({
                method: "GET",
                url: result.articleLink.href,
                onload: function(response){
                    if(response.status == 301 || response.status == 302 || response.status == 303){ //moved
                        var loc = /Location: ([^\n]*)\n/.exec(response.responseHeaders)[1];
                        GM_xmlhttpRequest({method:"GET", url:loc, onload:arguments.callee});
                        return;
                    }
                    var syhidden = document.getElementById("sinablog-yahoonews-hidden");
                    if(!syhidden){
                        syhidden = document.createElement("sinablog-yahoonews-hidden");
                        syhidden.style.display = "none";
                        document.body.appendChild(syhidden);
                    }
                    var resultHtml = siteParser[result.key](syhidden,response.responseText);
                    result.currentContent.innerHTML = "<div class='rssget-fullContent'>" + resultHtml + "</div>";
                    syhidden.innerHTML = ""; //clean up
                }
            });
        }
    }

    // Function to handle the keypress events
    function LinkKey(event) {
        // Get the key pressed in string format
        var k = String.fromCharCode(event.which);

        if (k == "g"){
            doRssget();
        }
    }

    // Add listener for to handle the keypress events.
    document.addEventListener("keypress", LinkKey, true);

    // add supported
    document.getElementById("viewer-box-inner").addEventListener("DOMAttrModified", addMarker, 0);
})(document);
