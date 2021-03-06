//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
"use strict";
(function(){ //}
var IconModel = require4('IconModel');
var Img = exports.Img = {};

var ZINDEX = 20;	//bad...


Img.call = [];
Img.load = function(src,cb){
	Img.call.push(src);
	var tmp = new Image();
	tmp.src = '/' + src;
	if(cb)
		tmp.onload = function(){
			cb(tmp);
		}
	return tmp;
}

//#####################

Img.icon = [];

Img.getMinimapIconSize = function(name){
	if(name === 'minimapIcon-quest') return 24;
	if(name === 'minimapIcon-questMarker') return 24;
	if(name.$contains('color')) return 6;
	return 16;
}
Img.getIcon = function(a,b){
	return a + '-' + b;
}
Img.drawIcon = function(ctx,info,size,x,y){	
	size = size || 32;
	var ret = ctx;

	if(info.$contains('.'))
		ERROR(3,'dot',info);
		
	info = info.replace('.','-');
	var iconModel = IconModel.get(info);
	if(!iconModel) 
		return;	//error handled in get

	var draw = function(){
		ctx.drawImage(
			iconModel.img,
			0,0,
			iconModel.size,iconModel.size,
			x,y,
			size,size
		);
	}
	if(!iconModel.img)
		iconModel.img = Img.load(iconModel.src,draw);
	else if(!iconModel.img.complete)
		$(iconModel.img).load(draw);
	else	
		draw();		
	return ret;
}

Img.drawIcon.html = function(icon,size,title,alpha){
	size = size || 24;
	var canvas = $('<canvas>')
		.attr({
			width:size,
			height:size,
		})
		.css({
			zIndex:ZINDEX,
			border: icon ? '' : '2px solid black',
		});
	if(title)
		canvas.attr('title',title);
	
	var ctx = canvas[0].getContext("2d");
	if(alpha !== undefined) 
		ctx.globalAlpha = alpha;
	if(icon) 
		Img.drawIcon(ctx,icon,size,0,0);
	return canvas;
}



Img.drawIcon.img = function(icon,size,title,alpha){	//unused
	size = size || 24;
	
	var src = icon ? IconModel.get(icon).src : '';
	var img = $('<img>')
		.attr({
			width:size,
			height:size,
			src:src,
		})
		.css({
			zIndex:ZINDEX,
			opacity:alpha !== undefined ? alpha : 1,
			border: icon ? '' : '2px solid black',
		});
	if(title)
		img.attr('title',title);
	
	return img;
}


Img.redrawIcon = function(canvas,icon,title,alpha){
	if(title)
		canvas.attr('title',title);
	
	var ctx = canvas[0].getContext("2d");
	if(alpha !== undefined) 
		ctx.globalAlpha = alpha;
	else 
		ctx.globalAlpha = 1;
	
	var size = canvas[0].width;	//assume square
	ctx.clearRect(0,0,size,size);
	if(icon) 
		Img.drawIcon(ctx,icon,size,0,0);
	return canvas;

}

//Dialog.get('inventory')
Img.drawItem = function(iconId,size,title,amount){
	var icon = Img.drawIcon.html(iconId,size || 40,title || '');
	
	var amountText = Img.drawItem.getAmounText(amount);
	
	icon.css({
		position:'absolute',
		top:0,
		left:0,
		zIndex:ZINDEX,
	});
	var amountHtml = $('<span>')
		.css({
			color:'yellow',
			position:'absolute',
			top:-5,
			left:-5,
			zIndex:ZINDEX+1,
			backgroundColor:'rgba(0,0,0,0.6)'
		})
		.addClass('shadow360')
		.html(amountText);
	
	if(!amountText)
		amountHtml.hide();
		
	var total = $('<div>')
		.css({position:'relative',width:size,height:size})
		.append(icon,amountHtml);
	return total;
}

Img.drawItem.getAmounText = function(amount){
	if(amount <= 1)
		return '';
		
	var amountText = '' + amount;
	if(amount >= 10000000)
		amountText = Math.floor(amount/1000000) + 'M';
	else if(amount >= 100000){
		amountText = Math.floor(amount/1000) + 'K';
	}
	return amountText;
}
	
Img.redrawItem = function(total,iconId,amount){
	
	var c = total.children();
	var amountHtml = $(c[1]);
	
	var amountText = Img.drawItem.getAmounText(amount);
	
	if(!amountText)
		amountHtml.hide();
	else {
		amountHtml.html(amountText);
		amountHtml.show();
	}
	Img.redrawIcon($(c[0]),iconId);
	return total;
}

Img.drawFace = function(info,size){
	size = size || 96;
	if(info.image === 'player') 
		info = {image:'warriorMale-0',name:player.name};	//BAD
	
	var face = $('<div>')
		.css({textAlign:'center'})
		.append(Img.drawIcon.html(info.image,size))
		.append($('<span>')
			.html(info.name)
			.css({margin:'auto auto'})
		);
	return face;
}

Img.drawArrow = function(side,size){
	size = size || 40;
	var src = 'img/ui/interface/arrow-' + side + '.png'; 
	return $('<img>')
		.attr({src:src})
		.css({zIndex:ZINDEX,width:size,height:size});
}

Img.getStar = function(color){
	return $('<span>').html(CST.STAR).css({color:'yellow' || color});
}

/*

villagerFemale-0
001002008033001001005006006001001001001001001001100100100100000060100100100100100100100100100100060027011100100100100100100100100100100100100100100100100100100100100100100100100100

villagerFemale-1
002002006011001001002033008001001001001001001001100100100100000060100100100100100100100100100100020020020100100100100100100100100100100100100100100100100100100100100100100100100100

villagerFemale-2
001003004007001001002005023001001001001001001001100100100100000060100100100100100100100100100100080040020100100100100100100100100100100100100100100100100100100100100100100100100100

villagerFemale-3
001002019021001001003003004001001001001001002001100100100100000060100100100100100100100100100100000020080100100100100100100100100100100100100100100100100100080000040100100100100100

villagerFemale-4
001002020008001001013030006001001001001001001001100100100100000000000100100100100100100100100100060020060100100100100100100100100100100100100100100100100100080000040100100100100100

villagerFemale-5
001006023022001001013035008001001001001001001001100100100100000080060100100100100100100100100100100100020100100100100100100100100100100100100100100100100100080000040100100100100100

villagerFemale-6
001003009025001001003009008001001001001001001001100100100100060020040100100100100100100100100100020020020100100100100100000000000100100100100100100100100100100100100100100100100100

villagerFemale-7
002002003015001001003006003001001001001001001001100100100100000000100100100100100100100100100100100100000100100100100100100100100100100100100100100100100100100100100100100100100100

villagerFemale-8
002002002002002001002004012001001001001001001001100100100100060040040100100100100100100100100100080080080100100100100100100100100100100100100100100100100100100100100100100100100100

villagerFemale-9
002006019004002001004007019001001001003001001001100100100100060020020100100100100100100100100100000040100100100100100100060060060100100100100100100100100100100100100100100100100100

villagerMale-0
003006011013001001007002025001001001001001001001093092087100020080040100100100100100100100100100040040040100100100100100100100100100100100100100100100100100040040040100100100100100

villagerMale-1
001002003034001001007002005001001001001001001001100100100100020040020100100100100100100100100100076038000100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-2
005005009021001001010033006003001001001001001001100100100100040040040100100100100100100100100100020020020100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-3
001002017003001001011024001001001001001001001001100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-4
003003034032001002014021005001001001001001001001100100100100020060100100100100100100100100100100033033033100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-5
001007034033001001014001032001001001001001001001100100100100020060100100100100100100100100100100000000000100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-6
002003019008001001007015008001001001001001001001060040020100020080040100100100100100100100100100020020020100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-7
003007024014001001007002010001001001001001001001060040020100020020060100100100100100100100100100051040031100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-8
002006026013001001007002025001001001001001001001100100100100020080080100100100100100100100100100049030006100100100100100100100100100100100100100100100100100100100100100100100100100

villagerMale-9
008003028013001001001027010001001001001001002001093092087100000100100100100100100100100100100100100100060100100100100100100100100100100100100100100100100100040040040100100100100100


*/

})();









