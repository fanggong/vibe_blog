---
title: 关于指数族的定义
author: Fang Yongchao
date: "2021-03-22"
description: "指数族是可写成指数形式的一类分布族，以自然参数与充分统计量刻画分布结构，广泛用于广义线性模型、共轭先验与推断理论。"
categories:
  - "统计学"
---

指数分布族的概念主要应用于广义线性模型（GLM）。

## 指数分布族

------------------------------

指数分布族（exponential family）的分布可以写成如下形式：

$$
p(x|\eta) = h(x) g(\eta) \exp \left\lbrace\eta^Tu(x)\right\rbrace
$$

- $\boldsymbol {\eta}$为自然参数，是决定分布的具体参数
- $\boldsymbol {u(x)}$称作充分统计量，通常有$\boldsymbol {u(x) = x}$
- $\boldsymbol {g(\eta)}$称作分布正规化系数，为确保概率和为1

## 伯努利分布的指数族形式

-----------------------------

伯努利分布的一般形式可以写为：

$$
p(x|\mu) = \mu^x (1-\mu)^{1-x}
$$
这里为了与指数族的参数进行对应写成了这个形式，平常我们在书本中看到的最多的形式是：

$$
f(x) =
\begin{cases} 
p,  & if & x = 1 \\\\
1-p, & if & x = 0
\end{cases}
$$
很明显是一样的。

伯努利分布可以转换成指数族的标准形式：

$$
\begin{aligned}
p(x|\mu) & = \exp \left\lbrace \ln {\mu^x (1-\mu)^{1-x}} \right\rbrace \\\\
& = \exp \left\lbrace x \ln\mu + (1-x) \ln{(1-\mu)}\right\rbrace \\\\
& = \exp \left\lbrace x \ln\mu - x \ln{(1-\mu)} + \ln{(1-\mu)}\right\rbrace \\\\
& = \exp \left\lbrace x \ln{\mu \over {1-\mu}} + \ln{(1-\mu)} \right\rbrace \\\\
& = (1-\mu) \exp \left\lbrace x \ln{\mu \over {1-\mu}} \right\rbrace 
\end{aligned}
$$
于是有

$$
\boldsymbol {\eta = \ln{\mu \over {1-\mu}}, \quad
\mu = {1 \over {1 + e^{-\eta}}}, \quad 
u(x) = x, \quad 
h(x) = 1, \quad g(\eta) = 1-\mu}
$$

## 正态分布的指数族形式

-----------------------------

正态分布的一般形式可以写为：

$$
p(x|\mu, \sigma) = {1 \over \sqrt{2\pi}\sigma} 
\exp \left\lbrace -{(x - \mu)^2 \over {2\sigma^2}} \right\rbrace
$$
将正态分布转换成指数族的标准形式：

$$
p(x|\mu, \sigma) =  {1 \over \sqrt{2\pi}\sigma} 
\exp \left\lbrace -{x^2 \over 2\sigma^2} \right\rbrace 
\exp \left\lbrace - {\mu^2 \over 2\sigma^2} \right\rbrace 
\exp \left\lbrace {x\mu \over \sigma^2} \right\rbrace
$$
于是有

$$
\boldsymbol {\eta = \mu, \quad 
u(x) = {x \over \sigma^2}, \quad 
h(x) = {1 \over \sqrt{2\pi}\sigma} \exp \left\lbrace -{x^2 \over 2\sigma^2} \right\rbrace, \quad 
g(\eta) = \exp \left\lbrace - {\mu^2 \over 2\sigma^2} \right\rbrace }
$$

## 分类分布的指数族形式

-------------------------

分类分布（Categorical Distribution）的一般形式可以写为：

$$
p(x|\mu) = \prod_{i=1}^M\mu_i^{x_i}
$$

将分类分布转换成指数族的标准形式：

$$
\begin{aligned}
p(x|\mu) & = \exp \left\lbrace \sum_{i=1}^M x_i\ln\mu_i \right\rbrace \\\\
& = \exp \left\lbrace \sum_{i=1}^{M-1}x_i\ln\mu_i + (1-\sum_{i=1}^{M-1}x_i)\ln(1-\sum_{i=1}^{M-1}\mu_i) \right\rbrace \\\\
& = \exp \left\lbrace \sum_{i=1}^{M-1}x_i\ln\mu_i + \ln(1-\sum_{i=1}^{M-1}\mu_i) - \sum_{i=1}^{M-1}x_i\ln(1-\sum_{i=1}^{M-1}\mu_i) \right\rbrace \\\\
& = \exp \left\lbrace \sum_{i=1}^{M-1} x_i\ln{\mu_i \over \ln(1-\sum_{i=1}^{M-1}\mu_i)} + \ln(1-\sum_{i=1}^{M-1}\mu_i) \right\rbrace \\\\
& = (1-\sum_{i=1}^{M-1}\mu_i) \exp \left\lbrace \sum_{i=1}^{M-1} x_i\ln{\mu_i \over \ln(1-\sum_{i=1}^{M-1}\mu_i)} \right\rbrace
\end{aligned}
$$

于是有
$$
\boldsymbol {\eta_i = \ln{\mu_i \over \ln(1-\sum_{i=1}^{M-1}\mu_i)}, \quad
u(x) = \sum_{i=1}^{M-1} x_i, \quad
h(x) = 1, \quad
g(\eta) = 1-\sum_{i=1}^{M-1}\mu_i}
$$
对比[伯努利分布的指数族形式](#伯努利分布的指数族形式)可以发现其只是分类分布在$\boldsymbol{M = 2}$时的特殊形式。
