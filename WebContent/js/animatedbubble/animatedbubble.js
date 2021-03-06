  var Bubbles, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;


  Bubbles = function() {
    var chart, clear, click, collide, collisionPadding, connectEvents, data, force, gravity, hashchange, height, jitter, label, margin, maxRadius, minCollisionRadius, mouseout, mouseover, node, def, rScale, rValue, tagValue,colorValue, typeValue,graphValue, colorChange, textValue, tick, transformData, update, updateActive, updateLabels, updateNodes, width;
   
    width = 990;
    height = 600;
    data = [];
    node = null;
    label = null;
    margin = {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0
    };
    maxRadius = 50;
    rScale = d3.scale.sqrt().range([0, maxRadius]);
    rValue = function(d) {
      return parseInt(d.count);
    };
    tagValue = function(d) {
    	if(d.id!=undefined && d.id!='undefined' && d.id!=null){
			return d.id;
		}else{
			return "null";
		}
    };
    graphValue = function(d) {
    	if(d.graph!=undefined && d.graph!='undefined' && d.graph!=null){
    		return d.graph;
    	}else{
    		return "null";
    	}
    };
    
    colorValue = function(d) {
	    if(d.color!=undefined && d.color!='undefined' && d.color!=null){
	    	return "fill:url(#"+d.color+"Circle)";
		}else{
			//default color: light green
			return "fill:url(#greenCircle)";
		}
	    
    };
    typeValue = function(d) {
		if(d.type!=undefined && d.type!='undefined' && d.type!=null){
			return d.type;
		}else{
			return "null";
		}
    };
    colorChange = function(d) {
    	return "fill:url(#greyCircle)";
    };
    textValue = function(d) {
      return d.name;
    };
    sentiValue = function(d) {
    	if(d.senti!=undefined && d.senti!='undefined' && d.senti!=null){
			return d.senti;
		}else{
			return "A";
		}
    };
    collisionPadding = 4;
    minCollisionRadius = 12;
    jitter = 0.5;
    transformData = function(rawData) {
      rawData.forEach(function(d) {
        d.count = parseInt(d.count);
        return rawData.sort(function() {
          return 0.5 - Math.random();
        });
      });
      return rawData;
    };
    tick = function(e) {
      var dampenedAlpha;
      dampenedAlpha = e.alpha * 0.1;
      node.each(gravity(dampenedAlpha)).each(collide(jitter)).attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      return label.style("left", function(d) {
        return ((margin.left + d.x) - d.dx / 2) + "px";
      }).style("top", function(d) {
        return ((margin.top + d.y) - d.dy / 2) + "px";
      });
    };
    
    chart = function(selection) {
      return selection.each(function(rawData) {
        var maxDomainValue, svg, svgEnter;
        data = transformData(rawData);
        maxDomainValue = d3.max(data, function(d) {
          return rValue(d);
        });
        rScale.domain([0, maxDomainValue]);
        svg = d3.select(this).selectAll("svg").data([data]);
        svgEnter = svg.enter().append("svg");
        if($(svg).parent().parent().parent().parent().width()!=undefined)
        	width = $(svg).parent().parent().parent().parent().width();
        //if($(svg).parent().parent().parent().parent().height())
        	//height = $(svg).parent().parent().parent().parent().height();
        height = 400;     
        
        
        //default range = range([0, 60])
        if(width>=550 && width<850){
        	 rScale.range([0, 45]);
        }else if(width>=350 && width<550){
        	 rScale.range([0, 35]);
        }else if(width<350){
        	rScale.range([0, 20]);
        }
        
        svg.attr("width", width);
        svg.attr("height", height);
        def = svgEnter.append("defs");
        
        var radGradGreen = def.append("radialGradient").attr("id","greenCircle").attr("gradientUnits","objectBoundingBox").attr("fx","30%").attr("fy","30%");
        radGradGreen.append("stop").attr("offset","0%").attr("style","stop-color:#FFFFFF");
        radGradGreen.append("stop").attr("offset","40%").attr("style","stop-color:#9cd625");
        radGradGreen.append("stop").attr("offset","100%").attr("style","stop-color:#9cd625");
        
        var radGradBlue = def.append("radialGradient").attr("id","blueCircle").attr("gradientUnits","objectBoundingBox").attr("fx","30%").attr("fy","30%");
        radGradBlue.append("stop").attr("offset","0%").attr("style","stop-color:#FFFFFF");
        radGradBlue.append("stop").attr("offset","40%").attr("style","stop-color:#4693b0");
        radGradBlue.append("stop").attr("offset","100%").attr("style","stop-color:#4693b0");
        
        var radGradRed = def.append("radialGradient").attr("id","redCircle").attr("gradientUnits","objectBoundingBox").attr("fx","30%").attr("fy","30%");
        radGradRed.append("stop").attr("offset","0%").attr("style","stop-color:#FFFFFF");
        radGradRed.append("stop").attr("offset","40%").attr("style","stop-color:#ec6961");
        radGradRed.append("stop").attr("offset","100%").attr("style","stop-color:#ec6961");
        
        var radGradGrey = def.append("radialGradient").attr("id","greyCircle").attr("gradientUnits","objectBoundingBox").attr("fx","30%").attr("fy","30%");
        radGradGrey.append("stop").attr("offset","0%").attr("style","stop-color:#FFFFFF");
        radGradGrey.append("stop").attr("offset","40%").attr("style","stop-color:#E8E9E7");
        radGradGrey.append("stop").attr("offset","100%").attr("style","stop-color:#E8E9E7");
        
        
        node = svgEnter.append("g").attr("id", "bubble-nodes").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        node.append("rect").attr("id", "bubble-background").attr("width", width).attr("height", height).on("click", clear);
        label = d3.select(this).selectAll("#bubble-labels").data([data]).enter().append("div").attr("id", "bubble-labels");
        update();
        hashchange();
        return d3.select(window).on("hashchange", hashchange);
      });
    };
    force = d3.layout.force().gravity(0).charge(0).size([width, height]).on("tick", tick);
    update = function() {
      data.forEach(function(d, i) {
        return d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)));
      });
      force.nodes(data).start();
      updateNodes();
      return updateLabels();
    };
    updateNodes = function() {
      node = node.selectAll(".bubble-node").data(data, function(d) {
        return textValue(d);
      });
      node.exit().remove();
      return node.enter().append("a").attr("class", "bubble-node").attr("id", function(d) {
        return tagValue(d);
      }).attr("xlink:href", function(d) {
        return "javascript:void(0);";
      }).call(force.drag).call(connectEvents).append("circle").attr("r", function(d) {
        return rScale(rValue(d));
      }).attr('style', function(d) {
        return colorValue(d);
      });
    };
    updateLabels = function() {
      var labelEnter;
      label = label.selectAll(".bubble-label").data(data, function(d) {
        return textValue(d);
      });
      label.exit().remove();
      labelEnter = label.enter().append("a").attr("class", "bubble-label").attr("id", function(d) {
        return "taglabel" + tagValue(d);
      }).attr("href", function(d) {
    	return "javascript:void(0);";
      }).call(force.drag).call(connectEvents);
      labelEnter.append("div").attr("class", "bubble-label-name").text(function(d) {
        return textValue(d);
      });
    
      label.style("font-size", function(d) {
    	  if(textValue(d).length>7){
    		  return Math.max(8, rScale(rValue(d) / 8)) + "px";
    	  }else{
    		  return Math.max(8, rScale(rValue(d) / 4)) + "px";
    	  }
        
      }).style("width", function(d) {
        return 2.5 * rScale(rValue(d)) + "px";
      });
      label.append("span").text(function(d) {
        return textValue(d);
      }).each(function(d) {
        return d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
      }).remove();
      label.style("width", function(d) {
        return d.dx + "px";
      });
      return label.each(function(d) {
        return d.dy = this.getBoundingClientRect().height;
      });
    };
    gravity = function(alpha) {
      var ax, ay, cx, cy;
      cx = width / 2;
      cy = height / 2;
      ax = alpha / 8;
      ay = alpha;
      return function(d) {
        d.x += (cx - d.x) * ax;
        return d.y += (cy - d.y) * ay;
      };
    };
    collide = function(jitter) {
      return function(d) {
        return data.forEach(function(d2) {
          var distance, minDistance, moveX, moveY, x, y;
          if (d !== d2) {
            x = d.x - d2.x;
            y = d.y - d2.y;
            distance = Math.sqrt(x * x + y * y);
            minDistance = d.forceR + d2.forceR + collisionPadding;
            if (distance < minDistance) {
              distance = (distance - minDistance) / distance * jitter;
              moveX = x * distance;
              moveY = y * distance;
              d.x -= moveX;
              d.y -= moveY;
              d2.x += moveX;
              return d2.y += moveY;
            }
          }
        });
      };
    };
    connectEvents = function(d) {
      d.on("click", click);
      d.on("mouseover", mouseover);
      return d.on("mouseout", mouseout);
    };
    clear = function() {
      if($(".tag-sub-menu-cloud-bubble")!=undefined && $(".tag-sub-menu-cloud-bubble")!=null){$(".tag-sub-menu-cloud-bubble").remove();}
      d3.selectAll(".bubble-node :first-child").attr("style", function(d) {
    	  return colorValue(d);
      });
      return null;
    };
    click = function(d) {
      location.replace("#" + encodeURIComponent(textValue(d)));
      d3.selectAll(".bubble-node :first-child").attr("style", function(d) {
    	  return colorValue(d);
      });
      
      //change to grey
      d3.selectAll("#"+tagValue(d)+" :first-child").attr("style", function(d) {
    	  return colorChange(d);
      });
      
      if($(".tag-sub-menu-cloud-bubble")!=undefined && $(".tag-sub-menu-cloud-bubble")!=null){$(".tag-sub-menu-cloud-bubble").remove();}
      /*var menuVar = '<ul id="'+tagValue(d)+'Menu" class="tag-sub-menu-cloud-bubble""><li style="cursor:pointer;" onclick="viewTagWrdMsgBubble(&quot;'+tagValue(d)+'&quot;,&quot;'+textValue(d)+'&quot;,&quot;'+sentiValue(d)+'&quot;);">View Msg</li><li style="cursor:pointer;" onclick="ignoreTagWrdMsgBubble(&quot;'+tagValue(d)+'&quot;,&quot;'+textValue(d)+'&quot;,&quot;'+sentiValue(d)+'&quot;);">Ignore Word</li></ul>';
      
      if(graphValue(d).indexOf("overall")==-1 && (typeValue(d).indexOf("positive")!=-1 || typeValue(d).indexOf("negative")!=-1 || typeValue(d).indexOf("neutral")!=-1)){
          $("#"+typeValue(d)+"bubbleactiondiv").prepend(menuVar);
      }
      else if(graphValue(d).indexOf("overall")!=-1){
          $("#overallbubbleactiondiv").prepend(menuVar);
      }
      else if(tagValue(d).indexOf("oCloud")!=-1){
          $("#obubbleactiondiv").prepend(menuVar);
      }*/
      
      return d3.event.preventDefault();
    };
    hashchange = function() {
      var id;
      id = decodeURIComponent(location.hash.substring(1)).trim();
      return updateActive(id);
    };
    updateActive = function(id) {
      node.classed("bubble-selected", function(d) {
        return id === textValue(d);
      });
    };
    mouseover = function(d) {
      return node.classed("bubble-hover", function(p) {
        return p === d;
      });
    };
    mouseout = function(d) {
      return node.classed("bubble-hover", false);
    };
    chart.jitter = function(_) {
      if (!arguments.length) {
        return jitter;
      }
      jitter = _;
      force.start();
      return chart;
    };
    chart.height = function(_) {
      if (!arguments.length) {
        return height;
      }
      height = _;
      return chart;
    };
    chart.width = function(_) {
      if (!arguments.length) {
        return width;
      }
      width = _;
      return chart;
    };
    chart.r = function(_) {
      if (!arguments.length) {
        return rValue;
      }
      rValue = _;
      return chart;
    };
    return chart;
  };

  root.plotData = function(selector, data, plot) {
    return d3.select(selector).datum(data).call(plot);
  };

