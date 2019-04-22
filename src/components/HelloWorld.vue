<template>
  <div class="hello">
    <div class="top">
      <div class="title">
        <input type="text" class="title_input" v-model="title" placeholder="请输入文章标题" />
      </div>
      <div>
        <div class="send" @click="$articleSend">发布</div>
      </div>
    </div>
   <mavon-editor class="editor" v-model="content" ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" placeholder="请开始您的创作..." />
   
   <div class="alert" v-if="alertShow">{{message}}</div>
  </div>
</template>

<script>
function getSearchString(key) {
       // 获取URL中?之后的字符
       var str = window.location.href;
       str = str.split("?")[1];
 
       // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
       
       var arr = str.split("&");
       var obj = new Object();
 
        // 将每一个数组元素以=分隔并赋给obj对象
        for(var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=");
          obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
      }
        return obj[key];
}

import axios from 'axios';
import {setCookie,getCookie} from '../util/util.js'
import {articleSend,upload} from '../api/getData.js'
import { setTimeout } from 'timers';
export default {
  name: 'HelloWorld',
  data () {
    return {
      content: '',
      img_file:{},
      title:'',
      articleType:null,
      jiashu_code:null,
      message:'文章发布成功',
      alertShow:false
    }
  },
  mounted(){
    let articleType = getSearchString('articleType')
    let title = getSearchString('title')
    let jiashu_code = getSearchString('jiashu_code')
    setCookie("jiashu_code",jiashu_code)
    if(title){
      this.title = title
    }
    if(articleType){
      this.articleType = articleType
    }
    if(jiashu_code){
      this.jiashu_code = jiashu_code
    }
  },
  methods:{
    $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        this.img_file[pos] = $file;
        
        upload(formdata)
          .then(res => {
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            // $vm.$img2Url 详情见本页末尾
            console.log(res)
            let url = "https://pic.fangkuaikj.com/"+res.data
            this.$refs.md.$img2Url(pos, url);
          })
        
    },
    $imgDel(pos) {
        delete this.img_file[pos];
    },
    $articleSend(){
      if(this.content == ''){
        this.alertShow = true
        this.message = '请填写文章内容'
        setTimeout(()=>{
          this.alertShow = false
        },1000)
        return
      }
      if(this.title == ''){
        this.alertShow = true
        this.message = '请填写文章标题'
        setTimeout(()=>{
          this.alertShow = false
        },1000)
        return
      }
      let paramData = {
        articleType:this.articleType,
        detail:this.content,
        title:this.title
      }
      var qs = require('qs');
      articleSend(qs.stringify(paramData))
        .then(res => {
          console.log(res)
          if(res.data == 1){
            this.alertShow = true
            this.message = '文章发布成功'

            setTimeout(()=>{
              this.alertShow = false
              this.title = ''
              this.content = ''
              wx.miniProgram.navigateBack({
                delta: 1
              },1000)
            })
          }
          
        })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top{
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}
.editor{
  height: 12rem;
  z-index: 1;
}
.title_input{
  font-size: 0.35rem;
  border:0;
  outline: none;
  width: 6rem;
  display: block;
}

.send{
  color: #26B8A1;
  font-size: 0.35rem;
  display: block;
  cursor: pointer;
}
.alert{
  font-size: 0.22rem;
  position: absolute;
  top: 50%;
  z-index: 999;
  height: 0.4rem;
  width: 2rem;
  left: 50%;
  margin-top: -0.2rem;
  margin-left: -1rem;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  text-align: center;
  line-height: 0.4rem;
  border-radius: 0.05rem;
}
</style>
