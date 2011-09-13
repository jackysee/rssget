//Mocking
var content = "content of ynstory <b>important!</b>";
var responseText = "<p>abcd efghi <script>alert('abc');</script> defgh <div class='yom-art-content'><div class='bd'>"+content+"</div></div></p>";

function GM_xmlhttpRequest(obj){
	var resp;
	if(obj.url == 'http://moved/3cmusiccom'){
		resp = {status:301, responseHeaders: 'Location: http://movedto\n'};
	}
	else if(obj.url == 'http://movedto'){
		resp = {responseText:"<div><div class='entry-content'>"+content+"</div></div>"};
	}
	else{
		resp = {responseText:responseText};
	}
	obj.onload(resp);
}


$(document).ready(function(){


    test("get current entry", function(){
        ok(getCurrentEntry()===emptyDiv, 'current entry not found');
        $('div.testEntry').attr('id', 'current-entry');
        ok(getCurrentEntry()!==null, 'current entry found');
    });
    
    test("current entry first link", function(){
        $('div.testLink').attr('id', 'current-entry');
        var current = getCurrentEntry();
        equal(getCurrentLink(), 'http://www.abc.com/1234');
    });
    
    
    test("current entry match parser", function(){
        $('div.testParser').attr('id', 'current-entry');
        var parser = getCurrentParser();
        equal(parser.selector, 'div.yom-art-content div.bd');
        equal(parser.link, 'http://hk.news.yahoo.com/45768');
    });
    
    test("hidden div exists", function(){
        ok(hiddenDiv!==null, 'hidden div exists');
    });
    
    test("strip script", function(){
        var str = "<p>abcd efghi <script>alert('abc');</script> defgh</p>";
        equal(stripScript(str), "<p>abcd efghi  defgh</p>");
    });
    
    test("get content from text, with script stripped", function(){
        var str = responseText;
        equal(getContent(str, "div.yom-art-content div.bd"), content);
    });
    
    test("test get item div", function(){
        $('div.testReplaceContent').attr('id', 'current-entry');
        equal(getItemDiv().innerHTML, 'old content');
    });
    
    test("test replace content", function(){
        $('div.testReplaceContent').attr('id', 'current-entry');
        replaceContent('123 abc');
        equal(getItemDiv().innerHTML, '123 abc');
    });
    
    test("append loader", function(){
        $('div.testReplaceContent').attr('id', 'current-entry');
        appendLoader();
        ok(getItemDiv().innerHTML.indexOf('old content<img src=')===0);
    });
    
    
    test("retrieve story", function(){
        $('div.testRetrieveStory').attr('id', 'current-entry');
        retrieveCurrentContent();
        equals(currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML, content);
        
        //Should retrieve again
        currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML = "new content";
        retrieveCurrentContent();
        equals(currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML, content);
    });
	
	asyncTest("redirect", function(){
		start();
		$('div.testMoved').attr('id', 'current-entry');
		stop();
		setTimeout(function(){
			start();
			retrieveCurrentContent();
			stop();
			setTimeout(function(){
				start();
				equals(currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML, content);
			}, 110);
		},110);
	});
    
    test("test no current entry", function(){
        var parser = getCurrentParser();
        equals(parser, null);
    });
    
    asyncTest("append marker", function(){
        $('div.testAppendMarker1').attr('id', 'current-entry');
        setTimeout(function(){
            start();
            
            var item = getItemDiv();
            equal(item.querySelectorAll('img').length, 1);
            ok(item.innerHTML.indexOf('Retrieve content')!==-1);
            
            $('div.testAppendMarker1').removeAttr('id');
            $('div.testAppendMarker2').attr('id', 'current-entry');
            
            stop();
            
            setTimeout(function(){
                start();    
                equal(item.querySelectorAll('img').length, 1);
                ok(item.innerHTML.indexOf('Retrieve content')!==-1);
            }, 110);
            
        }, 110);

    });


});