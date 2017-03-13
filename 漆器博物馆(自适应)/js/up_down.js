window.$=
    HTMLElement.prototype.$=
        function(selector){
            var elems=(this==window?document:this)
                .querySelectorAll(selector);
            return elems.length==0?null:
                elems.length==1?elems[0]:
                    elems;
        }
//封装bind函数
HTMLElement.prototype.bind=function(eName,fn,capture){this.addEventListener(eName,fn,capture);}
//封装css函数
HTMLElement.prototype.css=function(prop,value){
    if(value===undefined){
        var style=getComputedStyle(this)
        return style[prop];
    }else{
        this.style[prop]=value;
    }
}
/*放大镜*/
var zoom={
    LIWIDTH:0,//每个li的宽度
    COUNT:0,//总li个数
    moved:0,//左移的li个数
    OFFSET:0,//ul的起始left
    MSIZE:0,//mask的大小
    MAXTOP:0,
    MAXLEFT:0,
    init:function(){
        this.LIWIDTH=parseFloat(getComputedStyle($("#icon_list>li:first-child")).width);
        this.COUNT=$("#icon_list>li").length;
        this.OFFSET=parseFloat(getComputedStyle($("#icon_list")).top);
        $("[class^='forward']").bind("click",this.move.bind(this));
        $("[class^='backward']").bind("click",this.move.bind(this));
        $("#icon_list").bind("mouseover",this.changeMimg);
        $("#superMask").bind("mouseover",this.maskToggle);
        $("#superMask").bind("mouseout",this.maskToggle);
        this.MSIZE=parseFloat(getComputedStyle($("#mask")).width);
        this.MAXTOP=parseFloat(getComputedStyle($("#superMask")).height)-this.MSIZE;
        this.MAXLEFT=parseFloat(getComputedStyle($("#superMask")).width)-this.MSIZE;
        //debugger;
        $("#superMask").bind("mousemove",this.maskMove.bind(this));
    },

    move:function(e){
        var target=e.target;
        if(target.className.indexOf("disabled")==-1){
            this.moved+=/^forward/.test(target.className)?1:-1;
            $("#icon_list").css("left",-this.moved*this.LIWIDTH+this.OFFSET+"px");
            this.checkA();//检查a元素状态;
        }
    },
    checkA:function(){
        if(this.moved==0){
            $("[class^='backward']").className="backward_disabled";
        }else if(this.COUNT-this.moved==5){
            $("[class^='forward']").className="forward_disabled";
        }else{
            $("[class^='backward']").className="backward";
            $("[class^='forward']").className="forward";
        }
    },
    changeMimg:function(e){//更换中图片
        var target=e.target;
        if(target.nodeName=="IMG"){
            var i=target.src.lastIndexOf(".");
            $("#mImg").src=target.src.slice(0,i)+"-m"+target.src.slice(i);
        }
    },
    maskToggle:function(){//切换mask的显示
        $("#mask").css("display",
            $("#mask").css("display")=="block"?"none":"block");
        $("#largeDiv").css("display",$("#mask").css("display"));
        var i=$("#mImg").src.lastIndexOf("m");
        var src=$("#mImg").src.slice(0,i)+"l"+$("#mImg").src.slice(i+1);
        //debugger;
        //设置largeDiv的背景图片为src
        $("#largeDiv").css("backgroundImage","url("+src+")");
    },
    maskMove:function(e){
        var x=e.offsetX;
        var y=e.offsetY;
        var top=y-this.MSIZE/2;
        var left=x-this.MSIZE/2;
        //debugger;
        top=top<0?0:top>this.MAXTOP?this.MAXTOP:top;
        left=left<0?0:left>this.MAXLEFT?this.MAXLEFT:left;
        $("#mask").css("top",top+"px");
        $("#mask").css("left",left+"px");
        $("#largeDiv").css("backgroundPosition",-2*left+"px "+(-2*top)+"px");
        //debugger;
    }
}
zoom.init();