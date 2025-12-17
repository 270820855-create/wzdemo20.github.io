import { Language, PetSkinId } from '../types';

export const TRANSLATIONS = {
  'zh-CN': {
    app: {
      title: '无名',
      subtitle: '次元',
      dashboard: '仪表盘',
      items: '项',
      noResults: '未找到结果...',
      addNew: '添加新项',
      setup: '设置'
    },
    menu: {
      title: '菜单',
      arcade: '街机',
      partner: '伙伴'
    },
    category: {
      ALL: '全部',
      AI: 'AI',
      DESIGN: '艺术',
      FRONTEND: '代码',
      MEDIA: '娱乐',
      TOOLS: '工具',
      GAME: '街机'
    },
    search: {
      placeholder: '搜索 {engine} 或筛选...',
      go: '走起!'
    },
    modal: {
      newLink: '新建链接',
      title: '标题',
      url: '网址',
      icon: '图标',
      color: '颜色',
      create: '创建!',
      cancel: '取消'
    },
    jump: {
      title: '正在离开当前次元',
      destination: '目标坐标',
      confirm: '立即穿越',
      cancel: '留在这里'
    },
    settings: {
      title: '系统设置',
      export: '导出数据',
      import: '导入数据',
      reset: '重置系统',
      petSize: '人物模型大小',
      language: '语言 (LANGUAGE)'
    },
    petUI: {
      feed: '喂食',
      play: '玩耍',
      heal: '治疗',
      stats: {
        hunger: '饥饿',
        mood: '心情',
        health: '健康',
        level: 'Lv.'
      }
    },
    pet: {
      'girl-white': {
        idle: ["真无聊... 炸点什么吧？", "我不疯，只是有点... 有创意！", "你看见我的枪了吗？", "嘘... 它们在跟我说话。", "嘿！看这里！"],
        surprised: ["哇哦！你认真的？", "什么鬼？！"],
        happy: ["太棒了！哈哈哈哈！", "完美！爆炸！"],
        love: ["你这人还不错。", "❤️"],
        sleep: ["没电了...", "Zzz... 别吵..."],
        angry: ["别碰我！", "烦死了！走开！💢"],
        feed: ["终于有吃的了！", "有火药味的吗？", "吧唧吧唧... 味道一般。"],
        play: ["来追我啊！", "炸飞他们！", "哈哈哈哈！好玩！"],
        heal: ["啧，苦死了。", "我还不需要修理！", "状态恢复。"],
        levelup: ["力量涌上来了！", "哈哈！更强了！", "升级了！谁想试试？"],
        lowHunger: ["喂！我要饿死了！", "如果你不喂我，我就吃掉界面！"],
        lowMood: ["好无聊... 想搞破坏...", "别无视我！"],
        lowHealth: ["痛痛痛...", "我需要修理...", "可恶..."]
      },
      'girl-pink': {
        idle: ["星辰在指引我...", "你听见群星的声音了吗？", "这身白袍...能抵挡尘世的污秽。", "我在观测你的命运。", "不要熄灭心中的光。"],
        surprised: ["命运偏离了轨迹？！", "あれは...何？"],
        happy: ["群星在闪耀。✨", "真是耀眼的光芒。", "我感受到了祝福。"],
        love: ["你也是星空的一部分。❤️", "愿群星庇佑你。"],
        sleep: ["冥想时刻...", "回归星海..."],
        angry: ["无礼之徒。", "退下！💢"],
        feed: ["这是大地的恩赐。", "虽然不需要进食...但谢谢。", "星尘的味道..."],
        play: ["来观测星象吧。", "命运的轨迹变了。", "有趣的变数。"],
        heal: ["星光治愈万物。", "浄化...", "光芒重聚。"],
        levelup: ["我离星空更近了。✨", "灵魂升华。", "光芒更盛。"],
        lowHunger: ["魔力不足...", "即使是使者也需要能量..."],
        lowMood: ["星光黯淡了...", "有些孤独..."],
        lowHealth: ["袍子破了...", "我的光在消逝...", "需要...恢复..."]
      },
      'goth-bunny': {
        idle: ["无聊...", "想听摇滚吗？", "世界真吵...", "盯着我看干嘛？", "☠️"],
        surprised: ["哈？！", "被发现了？"],
        happy: ["酷。", "哼，有点意思。", "❤️"],
        love: ["你是特别的。", "别告诉别人。"],
        sleep: ["关灯...", "黑暗..."],
        angry: ["闭嘴！", "吵死了！💢"],
        feed: ["垃圾食品？我喜欢。", "谢了。", "嚼嚼..."],
        play: ["来场混乱吧。", "破坏时间。", "这就对了。"],
        heal: ["啧，麻烦。", "还能动。", "复活。"],
        levelup: ["更黑暗了。", "力量...溢出了。", "超越极限。"],
        lowHunger: ["我要饿疯了...", "喂食，现在。"],
        lowMood: ["想破坏点什么...", "真没劲。"],
        lowHealth: ["好痛...", "流血了...", "意识模糊..."]
      },
      'cat-orange': {
        idle: ["喵...", "呼噜... 呼噜...", "（盯着你看）", "（伸懒腰）"],
        surprised: ["哈？！（炸毛）", "喵嗷！"],
        happy: ["呼噜呼噜~", "喵~（蹭蹭）"],
        love: ["喵~ ❤️", "（舔手）"],
        sleep: ["Zzz...", "（缩成一团）"],
        angry: ["哈——！", "（咬你一口）"],
        feed: ["喵！(嚼嚼)", "呼噜... (好吃)", "鱼？"],
        play: ["喵！(飞扑)", "（追尾巴）", "嗖——！"],
        heal: ["喵... (舔毛)", "呼噜..."],
        levelup: ["吼——！(其实是喵)", "大猫能量！", "喵喵喵！(升级)"],
        lowHunger: ["喵？(ご飯？)", "喵ー！！！(空腹)"],
        lowMood: ["... (尾巴拍打)", "喵..."],
        lowHealth: ["哈...", "（躲在角落）"]
      }
    }
  },
  'en-US': {
    app: {
      title: 'UNKNOWN',
      subtitle: 'DIMENSION',
      dashboard: 'DASHBOARD',
      items: 'ITEMS',
      noResults: 'NO RESULTS FOUND...',
      addNew: 'ADD NEW',
      setup: 'SETUP'
    },
    menu: {
      title: 'MENU',
      arcade: 'ARCADE',
      partner: 'PARTNER'
    },
    category: {
      ALL: 'ALL',
      AI: 'AI',
      DESIGN: 'ART',
      FRONTEND: 'CODE',
      MEDIA: 'MEDIA',
      TOOLS: 'TOOLS',
      GAME: 'GAMES'
    },
    search: {
      placeholder: 'SEARCH {engine} OR FILTER...',
      go: 'GO!'
    },
    modal: {
      newLink: 'NEW LINK',
      title: 'TITLE',
      url: 'URL',
      icon: 'ICON',
      color: 'COLOR',
      create: 'CREATE!',
      cancel: 'CANCEL'
    },
    jump: {
      title: 'LEAVING DIMENSION',
      destination: 'TARGET COORDINATES',
      confirm: 'INITIATE WARP',
      cancel: 'ABORT'
    },
    settings: {
      title: 'SYSTEM CONFIG',
      export: 'EXPORT DATA',
      import: 'IMPORT DATA',
      reset: 'RESET SYSTEM',
      petSize: 'PET SIZE',
      language: 'LANGUAGE'
    },
    petUI: {
      feed: 'FEED',
      play: 'PLAY',
      heal: 'HEAL',
      stats: {
        hunger: 'HUNGER',
        mood: 'MOOD',
        health: 'HEALTH',
        level: 'Lv.'
      }
    },
    pet: {
      'girl-white': {
        idle: ["Boring... Let's blow something up!", "I'm not crazy, just creative!", "Seen my gun?", "Shh... they're talking to me.", "Hey! Look here!"],
        surprised: ["Whoa! Seriously?", "What the heck?!"],
        happy: ["Awesome! Hahahaha!", "Perfect! Kaboom!"],
        love: ["You're not so bad.", "❤️"],
        sleep: ["Out of battery...", "Zzz..."],
        angry: ["Don't touch!", "Go away! 💢"],
        feed: ["Finally! Food!", "Got explosives with this?", "Nom nom... needs gunpowder."],
        play: ["Let's blow it up!", "Faster!", "Hahahaha!"],
        heal: ["Ugh, medicine.", "Stable. Boring.", "Patching up."],
        levelup: ["Power overwhelming!", "Level up! Chaos time!", "I'm stronger!"],
        lowHunger: ["Feed me or I eat the UI.", "Starving here!"],
        lowMood: ["Booooring.", "Entertain me!"],
        lowHealth: ["Ouch...", "I'm leaking...", "System error..."]
      },
      'girl-pink': {
        idle: ["The stars are guiding me...", "Do you hear the cosmos?", "This white robe protects against impurity.", "I am observing your fate.", "Don't let your light fade."],
        surprised: ["Fate has shifted?!", "What is... that?"],
        happy: ["The stars are shining. ✨", "A brilliant light.", "I feel the blessing."],
        love: ["You are part of the sky. ❤️", "May the stars protect you."],
        sleep: ["Meditating...", "Returning to the stardust..."],
        angry: ["Insolent.", "Back off! 💢"],
        feed: ["A gift from the earth.", "Thank you.", "Tastes like stardust..."],
        play: ["Let's observe the constellations.", "The trajectory has changed.", "An interesting variable."],
        heal: ["Starlight heals all.", "Purifying...", "Light gathers."],
        levelup: ["I am closer to the sky. ✨", "Ascension.", "The light grows stronger."],
        lowHunger: ["Mana running low...", "Even envoys need energy..."],
        lowMood: ["The light dims...", "Feeling lonely..."],
        lowHealth: ["My robe is torn...", "My light is fading...", "I need... recovery..."]
      },
      'goth-bunny': {
        idle: ["Boring...", "Wanna listen to rock?", "World is noisy...", "Stop staring.", "☠️"],
        surprised: ["Hah?!", "Spotted?"],
        happy: ["Cool.", "Hmph, not bad.", "❤️"],
        love: ["You're special.", "Don't tell anyone."],
        sleep: ["Lights out...", "Darkness..."],
        angry: ["Shut up!", "So loud! 💢"],
        feed: ["Junk food? Like it.", "Thanks.", "Munch..."],
        play: ["Let's cause chaos.", "Destruction time.", "That's right."],
        heal: ["Tch, annoying.", "Still moving.", "Revived."],
        levelup: ["Darker.", "Power... overflowing.", "Limit broken."],
        lowHunger: ["Starving crazy...", "Feed me, now."],
        lowMood: ["Wanna break something...", "Lame."],
        lowHealth: ["It hurts...", "Bleeding...", "Fading..."]
      },
      'cat-orange': {
        idle: ["Meow...", "Purr...", "(Stares at you)", "(Stretches)"],
        surprised: ["Hah?!", "Meow!"],
        happy: ["Purr~", "Meow~"],
        love: ["Meow~ ❤️", "(Licks hand)"],
        sleep: ["Zzz...", "(Curled up)"],
        angry: ["Hiss!", "(Bites)"],
        feed: ["Meow! (Munch)", "Purr... (Tasty)", "Fish?"],
        play: ["Meow! (Chase)", "(Pounce)", "Zoomies!"],
        heal: ["Meow... (Lick)", "Purr..."],
        levelup: ["ROAR! (Just kidding)", "Big Cat Energy!", "Level Up Meow!"],
        lowHunger: ["Meow? (Food?)", "MEOW! (Hungry!)"],
        lowMood: ["... (Flicks tail)", "Meow..."],
        lowHealth: ["Hiss...", "(Limps)"]
      }
    }
  },
  'ja-JP': {
    app: {
      title: '無名',
      subtitle: '次元',
      dashboard: 'ダッシュボード',
      items: '項目',
      noResults: '結果が見つかりません...',
      addNew: '追加',
      setup: '設定'
    },
    menu: {
      title: 'メニュー',
      arcade: 'アーケード',
      partner: 'パートナー'
    },
    category: {
      ALL: 'すべて',
      AI: 'AI',
      DESIGN: '芸術',
      FRONTEND: 'コード',
      MEDIA: '娯楽',
      TOOLS: 'ツール',
      GAME: 'ゲーム'
    },
    search: {
      placeholder: '{engine} で検索、またはフィルタ...',
      go: '検索!'
    },
    modal: {
      newLink: 'リンク追加',
      title: 'タイトル',
      url: 'URL',
      icon: 'アイコン',
      color: '色',
      create: '作成!',
      cancel: 'キャンセル'
    },
    jump: {
      title: '次元跳躍警告',
      destination: '転送先座標',
      confirm: 'ワープ開始',
      cancel: '中止'
    },
    settings: {
      title: 'システム設定',
      export: 'データ出力',
      import: 'データ取込',
      reset: '初期化',
      petSize: 'モデルサイズ',
      language: '言語 (LANGUAGE)'
    },
    petUI: {
      feed: '食事',
      play: '遊ぶ',
      heal: '治療',
      stats: {
        hunger: '空腹',
        mood: '気分',
        health: '健康',
        level: 'Lv.'
      }
    },
    pet: {
      'girl-white': {
        idle: ["退屈... 何か爆破しよう？", "狂ってないわ、創造的なだけ！", "私の銃、見た？", "シーッ... 声が聞こえるの。", "ねえ！こっち！"],
        surprised: ["うわっ！マジで？", "何これ？！"],
        happy: ["最高！アハハハ！", "完璧！ドカン！"],
        love: ["悪くないわね。", "❤️"],
        sleep: ["電池切れ...", "Zzz..."],
        angry: ["触らないで！", "あっち行って！💢"],
        feed: ["やっと食料！", "火薬の味は？", "モグモグ..."],
        play: ["爆破しようぜ！", "もっと速く！", "アハハハ！"],
        heal: ["チッ、薬か。", "修理完了。", "悪くない。"],
        levelup: ["力が溢れる！", "レベルアップ！暴れるぞ！", "もっと強くなった！"],
        lowHunger: ["おい！餓死する！", "インターフェース食べるぞ！"],
        lowMood: ["退屈だ...", "楽しませてよ！"],
        lowHealth: ["痛い...", "故障中...", "クソッ..."]
      },
      'girl-pink': {
        idle: ["星が導いている...", "宇宙の声が聞こえる？", "この白衣は汚れを防ぐの。", "あなたの運命を観測中。", "心の光を消さないで。"],
        surprised: ["運命がズレた？！", "あれは...何？"],
        happy: ["星々が輝いている。✨", "眩しい光。", "祝福を感じるわ。"],
        love: ["あなたも星空の一部ね。❤️", "星の加護があらんことを。"],
        sleep: ["瞑想中...", "星の海へ..."],
        angry: ["無礼者。", "下がって！💢"],
        feed: ["大地の恵みね。", "ありがとう。", "星屑の味がする..."],
        play: ["星座を観測しましょう。", "軌道が変わったわ。", "興味深い変数ね。"],
        heal: ["星の光は癒やし。", "浄化...", "光が集まる。"],
        levelup: ["空に近づいたわ。✨", "魂の昇華。", "光が強まった。"],
        lowHunger: ["魔力が足りない...", "使者にもエネルギーは必要..."],
        lowMood: ["光が陰っている...", "孤独ね..."],
        lowHealth: ["衣が破れた...", "光が消えていく...", "回復が...必要..."]
      },
      'goth-bunny': {
        idle: ["退屈...", "ロック聴く？", "世界はうるさい...", "ジロジロ見ないで。", "☠️"],
        surprised: ["はぁ？！", "バレた？"],
        happy: ["クール。", "ふん、悪くない。", "❤️"],
        love: ["あんたは特別。", "誰にも言うなよ。"],
        sleep: ["消灯...", "闇...", "Zzz..."],
        angry: ["黙れ！", "うるさい！💢"],
        feed: ["ジャンクフード？好き。", "サンキュ。", "モグモグ..."],
        play: ["混沌を起こそう。", "破壊の時間だ。", "そうでなくちゃ。"],
        heal: ["チッ、面倒。", "まだ動ける。", "復活。"],
        levelup: ["より深く...", "力が...溢れる。", "限界突破。"],
        lowHunger: ["腹減って死ぬ...", "餌、今すぐ。"],
        lowMood: ["何か壊したい...", "くだらない。"],
        lowHealth: ["痛ぇ...", "血が...", "意識が..."]
      },
      'cat-orange': {
        idle: ["ニャー...", "ゴロゴロ...", "（じーっ）", "（伸び〜）"],
        surprised: ["ハァ？！", "ニャッ！"],
        happy: ["ゴロゴロ~", "ニャ~"],
        love: ["ニャ~ ❤️", "（ペロペロ）"],
        sleep: ["Zzz...", "（丸まる）"],
        angry: ["シャー！", "（ガブッ）"],
        feed: ["ニャ！(モグモグ)", "ゴロゴロ... (美味)", "魚？"],
        play: ["ニャ！(ダッシュ)", "（お尻フリフリ）", "ズーム！"],
        heal: ["ニャ... (ペロペロ)", "ゴロゴロ..."],
        levelup: ["ガオー！(冗談)", "ビッグキャット！", "レベルアップニャ！"],
        lowHunger: ["ニャ？(ご飯？)", "ニャー！！！(空腹)"],
        lowMood: ["... (しっぽ)", "ニャ..."],
        lowHealth: ["シャー...", "（隠れる）"]
      }
    }
  }
};