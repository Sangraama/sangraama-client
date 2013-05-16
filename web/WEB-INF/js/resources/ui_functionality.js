// JavaScript Document




function remove_last_elements(block,row,num_of_elements){
	
	$('#txt_'+block+'_'+row).addClass('hidden');
	var i;
	for(i=4; i>(4-num_of_elements);i--){
	$('#drpdwn_'+block+'_'+row+'_'+i).html('');
	$('#drpdwn_'+block+'_'+row+'_'+i).addClass('hidden');
	}
	
}

var block_rows=new Array(); // an arry to store the block numbers and row numbers.
    block_rows[1]=1; 
	block_rows[2]=1;
	block_rows[3]=1;
	block_rows[4]=1;
	
function show_all_elements(block,row,num_of_elements){
	
	$('#txt_'+block+'_'+row).removeClass('hidden');
	var i;
	for(i=2; i<= num_of_elements;i++){
	$('#drpdwn_'+block+'_'+row+'_'+i).html('<option>--Please Select--</option>');
	$('#drpdwn_'+block+'_'+row+'_'+i).removeClass('hidden');
	
	}
}

function removeRow(block,row){
	
	row_id="#row_"+block+"_"+row;
	$(row_id).empty();
	
}

function createNewRow(block){

block_rows[block]+=1; 
row=block_rows[block];

var row_string="\
<div class='rows' id='row_"+block+"_"+row+"'>\
<div class='pull-right'>\
		      <img src='images/minus.png' onclick='removeRow("+block+","+row+")'/>\
</div>\
\
<select class='level1 span3' id='drpdwn_"+block+"_"+row+"_1'>\
<option value='0'>--Please Select--</option>\
<option value='0'>-Events-</option>\
<option value='voice'>Voice</option>\
<option value='sms'>SMS</option>\
<option value='mms'>MMS</option>\
<option value='data'>Data</option>\
<option value='topup'>Topup</option>\
<option value='0'>-Subscriber Categories-</option>\
<option value='life_style'>Life Style</option>\
<option value='entertainment'>Entertainment</option>\
<option>-Profiles-</option>\
<option value='pizza_lover'>Pizza Lover</option>\
<option value='type_writer'>Type Writer</option>\
<option value='senior_citizen'>Senior Citizen</option>\
<option value='0'>-Subscriber Demographics-</option>\
<option value='gender'>Gender</option>\
<option value='tarrif_plan'>Tarrif plan</option>\
<option value='nationality'>Nationality</option>\
</select> \
\
<select class='level2 span3' id='drpdwn_"+block+"_"+row+"_2'>\
<option value='0'>--Please Select--</option>\
\
</select>\
\
 <select class='level3  report-input-left' id='drpdwn_"+block+"_"+row+"_3'>\
<option value='0'>--Please Select--</option>\
</select>\
\
 <select class='level4 hidden span2' id='drpdwn_"+block+"_"+row+"_4'>\
<option value='0'>--Please Select--</option>\
</select>\
 <input id='txt_"+block+"_"+row+"' type='text' class='span2 right'/>\
</div><!-- end of the row -->";

	
	$(row_string).insertBefore('#row_'+block+'_1');
}


function doStuff(){
	
 $('#chk_whitelisted_subs').click(
			 function(){
				 $('#whitelist-add-content').toggleClass('hidden');
			  }
	)
 
 $('#chk_blacklisted_subs').click(
			 function(){
				 $('#blacklist-add-content').toggleClass('hidden');
			  }
	)
 
 $('#pre_notifi_add_new_0').click(
			 function(){
				 $('#blacklist-add-content').toggleClass('hidden');
			  }
	)
 
 $('#tangible_rewards').click(
			 function(){
				if(document.getElementById("radio_usage").checked){
					  $('#tangible_rewards_content2').toggleClass('hidden');
				}
				 else{
				$('#tangible_rewards_content').toggleClass('hidden');
				
				 }
			  }
	)
 
  $('#intangible_rewards').click(
			 function(){
			
			if(document.getElementById("radio_usage").checked){
				
				$('#intangible_rewards_content2').toggleClass('hidden');
				
				}
				 else{
				
				$('#intangible_rewards_content').toggleClass('hidden');
				
				 }
				
			  }
	)
 
 $('.sk').click(
			 function(){
				 $('#tangible_rewards_content').addClass('hidden');
				  $('#tangible_rewards_content2').addClass('hidden');
				   $('#intangible_rewards_content').addClass('hidden');
				  $('#intangible_rewards_content2').addClass('hidden');
				  document.getElementById('tangible_rewards').checked=false;
				  document.getElementById('intangible_rewards').checked=false;
			  }
	)
 
 $(".level1").live('change',function (event){
	
	
	var elem_id=event.target.id;						 							  
	var block_number=elem_id.charAt(elem_id.indexOf('_')+1);
	var row_number=elem_id.charAt(elem_id.lastIndexOf('_')-1);
	var lvl2_dd_id="#drpdwn_"+block_number+"_"+row_number+"_2"; //getting the second drop down id
	var dd_content="";
	//alert(lvl2_dd_id);
	show_all_elements(block_number,row_number,3);
	if ($(this).val()==0)
		remove_last_elements(block_number,row_number,3);
	
	switch($(this).val()){
		
		
	
	case 'voice':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option value='c_to_sa'>Calls to South Asia</option>\
					<option value='num_of_calls'>No of Calls</option>\
					<option value='duration'>Duration</option>\
					<option value='country'>Country</option>";
					show_all_elements(block_number,row_number,3);
 	
	break;
	
	case 'sms':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option value='num_of_sms'>No of SMS's</option>\
					<option value='country'>Country</option>\
					<option value='sms_to_sa'>SMS to South Asia</option>";
 					show_all_elements(block_number,row_number,3);
	break;
	
	case 'mms':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option value='num_of_mms'>No.of MMS's</option>\
					<option  value='country'>Country</option>";
	    			show_all_elements(block_number,row_number,3);
	break;
	
	case 'data':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option value='usage'>Usage</option>\
					<option></option>";
	    			show_all_elements(block_number,row_number,3);
	break;
	
	case 'topup':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option value='topup_type'>Topup type</option>\
					<option value='topup_amount'>Topup amount</option>";
	    			show_all_elements(block_number,row_number,3);
	break;
	case 'movie_lover':
	case 'pizza_lover':
	case 'type_writer':
	case 'senior_citizen':
	remove_last_elements(block_number,row_number,3); //removing the unnessary fields from the row
	break;
	
	case 'life_style':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option>Pizzahut calls</option>\
					<option>SMS to CNN</option>";
					remove_last_elements(block_number,row_number,2);				   
	break;
	
	case 'entertainment':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option value='sms_to_golden_village'>SMS to Golden Village</option>";
					remove_last_elements(block_number,row_number,2);
	break;
	
	case 'gender':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option>Male</option>\
					<option>Female</option>";
					remove_last_elements(block_number,row_number,2);
	   
	break;
	
	case 'tarrif_plan':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option>M1 Family</option>\
					<option>M1 Buddies</option>";
					remove_last_elements(block_number,row_number,2);
	    	
	break;
	
	case 'nationality':
		dd_content=" \
					<option value='0'>--Please Select--</option>\
					<option>Sri Lankan</option>\
					<option>Indian</option>\
					<option>Singaporean</option>\
					<option>Chinese</option>";
					remove_last_elements(block_number,row_number,2)
	   	
	break;
	}
	$(lvl2_dd_id).html(dd_content); 
	
		}
		
	
	)

/*=============================================================================================== */

 $('.level2').live('change', function(event){
				
	var elem_id=event.target.id;						 							  
	var block_number=elem_id.charAt(elem_id.indexOf('_')+1);
	var row_number=elem_id.charAt(elem_id.lastIndexOf('_')-1);
	var lvl3_dd_id="#drpdwn_"+block_number+"_"+row_number+"_3"; //getting the 3rd drop down id
	var lvl4_dd_id="#drpdwn_"+block_number+"_"+row_number+"_4"; //getting the 4th drop down id
	//alert(lvl3_dd_id);
	var lvl3_dd_content="";
	var lvl4_dd_content="";
				

				//alert($(this).val());
				
					switch($(this).val()){
					case 'country':
					
					lvl3_dd_content="\
					<option>equals</option>\
					<option>not equal</option>";
					
					
					lvl4_dd_content="\
					<option>Sri Lanka</option>\
					<option>India</option>\
					<option>Singapore</option>";
					
					$(lvl4_dd_id).removeClass('hidden');
					$('#txt_'+block_number+'_'+row_number).addClass('hidden');
					//alert(block_number);
					$(lvl4_dd_id).html(lvl4_dd_content);
					break;
					
					
					case 'topup_type':
					
					lvl3_dd_content="\
					<option>equals</option>\
					<option>not equal</option>";
					
					
					lvl4_dd_content="\
					<option>28</option>\
					<option>29</option>\
					<option>30</option>";
					
					$(lvl4_dd_id).removeClass('hidden');
					$('#txt_'+block_number+'_'+row_number).addClass('hidden');
					$(lvl4_dd_id).html(lvl4_dd_content);
					
					//alert("im in country");
					break;
					
					case 'topup_amount':
					lvl3_dd_content="\
					<option>greater than</option>\
					<option>equals</option>\
					<option>less than</option>\
					<option>greater than or equal</option>\
					<option>less than or equal</option>\
					<option>not equal</option>";
					$(lvl4_dd_id).addClass('hidden');
					$('#txt_'+block_number+'_'+row_number).removeClass('hidden');
					$(lvl4_dd_id).html(lvl4_dd_content);
					
					break;
					
					case 'Male':
					case 'Female':
					case 'Sri Lankan':
					case 'Indian':
					case 'Singaporean':
					case 'Chinese':
					case 'M1 Family':
					case 'M1 Buddies':
					remove_last_elements(block_number,row_number,2);
					break;
					
					default:
					lvl3_dd_content="\
					<option>greater than</option>\
					<option>less than</option>\
					<option>greater than or equal</option>\
					<option>less than or equal</option>\
					<option>not equal</option>";
					
					$(lvl4_dd_id).addClass('hidden');
					$('#txt_'+block_number+'_'+row_number).removeClass('hidden');
										
					}
					
					
					$(lvl3_dd_id).html(lvl3_dd_content);
					
				
		   }
	)
 

 
}

/*****************************************************************************************************/

function w_wl_content(){ //write whitelist content
	if(document.getElementsByName("ws")[0].checked)
	document.getElementById("whitelist-add-content").style.display="block";
	else
	document.getElementById("whitelist-add-content").style.display="none";
}
	
	
function w_notify_content(id){ //write notify content
	//alert("I'm working my id is "+id);
	document.getElementById("notify_"+id).style.display="block";
	var i;
	for(i=0;i<2;i++){
		if (i==id)
		continue;
	document.getElementById("notify_"+i).style.display="none";		
		
	}

}

function w_email_header(mt,val){
	if(mt=="email")
	document.getElementById("email-header-"+val).style.display="block";
	else
	document.getElementById("email-header-"+val).style.display="none";
	
}
	
function w_winner_notification(sender){ //write whitelist content
switch(sender){
	
	case 'wn':
	if(document.getElementsByName("wn")[0].checked)
	document.getElementById("winner-notification-1").style.display="block";
	else
	document.getElementById("winner-notification-1").style.display="none";
	break;
	
	case 'pn':
	
	if(document.getElementsByName("pn")[0].checked)
	{
	document.getElementById("pre-notification-1").style.display="block";
	
	}
	else
	{
	document.getElementById("pre-notification-1").style.display="none";
	}
	break;
	
}
}







