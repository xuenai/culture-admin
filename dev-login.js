
/**
 * @desc   本地调试登录
 * @author shaoyang
 * @date   2019-08-08 10:50:48
*/

var opn = require('opn');
let http=require('http');
let qs=require('querystring');
// 18681372391 18081372391 18030814301
var search_key={username:"18582522507",password:"jkb123456",key:'',timeStamp:new Date()}; // 测试
search_key=qs.stringify(search_key);
const hostname = 'api.test.jkxds.com'; // 测试
// const hostname = 'api.jkxds.com'; // 正式
var body_request={
    hostname: hostname,
    path:'/auth/login?'+search_key,
    port:80
};
http.request(body_request,(res)=>{
    let content='';
    res.setEncoding('utf-8');
    res.on('data',(chunk)=>{
        content+=chunk;
    });
    res.on('end',()=>{
        let result = JSON.parse(content);
        merapprelationinfo(result.data.JSESSIONID,result.data.key,result.data.timeStamp);
    })
}).end();
function merapprelationinfo(JSESSIONID,key,timeStamp){
    http.request({
        hostname:hostname,
        path: `/jkb66/1.0/merapprelationinfo/into?appSn=2005144221&id=http%3A%2F%2F192.168.0.204&JSESSIONID=${JSESSIONID}&key=${key}&timeStamp=${encodeURI(timeStamp)}`,
        port:80
    },(res)=>{
        let content='';
        res.setEncoding('utf-8');
        res.on('data',(chunk)=>{
            content+=chunk;
        });
        res.on('end',()=>{
          let result = JSON.parse(content);
          if(!result.data || !result.data.JSESSIONID) return  console.error(result.msg);
          console.log('open at   ' +  `http://localhost:8080?JSESSIONID=${result.data.JSESSIONID}`);
          opn(`http://localhost:8080/#/profile?JSESSIONID=${result.data.JSESSIONID}`)
        })
    }).end();
}