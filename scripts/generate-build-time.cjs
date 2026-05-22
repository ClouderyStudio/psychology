const fs = require('fs')
const path = require('path')

// 获取当前时间
const now = new Date()
const buildTime = now.toISOString()
const buildTimeFormatted = now.toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

// 生成构建信息文件
const buildInfo = {
  timestamp: buildTime,
  formattedTime: buildTimeFormatted,
  version: require('../package.json').version || '1.0.0'
}

// 写入文件
const outputPath = path.join(__dirname, '../app/plugins/build-info.client.ts')
const fileContent = `// 此文件由 scripts/generate-build-time.js 自动生成
// 构建时间：${buildTimeFormatted}
// 请勿手动修改

export const buildInfo = ${JSON.stringify(buildInfo, null, 2)}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            buildInfo
        }
    }
})
`

fs.writeFileSync(outputPath, fileContent, 'utf-8')
console.log(`✅ 构建时间已生成: ${buildTimeFormatted}`)