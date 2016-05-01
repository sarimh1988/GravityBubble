<script type="text/javascript" src="js/jquery-1.11.2.js"></script>
<link rel="stylesheet" href="css/animatedbubble/style.css"> 
<style type="text/css">

.tag-sub-menu-cloud-bubble
{    
  	background-color: #D9F9D9;
    margin: 0 0 2px;
    padding: 0 3px 4px 0;
    text-align: center;
    width: 100px;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
}
.red .tag-sub-menu-cloud-bubble{left:0;}
.tag-sub-menu-cloud-bubble li
{
    background-color: #4572A7;
    border: 1px solid #2C486B;
    color: #FFFFFF;
    margin-bottom: -1px;
    padding: 5px;
    text-align:center;
}

</style>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script type="text/javascript" src="js/animatedbubble/animatedbubble.js"></script>
<script type="text/javascript">

var overallclouddata = [];
var posArray = new Array("Voda Rocks", "Good service", "Great reception", "Strong");
var negArray = new Array("Voda Sucks", "Bad master voda", "Bad service", "Bad reach");
var cmnArray = new Array("Vodafone", "Reception", "Reach", "Voda");
var weightArray = new Array(40, 30, 20, 10);

for (var i = 0; i < 4; i++) { 
	//JS Object
	var worddatapos =  {name: posArray[i] , count: parseInt(weightArray[i]) , id: "postag"+i, type: "positive", graph: "overall",  color: "green",  senti: "1"};
	overallclouddata.push(worddatapos);
}		

for (var i = 0; i < 4; i++) { 
	var worddataneg =  {name: negArray[i] , count: parseInt(weightArray[i]) , id: "negtag"+i, type: "negative", graph: "overall",  color: "red",  senti: "-1"};
	overallclouddata.push(worddataneg);
}

for (var i = 0; i < 4; i++) { 
	var worddatacmn =  {name: cmnArray[i] , count: parseInt(weightArray[i]) , id: "cmntag"+i, type: "neutral", graph: "overall",  color: "blue",  senti: "A"};
	overallclouddata.push(worddatacmn);
}


$(function() {
	  var plot;
	  plot = Bubbles();
	  
	  if(overallclouddata!=[] && overallclouddata.length>0){
		  return plotData("#overallbubblediv", overallclouddata, plot);
	  }else{
		  $('#overallbubblediv').html("No data present");
	  }
	  
	});

</script>
  
<div id="overallWordCloudDivTable" style="overflow:hidden;">
	<div></div>
	<div id="container1" class="container1">
	    <div id="main">
	    	<div id="overallbubbleactiondiv" align="center"></div>
	      	<div id="overallbubblediv"></div>
	    </div>
	</div> 

</div>