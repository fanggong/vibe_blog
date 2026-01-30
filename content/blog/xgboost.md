---
title: xgboost原理
author: Fang Yongchao
date: "2021-05-17"
description: "XGBoost是一种基于梯度提升的树模型集成方法，通过优化目标函数与正则项逐步拟合残差，广泛用于分类与回归任务。本文梳理其目标函数、正则项与树结构学习的核心推导。"
categories:
  - "机器学习"
---

参考文章：

- [Introduction to Boosted Trees](https://xgboost.readthedocs.io/en/latest/tutorials/model.html)
- [XGBoost: A Scalable Tree Boosting System](https://arxiv.org/pdf/1603.02754.pdf)

以下内容主要是对上面文章内容的整理以及一些个人理解。

## 目标函数：损失函数 + 正则项

--------------------------------

在机器学习模型中，目标函数一般由损失函数和正则项组成：
$$
obj(\theta) = L(\theta) + \Omega(\theta)
$$

其中$L(\theta)$为损失函数，在回归模型中，我们常常定义为MSE，即：
$$
L(\theta) = \sum_i(y_i - \hat y_i)^2
$$
或是在逻辑回归模型中，我们定义为：
$$
L(\theta) = \sum_i \left[ y_i\ln(1 + e^{-\hat y_i}) + (1 - y_i)\ln(1 + e^{\hat y_i}) \right]
$$
（逻辑回归的损失函数非常直观：当$y_i$为1时，$\hat y_i$越大则$L(\theta)$越小；而当$y_i$为0时，$\hat y_i$越小则$L(\theta)$越小）

## 决策树集成

--------------------------------

由于仅有一棵决策树的模型一般无法运用到实际中，所以我们会选择使用决策树集成模型，即将多个决策树的弱学习器的结果进行汇总，从而得到一个强学习器来进行预测。

随机森林模型就是由多个决策树的基学习器进行投票来得到集成模型的预测值，它的特点是基学习器之间相互独立，每个基学习器都仅使用部分样本和特征。

与随机森林这样的Bagging集成模型不同，Boosting集成模型中的每个基学习器基于前一个基学习器的结果进行进一步学习，最后将所有基学习器的预测值通过线性组合得到集成模型的预测结果，可以简单表示为：
$$
\hat y_i = \sum_{k=1}^Kf_k(x_i)
$$
在xgboost中，使用CART(Classification And Regression Tree)作为集成模型的基学习器。

## xgboost的损失函数

--------------------------------

模型训练的过程即为寻找使得目标函数达到最优的参数的过程。

在Boosting集成模型中，直接寻找全局最优意味着需要同时知道每个基学习器的状态，这对于将决策树作为基学习器的集成模型来说是很难办到的。因此在xgboost中采取了贪心策略，即在每一步寻找当前最优的树。

于是，xgboost中，目标函数可以表示为：
$$
\begin{aligned}
obj^{(t)} & = \sum_{i=1}^nl(y_i,\ \hat y_i^{(t)}) + \sum_{i=1}^t \Omega(f_i) \\
 & = \sum_{i=1}^nl(y_i,\ \hat y_i^{(t-1)} + f_t(x_i)) + \Omega(f_t) + constant
\end{aligned}
$$
即在前t-1棵树的基础上，寻找使得目标函数最小的第t棵树。这里的$constant$表示的是前t-1棵树对应的正则项。

当使用MSE作为损失函数时，上式可以表示为：
$$
\begin{aligned}
obj^{(t)} & = \sum_{i=1}^nl(y_i,\ \hat y_i^{(t)}) + \sum_{i=1}^t \Omega(f_i) \\
 & = \sum_{i=1}^n \left[ y_i - (\hat y_i^{(t-1)} + f_t(x_i))\right]^2 + \sum_{i=1}^t \Omega(f_i) \\
 & = \sum_{i=1}^n \left[ y_i^2 - 2y_i \hat y_i^{(t-1)} - 2y_if_t(x_i) + (\hat y_i^{(t-1)})^2 + 2\hat y_i^{(t-1)}f_t(x_i) + f^2_t(x_i)\right] + \sum_{i=1}^t \Omega(f_i) \quad (1)\\
 & = \sum_{i=1}^n \left[ 2(\hat y_i^{(t-1)} - y_i)f_t(x_i) + f_t^2(x_i)\right] + \Omega(f_t) + constant
\end{aligned}
$$

这里的$constant$包括了前t-1棵树对应的正则项以及(1)式第一项中的常数部分。

在实际情况下，由于损失函数的多种多样，我们需要一个可以通用的展开方式，即下述的泰勒展开式。

- **泰勒定理**：
设$n$是一个正整数。如果定义在一个包含$a$的区间上的函数$f$在$a$点处$n+1$次可导，那么对于这个区间上的任意$x$，都有：
$$
f(x) = f(a) + {f'(a) \over 1!}(x-a) + {f^{(2)}(a) \over 2!}(x-a)^2 +\ ...\ +{f^{(n)}(a) \over n!}(x-a)^n + R_n(x)
$$
其中的多项式称为函数在$a$处的泰勒展开式，剩余的$R_{n}(x)$ 是泰勒公式的余项，是$(x-a)^{n}$的高阶无穷小。

于是可以将$obj^{(t)}$作泰勒二阶展开成以下形式：
$$
\begin{aligned}
obj^{(t)} & = \sum_{i=1}^n l\left( y_i,\ \hat y_i^{(t-1)} + f_t(x_i)\right) + \sum_{i=1}^t \Omega(f_i) \\
 & = \sum_{i=1}^n \left[ l(y_i, \hat y_i^{(t-1)}) + g_if_t(x_i) + {1 \over 2} h_i f_t^2(x_i)\right] + \sum_{i=1}^t \Omega(f_i)
\end{aligned}
$$
**对应到上方的泰勒展开式，$f$就是关于预测值$\hat y$的损失函数$l$，这里令泰勒展开式中左侧的$x = \hat y_i^{(t-1)} + f_t(x_i)$，右侧的$a = \hat y_i^{(t-1)}$。那么$g_i$就是对损失函数$l$求一阶导数后将$\hat y_i^{(t-1)}$带入得到的值，同理，$h_i$为对损失函数$l$求二阶导数后将$\hat y_i^{(t-1)}$带入得到的值。**

将目标函数中的常数移除，就得到了我们对第t棵树进行最优化的目标函数为：
$$
\sum_{i=1}^n \left[ g_if_t(x_i) + {1 \over 2} h_i f_t^2(x_i)\right] + \Omega(f_t)
$$
将该式与前面以MSE作为损失函数时的目标函数比较，可以发现完美对应上了。

## xgboost的正则项

--------------------------------

这一部分在文章中没有详细地说明细节，只是给出了一个结论——this one works well in practice...

首先，我们将CART$f(x)$定义如下：
$$
f_t(x) = \omega_{q(x)}
$$
这里的$\omega$是由CART的$T$个叶子的值组成的一个向量，$q(x)$是一个映射，该映射将每一个样本映射到$T$个叶子节点中的某一个。

那么，在xgboost中对正则项的定义为：
$$
\Omega(f) = \gamma T + {1 \over 2}\lambda \sum_{j=1}^T \omega_j^2
$$

## xgboost的目标函数

--------------------------------

在定义了正则项之后，我们可以回到xgboost的目标函数。第t棵树的目标函数可以写作：
$$
\begin{aligned}
obj^{(t)} & = \sum_{i=1}^n \left[ g_i\omega_{q(x_i)} + {1 \over 2} h_i \omega_{q(x_i)}^2\right] + \gamma T + {1 \over 2}\lambda \sum_{j=1}^T \omega_j^2 \\
 & = \sum_{j=1}^T \left[ (\sum_{i \in I_j}g_i)\omega_j + {1 \over 2}(\sum_{i \in I_j}h_i +\lambda)\omega_j^2 \right] + \gamma T
\end{aligned}
$$
**写成这种形式很好理解，因为在同一个叶子节点上的样本的预测值是一样的，所以$n$个样本的损失函数之和可以分$T$个叶子节点进行计算。**

令$G_j = \sum_{i \in I_j}g_i$，$H_j = \sum_{i \in I_j}h_i$，那么目标函数可以写作：
$$
obj^{(t)} = \sum_{j=1}^T \left[ G_j\omega_j + {1 \over 2}(H_j + \lambda)\omega_j^2 \right] + \gamma T
$$
对于任意的$j$，上式是一个关于$\omega_j$的二次多项式，故可以得到当$\omega_j = - {G_j \over H_j + \lambda}$时，目标函数取到最小值，为：
$$
\displaystyle - {1 \over 2} \sum_{j=1}^T {G_j^2 \over H_j + \lambda} + \gamma T
$$
这里的$\omega_j,\ j=1,2,3,...,T$即为第t棵树上每个叶子节点的预测值。

## 寻找最优结构的树

--------------------------------

有了上方的目标函数后，就可以开始寻找最优结构的树了。很显然，我们无法枚举出所有的树结构然后比较目标函数的大小，因此这里的策略仍然是贪心算法，即每一步仅寻找当前最优的分割方法。可以知道每次分割目标函数减少量为：
$$
Gain = {1 \over 2}\left[ {G_L^2 \over H_L + \lambda} + {G_R^2 \over H_R + \lambda} + {(G_L + G_R)^2 \over H_L + H_R + \lambda} \right] - \gamma
$$
可以发现当$\gamma$越大，在分割时我们对目标函数剩余部分的变化的需求也越大，所以对$\gamma$进行调参可以起到很好的控制树的复杂度防止过拟合的目的。

## 几个比较纠结的问题

--------------------------------

1. **正则项中包括了叶子节点的值（也就是预测值）的平方和，这意味着预测值越大目标函数越大？**  
仔细想想这样其实是符合Boosting的思想的。Boosting希望使用一组弱学习器进行组合从而得到一个强学习器，那么对于一个同样的真实值，按照Boosting的思想应该是希望每一个弱学习器都使预测值向真实值前进一步，而不是仅凭某一个弱学习器就做出了非常准确的预测，而剩下的弱学习器不做出任何贡献。  
另一方面，这也是符合正则化的思想的，如果一个弱学习器对样本进行了非常准确的预测，那么这个弱学习器很大可能仅仅是在训练集上表现良好而已，也就是过拟合了。

1. **想出这些方法的人都是啥脑子呢？**  
不知道

