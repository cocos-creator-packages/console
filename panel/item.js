'use strict';

exports.template = `
<div class="item" v-bind:type="type" v-init="y" v-info="info" v-bind:style="style" v-bind:texture="texture">
    <div class="warp">
        <div class="text">
            <span>
                <i class="fa fa-times-circle" v-if="type==='error'"></i>
                <i class="fa fa-warning" v-if="type==='warn'"></i>
            </span>
            
            <span>
                <i class="fold fa fa-caret-down" v-if="info&&!fold" v-on:click="onHide"></i>
                <i class="fold fa fa-caret-right" v-if="info&&fold" v-on:click="onShow"></i>
                {{title}}
            </span>
            
        </div>
        <span v-if="num>1">{{num}}</span>
    </div>
    <div class="info" v-if="!fold">
        <template v-for="str in foldInfo">
            <div>{{str}}</div>
        </template>
    </div>
</div>
`;

exports.props = ['type', 'title', 'info', 'y', 'texture', 'rows', 'fold', 'num'];

exports.data = function () {
    return {
        foldInfo: [],
        style: {
            transform: 'translateY(0)'
        }
    };
};

exports.directives = {
    init (y) {
        this.vm.style.transform = `translateY(${y}px)`;
    },
    info (info) {
        var results = this.vm.foldInfo;
        while (results.length > 0) {
            results.pop();
        }
        info.split('\n').forEach((item) => {
            results.push(item.trim());
        });
    }
};

exports.methods = {
    onHide () {
        this.$parent.onUpdateFold(this.y, true);
    },
    onShow () {
        this.$parent.onUpdateFold(this.y, false);
    }
};