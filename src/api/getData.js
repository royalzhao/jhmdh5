import { baseUrl } from './env'
import { post } from '../util/http'

//图片上传
export function fileUpload(data){
    return new Promise((resolve,reject)=>{
        post(baseUrl+'/fileService/fileUpload',data).then(response=>{
            //console.log(response)
            resolve(response)

        })
        .catch(error => {
            reject(error)
        })
    })
}
//文章发送
export function articleSend(data){
    return new Promise((resolve,reject)=>{
        post(baseUrl+'/article/create',data).then(response=>{
            //console.log(response)
            resolve(response)

        })
        .catch(error => {
            reject(error)
        })
    })
}
//图片上传
export function upload(data){
    return new Promise((resolve,reject)=>{
        post(baseUrl+'/fileService/fileUpload',data).then(response=>{
            //console.log(response)
            resolve(response)

        })
        .catch(error => {
            reject(error)
        })
    })
}

