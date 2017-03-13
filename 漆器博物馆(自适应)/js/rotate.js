/**
 * Created by QJ on 2017/1/17.
 */
function Rotate(config) {
    /// <summary>
    /// �ֲ���
    /// </summary>
    /// <param name="config">����json����:(stayTime:ͣ��ʱ��(���������Ͳ��Զ�����),actionTime:����ʱ��(default:1000),wrap:�ֲ�����,nvs:�����㣬nvclass:��������ʽ(default:active),width:�����)</param>
    /// <returns></returns>
    this.stayTime = config.stayTime;
    this.actionTime = config.actionTime ? config.actionTime : 1000;
    this.wrap = config.wrap,
        this.itemW = config.width | 0;
    this.itemArray = [];

    this.nvs = config.nvs;
    this.nvclass = config.nvclass || 'active';
    this.timeIndex = -1;
    this.move = 0;

    //����Ч��
    this.effect = config.effect || 'move';

    //��һ��
    this.pre = function () {
        var oThis = this;
        if (oThis.effect == 'fade') {
            fadeEffect.pre.call(oThis);
        } else {
            moveEffect.pre.call(oThis);
        }
    };

    //��һ��
    this.next = function () {
        var oThis = this;
        if (oThis.effect == 'fade') {
            fadeEffect.next.call(oThis);
        } else {
            moveEffect.next.call(oThis);
        }
    };

    //�ض���
    this.custom = function (i) {
        var oThis = this;
        if (oThis.effect == 'fade') {
            fadeEffect.curstom.call(oThis, i);
        } else {
            moveEffect.curstom.call(oThis, i);
        }
    };



    //˽�з���
    var rotatePrivate = {
        //��ʼ��
        init: function (con) {
            var oThis = this;
            con.items.css('width', con.width);
            for (var i = 0; i < con.items.length; i++) {
                var item = $(con.items[i]);
                var nv = con.nvs ? $(con.nvs[i]) : null;
                var itemO = { item: item, index: i, nv: nv };
                oThis.itemArray.push(itemO);
            }
            if (oThis.effect == 'fade') {
                $(con.items[0]).css('display', 'block');
                $(con.nvs[0]).addClass('active');
            }
            rotatePrivate.timeRun.call(oThis);
        },

        //�Զ�����
        timeRun: function () {
            var oThis = this;
            if (oThis.stayTime && oThis.itemArray.length > 1) {
                clearInterval(oThis.timeIndex);
                oThis.timeIndex = setInterval(function () {
                    if (oThis.effect == 'fade') {
                        fadeEffect.next.call(oThis);
                    } else {
                        moveEffect.next.call(oThis);
                    }

                }, oThis.stayTime);
            }
        },

        //������е������ʽ
        clealNvActive: function (i) {
            this.nvs && (this.nvs.removeClass(this.nvclass) && $(this.nvs[i]).addClass(this.nvclass));
        },

        //��������
        sortItem: function (customItem) {
            var oThis = this;
            var newArray = [customItem];
            var currentItem = customItem;
            //����ļ���
            for (var h = (customItem.index + 1) ; h < oThis.itemArray.length; h++) {
                for (var k = 0; k < oThis.itemArray.length; k++) {
                    var afterIndex = oThis.itemArray[k].index;
                    if (afterIndex == h) {
                        var afterItem = oThis.itemArray[k];
                        newArray.push(afterItem);
                        currentItem.item.after(afterItem.item);
                        currentItem = afterItem;
                    }
                }
            }

            //ǰ��ļ���
            for (var m = 0; m < customItem.index; m++) {
                for (var n = 0; n < oThis.itemArray.length; n++) {
                    var beforeIndex = oThis.itemArray[n].index;
                    if (beforeIndex == m) {
                        var beforeItem = oThis.itemArray[n];
                        newArray.push(beforeItem);
                        currentItem.item.after(beforeItem.item);
                        currentItem = beforeItem;
                    }
                }
            }
            oThis.itemArray = newArray;
        }

    };

    //move effect method assemble
    var moveEffect = {
        pre: function () {
            var oThis = this;
            //�ҵ����һ�ţ����Ƶ���һ��
            var lastItem = oThis.itemArray.pop();
            oThis.wrap.prepend(lastItem.item);
            oThis.wrap.css('margin-left', -oThis.itemW);
            rotatePrivate.clealNvActive.call(oThis, lastItem.index);
            oThis.wrap.animate({ marginLeft: 0 }, {
                duration: this.ActionTime,
                queue: false,
                complete: function () {
                    //�仯����
                    oThis.itemArray.splice(0, 0, lastItem);
                    rotatePrivate.timeRun.call(oThis);
                }
            });
        },

        next: function () {
            var oThis = this;
            var firstItem = oThis.itemArray.shift();
            oThis.itemArray.push(firstItem);
            rotatePrivate.clealNvActive.call(oThis, oThis.itemArray[0].index);
            //�ƶ�wrap���ڶ���Ԫ��
            oThis.wrap.animate({ marginLeft: -oThis.itemW }, {
                duration: this.ActionTime,
                queue: false,
                complete: function () {
                    //��һԪ���Ƶ����
                    oThis.wrap.append(firstItem.item);
                    oThis.wrap.css('margin-left', 0);
                    rotatePrivate.timeRun.call(oThis);
                }
            });
        },

        curstom: function (i) {
            var oThis = this;
            var customItem = null;
            for (var h in oThis.itemArray) {
                if (oThis.itemArray[h].index == i) {
                    customItem = oThis.itemArray[h];
                    break;
                }
            }
            var firstItem = oThis.itemArray[0];
            //�ڻ�ĺ���
            if (customItem.index > firstItem.index) {
                //��curstomItem�Ƶ�����
                firstItem.item.after(customItem.item);
                rotatePrivate.clealNvActive.call(oThis, customItem.index);
                //foucus move to curstomitem
                oThis.wrap.animate({ marginLeft: -oThis.itemW }, {
                    duration: this.ActionTime,
                    queue: false,
                    complete: function () {
                        //sort by customitem
                        rotatePrivate.sortItem.call(oThis, customItem);
                        oThis.wrap.css('margin-left', 0);
                        rotatePrivate.timeRun.call(oThis);
                    }
                });
            } else {
                //��curstomItem�Ƶ���ǰ��ǰ�棬��margin-left -itemWidth
                firstItem.item.before(customItem.item);
                oThis.wrap.css('margin-left', -oThis.itemW);
                rotatePrivate.clealNvActive.call(oThis, customItem.index);
                //foucus move to curstomitem
                oThis.wrap.animate({ marginLeft: 0 }, {
                    duration: this.ActionTime,
                    queue: false,
                    complete: function () {
                        //sort by customitem
                        rotatePrivate.sortItem.call(oThis, customItem);
                        rotatePrivate.timeRun.call(oThis);
                    }
                });
            }
        }
    };

    //fade effect method assemble
    var fadeEffect = {
        pre: function () {
            var oThis = this;
            if (oThis.move != 1) {
                oThis.move = 1;
                var firstItem = oThis.itemArray.shift();
                var lastItem = oThis.itemArray.pop();

                oThis.wrap.prepend(lastItem.item);
                rotatePrivate.clealNvActive.call(oThis, lastItem.index);

                //��һ��ͼ����ʾ�󵭳�����
                firstItem.item.show().fadeOut(this.ActionTime);
                //��ǰͼ�������غ�����ʾ
                lastItem.item.hide().fadeIn(this.ActionTime, function () { oThis.move = 0; });
                //�仯����
                oThis.itemArray.splice(0, 0, lastItem);
                rotatePrivate.timeRun.call(oThis);
            }
        },

        next: function () {
            var oThis = this;
            if (oThis.move != 1) {
                oThis.move = 1;
                var firstItem = oThis.itemArray.shift();
                oThis.itemArray.push(firstItem);

                var secondItem = oThis.itemArray[0];

                oThis.wrap.append(firstItem.item);
                rotatePrivate.clealNvActive.call(oThis, secondItem.index);

                //��ǰͼ����ʾ�󵭳�����
                firstItem.item.show().fadeOut(this.ActionTime);
                //��һ��ͼ�������غ�����ʾ
                secondItem.item.hide().fadeIn(this.ActionTime, function () { oThis.move = 0; });
                rotatePrivate.timeRun.call(oThis);
            }
        },
        curstom: function (i) {
            var oThis = this;
            if (oThis.move != 1) {
                oThis.move = 1;
                var currentItem = oThis.itemArray[0];//��ǰ��ʾ��
                var customItem = null;
                for (var h in oThis.itemArray) {
                    if (oThis.itemArray[h].index == i) {
                        customItem = oThis.itemArray[h];
                        break;
                    }
                }

                //�ڻ�ĺ���
                if (customItem.index > currentItem.index) {
                    //��curstomItem�Ƶ�����
                    currentItem.item.after(customItem.item);
                    rotatePrivate.clealNvActive.call(oThis, customItem.index);

                    //��ǰͼ����ʾ�󵭳�����
                    currentItem.item.show().fadeOut(this.ActionTime);
                    //ѡ��ͼ�������غ�����ʾ
                    customItem.item.hide().fadeIn(this.ActionTime, function () { oThis.move = 0; });

                    //sort by customitem
                    rotatePrivate.sortItem.call(oThis, customItem);
                    rotatePrivate.timeRun.call(oThis);
                } else {

                    //��curstomItem�Ƶ���ǰ��ǰ��
                    currentItem.item.before(customItem.item);
                    rotatePrivate.clealNvActive.call(oThis, customItem.index);

                    //��ǰͼ����ʾ�󵭳�����
                    currentItem.item.show().fadeOut(this.ActionTime);
                    //ѡ��ͼ�������غ�����ʾ
                    customItem.item.hide().fadeIn(this.ActionTime, function () { oThis.move = 0; });
                    //sort by customitem
                    rotatePrivate.sortItem.call(oThis, customItem);
                    rotatePrivate.timeRun.call(oThis);
                }
            }
        }
    };

    rotatePrivate.init.call(this, config);

}