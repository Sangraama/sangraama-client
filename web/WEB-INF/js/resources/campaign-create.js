function enableCampaignCreation () {
    try {
//        $('.tTip').betterTooltip({speed:150, delay:300});

        //Hide div w/id extra
        $("#sms1").css("display", "block");
        $("#sms2").css("display", "block");
        $("#wap_push").css("display", "block");
        $("#cas").css("display", "block");
        $("#down").css("display", "block");
        $("#test").css("display", "block");
    } catch (e) {
        alert(e)
    }


    // Add onclick handler to checkbox w/id checkme
    try {
        $("#chk_sms").click(function () {

            // If checked
            if ($("#chk_sms").is(":checked")) {
                //show the hidden div
                $("#sms1").show("fast");
                $("#sms2").show("fast");
            }
            else {
                //otherwise, hide it
                $("#sms1").hide("fast");
                $("#sms2").hide("fast");
            }
        });
    } catch (e) {
        alert(e)
    }

    try {
        $("#chk_wap_push").click(function () {

            //alert($(this).attr("class"));
            // If checked

            if ($(this).attr("class") == "colpsd") {
                //show the hidden div
                $("#chk_wap_push").removeClass("colpsd").addClass("expndd");
                $("#wap_push").show("fast");
            }
            else {
                //otherwise, hide it

                $("#wap_push").hide("fast");
                $("#chk_wap_push").removeClass("expndd").addClass("colpsd");

            }

        });

        $("#chk_cas").click(function () {

            // If checked
            if ($(this).attr("class") == "colpsd") {
                //show the hidden div
                $("#chk_cas").removeClass("colpsd").addClass("expndd");
                $("#cas").show("fast");
            }
            else {
                //otherwise, hide it
                $("#cas").hide("fast");
                $("#chk_cas").removeClass("expndd").addClass("colpsd");

            }
        });

        $("#chk_down").click(function () {

            // If checked
            if ($(this).attr("class") == "colpsd") {
                //show the hidden div
                $("#chk_down").removeClass("colpsd").addClass("expndd");
                $("#down").show("fast");
            }
            else {
                //otherwise, hide it
                $("#down").hide("fast");
                $("#chk_down").removeClass("expndd").addClass("colpsd");
            }
        });

        $("#chk_test").click(function () {

            // If checked
            if ($(this).attr("class") == "colpsd") {
                //show the hidden div
                $("#chk_test").removeClass("colpsd").addClass("expndd");
                $("#test").show("fast");
            }
            else {
                //otherwise, hide it
                $("#test").hide("fast");
                $("#chk_test").removeClass("expndd").addClass("colpsd");
            }
        });
    } catch (e) {
        alert(e)
    }
}