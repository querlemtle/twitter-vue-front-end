(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-35732f13"],{"23b1":function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t._self._c;return e("div",{staticClass:"d-flex flex-column mx-auto",attrs:{id:"login"}},[e("div",{staticClass:"logo mx-auto mb-4"},[e("img",{attrs:{src:s("7175"),width:"50px"}})]),e("p",{staticClass:"menu-text mx-auto mb-4"},[t._v("後台登入")]),e("form",{staticClass:"mx-auto w-100",attrs:{action:""},on:{submit:function(e){return e.preventDefault(),e.stopPropagation(),t.handleSubmit.apply(null,arguments)}}},[e("div",{staticClass:"form-input d-flex flex-column"},[e("label",{staticClass:"form-input-text",attrs:{for:"account"}},[t._v("帳號")]),e("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.user.account,expression:"user.account",modifiers:{trim:!0}}],attrs:{type:"text",name:"account",id:"account",placeholder:"請輸入帳號",required:""},domProps:{value:t.user.account},on:{input:function(e){e.target.composing||t.$set(t.user,"account",e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}})]),e("div",{staticClass:"form-input d-flex flex-column"},[e("label",{staticClass:"form-input-text",attrs:{for:"password"}},[t._v("密碼")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.user.password,expression:"user.password"}],attrs:{type:"password",name:"password",id:"password",placeholder:"請輸入密碼",required:""},domProps:{value:t.user.password},on:{input:function(e){e.target.composing||t.$set(t.user,"password",e.target.value)}}}),e("div",{staticClass:"d-flex justify-content-between"})]),e("button",{staticClass:"btn-bg btn-border w-100",attrs:{type:"submit",disabled:t.isProcessing}},[t._v(" "+t._s(t.isProcessing?"處理中...":"登入")+" ")])]),e("div",{staticClass:"text-end"},[e("router-link",{staticClass:"mx-auto text-blue",attrs:{to:"/login"}},[t._v("前台登入 ")])],1)])},a=[],o=(s("d9e2"),s("2fa3")),i=s("be6c"),n={name:"AdminLogin",data(){return{user:{account:"",password:""},isProcessing:!1}},methods:{async handleSubmit(){try{if(!this.user.account||!this.user.password)return void o["a"].fire({icon:"warning",title:"請填寫帳戶、密碼"});this.isProcessing=!0;const t=await i["a"].adminLogin({account:this.user.account,password:this.user.password}),e=t.data;if("error"===e.status)throw new Error(e.message);localStorage.setItem("token",e.token),o["a"].fire({icon:"success",title:"登入成功"}),this.$router.push("/admin/tweets")}catch(t){switch(this.isProcessing=!1,console.error(t.response.data.message),t.response.data.message){case"Error: account not exist":o["a"].fire({icon:"error",title:"帳號不存在！"}),this.user.account="",this.user.password="";break;case"Error: Account or Password error!":o["a"].fire({icon:"error",title:"請確認您輸入的帳號、密碼是否正確"}),this.user.account="",this.user.password="";break}}}}},u=n,c=(s("7928"),s("2877")),d=Object(c["a"])(u,r,a,!1,null,"e3d93b22",null);e["default"]=d.exports},7928:function(t,e,s){"use strict";s("d911")},be6c:function(t,e,s){"use strict";var r=s("2fa3");const a=()=>localStorage.getItem("token");e["a"]={adminLogin({account:t,password:e}){return r["b"].post("/admin/signin",{account:t,password:e})},getAllUsers(){return r["b"].get("/admin/users",{headers:{Authorization:"Bearer "+a()}})},getAllTweets(){return r["b"].get("/admin/tweets",{headers:{Authorization:"Bearer "+a()}})},deleteTweet(t){return r["b"].delete("/admin/tweets/"+t,{headers:{Authorization:"Bearer "+a()}})}}},d911:function(t,e,s){}}]);
//# sourceMappingURL=chunk-35732f13.4d9bc779.js.map