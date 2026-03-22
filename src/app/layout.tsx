import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentSwarm | AI 天赋推演沙盒",
  description: "停止枯燥测试，开始演算你的 1000 种人生。AI 引擎生成 1000 个平行宇宙的你，寻找你真正的天赋归属。",
  keywords: ["AI", "天赋", "职业规划", "多智能体", "模拟", "人生推演"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
