---
title: 生存分析及R语言实现
author: Fang Yongchao
date: "2021-04-06"
description: "生存分析是一类用于研究事件发生时间及其影响因素的统计方法，广泛应用于医学随访、可靠性与风险研究等场景。"
categories:
  - "R语言"
  - "统计学"
---

相关包：[survival](https://mirrors.tuna.tsinghua.edu.cn/CRAN/web/packages/survival/index.html)，[survminer](https://mirrors.tuna.tsinghua.edu.cn/CRAN/web/packages/survminer/index.html)

## 相关概念

------------------------------

生存分析主要用于分析感兴趣的事件发生所需要的时间以及变量对事件发生的影响。

有如下几个相关概念：

- 事件（Event）：比如在癌症相关研究中，病人的死亡
- 时间（Time）：当事件没有发生时，时间就是起始时间到当前时间的跨度，当事件发生时，时间为起始时间到事件发生的时间跨度
- 删失（Censoring）：个人认为这个概念没必要过度理解，截止到某时间点事件没有发生，即为删失（这个时间点可能是当前时间，也可能是失去调查对象数据的中间某个时间点）
- 生存函数（Survival Function）：一般写作$S(t)$，表示从起始时间到时间t没有发生事件的概率，即：
$$
S(t) = P \left( T > t \right)
$$
- 寿命分布函数（Lifetime distribution function）：一般写作$F(t)$，表示从起始时间到时间t发生了事件的概率，即：
$$
F(t) = P \left( T \le t \right) = 1 - S(t)
$$

- 危险函数（Harzard Function）：一般写作$h(t)$或$\lambda(t)$，表示在截止到时间t事件都没有发生的条件下，事件接下来发生的瞬时概率，即：
$$
h(t) = \lim_{\Delta t \to 0} {P(t \le T \lt t + \Delta t\,|\, T > t) \over {\Delta t}} = {F'(t) \over S(t)} = - {S'(t) \over S(t)}
$$

## Kaplan-Meier方法

------------------------------

Kaplan-Meier方法是一种非参数估计生存函数的方法，计算方法为：

$$
S(t) = \prod_{i; t_i \le t} \left( 1 - {d_i \over n_i} \right)
$$
这里对于每一个$i$，在时间$t_i$都发生了至少一次事件，$d_i$为在时间$t_i$发生的事件数，$n_i$为在时间$t_i$还未发生事件的个体数。

使用函数`survfit()`进行估计：
```r
fit <- survfit(Surv(time, status) ~ sex, data = kidney)
str(fit)
```

绘制生存曲线。`ggsurvplot()`拥有众多参数对生存曲线的图进行修改完善。
```r
ggsurvplot(fit)
```

## Log-rank检验

------------------------------

Log-rank检验对两个或两个以上的生存曲线进行比较，其零假设为生存曲线之间没有差异。

使用函数`survdiff()`进行检验：
```r
survdiff(Surv(time, status) ~ sex, data = kidney)
```

这个检验结果也可以在绘制生存曲线时将**pval**参数设为TRUE得到。

## Cox比例风险回归模型

------------------------------

Cox比例风险回归模型的回归方程形式为：

$$
h(t) = h_0(t) \exp \left( b_1x_1 + b_2x_2 + ... + b_nx_n\right)
$$
这里的$h_0(t)$可以理解为在时间t事件发生的瞬时概率的基线，即所有的$x_i$都取0时的$h(t)$。但是在实际情况中，我们感兴趣的是相对危险（Harzard Ratio, HR），也就是对于$\boldsymbol{x} = (x_1, x_2, ..., x_n)$和$\boldsymbol{x'} = (x'_1, x'_2, ..., x'_3)$，它们在时间t事件发生的瞬时概率$h(t)$和$h'(t)$的比值，即：

$$
{h(t) \over h'(t)} = \exp \left( b_1(x_1 - x'_1) + b_2(x_2 - x'_2) + ...+b_n(x_n - x'_n) \right)
$$

由此可以很容易理解Cox比例风险回归模型的系数解释，即$x_i$每增加1个单位，事件发生的瞬时概率上升$\exp(b_i)$。

在R中，使用函数`coxph()`进行Cox回归：

```r
fit <- coxph(Surv(time, status) ~ sex + age + disease + frail, data = kidney)
summary(fit)
```


