# 开发历程

1. 一开始只是觉得需要一个可以看到节假日的日历，别的日历都太复杂了，太臃肿看着不爽

2. 后来我想，人的事情，其实都可以抽象成日历，everything都发生在calendar上面

3. 为了100%的简洁，所以所有额外功能都是默认保持关闭状态，后面考虑独立出来

# todo

1. [x] 基本日历功能

2. [x] 节假日功能

3. [ ] 背单词功能

4. [ ] 生词两大来源之一：Chrome浏览器插件查词功能 question: 普通用户根本不会使用插件，尝试向360,qq等浏览器递交插件

5. [ ] 生词两大来源之二：移动App，iOS，Android

# 单词功能

slogan：在日历上复习你阅读中查过的词

story：as a 程序员, i want to 阅读英文技术文档, so that i 查询文章里面不认识的单词

story：as a 时事关注者, i want to 阅读国际新闻, so that i 查询新闻里面不认识的单词

story：as a 记录过很多生词的人, i want to 更好的阅读英语文章, so that i 复习我阅读过的文章和生词

## 该功能的要点有三个

1. 英语是一门用于沟通的工具，我用它去学习知识

2. 移动时代来临，我接触生词的来源是平常网上的阅读(很遗憾，没有言语沟通) 手机和PC Web(核心点：理解单词所在的句子而不是记住单词)

3. 参考 `Anki` 的 `艾宾浩斯遗忘曲线` 的复习提醒，以及对单词的印象：不认识(1m Again)、复杂(5m Hard)、一般(10m Good)、简单(4d Easy)，的三个自我认识和理解

## 艾宾浩斯遗忘曲线 的实现
```
timeSort
nextReviewDate = 
R=e^（-t/S)，其中R是被记忆的内容，t是时间，S是相对记忆强度
R=e^（-1/1)=0.36787944117
R=e^（-1/2)=0.60653065971
R=e^（-1/3)=0.71653131057
R=e^（-1/4)=0.77880078307

单词第一次出现，三个选项：10min 1day 4day，选了第一个则加入队列继续复习，直到可以隔天记忆，
计算得R=e^（-1/1)=0.36787944117，超过三次，只能选择1day复习，30*(1/4)
0.36*1.36 
S=10/in(0.36)=10天 S=10/in(0.36)=10天
in(0.36) = -1

where R is retrievability (a measure of how easy it is to retrieve a piece of information from memory),
 S is stability of memory (determines how fast R falls over time in the absence of training, testing or other recall),
 and t is time.
艾宾浩斯遗忘曲线，图中竖轴表示学习中记住的知识数量，横轴表示时间(天数)，曲线表示记忆量变化的规律
```

# Question
 
1. 这样的话，如何让用户直接体验到想要的功能而不是因为需要手动开启，没有体验就走了？maybe这部分用户并不是我的意向用户？
