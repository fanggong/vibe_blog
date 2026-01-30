---
title: 参数正则化
author: Fang Yongchao
date: "2021-06-11"
description: "参数正则化通过在损失函数中加入惩罚项来控制模型复杂度，降低过拟合风险。本文概述L1/L2正则化及其在线性回归与优化中的作用与差异。"
categories:
  - "机器学习"
---

以下内容主要参考自[scikit-learn文档](https://scikit-learn.org/stable/user_guide.html)和**Deep Learning**一书。

## 线性回归的正则化

--------------------------

对于参数正则化最早的接触来自于线性回归。

**Lasso回归**使用L1范数进行参数正则化，即回归的目标函数为：
$$
{1 \over 2N }\left\| X\omega-y \right\|_2^2 + \alpha \left\| \omega \right\|_1
$$

**岭回归**使用L2范数进行参数正则化，即回归的目标函数为：
$$
\left\| X\omega-y \right\|_2^2 + \alpha \left\| \omega \right\|_2^2
$$

**Elasti-Net回归**的正则项结合了L1范数和L2范数，其目标函数为：
$$
{1 \over 2N }\left\| X\omega-y \right\|_2^2 + \alpha \rho \left\| \omega \right\|_1 + {\alpha (1-\rho) \over 2} \left\| \omega \right\|_2^2
$$

## 关于L2参数正则化的理论分析

--------------------------

L2正则化下的目标函数可以表示为：
$$
\tilde J(\omega; X, y) = {\alpha \over 2}\omega^T\omega + J(\omega; X, y)
$$
上式的右侧两项分别为正则项和损失函数。

设$\omega^\ast$为使得损失函数$J(\omega; X, y)$取得最小值时的$\omega$，那么在$\omega^\ast$的附近对损失函数进行二次泰勒展开，则有：
$$
J(\omega) = J(\omega^\ast) + {1 \over 2}(\omega - \omega^\ast)^T H (\omega - \omega^\ast)
$$
其中$H$是$J$在$\omega^\ast$处的关于$\omega$的Hessian矩阵。

**这里由于$\omega^\ast$为损失函数的最优解，损失函数在该点的一阶导为0，故上式的泰勒展开中不含一阶项。**

显然，上面的泰勒展开在取到最小值时有：
$$
J'(\omega) = H(\omega - \omega^\ast) = 0
$$

设$\tilde \omega$为使得目标函数$\tilde J(\omega; X, y)$取得最小值时的$\omega$，那么$\tilde \omega$应该满足：
$$
\alpha \tilde \omega + H(\tilde \omega - \omega^\ast) = 0 \\\\
(H + \alpha I)\tilde \omega - H\omega^\ast = 0 \\\\
\tilde \omega = (H + \alpha I)^{-1} H \omega^\ast
$$
**到这一步其实已经可以看出来$\alpha$的作用是在对使得损失函数取得最小值的$\omega = \omega^\ast$进行一个缩放了，而且$\alpha$越大，这个缩放的程度也会越大。**

但是为了理解正则项是如何对$\omega^\ast$进行缩放的话，需要对上式进行一个变换，这里要用到下述定理：

- 任意的NxN实对称矩阵的特征值都是实数且都有N个线性无关的特征向量。并且这些特征向量都可以正交单位化而得到一组正交且模为1的向量。故实对称矩阵$A$可被分解成：  
$$
A = Q \Lambda Q^{-1} = Q \Lambda Q^T
$$
其中$Q$为正交矩阵，$\Lambda$为实对角矩阵。

由于$H$是实对称矩阵，运用上面的定理，可以得到：
$$
\begin{aligned}
\tilde \omega & =  (H + \alpha I)^{-1} H \omega^\ast \\\\
 & = (Q \Lambda Q^T + \alpha I)^{-1} Q \Lambda Q^T \omega^\ast \\\\
 & = [Q (\Lambda + \alpha I) Q^T]^{-1} Q \Lambda Q^T \omega^\ast \\\\
 & = Q (\Lambda + \alpha I)^{-1} \Lambda Q^T \omega^\ast
\end{aligned}
$$
于是可以看到，**权重衰减的效果是沿着由$H$的特征向量所定义的轴缩放$\omega^\ast$，具体来说，会根据$\lambda_i \over {\lambda_i + \alpha}$因子缩放与$H$第$i$个特征向量对齐的$\omega^\ast$的分量**。

这个结论是**Deep Learning**书中的原话，但是个人依然觉得实在是很**的抽象，无法与前面的公式联系起来。直到发现做一个下面的变换就理解了：
$$
Q^T \tilde \omega = (\Lambda + \alpha I)^{-1} \Lambda Q^T \omega^\ast
$$

即**计算$\omega^\ast$在$H$的特征向量所定义的轴上的坐标（$Q^T \omega^\ast$），然后使用因子$\lambda_i \over {\lambda_i + \alpha}$（$(\Lambda + \alpha I)^{-1} \Lambda$）进行缩放。而$\tilde \omega$在$H$的特征向量定义的轴上的坐标（$Q^T \tilde \omega$）应该等于上一步缩放后的结果**。

很显然，对于某确定的$\alpha$，$\lambda_i$越小，缩放因子越接近0，从而处于该特征值对应特征向量方向上的$\omega^\ast$的分量就会被缩放到很小。

换一个角度考虑，$\lambda_i$越小，说明当$\omega$在$\lambda_i$对应特征向量方向上移动的时候，损失函数变化相对较小（Hessian矩阵的性质），故$\omega^\ast$会在较小的特征值对应的特征向量方向上进行更大的移动（即缩放）。

## 关于L1参数正则化的理论分析

--------------------------

L1正则化下的目标函数可以表示为：
$$
\tilde J(\omega; X, y) = \alpha \left\| \omega \right\| _1 + J(\omega; X, y)
$$
同样的，设$\omega^\ast$为损失函数取到最小值时的$\omega$，$\tilde \omega$为目标函数取到最小值时的$\omega$，那么$\omega^\ast$和$\tilde \omega$的关系可以由下式得出：
$$
\tilde J'(\tilde \omega; X, y) = \alpha sign(\tilde \omega) + H(\tilde \omega - \omega^\ast) = 0
$$
然而，根据上式，我们无法得到一个用$\omega^\ast$表示$\tilde \omega$的直接清晰的代数表达式。因此这里做一个简化假设$H$是对角矩阵，即$H=diag([H_{1,1}, H_{2,2},...,H_{n,n}])$，其中每个$H_{i,i}>0$（该假设可以通过对输入特征进行预处理得到，如PCA）。

那么，在该假设下，目标函数可以表示成如下形式：
$$
\tilde J(\omega; X, y) = J(\omega^\ast; X, y) + \sum_i \left[ {1 \over 2} H_{i,i}(\omega_i - \omega_i^\ast)^2 + \alpha |\omega_i| \right]
$$
为最小化目标函数，可以求得$\omega_i$有下列形式的解析解（完全不知道这个解析解怎么求出来的，为什么写书的总喜欢在一些不显然的地方很显然...）：
$$
\omega_i = sign (\omega^\ast)\max \left\lbrace |\omega_i^\ast| - {\alpha \over H_{i,i}},\ 0 \right\rbrace
$$
分析上面的解析解，可以发现：

- $0 < |\omega_i^\ast| < {\alpha \over H_{i,i}}$时，$\omega_i$为0。即$\omega_i$对损失函数的贡献被正则项抵消，$\omega_i$被推为0
- $|\omega_i^\ast| > {\alpha \over H_{i,i}}$时，$\omega_i$会被从$\omega_i^\ast$开始向0推动$\alpha \over H_{i,i}$的距离


## L2正则化和L1正则化的比较

--------------------------

通过前面的理论分析就可以得到对L2正则化和L1正则化的几个常识：

1. L2正则化中，参数只是在进行缩放，即最小化损失函数得到的参数不为0的话，最小化目标函数得到的参数也不会为0。因此L2正则化不会使参数变得稀疏；
1. L1正则化中，参数是在被向0推动，当$\alpha$足够大时，部分特征的参数会被推为0，因此L1正则化也常被用来作为特征选择的工具。
