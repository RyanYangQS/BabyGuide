# TabBar 图标说明

## 图标要求

微信小程序 tabBar 图标要求：
- 尺寸：81px × 81px（推荐）
- 格式：PNG 格式
- 大小：不超过 40KB

## 需要的图标

| 图标名称 | 未选中状态 | 选中状态 | 说明 |
|---------|-----------|---------|------|
| 首页 | home.png | home-active.png | 房子图标 |
| 体温 | temperature.png | temperature-active.png | 温度计图标 |
| 用药 | medicine.png | medicine-active.png | 药丸图标 |
| 我的 | profile.png | profile-active.png | 用户图标 |

## 获取图标方式

### 方式1：使用 iconfont（推荐）

1. 访问 [阿里巴巴矢量图标库](https://www.iconfont.cn/)
2. 搜索需要的图标
3. 下载 PNG 格式，尺寸选择 81px
4. 重命名并放入 `static/icons/` 目录

### 方式2：使用 Figma/Sketch 设计

1. 创建 81px × 81px 的画布
2. 设计图标
3. 导出为 PNG 格式

### 方式3：使用在线工具

- [Flaticon](https://www.flaticon.com/)
- [Icons8](https://icons8.com/)
- [IconPark](https://iconpark.oceanengine.com/)

## 临时方案

如果暂时没有图标，可以：
1. 使用项目中的 `logo.png` 作为临时图标
2. 或者暂时移除 tabBar 配置中的 iconPath 和 selectedIconPath

## 图标颜色建议

- 未选中状态：#999999（灰色）
- 选中状态：#4A90E2（主题蓝色）
