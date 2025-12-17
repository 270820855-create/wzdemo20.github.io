import { NavLink, Category, PetSkin, BuiltInGame } from './types';

// Palette based on the reference image (Jinx style: Hot Pink, Cyan, Acid Green)
export const COLORS = [
  'bg-jinx-pink',
  'bg-jinx-blue',
  'bg-neon-green',
  'bg-purple-500',
  'bg-yellow-400',
  'bg-gray-800',
  'bg-red-500',
  'bg-blue-500',
];

export const CATEGORIES: { id: Category; icon: string }[] = [
  { id: 'ALL', icon: '🔥' },
  { id: 'AI', icon: '🧠' },
  { id: 'DESIGN', icon: '🎨' },
  { id: 'FRONTEND', icon: '💻' },
  { id: 'MEDIA', icon: '🎮' },
  { id: 'TOOLS', icon: '🛠️' },
  { id: 'GAME', icon: '🕹️' },
];

export const PET_SKINS: PetSkin[] = [
  { id: 'girl-white', name: '暴走蓝发', avatarColor: '#00E5FF', description: '蓝发双马尾的疯狂少女' },
  { id: 'girl-pink', name: '星之使者', avatarColor: '#0F172A', description: '披着白袍的神秘少女' },
  { id: 'goth-bunny', name: '暗夜兔', avatarColor: '#18181B', description: '酷酷的暗黑系兔耳少女' },
  { id: 'cat-orange', name: '墨水猫', avatarColor: '#FDBA74', description: '打翻了墨水瓶' },
];

export const BUILT_IN_GAMES: BuiltInGame[] = [
  { id: 'tetris3d', name: '微型积木', description: 'BUILDER', icon: '🧱', color: 'bg-yellow-400' },
  { id: 'snake', name: '贪吃蛇', description: 'CLASSIC', icon: '🐍', color: 'bg-neon-green' },
  { id: 'tictactoe', name: '井字棋', description: 'VS', icon: '❌', color: 'bg-jinx-pink' },
  { id: '2048', name: '2048', description: 'PUZZLE', icon: '🔢', color: 'bg-orange-400' },
  { id: 'minesweeper', name: '扫雷', description: 'LOGIC', icon: '💣', color: 'bg-gray-600' },
];

export const SEARCH_ENGINES = [
  { id: 'google', name: 'GO', url: 'https://www.google.com/search?q=', color: '#4285F4' },
  { id: 'baidu', name: 'DU', url: 'https://www.baidu.com/s?wd=', color: '#2932E1' },
  { id: 'bilibili', name: 'BILI', url: 'https://search.bilibili.com/all?keyword=', color: '#FB7299' },
  { id: 'github', name: 'GIT', url: 'https://github.com/search?q=', color: '#171515' },
];

export const DEFAULT_LINKS: NavLink[] = [
  // --- AI ZONE ---
  { id: 'ai-1', title: '豆包', url: 'https://www.doubao.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-2', title: '文心一言', url: 'https://yiyan.baidu.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-3', title: '讯飞星火', url: 'https://xinghuo.xfyun.cn', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-4', title: '通义千问', url: 'https://tongyi.aliyun.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-5', title: '盘古', url: 'https://huaweicloud.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-6', title: 'deepseek', url: 'https://deepseek.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-7', title: 'prompthero', url: 'https://prompthero.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-8', title: 'ChatGPT', url: 'https://chat.openai.com', color: 'bg-neon-green text-black', icon: '🧠', category: 'AI' },
  { id: 'ai-9', title: 'Picwish', url: 'https://picwish.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-10', title: 'DALL·E 2 (绘画AI)', url: 'https://openai.com/dall-e-2', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-11', title: 'Anthropic (聊天AI)', url: 'https://anthropic.com', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-12', title: 'YOU (聊天AI)', url: 'https://perplexity.ai', color: 'bg-jinx-pink text-white', icon: '🧠', category: 'AI' },
  { id: 'ai-13', title: 'midjourney (绘画AI)', url: 'https://midjourney.com', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-14', title: 'Dreamlike.art (绘画AI)', url: 'https://dreamlike.art', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-15', title: 'NightCafe (绘画AI)', url: 'https://creator.nightcafe.studio', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-16', title: 'Tiamat (绘画AI)', url: 'https://tiamat.world', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-17', title: 'HuggingFace (开源社区)', url: 'https://huggingface.co', color: 'bg-jinx-pink text-white', icon: '🤗', category: 'AI' },
  { id: 'ai-18', title: 'Lexica (绘画AI)', url: 'https://lexica.art', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-19', title: 'Scribble Diffusion (绘画)', url: 'https://scribblediffusion.com', color: 'bg-jinx-pink text-white', icon: '✏️', category: 'AI' },
  { id: 'ai-20', title: 'Leonardo (AI 绘图社区)', url: 'https://leonardo.ai', color: 'bg-jinx-pink text-white', icon: '🎨', category: 'AI' },
  { id: 'ai-21', title: 'promptbase (AI提示词)', url: 'https://promptbase.com', color: 'bg-jinx-pink text-white', icon: '📝', category: 'AI' },
  { id: 'ai-22', title: 'waifulabs (二次元头像生成)', url: 'https://waifulabs.com', color: 'bg-jinx-pink text-white', icon: '👧', category: 'AI' },
  { id: 'ai-23', title: 'Galileo AI (UI 设计)', url: 'https://usegalileo.ai', color: 'bg-jinx-pink text-white', icon: '📐', category: 'AI' },

  // --- DESIGN ZONE ---
  { id: 'des-1', title: 'Figma', url: 'https://www.figma.com', color: 'bg-purple-600 text-white', icon: '🎨', category: 'DESIGN' },
  { id: 'des-2', title: '千亿像素看中国', url: 'http://pf.bigpixel.cn', color: 'bg-jinx-pink text-white', icon: '📷', category: 'DESIGN' },
  { id: 'des-3', title: '环游世界', url: 'https://www.airpano.org.cn', color: 'bg-jinx-pink text-white', icon: '🌍', category: 'DESIGN' },
  { id: 'des-4', title: '猫趣', url: 'https://catfun.org', color: 'bg-jinx-pink text-white', icon: '🐱', category: 'DESIGN' },

  // --- FRONTEND ZONE ---
  { id: 'fe-1', title: 'Csdn', url: 'https://www.csdn.net', color: 'bg-red-500 text-white', icon: 'C', category: 'FRONTEND' },
  { id: 'fe-2', title: 'Github', url: 'https://github.com', color: 'bg-black text-white', icon: '🐙', category: 'FRONTEND' },
  { id: 'fe-3', title: 'Gitcode', url: 'https://gitcode.com', color: 'bg-blue-600 text-white', icon: 'G', category: 'FRONTEND' },
  { id: 'fe-4', title: '菜鸟工具', url: 'https://cainiaojc.com', color: 'bg-green-500 text-white', icon: '🛠️', category: 'FRONTEND' },
  { id: 'fe-5', title: '开源中国', url: 'https://gitee.com', color: 'bg-green-600 text-white', icon: 'OS', category: 'FRONTEND' },

  // --- MEDIA ZONE ---
  { id: 'med-1', title: 'Bilibili', url: 'https://www.bilibili.com', color: 'bg-blue-400 text-white', icon: '📺', category: 'MEDIA' },
  { id: 'med-2', title: 'YouTube', url: 'https://www.youtube.com', color: 'bg-red-600 text-white', icon: '▶️', category: 'MEDIA' },
  { id: 'med-3', title: '樱花动漫', url: 'http://hyys19.com', color: 'bg-jinx-pink text-white', icon: '🌸', category: 'MEDIA' },
  { id: 'med-4', title: '橘子动漫', url: 'http://jzacg.com', color: 'bg-orange-400 text-white', icon: '🍊', category: 'MEDIA' },
  { id: 'med-5', title: 'AGE动漫', url: 'http://agedm.org', color: 'bg-jinx-pink text-white', icon: '🅰️', category: 'MEDIA' },
  { id: 'med-6', title: '异世界动漫', url: 'http://dmmiku.com', color: 'bg-purple-500 text-white', icon: '🌀', category: 'MEDIA' },
  { id: 'med-7', title: '喵物次元', url: 'http://mwcy.net', color: 'bg-jinx-pink text-white', icon: '🐱', category: 'MEDIA' },
  { id: 'med-8', title: '動畫線上看', url: 'http://anime1.me', color: 'bg-blue-400 text-white', icon: '📺', category: 'MEDIA' },
  { id: 'med-9', title: '稀饭动漫', url: 'http://dick.xfani.com', color: 'bg-jinx-pink text-white', icon: '🍚', category: 'MEDIA' },
  { id: 'med-10', title: '饭团动漫', url: 'http://acgfta.com', color: 'bg-gray-800 text-white', icon: '🍙', category: 'MEDIA' },
  { id: 'med-11', title: '樱之空动漫', url: 'http://skr2.cc', color: 'bg-pink-400 text-white', icon: '🌸', category: 'MEDIA' },
  { id: 'med-12', title: '栀子欢文学网', url: 'http://zhizihuan.com', color: 'bg-green-500 text-white', icon: '🍃', category: 'MEDIA' },
  { id: 'med-13', title: '晋江文学城', url: 'http://jjwxc.net', color: 'bg-green-600 text-white', icon: '🌿', category: 'MEDIA' },
  { id: 'med-14', title: '番茄小说', url: 'http://fanqienovel.com', color: 'bg-red-500 text-white', icon: '🍅', category: 'MEDIA' },
  { id: 'med-15', title: '七猫小说', url: 'http://qimao.com', color: 'bg-yellow-400 text-black', icon: '🐱', category: 'MEDIA' },
  { id: 'med-16', title: '飞卢小说', url: 'http://faloo.com', color: 'bg-blue-500 text-white', icon: '📚', category: 'MEDIA' },
  { id: 'med-17', title: '漫漫漫画', url: 'http://manmanapp.com', color: 'bg-jinx-pink text-white', icon: '🖼️', category: 'MEDIA' },
  { id: 'med-18', title: '动漫屋', url: 'http://dm5.com', color: 'bg-blue-400 text-white', icon: '🏠', category: 'MEDIA' },
  { id: 'med-19', title: '快看漫画', url: 'http://kuaikanmanhua.com', color: 'bg-yellow-400 text-black', icon: '👀', category: 'MEDIA' },

  // --- TOOLS ZONE ---
  { id: 'tool-1', title: 'wikiHow', url: 'https://zh.wikihow.com', color: 'bg-jinx-blue text-black', icon: '📘', category: 'TOOLS' },
  { id: 'tool-2', title: '中午吃什么', url: 'https://chishenme.xyz', color: 'bg-gray-200 text-black', icon: '🍱', category: 'TOOLS' },
  { id: 'tool-3', title: 'emojimix', url: 'https://tikolu.net', color: 'bg-purple-400 text-white', icon: '😀', category: 'TOOLS' },
  { id: 'tool-4', title: '大学资源网', url: 'https://dxzy163.com', color: 'bg-blue-500 text-white', icon: '📚', category: 'TOOLS' },
  { id: 'tool-5', title: 'Oeasy', url: 'http://oeasy.org', color: 'bg-green-400 text-black', icon: '🎓', category: 'TOOLS' },
  { id: 'tool-6', title: 'Mikutap (自动音乐生成器)', url: 'https://aidn.jp', color: 'bg-jinx-pink text-white', icon: '🎵', category: 'TOOLS' },
  { id: 'tool-7', title: '为所欲为成语生成器', url: 'https://lab.bangbang93.com', color: 'bg-jinx-pink text-white', icon: '📝', category: 'TOOLS' },
  { id: 'tool-8', title: '制作能说话的好玩表情包', url: 'https://facecards.com', color: 'bg-jinx-pink text-white', icon: '🤪', category: 'TOOLS' },
  { id: 'tool-9', title: '动漫捏脸', url: 'https://picrew.me', color: 'bg-jinx-pink text-white', icon: '😊', category: 'TOOLS' },
  { id: 'tool-10', title: 'eHow', url: 'https://ehow.com', color: 'bg-yellow-400 text-black', icon: '💡', category: 'TOOLS' },
  { id: 'tool-11', title: '在线抠图', url: 'https://remove.bg', color: 'bg-gray-600 text-white', icon: '✂️', category: 'TOOLS' },
  { id: 'tool-12', title: '有趣网址之家', url: 'https://youquhome.com', color: 'bg-red-400 text-white', icon: '🏠', category: 'TOOLS' },
  { id: 'tool-13', title: 'voicv (声音克隆)', url: 'http://voicv.com', color: 'bg-jinx-pink text-white', icon: '🎙️', category: 'TOOLS' },
  { id: 'tool-14', title: '凹凸工坊', url: 'http://autohanding.com', color: 'bg-black text-white', icon: '🏭', category: 'TOOLS' },
  { id: 'tool-15', title: 'docsmall (文件处理)', url: 'http://docsmall.com', color: 'bg-blue-500 text-white', icon: '📄', category: 'TOOLS' },

  // --- GAME ZONE ---
  { id: 'game-1', title: 'MAZE TOYS', url: 'https://maze.toys', color: 'bg-yellow-400 text-black', icon: '🧩', category: 'GAME' },
  { id: 'game-2', title: 'yikn.net', url: 'https://yikm.net', color: 'bg-jinx-pink text-white', icon: '🎮', category: 'GAME' },
  { id: 'game-3', title: 'farter', url: 'https://farter.cn', color: 'bg-gray-800 text-white', icon: '💨', category: 'GAME' },
  { id: 'game-4', title: 'crazygames', url: 'https://crazygames.com', color: 'bg-purple-600 text-white', icon: '🕹️', category: 'GAME' },
  { id: 'game-5', title: '在线 DOS 游戏', url: 'https://dos.zcrc.cz', color: 'bg-black text-white', icon: '💾', category: 'GAME' },
  { id: 'game-6', title: '到底是谁没动', url: 'https://emojisandearthporn.com', color: 'bg-jinx-pink text-white', icon: '🤔', category: 'GAME' },
  { id: 'game-7', title: '在线拼魔方', url: 'http://tools.bqrdh.com', color: 'bg-blue-500 text-white', icon: '🧊', category: 'GAME' },
  { id: 'game-8', title: '彩虹皮生成器', url: 'https://chp.shadiao.app', color: 'bg-red-400 text-white', icon: '🌈', category: 'GAME' },
  { id: 'game-9', title: '雨声生成器', url: 'https://gogoame.sumbloun.com', color: 'bg-blue-300 text-black', icon: '🌧️', category: 'GAME' },
];