function sh() {
var oup_weapon=[""
];
var oup_armor=["大祭司长礼服",
"大魔法师[???]的长袍",
"浪漫旋律华尔兹",

"掌管生死之影夹克",
"首席执行官风衣",
"最终战术",

"爆裂大地之勇猛",
"热带 : 霸王树",
"实用型电弧胸甲",

"撒旦 : 愤怒之王",
"天堂之翼",
"束缚链甲",

"永恒世界之循环",
"选择优势",
"原始胎动之地",

"古代深渊长袍",
"流浪者水牛风衣",
"结局逆转",
"灭世之怒"
];
var oup_acc=["融化拂晓之温暖",
"莱多 : 秩序创造者",
"伽内什的永恒庇护",

"无尽的探求",
"时间回溯之针",
"响彻天地的咆哮",
"逆转宿命的狂乱"
];
var oup_special=["永恒地狱黑暗巴士",
"穿越次元的超新星",
"命运反抗者",
"心痛如绞的悲剧"
];
var k;
var int_choose = parseInt(Math.random() * 6);
var equi_title = "";
if (int_choose < 3) {
k=parseInt(Math.random()*oup_armor.length);
equi_title = oup_armor[k];
} else if (int_choose >=4 && int_choose < 6) {
k=parseInt(Math.random()*oup_acc.length);
equi_title = oup_acc[k];
} else if (int_choose >=5) {
k=parseInt(Math.random()*oup_special.length);
equi_title = oup_special[k];
}
// equi_title = "神话装备";
document.getElementById("equiname").innerHTML=equi_title;
document.getElementById("test").innerHTML+=equi_title;
document.getElementById("record").innerHTML+="<span style='background-image: -webkit-gradient( linear, left top, left bottom, color-stop(0, #F8C63D), color-stop(1, #CC66E7));color: transparent;-webkit-background-clip: text;'>" + equi_title + "</span>";
document.getElementById("record").scrollTop=document.getElementById("record").scrollHeight;
}