(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-72c26b5a"],{6786:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"cat-list"},[n("div",{ref:"box",staticClass:"cat-table-box"},[n("a-table",{attrs:{columns:t.columns,dataSource:t.data,pagination:!1,rowKey:"cat_id",scroll:{y:t.h}},scopedSlots:t._u([{key:"operation",fn:function(e,a){return[n("a",{attrs:{href:"javascript:;"},on:{click:function(e){return t.handleEdit(a)}}},[n("a-icon",{attrs:{type:"edit"}}),t._v("Edit ")],1),n("a-divider",{attrs:{type:"vertical"}}),n("a",{attrs:{href:"javascript:;"},on:{click:function(e){return t.handleDelete(a.cat_id)}}},[n("a-icon",{attrs:{type:"delete"}}),t._v("Delete ")],1)]}}])})],1)])},r=[],c=(n("7369"),n("e63d")),i=n.n(c),s=(n("2a74"),n("7531")),o=n.n(s),u=(n("96cf"),n("1da1")),l=(n("b91b"),n("b6c0")),d=n.n(l),h=(n("a09b"),n("50f6")),f=n.n(h),p=(n("d1c3"),n("9456")),m=n.n(p),v=n("864d"),b=n("50fc3"),g={components:{ATable:m.a,AIcon:f.a,ADivider:d.a},data:function(){var t=[{title:"序号",className:"nth1",align:"center",customRender:function(t,e,n){return n+1}},{title:"栏目名称",dataIndex:"catname",className:"nth2",align:"center"},{title:"文章数",dataIndex:"num",className:"nth3",align:"center"},{title:"operation",dataIndex:"operation",scopedSlots:{customRender:"operation"},className:"nth4"},{title:"",dataIndex:"empty",key:"empty",align:"center",className:"nth5"}];return{columns:t,data:[],h:0}},mounted:function(){this.setHeight(),this.requestData(),window.addEventListener("resize",this.setHeight)},methods:{setHeight:function(){var t=this.$refs,e=t.box.clientHeight;this.h=e-76},requestData:function(){var t=this;return Object(u["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(v["d"])();case 3:n=e.sent,t.data=n.data,e.next=10;break;case 7:e.prev=7,e.t0=e["catch"](0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))()},handleEdit:function(t){this.$router.push({path:"/catList/editCat",query:t})},handleDelete:function(t){var e=this,n=this.$createElement,a=o.a.confirm;a({title:"警告",content:function(){return n("div",{class:"test"},["确定删除该项？"])},onOk:function(){var n=Object(u["a"])(regeneratorRuntime.mark((function n(){var a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,Object(b["d"])({cat_id:t});case 3:a=n.sent,i.a.error(a.message),e.requestData(),n.next=11;break;case 8:n.prev=8,n.t0=n["catch"](0),console.log(n.t0);case 11:case"end":return n.stop()}}),n,null,[[0,8]])})));function a(){return n.apply(this,arguments)}return a}(),onCancel:function(){console.log("Cancel")}})}}},w=g,x=(n("b830"),n("2877")),k=Object(x["a"])(w,a,r,!1,null,"78fa10d8",null);e["default"]=k.exports},b830:function(t,e,n){"use strict";var a=n("babf"),r=n.n(a);r.a},babf:function(t,e,n){}}]);
//# sourceMappingURL=chunk-72c26b5a.e2713563.js.map