# Gloria Victis 资源地图

一个基于 Leaflet 的游戏资源标记地图，支持矿石、草药、木材的标记、筛选与编辑。单 HTML 文件，无需服务器部署。

## 在线使用

**[打开地图](https://mennys3115138750-dev.github.io/gloria-victis-map/)**

## 功能

- 无极缩放地图，拖拽平移
- 资源标记：矿石 🟠 / 草药 🟢 / 木材 🟤(暂时)
- 按资源类型筛选（复选框）和等级范围筛选（滑块）
- 标记列表侧边栏，点击即飞至坐标
- 多地图切换（下拉框）
- 导入 / 导出 JSON 数据，方便社区共享
- **双击地图空白处**添加新标记
- **点击标记**查看详情，可编辑或删除
- **右键标记**快捷菜单（编辑 / 删除）

## 本地使用

```bash
git clone https://github.com/mennys3115138750-dev/gloria-victis-map.git
cd gloria-victis-map
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

或直接双击 `index.html`（部分浏览器可能限制数据加载，建议用 HTTP 服务器）。

## 数据文件

```
data/
├── map1.json   # 主大陆标记数据
└── map2.json   # 扩展区域标记数据
```

JSON 格式：

```json
{
  "mapName": "map1",
  "imageWidth": 943,
  "imageHeight": 766,
  "markers": [
    { "id": "m1", "x": 200, "y": 150, "type": "herb", "level": 1, "label": "银叶草" }
  ]
}
```

- `x`, `y`：游戏内坐标（左上角为原点）
- `type`：`ore`（矿石）、`herb`（草药）、`wood`（木材）
- `level`：等级（1-10）
- `label`：显示名称

## 社区协作

1. 浏览器打开页面，双击添加标记
2. 点击「导出 JSON」下载数据文件
3. 将 JSON 文件分享到社区群，或提交 Pull Request

## 技术

- [Leaflet.js](https://leafletjs.com/) 地图引擎
- `L.CRS.Simple` 像素坐标系
- 纯静态文件，托管于 GitHub Pages
