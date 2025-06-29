#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 格式化对话内容
 * @param {string} content 原始内容
 * @returns {string} 格式化后的内容
 */
function formatConversation(content) {
    // 分割对话块
    const blocks = content.split(/\n---\n/);
    
    // 处理每个对话块
    const formattedBlocks = blocks.map(block => {
        // 移除多余的空行
        block = block.trim().replace(/\n{3,}/g, '\n\n');
        
        // 处理User的发言
        if (block.includes('**User**')) {
            return `\n\n## 👤 用户\n\n${block.replace('**User**', '').trim()}\n`;
        }
        
        // 处理Cursor(AI)的发言
        if (block.includes('**Cursor**')) {
            const aiContent = block.replace('**Cursor**', '').trim();
            
            // 处理AI的结构化内容
            const formattedAiContent = aiContent
                // 处理标题
                .replace(/## 🎯/g, '\n### 🎯')
                .replace(/## 🤔/g, '\n### 🤔')
                .replace(/## 💡/g, '\n### 💡')
                // 处理代码块
                .replace(/```(xml|plaintext)\n/g, '\n```$1\n')
                .replace(/```\n/g, '\n```\n')
                // 处理列表
                .replace(/\n- /g, '\n  - ');
            
            return `\n\n## 🤖 AI\n\n${formattedAiContent}\n`;
        }
        
        return block;
    });
    
    // 组合所有块
    return formattedBlocks.join('\n---\n');
}

/**
 * 处理指定的对话文件
 * @param {string} filePath 文件路径
 */
function processFile(filePath) {
    try {
        // 读取文件
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 格式化内容
        const formattedContent = formatConversation(content);
        
        // 写回文件
        fs.writeFileSync(filePath, formattedContent);
        
        console.log(`✅ 成功格式化文件: ${filePath}`);
    } catch (error) {
        console.error(`❌ 处理文件时出错: ${error.message}`);
        process.exit(1);
    }
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ 请提供要处理的文件路径');
        process.exit(1);
    }
    
    const filePath = path.resolve(args[0]);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 文件不存在: ${filePath}`);
        process.exit(1);
    }
    
    processFile(filePath);
}

// 执行主函数
main(); 