function enableCampaignCreation () {
    try {
//        $('.tTip').betterTooltip({speed:150, delay:300});

        //Hide div w/id extra
        $("#wap_push_1").css("display","none");
        $("#cas_1").css("display","none");
        $("#down_1").css("display","none");
        $("#test_1").css("display","none");
    } catch (e) {
        alert(e)
    }

    try {
        $("#chk_wap_push_1").click(function(){

            //alert($(this).attr("class"));
            // If checked

            if ($(this).attr("class")=="colpsd")
            {
                //show the hidden div
                $("#chk_wap_push_1").removeClass("colpsd").addClass("expndd");
                $("#wap_push_1").show("fast");
            }
            else
            {
                //otherwise, hide it

                $("#wap_push_1").hide("fast");
                $("#chk_wap_push_1").removeClass("expndd").addClass("colpsd");

            }

        });

        $("#chk_cas_1").click(function(){

            // If checked
            if ($(this).attr("class")=="colpsd")
            {
                //show the hidden div
                $("#chk_cas_1").removeClass("colpsd").addClass("expndd");
                $("#cas_1").show("fast");
            }
            else
            {
                //otherwise, hide it
                $("#cas_1").hide("fast");
                $("#chk_cas_1").removeClass("expndd").addClass("colpsd");

            }
        });

        $("#chk_down_1").click(function(){

            // If checked
            if ($(this).attr("class")=="colpsd")
            {
                //show the hidden div
                $("#chk_down_1").removeClass("colpsd").addClass("expndd");
                $("#down_1").show("fast");
            }
            else
            {
                //otherwise, hide it
                $("#down_1").hide("fast");
                $("#chk_down_1").removeClass("expndd").addClass("colpsd");
            }
        });

        $("#chk_test_1").click(function(){

            // If checked
            if ($(this).attr("class")=="colpsd")
            {
                //show the hidden div
                $("#chk_test_1").removeClass("colpsd").addClass("expndd");
                $("#test_1").show("fast");
            }
            else
            {
                //otherwise, hide it
                $("#test_1").hide("fast");
                $("#chk_test_1").removeClass("expndd").addClass("colpsd");
            }
        });
    } catch (e) {
        alert(e)
    }
}

function installListenersForTabs(index) {
    var i = index;
    for (i = index; i > 0; i--) {
        var tabname = "div.stripNav li.tab" + i + " a";
        jQuery(tabname).each(function(z1) {
            this.halt = false;
        });
        var tabName = 'tab' + i;
        document.getElementById(tabName).style.opacity = '1';
    }
}

function hideTabs(tabCount) {

    window.location='#1';
    var i = tabCount;
    for (i = tabCount; i > 1; i--) {
        var tab = 'tab' + i;
        document.getElementById(tab).style.opacity = '0.2';
    }

    jQuery('div.stripNav li.tab1 a').each(function(x){
        this.halt=false;
    });
}