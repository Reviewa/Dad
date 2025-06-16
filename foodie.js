/*

项目名称：Foodie美食相机
下载地址：https://apps.apple.com/cn/app/foodie-%E7%BE%8E%E9%A3%9F%E7%9B%B8%E6%9C%BA/id1336411132
[rewrite_local]
^https?:\/\/content-static\.snowcam\.cn\/.*\/assets url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/refs/heads/main/foodie.js
^https?:\/\/content-static\.snowcam\.cn\/.*\/items url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/refs/heads/main/foodie.js
^https?:\/\/content-static\.snowcam\.cn\/.*\/vip url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/refs/heads/main/foodie.js
^https?:\/\/content-static\.snowcam\.cn\/.*\/priorityRuleInfo url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/refs/heads/main/foodie.js
^https?:\/\/content-static\.snowcam\.cn\/.*\/productList url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/refs/heads/main/foodie.js
^https?:\/\/content-static\.snowcam\.cn\/.*\/storeInfo url script-response-body https://raw.githubusercontent.com/Reviewa/Dad/refs/heads/main/foodie.js
^https?:\/\/foodie-api\.yiruikecorp\.com\/v\d\/(banner|notice)\/overview url reject-200
^https?:\/\/adimage\.bwton\.com\/.*\.(jpg|jpeg|png|gif|webp)$ url reject-200
^https?:\/\/zjres-ad\.kajicam\.com\/ad-creative\/resource\/.* url reject-200

[MITM]
hostname = content-static.snowcam.cn, foodie-api.yiruikecorp.com, adimage.bwton.com, zjres-ad.kajicam.com

*/

let obj = JSON.parse($response.body);

if (obj.result && Array.isArray(obj.result.assets)) {
  obj.result.assets.forEach(asset => {
    if (asset.vipType === "VIP") asset.vipType = "NONE";
  });
}

if (obj.result && Array.isArray(obj.result.items)) {
  obj.result.items.forEach(item => {
    if (item.groups && Array.isArray(item.groups)) {
      item.groups.forEach(group => {
        if (group.items && Array.isArray(group.items)) {
          group.items.forEach(subItem => {
            if (subItem.itemProperty && subItem.itemProperty.vip === true) delete subItem.itemProperty.vip;
            if (subItem.itemBridges && Array.isArray(subItem.itemBridges)) {
              subItem.itemBridges.forEach(bridge => {
                if (bridge.vip === true) delete bridge.vip;
              });
            }
          });
        }
      });
    }
    if (item.items && Array.isArray(item.items)) {
      item.items.forEach(subItem => {
        if (subItem.itemProperty && subItem.itemProperty.vip === true) delete subItem.itemProperty.vip;
        if (subItem.itemBridges && Array.isArray(subItem.itemBridges)) {
          subItem.itemBridges.forEach(bridge => {
            if (bridge.vip === true) delete bridge.vip;
          });
        }
      });
    }
  });
}

if (obj.result && Array.isArray(obj.result.vipSegments)) {
  obj.result.vipSegments = ["ACTIVE_VIP"];
  obj.result.activated = true;
}

if (obj.result && Array.isArray(obj.result.productList)) {
  obj.result.productList.forEach(product => {
    product.sale = true;
    if (product.title && product.title.toLowerCase().includes("pro")) {
      product.priceType = "FREE";
      product.trialPeriod = 9999;
    }
  });
}

if (obj.data && Array.isArray(obj.data.priorityRuleInfoList)) {
  obj.data.priorityRuleInfoList.forEach(rule => {
    if (Array.isArray(rule.thisPlanExposurePriorityList)) rule.thisPlanExposurePriorityList = [];
    if (Array.isArray(rule.brandCreativeList)) rule.brandCreativeList = [];
    if (Array.isArray(rule.nextRequestPriorityInfoList)) rule.nextRequestPriorityInfoList = [];
    if (Array.isArray(rule.nextPlanExposurePriorityList)) rule.nextPlanExposurePriorityList = [];
  });
}

if (obj.data === null) obj.data = {};

$done({ body: JSON.stringify(obj) });
