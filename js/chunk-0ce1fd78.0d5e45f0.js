(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0ce1fd78"],{"0979":function(s,t,e){},"369c":function(s,t,e){"use strict";e.r(t);var a=function(){var s=this,t=s._self._c;return t("div",{staticClass:"container"},[t("div",{staticClass:"row"},[t("div",{staticClass:"col"},[t("SideBar")],1),t("div",{staticClass:"col-7 scrollable-part"},[t("div",{staticClass:"main-title"},[t("router-link",{attrs:{to:{name:"user",params:{id:s.user.id}}}},[t("img",{staticClass:"prev-icon",attrs:{src:e("8bcd"),alt:"..."}})]),t("div",[t("h5",{staticClass:"user-name m-0"},[s._v(" "+s._s(s.user.name)+" ")]),t("span",{staticClass:"card-text"},[s._v(s._s(s.user.tweetCount)+" 推文")])])],1),t("UserFollowsNav",{attrs:{user:s.user}}),s._l(s.allFollowers,(function(e){return t("UserFollowsCard",{key:e.id,attrs:{"initial-follower":e},on:{"update-followers":function(t){return t.preventDefault(),s.updateFollowers.apply(null,arguments)}}})}))],2),t("div",{staticClass:"col"},[t("PopularUsers")],1)])])},r=[],o=(e("d9e2"),e("5ea5")),l=e("f963"),i=e("ad4d"),n=e("9ed8"),c=e("1602"),u=e("2fa3"),d={name:"UserFollowers",data(){return{user:[],allFollowers:[]}},components:{SideBar:o["a"],PopularUsers:l["a"],UserFollowsCard:i["a"],UserFollowsNav:n["a"]},created(){const{id:s}=this.$route.params;this.fetchUserFollowers(s)},methods:{async fetchUserFollowers(s){try{const t=await c["a"].getUserFollowers({userId:s});if(200!==t.status)throw new Error(t.data.message);this.user=s,this.allFollowers=t.data,this.isLoading=!1}catch(t){this.isLoading=!1,u["a"].fire({icon:"error",title:"無法取得跟隨者資料，請稍後再試"})}},updateFollowers(){const{id:s}=this.$route.params;this.fetchUserFollowers(s)}}},w=d,f=(e("43f3"),e("2877")),p=Object(f["a"])(w,a,r,!1,null,"82d0348c",null);t["default"]=p.exports},"36d8":function(s,t,e){},"43f3":function(s,t,e){"use strict";e("cf70")},"8bcd":function(s,t){s.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAcCAYAAAAEN20fAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB5SURBVHgB7dfBCYAwEETR0Qoswc6SzreEpAPNQg5R4kGFnct8GMnNBwoi8L7UVtqsnyn5jY9hBYTuCJ8huBnClxGYEEIIIcRXRNTMDUs/7OBW13bZwK/6JYP7aAqGd/EJk0AoQxhhhBEmHkP5r5lhDMRyB1y+EX87AdxCwzt7prpuAAAAAElFTkSuQmCC"},"9ed8":function(s,t,e){"use strict";var a=function(){var s=this,t=s._self._c;return t("ul",{staticClass:"tab"},[t("li",{staticClass:"tab-item"},[t("router-link",{staticClass:"tab-link",attrs:{"aria-current":"page",to:{name:"user-followers",params:{id:s.user}}}},[s._v("追隨者")])],1),t("li",{staticClass:"tab-item"},[t("router-link",{staticClass:"tab-link",attrs:{"aria-current":"page",to:{name:"user-followings",params:{id:s.user}}}},[s._v("正在追隨")])],1)])},r=[],o={name:"UserFollowsNav",data(){return{}},props:{user:{type:String,required:!0}}},l=o,i=(e("c892"),e("2877")),n=Object(i["a"])(l,a,r,!1,null,"d63b111a",null);t["a"]=n.exports},ad4d:function(s,t,e){"use strict";var a=function(){var s=this,t=s._self._c;return t("div",{staticClass:"card-group"},[t("div",{staticClass:"card-container"},[t("div",{staticClass:"card-follow"},[t("div",{staticClass:"user-image"},[t("router-link",{attrs:{to:{name:"user",params:{id:s.follower.id}}}},[t("img",{staticClass:"user-image-sm",attrs:{src:s._f("emptyImage")(s.follower.avatar),alt:"user-image"}})])],1),t("div",{staticClass:"card-info"},[t("div",{staticClass:"card-header"},[t("p",{staticClass:"user-name"},[t("router-link",{attrs:{to:{name:"user",params:{id:s.follower.id}}}},[t("p",{staticClass:"user-name"},[s._v(s._s(s.follower.name))])])],1),s.follower.id!==s.currentUser.id?t("button",{staticClass:"btn-border btn-clip btn-50 user-follow-btn",attrs:{active:s.follower.isFollowed},on:{click:[function(t){return s.changeFollowingCount(s.follower.isFollowed)},function(t){return t.preventDefault(),t.stopPropagation(),s.toggleFollowUser(s.follower.isFollowed,s.follower.id)}]}},[s._v(" "+s._s(s.follower.isFollowed?"正在跟隨":"跟隨")+" ")]):s._e()]),t("div",{staticClass:"card-body"},[t("p",{staticClass:"introduction"},[s._v(" "+s._s(s.follower.introduction)+" ")])])])])])])},r=[],o=(e("d9e2"),e("2708")),l=e("b025"),i=e("2f62"),n=e("2fa3"),c={name:"UserFollowsCard",mixins:[o["b"]],props:{initialFollower:{type:Object,required:!0},initialFollowing:{type:Object,required:!0}},data(){return{follower:this.initialFollowing||this.initialFollower}},methods:{changeFollowingCount(s){this.$emit("change-count",s)},async toggleFollowUser(s,t){try{if(s){const s=await l["a"].unFollowUser({userId:t});if(console.log(s.data),"success"===s.data.status)n["a"].fire({icon:"success",title:"成功取消跟隨"});else if("error"===s.data.status)throw new Error(s.data.message)}else{const s=await l["a"].followUser({userId:t});if("success"===s.data.status)n["a"].fire({icon:"success",title:"成功跟隨"});else if("error"===s.data.status)throw new Error(s.data.message)}"user-followings"===this.$route.name?this.$emit("update-followings"):"user-followers"===this.$route.name&&this.$emit("update-followers")}catch(e){console.error(e.response.data.message),n["a"].fire({icon:"error",title:e.response.data.message})}}},computed:{...Object(i["b"])(["currentUser"])}},u=c,d=(e("de6d"),e("2877")),w=Object(d["a"])(u,a,r,!1,null,"ec4d702e",null);t["a"]=w.exports},c892:function(s,t,e){"use strict";e("36d8")},cf70:function(s,t,e){},de6d:function(s,t,e){"use strict";e("0979")}}]);
//# sourceMappingURL=chunk-0ce1fd78.0d5e45f0.js.map