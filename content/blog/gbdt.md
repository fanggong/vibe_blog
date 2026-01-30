---
title: 梯度提升树（GBDT）原理
author: Fang Yongchao
date: "2021-05-07"
categories:
  - "机器学习"
description: "GBDT 属于梯度提升框架的树模型，以加法模型与前向分步优化为核心，通过拟合损失函数的负梯度逐步提升预测性能，适用于回归与分类任务。"
---

## GBDT算法原理

---------------------------

GBDT可以表示为决策树的加法模型，即：
$$
\hat y_i = \sum_{k=1}^K f_k(x_i)
$$
其中$f$表示决策树，$K$为决策树的数量。

通过前向分步骤算法，第t步得到的决策树模型为$f_t(x)$，有：
$$
\hat y_i^{(t)} = \hat y_i^{(t-1)} + f_t(x_i)
$$
其目标函数为：
$$
obj^{(t)} = \sum_{i=1}^N l\left(y_i, \hat y_i^{(t-1)} + f_t(x_i) \right)
$$
将目标函数使用泰勒一阶展开，有：
$$
obj^{(t)} = \sum_{i=1}^N \left[ l(y_i, \hat y_i^{(t-1)}) + g_i f_t(x_i) \right]
$$
这里的$g_i = \left[ {\partial\ l(y_i, \hat y_i) \over \partial \hat y_i}  \right]_{\hat y_i = \hat y_i^{(t-1)}}$，即损失函数关于$\hat y_i$求导后带入$\hat y_i = \hat y_i^{(t-1)}$。

丢掉目标函数中的常数部分，我们要最优化的是下面的部分：
$$
\sum_{i=1}^N g_if_t(x_i)
$$

于是可以运用梯度下降的思想，沿着负梯度方向拟合第t棵决策树$f_t(x)$，即对于每个样本，$f_t(x)$需要拟合的值为：
$$
r_i = - \gamma g_i
$$
其中$\gamma$即为梯度下降的步长，或者可以称作学习率。通过调整$\gamma$可以达到**正则化**的目的。

## 回归问题下的GDBT

---------------------------

在回归问题下，如果使用二分之一的MSE作为损失函数，即：
$$
l(y, \hat y) = {1 \over 2} (y - \hat y)^2
$$
这时候，第t棵决策树$f_t(x)$需要拟合的值就是：
$$
r_i = \gamma\ (y_i - \hat y_i^{(t-1)})
$$
当步长（学习率）为1时，拟合的即为前t-1棵决策树模型之和与真实值的残差。

## 二分类问题下的GBDT

---------------------------

在二分类问题下，损失函数为：
$$
l(y, \hat y) =  y\ln(1 + e^{-\hat y}) + (1-y)\ln(1 + e^{\hat y})
$$
注意这里的$\hat y$类似逻辑回归中的$\ln{p \over {1-p}}$。

这时候，第t棵决策树$f_t(x)$需要拟合的值就是：
$$
\begin{aligned}
r_i & = \gamma\ ({y_i \over {1+e^{-\hat y_i^{(t-1)}}}}e^{- \hat y_i^{(t-1)} } - {{1-y_i} \over {1+e^{\hat y_i^{(t-1)}}}} e^{\hat y_i^{(t-1)}}) \\
 & = \gamma\ (y_i - {1 \over {1 + e^{-\hat y_i^{(t-1)}}}}) \\
 & = \gamma\ (y - p_i^{(t-1)})
\end{aligned}
$$
也就是说，当步长（学习率）为1时，拟合的是前t-1棵决策树模型预测的概率之和与真实标签之差。
