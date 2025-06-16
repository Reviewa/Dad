/*

项目名称：Foodie美食相机
下载地址：https://apps.apple.com/cn/app/foodie-%E7%BE%8E%E9%A3%9F%E7%9B%B8%E6%9C%BA/id1336411132
[rewrite_local]
^https?:\/\/content-static\.snowcam\.cn\/.*\/assets url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/main/foodie.js

[MITM]
hostname = content-static.snowcam.cn

*/

let obj = JSON.parse($response.body);

if (obj.result && Array.isArray(obj.result.assets)) {
  obj.result.assets.forEach(asset => {
    if (asset.vipType === "VIP") {
      asset.vipType = "NONE";
    }
  });
}

$done({ body: JSON.stringify(obj) });
