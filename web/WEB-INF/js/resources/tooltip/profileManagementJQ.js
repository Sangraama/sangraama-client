/**
 * Created by IntelliJ IDEA.
 * User: Prabath
 * Date: 1/31/12
 * Time: 10:00 AM
 * To change this template use File | Settings | File Templates.
 */

function getInnerHtmlForBlock1(){

// var innerHtml1=(' <div class="offset13">  ' +
//      	'<select class="span2"><option selected="selected">Any</option><option>All</option> ' +
//        '<option>None</option></select> of the following are true. '+
//
//        '<div class="plus_minus pull-right"> ' +
//		' <img class="blockAdd" src="../themes/m1-orange/images/plus_d.png"/> ' +
//       ' <img class="blockRm" src="../themes/m1-orange/images/minus_d.png"/>' +
//
//       ' </div> '+
//       ' </div>'+
//
//
//        '<div class="offset13"> '+
//
//          '   <select class="eventSelect"> ' +
//              '<option>SMS to Golden Village</option>' +
//			   '<option>Pizza Hut Calls</option>' +
//           ' </select> ' +
//
//            '<select class="conditionSelect"> ' +
//       		' <option>Greater than</option> ' +
//             ' <option>Less than</option> ' +
//             ' <option selected="selected">Equals</option> ' +
//             ' <option>Greater than or equal</option> ' +
//             ' <option>Less than or equal</option> ' +
//             ' <option>Not equal</option>' +
//        	'</select> ' +
//
//           ' <input type="text" class="span2 right" value="20" /> ' +
//
//
//               ' <div class="pull-right"> ' +
//               ' <img class="rowAdd" src="../themes/m1-orange/images/plus.png" /> ' +
//               ' <img  class="rowRm" src="../themes/m1-orange/images/minus.png"/> ' +
//               ' </div> ' +
//       ' </div>' + '<hr />'  )


//   return innerHtml1
}

function getInnerHtmlForRow1(){
//    var innerHtml1= (
//
//         '<select class="eventSelect"> ' +
//
//           ' </select> ' +
//
//
//            '<select class="conditionSelect"> ' +
//       		' <option>Greater than</option> ' +
//             ' <option>Less than</option> ' +
//             ' <option selected="selected">Equals</option> ' +
//             ' <option>Greater than or equal</option> ' +
//             ' <option>Less than or equal</option> ' +
//             ' <option>Not equal</option>' +
//        	'</select> ' +
//
//           ' <input type="text" class="span2 right" value="20" /> ' +
//
//            '    <div class="plus_minus pull-right"> ' +
//
//          '      <img class="rowRm" src="../themes/m1-orange/images/minus.png"/> ' +
//         '       </div> '
//         )
//
//     return innerHtml1

 }


 var rowsInBlock=Array();          // For storing the number of rows in a block....
     rowsInBlock["rowBlock"]=0;


  $(document).ready(function() {
      /*

      block adder
       */

      $(".blockAdd").live("click",function(){


        var hidnVal=$(".topH").attr("value");
        var intVal=parseInt(hidnVal)
        var newDiv=$("<div></div>")
        $(newDiv).attr("id",("row block-seperator"+(++intVal)))
        $(".topH").attr("value",(intVal))
        $(newDiv).html(getInnerHtmlForBlock1())
        $(newDiv).css("padding-left","45px")
		$(newDiv).addClass("block-seperator");
        $(newDiv).css("padding-right","0px")
        $("#logicF1").append(newDiv)
        if(rowsInBlock[$(newDiv).attr("id")]==null) rowsInBlock[$(newDiv).attr("id")]=1
        else rowsInBlock[$(newDiv).attr("id")] +=1



      });

     /*

     row adder
      */

      $(".rowAdd").live("click",function(ele){
        var blockDiv=$($($($(this).parent()).parent()).parent())
       if(rowsInBlock[$(blockDiv).attr("id")]==null){
          rowsInBlock[$(newDiv).attr("id")]=1}
       else rowsInBlock[$(blockDiv).attr("id")] +=1

        var newDiv=$("<div></div>")
        $(newDiv).attr("id",$(blockDiv).attr("id")+"R"+rowsInBlock[$(blockDiv).attr("id")])
        $(newDiv).attr("class","offset13")
        $(newDiv).html(getInnerHtmlForRow1())
        $(newDiv).insertBefore($($($(this).parent()).parent()))


      });

    /*

    row remover...
     */
      $(".rowRm").live("click",function(ele){

       var blockDiv=$($($($(this).parent()).parent()).parent())
       rowsInBlock[$(blockDiv).attr("id")] -=1
       $(this).parent().parent().remove()
      });


    /*

    block remover
     */
      $(".blockRm").live("click",function(){
       var blockDiv=$($($($(this).parent()).parent()).parent())
       rowsInBlock[$(blockDiv).attr("id")] =null
       $(blockDiv).remove()


      });

   });



