//Mocking

var responseText = "<p>abcd efghi <script>alert('abc');</script> defgh <div id='ynstory'>content of ynstory <b>important!</b></div></p>";

function GM_xmlhttpRequest(obj){
    var resp = {responseText:responseText};
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
        equal(parser.selector, '#ynstory');
        equal(parser.link, 'http://hk.rd.yahoo.com/45768');
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
        equal(getContent(str, "#ynstory"), "content of ynstory <b>important!</b>");
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
        equals(currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML, "content of ynstory <b>important!</b>");
        
        //Should retrieve again
        currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML = "new content";
        retrieveCurrentContent();
        equals(currentEntry.querySelectorAll('div.item-body>div')[0].innerHTML, "content of ynstory <b>important!</b>");
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