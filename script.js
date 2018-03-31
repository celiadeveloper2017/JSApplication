$(document).ready(function(){

var rc=RecordContainer('','','',1,3);
}

);




function RecordContainer(url, userId, password, bypass,thredhold){
this.url=url;
this.userId=userId;
this.password=password;
this.thredhold=thredhold;
this.curIndex=0;
this.records=[];
this.bypass=bypass;
this.accountSortAsc=1;
this.cashSortAsc=1;
var self=this;

this.initialize=function(){
if($('.header-item-left')){
var leftSortButton=$('.header-item-left').find("button");
$('.header-item-left').bind("click",function(){
	$(this).css("background-color","#D0D2D5");
  $(this).find("button").css("display","inline-block");
  $('.header-item-right').css("background-color","#DFE2E6").css("line-height","0.7");
  
  $('.header-item-right').find("button").css("display","none");
  $('.header-item-right').find("p").css("margin-top","7%");
  sort(self.records,'account', self.accountSortAsc);
 $('#recordsDiv').empty();
 paint(self.records,thredhold,self.curIndex,'');
  
});

if(leftSortButton){

$(leftSortButton).bind("click",function(){
if(self.accountSortAsc===1){
 self.accountSortAsc=0;
 $(this).find("i").removeClass("fa fa-angle-up").addClass("fa fa-angle-down");
}else{
self.accountSortAsc=1;
$(this).find("i").removeClass("fa fa-angle-down").addClass("fa fa-angle-up");
}
 sort(self.records,'account', self.accountSortAsc);
 $('#recordsDiv').empty();
 paint(self.records,thredhold,self.curIndex,'');
})
}
}

if($('.header-item-right')){
var rightSortButton=$('.header-item-right').find("button");
console.log(rightSortButton);
if(rightSortButton){
$(rightSortButton).bind("click",function(){
if(self.cashSortAsc===1){
 self.cashSortAsc=0;
  $(this).find("i").removeClass("fa fa-angle-up").addClass("fa fa-angle-down");
 
}else{
self.cashSortAsc=1;
$(this).find("i").removeClass("fa fa-angle-down").addClass("fa fa-angle-up");
}
sort(self.records,'Acash', self.cashSortAsc);
console.log(self.records);
$('#recordsDiv').empty();
 paint(self.records,thredhold,self.curIndex,'');


})
}
$('.header-item-right').find("button").css("display","none");
$('.header-item-right').bind("click",function(){
	$(this).css("background-color","#D0D2D5");
  $(this).find("button").css("display","inline-block").css("background-color","#D0D2D5");
  $(this).css("line-height","0.4");
  $(this).find("p").css("margin-top", "4%");
  $('.header-item-left').css("background-color","#DFE2E6");
  $('.header-item-left').find("button").css("display","none");
sort(self.records,'Acash', self.cashSortAsc);
$('#recordsDiv').empty();
 paint(self.records,thredhold,self.curIndex,'');
})



}


};
this.sort=function(records, type, asc){
if(!records||records.length==0)return;

	if(type==='account'){
  
  if(asc===1){
  records.sort(function(a,b){
  var objA=a.account;
  var objB=b.account;
 return objA.number-objB.number;
  
  });
  }else{
   records.sort(function(a,b){
    var objA=a.account;
  var objB=b.account;
  return objB.number-objA.number;
 
  });
  }
  }
  if(type==='Acash'){
    if(asc===1){
  records.sort(function(a,b){
  var objA=a.cash;
  var objB=b.cash;
  var objArr=objA.value.split(',').join('');
  var objBrr=objB.value.split(',').join('');
 return objArr-objBrr;
 })
  }else{
   records.sort(function(a,b){
    var objA=a.cash;
  var objB=b.cash;
  var objArr=objA.value.split(',').join('');
  var objBrr=objB.value.split(',').join('');
  
  return objBrr-objArr;
  })
  
  }
}
}
this.paint=function(dataArray, thredhold, curIndex, reload){
var totalLength=dataArray.length;
var cindex=curIndex;
var da=dataArray;
if(da){
if(thredhold&&cindex+thredhold<=totalLength){
da=da.slice(curIndex, cindex+thredhold);
cindex+=thredhold;
}
da.forEach(function(e){
if(e&& e.account&&e.cash){

    var account=e.account;
    var cash=e.cash;
    var currency=cash.currency||'$';
    var color='#94979B';
   	var afterProcessed='';
    if(cash.change){
    var cg=cash.change;
    if(cg.trim().charAt(0)==='-'){
    color='red';
    }else if(cg.trim().charAt(0)==='+'){
    color='#18C545';
    }
   if(cg.indexOf('/')!=-1){
   		var curindex=cg.indexOf('/');
     afterProcessed =cg.substring(0, curindex)+'/'+currency+cg.substring(curindex+1);
   }
    
    }
    if(account.number&&account.name&&cash.value&&cash.change){
    $('#recordsDiv').append('<div class='+'record-grid'+'><div class='+'record-item-left'+'><p>'+account.name+'-'+account.number+'</p></div><div class='+'record-item-right'+'><p style='+"font-size:0.85em"+'+>'+cash.currency+cash.value+'</p><p style='+"color:"+color+";font-size:0.7em; font-weight:900"+'>'+afterProcessed+'</p></div></div>')
    }
    
}
})

if(cindex<totalLength){
 $('#recordsDiv').append('<div class='+'record-grid'+'><div class='+'record-item-plaint'+'><p>'+'Load More'+'</p></div></div>');
	$('.record-item-plaint').bind("click",function(){
  $('.record-item-plaint').parent().detach();
  paint(dataArray,thredhold,cindex,1);
  
  });
}

}
if(reload)self.curIndex=cindex;
};


this.load=function(){

loadAccountRecords(url,userId, password, bypass);
self.records=loadAccountRecords(url,userId, password, bypass);
if(self.records&&self.records.length){
var cx=self.curIndex;
var rec=self.records;
var th=self.thredhold;
sort(rec,'account',1);
paint(rec,th,cx, '');

}
};

initialize();
load();

}
function loadAccountRecords(url,userId, password, bypass){
var records=[];
if(bypass===1){
 records=[
  {"account":
     {
             "name":"IRA",
             "number":"520"
             },
      "cash":{
             "currency":"$",
             "value": "5,763.36",
             "change":"-0.08%/8.916.96"

             }
  },
{"account":
             {
             "name":"AAA",
             "number":"3810"
             },
      "cash":{
             "currency":"$",
             "value": "10,050,054.07",
             "change":"+0.07%/8.916.96"
              },
 },
{"account":  
             {
             "name":"REG",
             "number":"2019"
             },
      "cash":{
             "currency":"$",
             "value": "13,465,679.34",
             "change":"0.00%/0.00"
             
             }
  },
{"account":
             {
             "name":"AAA",
             "number":"1812"
             },
      "cash":{
             "currency":"$",
             "value": "2,010,926.10",
             "change":"+0.21%/38.881.63"

             }
},
{"account":
             {
             "name":"IRA",
             "number":"0146"
             },
      "cash":{
             "currency":"$",
             "value": "15,884,302.39",
             "change":"+0.03%/7.430.83"

             }
  },
{"account":
             {
             "name":"AAA",
             "number":"0029"
             },
      "cash":{
             "currency":"$",
             "value": "39,160,334.42",
             "change":"-0.07%/31.435.87"

             }
}
];

//paint(records,maxIndex);
}
else{
var data={"userId":userId,
					"password":password
        
};
post(url, data, timeOutFunction, timeOutTimes, function(d){
records=d;
	//	paint(d);

})
}
return records;

}

function post(url, data, timeOutFunction, timeOutTimes, callback){
		if($){
    $.ajax({
    url:url,
    method:"POST",
    dataType:"json",
    data:data,
    
    }).done(function(data, status,jqxhr){
    callback(data);
    
    }).fail(function(msg){
    console.log(msg);
    })
    
    }

}
function cashSortButtonHandler(){

};

