window.$=
    HTMLElement.prototype.$=
        function(selector){
            var elems=(this==window?document:this)
                .querySelectorAll(selector);
            return elems.length==0?null:
                elems.length==1?elems[0]:
                    elems;
        }
//��װbind����
HTMLElement.prototype.bind=function(eName,fn,capture){this.addEventListener(eName,fn,capture);}
//��װcss����
HTMLElement.prototype.css=function(prop,value){
    if(value===undefined){
        var style=getComputedStyle(this)
        return style[prop];
    }else{
        this.style[prop]=value;
    }
}
/*�Ŵ�*/
var zoom={
    LIWIDTH:0,//ÿ��li�Ŀ��
    COUNT:0,//��li����
    moved:0,//���Ƶ�li����
    OFFSET:0,//ul����ʼleft
    MSIZE:0,//mask�Ĵ�С
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
            this.checkA();//���aԪ��״̬;
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
    changeMimg:function(e){//������ͼƬ
        var target=e.target;
        if(target.nodeName=="IMG"){
            var i=target.src.lastIndexOf(".");
            $("#mImg").src=target.src.slice(0,i)+"-m"+target.src.slice(i);
        }
    },
    maskToggle:function(){//�л�mask����ʾ
        $("#mask").css("display",
            $("#mask").css("display")=="block"?"none":"block");
        $("#largeDiv").css("display",$("#mask").css("display"));
        var i=$("#mImg").src.lastIndexOf("m");
        var src=$("#mImg").src.slice(0,i)+"l"+$("#mImg").src.slice(i+1);
        //debugger;
        //����largeDiv�ı���ͼƬΪsrc
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