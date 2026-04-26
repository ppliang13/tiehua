# Tiehua

Tiehua 是一个使用 **Three.js** 和 **Vite** 构建的 3D 锤击模拟项目。该项目模拟了锤击过程，并包含动态特效，如火花、烟雾和发光的熔铁。

## 项目结构

```
tiehua/
├── public/
│   ├── textures/       # 纹理资源（如火花、烟雾、光晕）
│   ├── audio/          # 音频资源（如锤击声音）
├── src/
│   ├── scene/          # 场景设置（相机、灯光、渲染器）
│   ├── objects/        # 3D 对象（锤子、地面、熔铁）
│   ├── effects/        # 特效（火花、烟雾、光晕）
│   ├── controls/       # 交互逻辑（如击打检测）
│   └── utils/          # 工具函数（如屏幕震动）
├── index.html          # 应用程序入口文件
├── package.json        # 项目依赖和脚本
└── vite.config.js      # Vite 配置文件
```

## 功能

- **3D 对象**：锤子、地面和熔铁。
- **视觉特效**：火花、烟雾和发光效果。
- **交互**：击打检测和动态更新。
- **响应式设计**：适配窗口大小调整。

## 安装步骤

1. 克隆仓库：
   ```bash
   git clone <repository-url>
   cd tiehua
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 在浏览器中打开应用程序（默认地址：`http://localhost:3000`）。

## 生产环境构建

运行以下命令以构建生产环境版本：

```bash
npm run build
```

构建输出位于 `dist/` 目录中。

## 依赖

- **Three.js**：用于 3D 渲染。
- **Vite**：用于快速开发和构建工具。

## 许可证

此项目基于 [MIT 许可证](LICENSE)。