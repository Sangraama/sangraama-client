function injectFacebox(){

    var fbcode= "\
<div class='boxes'><div id='sccf' class='window'> \
<table width='100%' border='0' cellspacing='0' cellpadding='0' class='faceboxtable'>\
   <tr>\
    <td class='mcontent'>Please Select a Campaign Type</td>\
  </tr>\
  <tr>\
    <td class='mbutton'><table width='100%' border='0' cellspacing='0' cellpadding='0'>\
        <tr>\
          <td width='45%' align='center'> <div class='span2'><a href='/campaign-management/createCampaign/main.html' style='cursor:pointer'><img src='/campaign-management/themes/m1-orange/images/reward.png' title='Normal flow'/></div>\
		  <div class='flow-dialog-label'>Normal Flow</div></a></td>\
          <td width='9%'>&nbsp;</td>\
          <td width='45%' align='center'><div class='span2'> <a href='/campaign-management/bulkRewards/createBulkMain.html' style='cursor:pointer'><img src='/campaign-management/themes/m1-orange/images/bulk-reward.png' title='Bulk Rewards'/></div>\
		  <div class='flow-dialog-label'>Bulk Rewards</div></a></td>\
		  <td width='1%'>&nbsp;</td>\
		  \
        </tr>\
      </table></td>\
  </tr>\
  \
</table>\
\
</div></div>";

    $('#sccf').remove();
    $(fbcode).insertBefore('#mask');
    $('body').append($('#sccf').parent())

}





