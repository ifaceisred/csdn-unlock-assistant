// 移除复制限制的主要函数
function removeCopyRestrictions() {
    // 移除页面上的复制限制
    document.oncopy = null;
    document.oncontextmenu = null;
    document.onselectstart = null;
    document.onselect = null;
    document.oncut = null;
    document.onpaste = null;
    
    // 移除所有元素的复制限制
    const elements = document.getElementsByTagName('*');
    for (let element of elements) {
        // 移除用户选择限制
        element.style.userSelect = 'auto';
        element.style.webkitUserSelect = 'auto';
        
        // 移除复制相关事件
        element.oncopy = null;
        element.oncontextmenu = null;
        element.onselectstart = null;
        element.onselect = null;
        element.oncut = null;
        element.onpaste = null;
        
        // 移除只读属性
        if (element.hasAttribute('unselectable')) {
            element.removeAttribute('unselectable');
        }
    }

    // 添加新的功能：移除弹窗和遮罩层
    removePopups();
    
    // 处理特定网站
    handleSpecificSites();
}

// 移除弹窗和遮罩层
function removePopups() {
    // 通用选择器，匹配常见的弹窗和遮罩层
    const popupSelectors = [
        '.login-box', '.login-modal', '.sign-modal',
        '.vip-popup', '.mask', '.modal-mask',
        '[class*="login"]', '[class*="popup"]',
        '[class*="modal"]', '[class*="mask"]',
        '[class*="overlay"]', '.download-popup',
        '.modal-wrapper',
        '.modal-container',
        '.login-guide',
        '.vip-limit-wrap',
        '#loginBarDiv'
    ];

    // 移除匹配的元素
    popupSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (element.style.display !== 'none') {
                element.style.display = 'none';
            }
        });
    });

    // 修复页面滚动
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.overflow = 'auto';
}

// 处理特定网站的特殊情况
function handleSpecificSites() {
    const host = window.location.hostname;

    if (host.includes('csdn.net')) {
        handleCSDN();
    } 
    // else if (host.includes('wenku.baidu.com')) {
    //     handleBaiduWenku();
    // } else if (host.includes('zhihu.com')) {
    //     handleZhihu();
    // } else if (host.includes('douban.com')) {
    //     handleDouban();
    // }
}

// 处理CSDN
function handleCSDN() {
    // 添加必要的样式，增强代码块的选择和复制功能
    const style = document.createElement('style');
    style.innerHTML = `
        #content_views pre,
        #content_views pre code,
        .prism-highlighted,
        .prettyprint,
        pre.prettyprint,
        .hljs,
        .language-*,
        [class*="language-"] {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
            cursor: text !important;
        }
        
        /* 隐藏登录弹窗和遮罩 */
        .login-mark,
        .login-box,
        .signin,
        .hide-article-box,
        .weixin-shadowbox,
        .login-mark-layer,
        #loginBox,
        .login-container,
        [class*="login-"],
        [class*="-login"],
        .passport-login-container {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        
        /* 修复页面滚动 */
        body {
            overflow: auto !important;
            position: static !important;
        }
        
        .article_content {
            height: auto !important;
            overflow: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
        }
        
        #article_content {
            height: auto !important;
            overflow: visible !important;
        }
        
        .code-block-fullscreen {
            position: static !important;
        }

        /* 移除代码块的所有遮罩和限制 */
        .code-mask,
        .hljs::before,
        pre::before,
        code::before {
            display: none !important;
        }
        
        /* 添加移除关注限制的样式 */
        .hide-article-box,
        .hide-article-pos,
        .hide-article,
        .article-show-more,
        [class*="article-hide"],
        [class*="hide-article"],
        .follow-text-box,
        .follow-box,
        .follow-btn-box {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
        
        #article_content,
        .article_content,
        #content_views,
        .blog-content-box {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
        }
        
        .article-preview-box {
            display: block !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
        }
        
        /* 移除文章底部的遮罩 */
        .article-preview-box::after,
        .article_content::after,
        #article_content::after,
        .hide-article-box::after {
            display: none !important;
        }
        
        /* 隐藏底部不需要的内容 */
        .article-copyright,
        .article-source-link,
        .blog-footer-bottom,
        .template-box,
        .insert-baidu-box,
        .recommend-box-plus,
        [id^="copyright"],
        [class*="copyright"],
        .blog-footer-bottom,
        .more-toolbox {
            display: none !important;
        }
        
        /* 确保文章内容区域清晰可见 */
        #article_content,
        .article_content,
        #content_views,
        .blog-content-box {
            margin-bottom: 20px !important;
            border-bottom: none !important;
        }
        
        /* 移除所有script标签的显示 */
        script {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 拦截和清除登录弹窗
    function removeLoginPopups() {
        const loginSelectors = [
            '#loginBox',
            '.login-mark',
            '.login-mark-layer',
            '.signin',
            '.passport-login-container',
            '[class*="login-"]',
            '[class*="-login"]'
        ];

        loginSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });

        // 移除body上的样式
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
    }

    // 处理代码块复制
    function enableCodeCopy() {
        const codeSelectors = [
            'pre', 
            'code',
            '.prism-highlighted',
            '.prettyprint',
            '[class*="language-"]',
            '.hljs'
        ];
        
        codeSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(block => {
                // 阻止原有的点击事件
                block.addEventListener('click', (e) => {
                    e.stopPropagation();
                }, true);

                // 设置新的样式和属性
                block.style.cssText = `
                    user-select: text !important;
                    -webkit-user-select: text !important;
                    pointer-events: auto !important;
                    cursor: text !important;
                    display: block !important;
                `;

                // 移除所有限制性属性
                ['onclick', 'ondblclick', 'onmouseover', 'onmouseout', 'oncontextmenu'].forEach(attr => {
                    block.removeAttribute(attr);
                });
            });
        });

        // 处理复制按钮
        document.querySelectorAll('.copy-code-btn, .hljs-button, [class*="copy"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const pre = btn.closest('pre') || btn.parentElement;
                if (pre) {
                    const code = pre.querySelector('code') || pre;
                    const text = code.textContent || code.innerText;
                    
                    // 使用异步复制
                    navigator.clipboard.writeText(text.trim())
                        .then(() => {
                            btn.textContent = '复制成功';
                            setTimeout(() => {
                                btn.textContent = '复制';
                            }, 1000);
                        })
                        .catch(() => {
                            // 降级方案：使用传统方式复制
                            const textarea = document.createElement('textarea');
                            textarea.value = text.trim();
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            
                            btn.textContent = '复制成功';
                            setTimeout(() => {
                                btn.textContent = '复制';
                            }, 1000);
                        });
                }
            }, true);
        });
    }

    // 拦截登录相关的事件和函数
    function interceptLoginEvents() {
        // 清除可能触发登录的全局函数
        const functionsToBlock = [
            'loginshow',
            'login',
            'showLogin',
            'LoginShow',
            'ShowLogin'
        ];
        
        functionsToBlock.forEach(func => {
            window[func] = function() { return false; };
        });

        // 拦截事件监听器
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'click' && listener && listener.toString().includes('login')) {
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // 移除关注限制
    function removeFollowRestrictions() {
        // 移除关注按钮和提示
        const followSelectors = [
            '.hide-article-box',
            '.hide-article-pos',
            '.hide-article',
            '.article-show-more',
            '[class*="article-hide"]',
            '[class*="hide-article"]',
            '.follow-text-box',
            '.follow-box',
            '.follow-btn-box'
        ];

        followSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });

        // 显示完整文章内容
        const articleSelectors = [
            '#article_content',
            '.article_content',
            '#content_views',
            '.blog-content-box'
        ];

        articleSelectors.forEach(selector => {
            const article = document.querySelector(selector);
            if (article) {
                // 移除高度限制和遮罩
                article.style.cssText = `
                    height: auto !important;
                    max-height: none !important;
                    overflow: visible !important;
                    opacity: 1 !important;
                `;
                
                // 移除可能的类名限制
                article.classList.remove(
                    'hide-article',
                    'hide-article-box',
                    'hidden'
                );
                
                // 确保内容可见
                Array.from(article.children).forEach(child => {
                    child.style.opacity = '1';
                    child.style.display = child.tagName.toLowerCase() === 'style' ? 'none' : 'block';
                });
            }
        });

        // 移除底部遮罩
        const masks = document.querySelectorAll('.article-preview-box::after, .article_content::after');
        masks.forEach(mask => {
            if (mask.parentNode) {
                mask.parentNode.removeChild(mask);
            }
        });

        // 移除底部不需要的内容
        const removeSelectors = [
            '.article-copyright',
            '.article-source-link',
            '.blog-footer-bottom',
            '.template-box',
            '.insert-baidu-box',
            '.recommend-box-plus',
            '[id^="copyright"]',
            '[class*="copyright"]',
            '.blog-footer-bottom',
            '.more-toolbox',
            'script:not([src])', // 移除内联脚本
            '.hide-article-box',
            '.hide-article-pos'
        ];

        removeSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });

        // 清理文本节点中的版权信息
        const cleanTextNodes = (node) => {
            if (node.nodeType === 3) { // 文本节点
                if (node.textContent.includes('版权声明') || 
                    node.textContent.includes('本文为博主原创') ||
                    node.textContent.includes('CC 4.0') ||
                    node.textContent.includes('原文链接')) {
                    node.textContent = '';
                }
            } else {
                Array.from(node.childNodes).forEach(cleanTextNodes);
            }
        };

        // 清理文章底部的文本
        const article = document.querySelector('#article_content, .article_content');
        if (article) {
            cleanTextNodes(article);
        }
    }

    // 拦截关注相关的事件和函数
    function interceptFollowEvents() {
        const functionsToBlock = [
            'hideArticle',
            'hideContent',
            'showMore',
            'followUser',
            'followAuthor',
            'showFollow'
        ];
        
        functionsToBlock.forEach(func => {
            window[func] = function() { return false; };
        });

        // 移除关注按钮的点击事件
        document.querySelectorAll('[class*="follow"]').forEach(btn => {
            btn.onclick = null;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, true);
        });
    }

    // 修改初始化部分，添加新功能
    function initialize() {
        removeLoginPopups();
        enableCodeCopy();
        interceptLoginEvents();
        removeFollowRestrictions();
        interceptFollowEvents();
        
        // 定期检查和移除限制
        setInterval(() => {
            removeLoginPopups();
            removeFollowRestrictions();
        }, 100);
    }

    // 修改DOM监听，添加新功能
    const observer = new MutationObserver(() => {
        removeLoginPopups();
        enableCodeCopy();
        removeFollowRestrictions();
    });

    // 初始化
    initialize();

    // 设置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 处理百度文库
function handleBaiduWenku() {
    // 移除VIP限制
    const style = document.createElement('style');
    style.innerHTML = `
        .vip-limit-wrap { display: none !important; }
        .reader-word-layer { 
            user-select: auto !important;
            opacity: 1 !important;
            color: #000 !important;
            background: transparent !important;
        }
        .doc-reader { height: auto !important; }
        .blur-bg { filter: none !important; }
        .reader-page { height: auto !important; }
        .ppt-page-item { height: auto !important; }
        .sf-edu-wenku-vip-mask { display: none !important; }
    `;
    document.head.appendChild(style);

    // 处理文字遮罩和实际内容
    document.querySelectorAll('.reader-word-layer, .p-txt').forEach(element => {
        element.style.opacity = '1';
        element.style.color = '#000';
        element.style.userSelect = 'auto';
        element.style.webkitUserSelect = 'auto';
        // 移除可能的transform属性
        element.style.transform = 'none';
    });

    // 修复文档高度
    const pages = document.querySelectorAll('.reader-page');
    pages.forEach(page => {
        page.style.height = 'auto';
        page.style.minHeight = '1000px';
    });

    // 处理文本选择
    document.addEventListener('copy', (e) => {
        const selection = window.getSelection();
        if (selection.toString()) {
            e.clipboardData.setData('text/plain', selection.toString().replace(/\s+/g, ' ').trim());
            e.preventDefault();
        }
    });

    // 移除复制限制的遮罩
    setInterval(() => {
        const masks = document.querySelectorAll('.sf-edu-wenku-vip-mask');
        masks.forEach(mask => mask.remove());
    }, 500);
}

// 处理知乎
function handleZhihu() {
    const style = document.createElement('style');
    style.innerHTML = `
        .signflow-modal { display: none !important; }
        .Modal-backdrop { display: none !important; }
        .Question-mainColumnLogin { display: none !important; }
        .ContentItem-actions { pointer-events: auto !important; }
    `;
    document.head.appendChild(style);

    // 移除复制限制
    document.addEventListener('copy', (e) => {
        const selection = window.getSelection();
        if (selection.toString()) {
            e.clipboardData.setData('text/plain', selection.toString());
            e.preventDefault();
        }
    });
}

// 处理豆瓣
function handleDouban() {
    const style = document.createElement('style');
    style.innerHTML = `
        .article-content { user-select: auto !important; }
        .review-content { user-select: auto !important; }
    `;
    document.head.appendChild(style);
}

// 添加右键菜单复制功能
document.addEventListener('contextmenu', function(e) {
    e.stopPropagation();
    return true;
}, true);

// 添加快捷复制功能
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'c') {
        e.stopPropagation();
        return true;
    }
}, true);

// 监听DOM变化，持续移除复制限制和弹窗
const observer = new MutationObserver(() => {
    removeCopyRestrictions();
    removePopups();
});

// 初始化
function initialize() {
    removeCopyRestrictions();
    
    // 根据不同网站使用不同的观察配置
    const host = window.location.hostname;
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: !host.includes('csdn.net') // CSDN不监听属性变化
    };
    
    // 观察DOM变化
    observer.observe(document.body, observerConfig);
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
} 