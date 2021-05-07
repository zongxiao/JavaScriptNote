```
// 本地初始化一个git 项目
git init

// 克隆一个远程仓库，比如GitHub
git clone [url]

// 关联到一个远程仓库 
git remote add origin git@github.com:zongxiao/JavaScriptNote.git

// 将所有的改动计入暂存区
git add

// 将所有更改加入版本历史，并说明
git commit -m "first commit"

// 从远程分支拉取更改
git pull

// 将本地更改提交到远程仓库
git push

// 创建一个分支
git branch [name]

// 切换到另一个分支
git checkout [branch-name]

// 合并指定分支到当前分支上
git merge [branch-name] 

// 删除一个指定分支
git branch -d [branch-name]
```

### 应用场景

#### 创建`.gitignore`文件

```
echo "">>.gitignore
```

 示例为`react`项目中`.gitignore`文件 

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

#### 关联远程仓库

 关联远程仓库，有两种情况：

1. ##### 本地初始化后远程关联 

   ```
   git init
   
   // 远程仓库创建完成后，进行关联
   git remote add origin [url]
   
   // 关联后，切换到远程的主分支 
   git checkout master
   ```

2. #####  克隆一个远程的仓库 

   ```
   git clone [url]
   ```

   

#### 关联远程分支

 正常如果是直接克隆或者关联到了远程仓库，从远程拉取对应的分支即可。 

1. #####  拉取远程分支到本地 

    拉取分支时，保证本地仓库与远程时同步。即通过`git pull` 

    然后查看远程仓库有哪些分支，`git branch -a` ; 分支`Ft_Hboot_1.1.0` 是在github上手动创建的。 

2. #####  关联本地分支到远程分支 - 远程不存在分支时 