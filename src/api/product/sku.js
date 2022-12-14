import request from '@/utils/request'

//sku列表接口
///admin/product/list/{page}/{limit} ---get
export const reqSkuList = (page, limit) => request({ url:`/admin/product/list/${page}/${limit}`, method: 'get'})

//上架
///admin/product/onSale/{skuId} ---get
export const reqSale = (skuId) => request({ url:`/admin/product/onSale/${skuId}`, methods: 'post'})

//下架
///admin/product/cancelSale/{skuId} ---get
export const reqCancel = (skuId) => request({ url:`/admin/product/cancelSale/${skuId}`, method: 'get'})

//获取shu详情接口
///admin/product/getSkuById/{skuId} ---get
export const reqSkuById = (skuId) => request({ url:`/admin/product/getSkuById/${skuId}`, method: 'get'})




// //获取图片的接口
// ///admin/product/spuImageList/{spuId} ---get
// export const reqSpuImageList = (spuId) => request({ url:`/admin/product/spuImageList/${spuId}`, method: 'get'})

// //获取销售属性列表
// ///admin/product/spuSaleAttrList/{spuId} ---get
// export const reqSpuSaleAttrList = (spuId) => request({ url:`/admin/product/spuSaleAttrList/${spuId}`, method: 'get'})

// //获取平台属性的列表
// ///admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} ---get
// export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})


// //获取sku列表数据的接口
// ///admin/product/findBySpuId/{spuId} --- get
// export const reqSkuList = (spuId) => request({ url:`/admin/product/findBySpuId/${spuId}`, method: 'get'})

