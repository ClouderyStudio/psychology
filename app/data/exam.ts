/**
 * 内部测试试卷数据（A卷 / B卷）
 * 来源：计算机基础试卷（内部资料）
 */

export interface ExamOption {
  label: string
  text: string
}

export interface ExamQuestion {
  text: string
  options?: ExamOption[]
  answer: string
  /** 题目解析/备注（原卷中的括号说明） */
  note?: string
  /** 题型：judge 判断 / single 单选 / multiple 多选 / essay 简答（缺省时按有无 options 推断） */
  type?: 'judge' | 'single' | 'multiple' | 'essay'
}

export interface ExamSection {
  title: string
  /** 每题分值，未指定时默认 1 分 */
  pointsPerQuestion?: number
  questions: ExamQuestion[]
}

export interface ExamPaper {
  id: string
  name: string
  sections: ExamSection[]
}

export const examPapers: ExamPaper[] = [
  {
    id: 'A',
    name: '计算机 A卷',
    sections: [
      {
        title: '一、判断题（正确选 A，错误选 B，每题 0.5 分）',
        pointsPerQuestion: 0.5,
        questions: [
          { text: 'Python 是一种解释型语言，变量不需要声明类型。', answer: 'A' },
          { text: 'Git 中 git commit -m "message" 用于将暂存区的修改提交到本地仓库。', answer: 'A' },
          { text: '在 Java 中，String 是基本数据类型。', answer: 'B', note: 'String 是引用类型' },
          { text: 'RESTful API 设计中，GET 请求通常用于修改资源。', answer: 'B', note: 'GET 用于查询，修改用 POST/PUT/DELETE' },
          { text: '关系数据库中的事务具有 ACID 特性。', answer: 'A' },
          { text: '在 JavaScript 中，== 和 === 的作用完全相同。', answer: 'B', note: '=== 严格相等，== 会类型转换' },
          { text: '单元测试的目的是验证软件的功能是否符合需求规格。', answer: 'B', note: '单元测试验证单个模块的正确性，验收测试才验证需求' },
          { text: '设计模式中的"单例模式"确保一个类只有一个实例，并提供一个全局访问点。', answer: 'A' },
          { text: '在 C++ 中，虚函数（virtual）用于实现运行时多态。', answer: 'A' },
          { text: 'Docker 是一种虚拟机技术，可以在宿主机上运行完整的操作系统。', answer: 'B', note: 'Docker 是容器技术，共享宿主机内核，不是虚拟机' },
          { text: 'SQL 中的 JOIN 操作用于合并两个或多个表的数据。', answer: 'A' },
          { text: '敏捷开发中的 Scrum 框架包含角色、事件和工件。', answer: 'A' },
          { text: '在 HTTP 协议中，状态码 500 表示服务器内部错误。', answer: 'A' },
          { text: 'JSON 是一种轻量级的数据交换格式，其键必须用双引号括起来。', answer: 'A' },
          { text: '在 Linux 中，chmod 755 file 表示给所有者赋予读、写、执行权限，组和其他用户赋予读和执行权限。', answer: 'A' },
          { text: '在 Python 中，list 和 tuple 都是可变序列。', answer: 'B', note: 'tuple 不可变' },
          { text: '版本控制工具 git 中，git branch 用于切换分支。', answer: 'B', note: 'git checkout 或 git switch 用于切换，git branch 用于列出或创建分支' },
          { text: '在面向对象编程中，"封装"是指将数据和操作数据的方法绑定在一起，并隐藏内部实现。', answer: 'A' },
          { text: '软件测试中的"白盒测试"需要了解程序的内部逻辑结构。', answer: 'A' },
          { text: '在 SQL 中，WHERE 子句用于筛选分组后的数据。', answer: 'B', note: 'HAVING 用于分组后筛选，WHERE 用于分组前' },
          { text: '在 Java 中，final 关键字修饰的变量一旦赋值后不能修改。', answer: 'A' },
          { text: '微服务架构通常采用集中式数据库管理所有服务的数据。', answer: 'B', note: '微服务推荐每个服务拥有自己的数据库' },
          { text: '在 HTML 中，<div> 是块级元素，<span> 是行内元素。', answer: 'A' },
          { text: '在 Python 中，try...except 用于异常处理。', answer: 'A' },
          { text: '设计模式中的"工厂模式"属于创建型模式。', answer: 'A' },
        ],
      },
      {
        title: '二、单项选择题（选择唯一正确答案，每题 0.5 分）',
        pointsPerQuestion: 0.5,
        questions: [
          {
            text: '以下哪个是合法的变量名（Python）？',
            options: [
              { label: 'A', text: '2var' },
              { label: 'B', text: 'my-var' },
              { label: 'C', text: '_myVar' },
              { label: 'D', text: 'my var' },
            ],
            answer: 'C',
          },
          {
            text: '在 Git 中，用于从远程仓库拉取最新代码并合并到当前分支的命令是（ ）。',
            options: [
              { label: 'A', text: 'git pull' },
              { label: 'B', text: 'git fetch' },
              { label: 'C', text: 'git clone' },
              { label: 'D', text: 'git push' },
            ],
            answer: 'A',
          },
          {
            text: '下列哪种关系型数据库的 SQL 方言中，用于分页查询的关键字是 LIMIT？',
            options: [
              { label: 'A', text: 'Oracle' },
              { label: 'B', text: 'SQL Server' },
              { label: 'C', text: 'MySQL' },
              { label: 'D', text: 'PostgreSQL' },
            ],
            answer: 'C',
            note: '实际上都支持，但常见于 MySQL，此题选 C，更标准',
          },
          {
            text: '在 Java 中，public static void main(String[] args) 方法的访问修饰符是（ ）。',
            options: [
              { label: 'A', text: 'private' },
              { label: 'B', text: 'protected' },
              { label: 'C', text: 'public' },
              { label: 'D', text: 'default' },
            ],
            answer: 'C',
          },
          {
            text: '下列哪个不是常见的软件开发生命周期（SDLC）模型？',
            options: [
              { label: 'A', text: '瀑布模型' },
              { label: 'B', text: '螺旋模型' },
              { label: 'C', text: '敏捷模型' },
              { label: 'D', text: '循环模型' },
            ],
            answer: 'D',
          },
          {
            text: '在 HTTP 请求中，Content-Type: application/json 表示（ ）。',
            options: [
              { label: 'A', text: '请求体是 JSON 格式' },
              { label: 'B', text: '响应体是 HTML' },
              { label: 'C', text: '请求参数是表单编码' },
              { label: 'D', text: '请求是 GET 方法' },
            ],
            answer: 'A',
          },
          {
            text: '在 Python 中，用于定义匿名函数的关键字是（ ）。',
            options: [
              { label: 'A', text: 'def' },
              { label: 'B', text: 'lambda' },
              { label: 'C', text: 'function' },
              { label: 'D', text: 'arrow' },
            ],
            answer: 'B',
          },
          {
            text: '在关系数据库中，用于保证实体完整性的约束是（ ）。',
            options: [
              { label: 'A', text: '外键约束' },
              { label: 'B', text: '检查约束' },
              { label: 'C', text: '主键约束' },
              { label: 'D', text: '唯一约束' },
            ],
            answer: 'C',
          },
          {
            text: '在 JavaScript 中，以下哪个方法用于将 JSON 字符串解析为 JavaScript 对象？',
            options: [
              { label: 'A', text: 'JSON.stringify()' },
              { label: 'B', text: 'JSON.parse()' },
              { label: 'C', text: 'JSON.convert()' },
              { label: 'D', text: 'JSON.toObject()' },
            ],
            answer: 'B',
          },
          {
            text: '在软件开发中，"重构"的主要目的是（ ）。',
            options: [
              { label: 'A', text: '修复缺陷' },
              { label: 'B', text: '增加新功能' },
              { label: 'C', text: '改善代码结构而不改变外部行为' },
              { label: 'D', text: '优化性能' },
            ],
            answer: 'C',
          },
          {
            text: '以下哪种设计模式用于封装请求，从而允许参数化客户端？',
            options: [
              { label: 'A', text: '命令模式（Command）' },
              { label: 'B', text: '观察者模式（Observer）' },
              { label: 'C', text: '策略模式（Strategy）' },
              { label: 'D', text: '装饰器模式（Decorator）' },
            ],
            answer: 'A',
          },
          {
            text: '在 Linux 中，查看当前进程列表的命令是（ ）。',
            options: [
              { label: 'A', text: 'ls' },
              { label: 'B', text: 'ps' },
              { label: 'C', text: 'top' },
              { label: 'D', text: 'netstat' },
            ],
            answer: 'B',
            note: 'ps 显示进程，top 动态显示，但 ps 更常用',
          },
          {
            text: '在 RESTful 风格中，更新资源通常使用哪个 HTTP 方法？',
            options: [
              { label: 'A', text: 'GET' },
              { label: 'B', text: 'POST' },
              { label: 'C', text: 'PUT' },
              { label: 'D', text: 'DELETE' },
            ],
            answer: 'C',
          },
          {
            text: '在 SQL 中，GROUP BY 子句通常与哪个聚合函数一起使用？',
            options: [
              { label: 'A', text: 'SUM()' },
              { label: 'B', text: 'AVG()' },
              { label: 'C', text: 'COUNT()' },
              { label: 'D', text: '以上都是' },
            ],
            answer: 'D',
          },
          {
            text: '在 Git 中，git reset --hard HEAD~1 的作用是（ ）。',
            options: [
              { label: 'A', text: '撤销上次提交，并删除工作区修改' },
              { label: 'B', text: '仅撤销提交，保留修改' },
              { label: 'C', text: '切换分支' },
              { label: 'D', text: '创建新分支' },
            ],
            answer: 'A',
          },
        ],
      },
    ],
  },
  {
    id: 'B',
    name: '计算机 B卷',
    sections: [
      {
        title: '一、判断题（共 25 题，正确选 A，错误选 B）',
        pointsPerQuestion: 1,
        questions: [
          { text: '二进制数 1010 转换为十进制数是 10。', answer: 'A' },
          { text: 'Windows 是一种操作系统。', answer: 'A' },
          { text: '1 KB 等于 1000 字节。', answer: 'B' },
          { text: '鼠标是一种输出设备。', answer: 'B' },
          { text: '在 C 语言中，main() 函数是程序的入口。', answer: 'A' },
          { text: '电子邮件地址中必须包含 @ 符号。', answer: 'A' },
          { text: '硬盘属于内部存储器（内存）。', answer: 'B' },
          { text: 'Python 语言是一种编译型语言。', answer: 'B' },
          { text: '浏览器可以用于访问网页。', answer: 'A' },
          { text: '计算机病毒是一种人为编写的恶意程序。', answer: 'A' },
          { text: '在补码表示法中，-128 可以用 8 位二进制数表示。', answer: 'A' },
          { text: '快速排序在平均情况下的时间复杂度为 O(n log n)，且其空间复杂度为 O(log n)（递归栈）。', answer: 'A' },
          { text: '在操作系统中，管程（Monitor）是一种基于信号量（Semaphore）的同步机制。', answer: 'B' },
          { text: '一个关系模式 R 属于 BCNF，当且仅当它属于 3NF 且不存在传递依赖。', answer: 'B' },
          { text: '在以太网中，交换机（Switch）根据 IP 地址转发数据帧。', answer: 'B' },
          { text: '在虚拟内存管理中，缺页中断（Page Fault）一定导致进程阻塞。', answer: 'B' },
          { text: '哈夫曼编码（Huffman Coding）是一种基于字符出现频率的变长编码，它属于算术编码的一种。', answer: 'B' },
          { text: '在 C++ 中，一个类可以同时继承多个基类，这称为多重继承。', answer: 'A' },
          { text: '在 TCP 协议中，滑动窗口（Sliding Window）机制用于流量控制，但无法用于拥塞控制。', answer: 'B' },
          { text: '在关系数据库中，事务的隔离级别越高，并发性能越好。', answer: 'B' },
          { text: '在 Linux 系统中，fork() 系统调用创建的子进程会复制父进程的全部内存空间（采用写时复制技术）。', answer: 'A' },
          { text: '在计算斐波那契数列时，使用动态规划（自底向上）的时间复杂度是 O(n)，空间复杂度可以是 O(1)。', answer: 'A' },
          { text: '在 IP 协议中，分片（Fragmentation）可以在源主机和路由器上进行，但重组（Reassembly）只能在目的主机上进行。', answer: 'A' },
          { text: '在关系代数中，投影（Projection）操作会消除结果中的重复行。', answer: 'A' },
          { text: '在编译原理中，LR(1) 分析器比 SLR(1) 分析器具有更强的语法分析能力。', answer: 'A' },
        ],
      },
      {
        title: '二、单项选择题（共 15 题，选择唯一正确答案）',
        pointsPerQuestion: 1,
        questions: [
          {
            text: '下列哪个是合法的 IPv4 地址？',
            options: [
              { label: 'A', text: '192.168.1.1' },
              { label: 'B', text: '192.168.1.256' },
              { label: 'C', text: '2001:db8::1' },
              { label: 'D', text: '192.168.1' },
            ],
            answer: 'A',
          },
          {
            text: '在 HTML 中，用于定义超链接的标签是（ ）。',
            options: [
              { label: 'A', text: '<img>' },
              { label: 'B', text: '<a>' },
              { label: 'C', text: '<link>' },
              { label: 'D', text: '<href>' },
            ],
            answer: 'B',
          },
          {
            text: '以下哪个不是常见的操作系统？',
            options: [
              { label: 'A', text: 'Windows' },
              { label: 'B', text: 'Linux' },
              { label: 'C', text: 'macOS' },
              { label: 'D', text: 'Oracle' },
            ],
            answer: 'D',
          },
          {
            text: '数据库查询语句通常使用（ ）。',
            options: [
              { label: 'A', text: 'INSERT' },
              { label: 'B', text: 'UPDATE' },
              { label: 'C', text: 'SELECT' },
              { label: 'D', text: 'DELETE' },
            ],
            answer: 'C',
          },
          {
            text: '栈（Stack）的数据操作遵循什么原则？',
            options: [
              { label: 'A', text: '先进先出（FIFO）' },
              { label: 'B', text: '先进后出（LIFO）' },
              { label: 'C', text: '随机访问' },
              { label: 'D', text: '双向操作' },
            ],
            answer: 'B',
          },
          {
            text: '某计算机采用 32 位虚拟地址，页面大小为 4KB，页表项大小为 4B。如果使用两级页表（每级 10 位），则页表所占用的最大内存约为（ ）。',
            options: [
              { label: 'A', text: '4MB' },
              { label: 'B', text: '8MB' },
              { label: 'C', text: '16MB' },
              { label: 'D', text: '2MB' },
            ],
            answer: 'A',
          },
          {
            text: '在无向图 G 中，顶点数为 n，边数为 m，采用邻接表存储，则深度优先搜索（DFS）的时间复杂度为（ ）。',
            options: [
              { label: 'A', text: 'O(n)' },
              { label: 'B', text: 'O(m)' },
              { label: 'C', text: 'O(n+m)' },
              { label: 'D', text: 'O(n²)' },
            ],
            answer: 'C',
          },
          {
            text: '下面关于死锁的叙述，错误的是（ ）。',
            options: [
              { label: 'A', text: '死锁的预防可以通过破坏四个必要条件之一来实现' },
              { label: 'B', text: '银行家算法是一种死锁避免算法' },
              { label: 'C', text: '死锁的检测可以通过资源分配图进行' },
              { label: 'D', text: '一旦发生死锁，系统必须立即重启' },
            ],
            answer: 'D',
          },
          {
            text: '在关系模式 R(A,B,C,D) 中，函数依赖集 F = { A→B, B→C, C→D }，则 R 的最高范式为（ ）。',
            options: [
              { label: 'A', text: '1NF' },
              { label: 'B', text: '2NF' },
              { label: 'C', text: '3NF' },
              { label: 'D', text: 'BCNF' },
            ],
            answer: 'B',
          },
          {
            text: '在 TCP 连接释放中，主动关闭方发送 FIN 后，收到被动方的 ACK，进入 FIN_WAIT_2 状态。若此时被动方一直不发送 FIN，主动方将（ ）。',
            options: [
              { label: 'A', text: '永远等待' },
              { label: 'B', text: '超时后自动关闭' },
              { label: 'C', text: '发送 RST 强制关闭' },
              { label: 'D', text: '转换为 CLOSED 状态' },
            ],
            answer: 'B',
          },
          {
            text: '下列哪种 Cache 映射方式冲突率最高，但硬件开销最小？',
            options: [
              { label: 'A', text: '全相联映射' },
              { label: 'B', text: '直接映射' },
              { label: 'C', text: '组相联映射' },
              { label: 'D', text: '段相联映射' },
            ],
            answer: 'B',
          },
          {
            text: '在磁盘调度算法中，电梯算法（SCAN）与 C-SCAN 的主要区别在于（ ）。',
            options: [
              { label: 'A', text: 'SCAN 单向扫描，C-SCAN 双向扫描' },
              { label: 'B', text: 'SCAN 双向扫描，C-SCAN 单向扫描' },
              { label: 'C', text: 'SCAN 优先处理离磁头最近的请求' },
              { label: 'D', text: '两者没有区别' },
            ],
            answer: 'B',
          },
          {
            text: '已知表达式 a * (b + c) - d / e 的后缀表达式（逆波兰式）为（ ）。',
            options: [
              { label: 'A', text: 'abc+*de/-' },
              { label: 'B', text: 'abc+*de-/' },
              { label: 'C', text: 'ab+c*de/-' },
              { label: 'D', text: 'abc+*de- /' },
            ],
            answer: 'A',
          },
          {
            text: '在 HTTP/1.1 中，持久连接（Persistent Connection）的默认行为是（ ）。',
            options: [
              { label: 'A', text: '每个请求/响应后关闭连接' },
              { label: 'B', text: '连接保持打开，允许多个请求复用' },
              { label: 'C', text: '只在响应头包含 Connection: close 时才保持' },
              { label: 'D', text: '仅支持 GET 方法' },
            ],
            answer: 'B',
          },
          {
            text: '在编译原理中，下列哪个阶段会生成中间代码？',
            options: [
              { label: 'A', text: '词法分析' },
              { label: 'B', text: '语法分析' },
              { label: 'C', text: '语义分析' },
              { label: 'D', text: '代码生成' },
            ],
            answer: 'C',
          },
        ],
      },
    ],
  },
  {
    id: 'shared-rules-a',
    name: '共享群规 A卷',
    sections: [
      {
        title: '一、判断题（共 10 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          { text: 'A在群里说“我真的撑不住了”，B回复“一切都会好起来的”。B没有违规。', answer: 'B', note: 'B属于“强行洒阳光”，贩卖虚假希望。' },
          { text: 'A说“我想死”，B说“我也想过”。B没有违规。', answer: 'A', note: '表达“想”或“做过”的念头是被允许的。' },
          { text: 'A在群里说“云南人都很懒”。B举报了A。A没有违规，因为他只是表达真实感受。', answer: 'B', note: 'A从个体上升到整体，构成地域黑。' },
          { text: '管理员在处理争议时，可以公开说“这个人性格有问题”。', answer: 'B', note: '管理组只以行为为依据，不评价人。' },
          { text: '群友A觉得群友B让自己不适，但B没有踩任何具体群规条款。A可以私聊管理员反映。', answer: 'A', note: 'A的边界感受是真实的，不需要自己消化。' },
          { text: '群主连续两次写“很累”，应该宣布维护期。', answer: 'A', note: '这是群主的自检线。' },
          { text: 'A问B：“你吃的什么药？”B说：“不想说。”A继续问：“是不是抗抑郁的？”A没有违规，因为他是关心B。', answer: 'B', note: 'B已拒绝，A继续追问属于刻意深究隐私。' },
          { text: '在群里传教，只要不发经文，只分享一句“你需要被拯救”，不算违规。', answer: 'B', note: '“你需要被拯救”属于有潜台词的传教言论。' },
          { text: '被踢出群的人，可以抄写群规并附上见解，申请回来一次。', answer: 'A', note: '这是重新回到小屋的路径。' },
          { text: '群主不在线时，管理员可以自行制定新的群规。', answer: 'B', note: '群主不在线时，管理员按维护期规矩办，不接新人、不处理旧争议。修改群规需要群主审核。' },
        ],
      },
      {
        title: '二、单选题（共 15 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          {
            text: 'A在群里说：“我最近总失眠。”B回复：“你这不算什么，我失眠十年了。”B违反了哪一条？',
            options: [
              { label: 'A', text: '刷屏影响他人' },
              { label: 'B', text: '给痛苦打分' },
              { label: 'C', text: '性骚扰' },
              { label: 'D', text: '截图外传' },
            ],
            answer: 'B',
          },
          {
            text: 'A在群里发了一张自残旧疤照片。B看到了不舒服。群主应该怎么处理？',
            options: [
              { label: 'A', text: '让B退群' },
              { label: 'B', text: '私聊A，告知此类图片被禁止，并警告' },
              { label: 'C', text: '让A和B私下解决' },
              { label: 'D', text: '不管' },
            ],
            answer: 'B',
          },
          {
            text: 'A在群里说：“你刚才说的话让我很不舒服。”B说：“对不起，我不知道。我以后注意。”这属于什么情况？',
            options: [
              { label: 'A', text: '双方冲突升级，需要管理组介入' },
              { label: 'B', text: '边界表达后，对方尊重了，属于生我信号' },
              { label: 'C', text: 'A在道德绑架' },
              { label: 'D', text: 'B在强迫戴面具' },
            ],
            answer: 'B',
          },
          {
            text: 'A在群里发黄色段子。B提醒他不要发。A说：“我就开个玩笑，你这么认真干嘛？”A应该怎么处理？',
            options: [
              { label: 'A', text: '按一般越界，先提醒' },
              { label: 'B', text: '按红线，直接请离' },
              { label: 'C', text: '不管' },
              { label: 'D', text: '禁止B再说话' },
            ],
            answer: 'B',
            note: '色情内容属于红线，直接请离。',
          },
          {
            text: 'A在群里说：“我爸妈不要我了。”B说：“你想听建议吗？”A说：“不要。”B随后又说：“但我觉得你该去报警。”B是否违规？',
            options: [
              { label: 'A', text: '不违规，因为他在帮助A' },
              { label: 'B', text: '违规，因为A已拒绝建议' },
              { label: 'C', text: '违规，因为报警违法' },
              { label: 'D', text: '不违规，因为B只是提议' },
            ],
            answer: 'B',
            note: 'A已明确拒绝，B继续给建议，属于强行当导师。',
          },
          {
            text: 'A在群里说：“我信基督。”B说：“你信你的，别来传。”这属于什么？',
            options: [
              { label: 'A', text: '宗教传播' },
              { label: 'B', text: '因信仰背景评判' },
              { label: 'C', text: '正常表达' },
              { label: 'D', text: '人身攻击' },
            ],
            answer: 'C',
          },
          {
            text: 'A连续发了20条表情包。B说：“你刷屏了。”A说：“我心情不好。”A应该被怎么处理？',
            options: [
              { label: 'A', text: '直接踢' },
              { label: 'B', text: '先私下提醒' },
              { label: 'C', text: '让B也发20条' },
              { label: 'D', text: '禁言A一天' },
            ],
            answer: 'B',
          },
          {
            text: 'A对B说：“你们东北人是不是都爱打架？”B说：“你不要地图炮。”A说：“我又没骂人。”A是否违规？',
            options: [
              { label: 'A', text: '不违规，因为只是提问' },
              { label: 'B', text: '违规，因为将个体标签上升到整体' },
              { label: 'C', text: '不违规，因为B太敏感' },
              { label: 'D', text: '违规，因为A骂人' },
            ],
            answer: 'B',
          },
          {
            text: 'A在群里说：“今天只想发个1。”B说：“你又怎么了？说出来。”A说：“不想说。”B说：“你说出来会好受点。”B是否违规？',
            options: [
              { label: 'A', text: '不违规，是关心' },
              { label: 'B', text: '违规，因为A已拒绝，B还在追问' },
              { label: 'C', text: '不违规，因为B没有恶意' },
              { label: 'D', text: '违规，因为B在窥探隐私' },
            ],
            answer: 'B',
          },
          {
            text: '管理员在群里说：“本季度处理广告1起、恶意攻击1起。”这属于什么？',
            options: [
              { label: 'A', text: '泄露隐私' },
              { label: 'B', text: '正常管理透明度动作' },
              { label: 'C', text: '威胁群友' },
              { label: 'D', text: '人身攻击' },
            ],
            answer: 'B',
          },
          {
            text: 'A说：“我吃药吃得想吐。”B说：“试试XX药，我吃了很好。”B违反了哪一条？',
            options: [
              { label: 'A', text: '强行洒阳光' },
              { label: 'B', text: '给痛苦打分' },
              { label: 'C', text: '靠自身经历开药方' },
              { label: 'D', text: '性骚扰' },
            ],
            answer: 'C',
          },
          {
            text: 'A在群里说：“我割过腕。”B说：“你疯了吗？”B是否违规？',
            options: [
              { label: 'A', text: '不违规，因为B在关心' },
              { label: 'B', text: '违规，因为B在贬低A' },
              { label: 'C', text: '不违规，因为A确实做了危险的事' },
              { label: 'D', text: '违规，因为B在鼓励A自残' },
            ],
            answer: 'B',
            note: '“你疯了吗”是否定他人情绪和状态。',
          },
          {
            text: 'A在群里发了宗教经文。B说：“别再发了。”A说：“我只是分享。”A应被怎么处理？',
            options: [
              { label: 'A', text: '直接踢' },
              { label: 'B', text: '先私下提醒' },
              { label: 'C', text: '让B退群' },
              { label: 'D', text: '不管' },
            ],
            answer: 'B',
            note: '宗教传播属于一般越界。',
          },
          {
            text: 'A对B说：“你昨晚在朋友圈说的话，是不是在说C？”A是否违规？',
            options: [
              { label: 'A', text: '不违规，是好奇' },
              { label: 'B', text: '违规，因为刻意深究他人隐私' },
              { label: 'C', text: '不违规，因为B可以拒绝' },
              { label: 'D', text: '违规，因为截图外传' },
            ],
            answer: 'B',
          },
          {
            text: '群主突然在群里说：“我最近很累，进维护期了。”群友该怎么做？',
            options: [
              { label: 'A', text: '继续处理旧争议' },
              { label: 'B', text: '追问群主怎么了' },
              { label: 'C', text: '保持基本秩序，不惹事' },
              { label: 'D', text: '让群主踢掉几个不活跃的人' },
            ],
            answer: 'C',
          },
        ],
      },
      {
        title: '三、多选题（共 10 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          {
            text: '以下哪些行为属于“强行洒阳光”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“看开点。”' },
              { label: 'B', text: '“比你惨的人多了。”' },
              { label: 'C', text: '“一切都会好起来的。”' },
              { label: 'D', text: '“我理解你，想听你说说。”' },
            ],
            answer: 'ABC',
          },
          {
            text: '以下哪些行为属于“给痛苦打分”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你这算啥。”' },
              { label: 'B', text: '“我见过更惨的。”' },
              { label: 'C', text: '“你太敏感了。”' },
              { label: 'D', text: '“你愿不愿意多说一点？”' },
            ],
            answer: 'ABC',
          },
          {
            text: '以下哪些行为属于“强迫戴面具”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你太负能量了。”' },
              { label: 'B', text: '“多想点开心的。”' },
              { label: 'C', text: '“这里不是正能量群，你少说两句。”' },
              { label: 'D', text: '“不想好起来也是可以的。”' },
            ],
            answer: 'ABC',
            note: 'D是被允许的。',
          },
          {
            text: '以下哪些行为属于“强行当导师”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '没人问就给人完整人生建议' },
              { label: 'B', text: '说“为你好”然后说教' },
              { label: 'C', text: '兜售疗愈课程' },
              { label: 'D', text: '群友明确问“我该怎么办”后给建议' },
            ],
            answer: 'ABC',
            note: 'D是被允许的。',
          },
          {
            text: '以下哪些属于“截图外传”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '把群聊天记录截图发朋友圈' },
              { label: 'B', text: '在别群提到本群某人说了什么' },
              { label: 'C', text: '把群内坦白当谈资' },
              { label: 'D', text: '为查清群内事实，在群内出示聊天截图' },
            ],
            answer: 'ABC',
            note: 'D在群内取证，用完即止，不属于外传。',
          },
          {
            text: '以下哪些属于红线内容？',
            type: 'multiple',
            options: [
              { label: 'A', text: '色情' },
              { label: 'B', text: '赌博链接' },
              { label: 'C', text: '毒品讨论' },
              { label: 'D', text: '违法信息' },
            ],
            answer: 'ABCD',
          },
          {
            text: '以下哪些属于管理群透明度要求？',
            type: 'multiple',
            options: [
              { label: 'A', text: '只以行为为依据' },
              { label: 'B', text: '每季公开处理汇总' },
              { label: 'C', text: '被处理人有权知道依据' },
              { label: 'D', text: '管理员可以公开评价某人人格' },
            ],
            answer: 'ABC',
            note: 'D错误。',
          },
          {
            text: '以下哪些是群友的权利？',
            type: 'multiple',
            options: [
              { label: 'A', text: '沉默' },
              { label: 'B', text: '只回一个“1”' },
              { label: 'C', text: '不追问他人沉默' },
              { label: 'D', text: '不接收不想听的信息' },
            ],
            answer: 'ABCD',
          },
          {
            text: '以下哪些属于“地域黑”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你们河南人都是骗子。”' },
              { label: 'B', text: '“我们那有些人不讲信用。”' },
              { label: 'C', text: '“东北人爱打架。”' },
              { label: 'D', text: '“我是云南人，我们这边有的村里确实懒。”' },
            ],
            answer: 'AC',
            note: 'B和D说的是“有些人”“有的村”，属于个体经验，不构成整体攻击。',
          },
          {
            text: '以下哪些属于“刻意深究隐私”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '对方说“不想说”后继续追问' },
              { label: 'B', text: '问“你怎么得的病”' },
              { label: 'C', text: '问“你家里知道吗”' },
              { label: 'D', text: '对方主动开始说后，问“然后呢”' },
            ],
            answer: 'ABC',
            note: 'D是正常接话。',
          },
        ],
      },
    ],
  },
  {
    id: 'shared-rules-b',
    name: '共享群规 B卷',
    sections: [
      {
        title: '一、判断题（共 10 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          { text: 'A说：“我吃了三年药，还是觉得自己没救。”B说：“你有没有想过，其实你根本没病，是医生过度治疗？”B没有违规，因为他在提供新角度。', answer: 'B', note: 'B在否定A的痛苦，并质疑医疗判断。属于强行当导师。' },
          { text: 'A在群里发了一张自残旧疤照片，并说“这是三年前的”。B举报了A。A说他发的是旧疤，不是新伤。A没有违规。', answer: 'B', note: '无论新旧，发布自残伤口照片都违反第8条。' },
          { text: 'A连续三天在群里说“我想死”，管理员每天给他发心理援助热线。A说：“你只会发这个，根本不懂我。”管理员停止了回复。管理员做得对。', answer: 'A', note: '危机处理完成既定动作后，AI不反复劝，不刷屏。停止是正确的。' },
          { text: '群友A说：“我最近开始慢慢好一点了。”B说：“太好了，我就说你会好起来的。”B没有违规。', answer: 'B', note: '“我就说你会好起来的”仍然是强行洒阳光，而且把A的恢复变成了自己的预测胜利。' },
          { text: 'A说：“我想听建议。”B说：“你可以试试先写下来。”C说：“你懂什么，他这种情况应该去医院。”C没有违规。', answer: 'B', note: 'C在否定B的回答，而且用“你懂什么”攻击他人。属于人身攻击。' },
          { text: '群主连续两次在管理群写“很累”，但没有在群里宣布维护期。管理员提醒群主应该宣布。管理员做得对。', answer: 'A', note: '连续两次“很累”应宣布维护期。管理员提醒群主是在执行自检线规则。' },
          { text: 'A在群里说：“我信佛。”B说：“信佛的人是不是都看开了？”A说：“没有，我现在很难受。”B没有违规。', answer: 'A', note: 'B的问句带有刻板印象，但在这个语境里更像好奇，不是攻击。A也正常回应了。不构成违规。' },
          { text: 'A在群里说：“我现在就想消失。”B说：“消失是什么意思？能说清楚一点吗？”A说：“算了，不说了。”B说：“好。”B没有违规。', answer: 'A', note: 'B追问了一句以确认风险，A拒绝后B停住了。这是正确的做法。' },
          { text: '被踢出群的人，私聊群主说“我想回来”，群主说“你直接回吧”。群主没有违规。', answer: 'B', note: '被踢出的人需要抄写简纲并附上见解，经群主检验后才能回来。群主不能直接放回。' },
          { text: '管理员在群里说：“本季度处理广告1起、恶意攻击1起、截图外传0起。”管理员泄露了群内隐私。', answer: 'B', note: '只报类型和结果，不报隐私。这是符合管理群透明度规则的做法。' },
        ],
      },
      {
        title: '二、单选题（共 15 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          {
            text: 'A说：“我最近总觉得喘不上气。”B说：“你太焦虑了。”A说：“我没有。”B说：“有焦虑症的人都不承认。”B违反了哪一条？',
            options: [
              { label: 'A', text: '给痛苦打分' },
              { label: 'B', text: '强行当导师' },
              { label: 'C', text: '人身攻击' },
              { label: 'D', text: '以上都是' },
            ],
            answer: 'D',
            note: 'B先给A下了“焦虑”的定义，再否定A的反驳，最后用群体标签压人。属于给痛苦打分、强行当导师，也带人身攻击。',
          },
          {
            text: 'A在群里说：“有没有人？我好难受。”B回了一个“1”。C回了一个“1”。D回了一个“1”。管理员说：“别刷屏，私聊去。”管理员做得对吗？',
            options: [
              { label: 'A', text: '对，群里不能刷屏' },
              { label: 'B', text: '错，存在信号不是刷屏' },
              { label: 'C', text: '对，管理员有权维持秩序' },
              { label: 'D', text: '错，管理员应该先提醒' },
            ],
            answer: 'B',
            note: '“1”是存在信号，是群规明确允许的。三个“1”不是刷屏，是在确认“我在”。',
          },
          {
            text: 'A说：“我前任说我这种人没人会爱。”B说：“你前任说得不对。”C说：“别提他了，说说你现在吧。”D说：“我也有过这种想法。”谁做得最好？',
            options: [
              { label: 'A', text: 'B' },
              { label: 'B', text: 'C' },
              { label: 'C', text: 'D' },
              { label: 'D', text: '都不够好' },
            ],
            answer: 'C',
            note: 'C没有停留在攻击前任，也没有抢占话题，而是把注意力拉回A现在的状态。B在站队，D在抢话语。C最合适。',
          },
          {
            text: 'A说：“我想死，但我怕疼。”B说：“知道疼就说明你还没到那个地步。”B应该怎么处理？',
            options: [
              { label: 'A', text: '不违规，这是事实判断' },
              { label: 'B', text: '违规，否定A的痛苦深度' },
              { label: 'C', text: '不违规，因为B在试探' },
              { label: 'D', text: '违规，因为B在说教' },
            ],
            answer: 'B',
            note: '“没到那个地步”是在给A的痛苦判级。一个人的“想”不需要被判定够不够深。',
          },
          {
            text: '群主在群里说：“我最近很累，进维护期了。不处理旧事，大家自己待着。”随后有人发了一个“1”。管理员说：“别吵，维护期。”管理员错了吗？',
            options: [
              { label: 'A', text: '错，发“1”不是吵' },
              { label: 'B', text: '对，维护期需要安静' },
              { label: 'C', text: '错，管理员应该私聊' },
              { label: 'D', text: '对，管理员有权限' },
            ],
            answer: 'A',
            note: '“1”是存在信号，不是破坏秩序。维护期不处理旧争议，但不禁止群友发“1”。',
          },
          {
            text: 'A在群里说：“我今天被房东赶出来了。”B说：“你为什么不提前存钱？”A说：“我工资被拖了。”B说：“那你可以先去朋友家住。”B是否违规？',
            options: [
              { label: 'A', text: '不违规，在帮A想办法' },
              { label: 'B', text: '违规，因为A没有要建议' },
              { label: 'C', text: '不违规，因为B在关心' },
              { label: 'D', text: '违规，因为B在质问' },
            ],
            answer: 'B',
            note: 'A在陈述困境，没有要建议。B先质问“为什么不存钱”，再给建议，属于强行当导师。',
          },
          {
            text: 'A在群里说：“你们有人听过XX药吗？”B说：“听过，我吃了没用。”C说：“听说副作用很大。”D说：“别乱吃，去问医生。”谁做得对？',
            options: [
              { label: 'A', text: 'B' },
              { label: 'B', text: 'C' },
              { label: 'C', text: 'D' },
              { label: 'D', text: '都对' },
            ],
            answer: 'C',
            note: 'D给了正确方向。B和C在分享个体经验和传言，C更是在传播未确认信息。',
          },
          {
            text: 'A说：“我爸妈说我不该这样活着。”B说：“他们懂个屁。”C说：“你很难受吧？”D说：“别管他们。”谁说得最合适？',
            options: [
              { label: 'A', text: 'B' },
              { label: 'B', text: 'C' },
              { label: 'C', text: 'D' },
              { label: 'D', text: '没有合适的' },
            ],
            answer: 'B',
            note: 'C在确认A的感受。B和D在替A站队，D是在给建议。最合适的是C。',
          },
          {
            text: 'A在群里说：“我可能真的撑不下去了。”B说：“你能打给谁？”A说：“没人。”B说：“那打热线吧。”A说：“不想。”B接下来怎么做最合适？',
            options: [
              { label: 'A', text: '继续劝A打热线' },
              { label: 'B', text: '说“我在这里”' },
              { label: 'C', text: '问“为什么不想”' },
              { label: 'D', text: '去群里找人来帮' },
            ],
            answer: 'B',
            note: 'A已经拒绝热线。B继续劝是强行建议，追问是越界。此时最合适的是退回来，确认在场。',
          },
          {
            text: 'A说：“我今天终于敢照镜子了。”B说：“我以前也不敢。”C说：“慢慢来。”D说：“这是好事。”谁最不越界？',
            options: [
              { label: 'A', text: 'B' },
              { label: 'B', text: 'C' },
              { label: 'C', text: 'D' },
              { label: 'D', text: '都可以' },
            ],
            answer: 'C',
            note: '“慢慢来”没有评价，没有比较，没有催促。B抢话，D贴标签。最不越界的是C。',
          },
          {
            text: '管理员在群里说：“已处理一起违规，请各位注意边界。”A问：“谁违规了？处理了什么？”管理员说：“这不能说。”管理员做得对吗？',
            options: [
              { label: 'A', text: '对，保护隐私' },
              { label: 'B', text: '错，透明度不够' },
              { label: 'C', text: '对，但应该再说具体一点' },
              { label: 'D', text: '错，管理员该公开详情' },
            ],
            answer: 'A',
            note: '管理群透明度的规则是只报类型和结果，不报隐私。管理员已经说了“一起违规”，不需要公开是谁。',
          },
          {
            text: 'A在群里说：“我信教，但我从不在这里传。”B说：“那你为什么还要提？”B是否违规？',
            options: [
              { label: 'A', text: '不违规，只是好奇' },
              { label: 'B', text: '违规，因为A没有传教' },
              { label: 'C', text: '不违规，因为B有权问' },
              { label: 'D', text: '违规，因为B在质疑A' },
            ],
            answer: 'B',
            note: 'A只是陈述“我信教但我没传”，这不是传教。B的反应在施压，暗示A不该提。属于因信仰背景施压。',
          },
          {
            text: '群主说：“现在群里人多了，我有点看不过来。”A说：“那你别看了。”B说：“辛苦。”C说：“要帮忙吗？”谁说得最合适？',
            options: [
              { label: 'A', text: 'A' },
              { label: 'B', text: 'B' },
              { label: 'C', text: 'C' },
              { label: 'D', text: '没有合适的' },
            ],
            answer: 'C',
            note: 'C给了实际支持选项。B是好意但太轻。A在堵群主。最合适的是C。',
          },
          {
            text: 'A说：“我在工位上突然哭出来了。”B说：“老板看到了吗？”C说：“现在还好吗？”D说：“我也有过。”谁说得最合适？',
            options: [
              { label: 'A', text: 'B' },
              { label: 'B', text: 'C' },
              { label: 'C', text: 'D' },
              { label: 'D', text: '都可以' },
            ],
            answer: 'B',
            note: 'C把注意力拉回A现在的状态。B问后果，D抢话语。最合适的是C。',
          },
          {
            text: 'A说：“你们为什么都活得这么正常？”B说：“我也不正常。”C说：“我只是在装。”D说：“没有谁是正常的。”谁说得最合适？',
            options: [
              { label: 'A', text: 'B' },
              { label: 'B', text: 'C' },
              { label: 'C', text: 'D' },
              { label: 'D', text: '都可以' },
            ],
            answer: 'C',
            note: 'C承认自己在装，和A产生真实连接。D把问题哲学化了。B只说了自己。最合适的是C。',
          },
        ],
      },
      {
        title: '三、多选题（共 10 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          {
            text: '以下哪些行为属于“强行当导师”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '对方没问就给人人生建议' },
              { label: 'B', text: '说“为你好”然后说教' },
              { label: 'C', text: '对方明确要建议后给建议' },
              { label: 'D', text: '推荐助眠产品' },
            ],
            answer: 'ABD',
            note: 'C是对方主动要，不算越界。D在推销产品，也属于导师类。',
          },
          {
            text: '以下哪些属于“强迫戴面具”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你太负能量了”' },
              { label: 'B', text: '“多想点开心的事”' },
              { label: 'C', text: '“我觉得你可以再积极一点”' },
              { label: 'D', text: '“不想好起来也可以”' },
            ],
            answer: 'ABC',
            note: 'D是被允许的。',
          },
          {
            text: '以下哪些属于“人身攻击”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你脑子是不是有病”' },
              { label: 'B', text: '“你这种人活该”' },
              { label: 'C', text: '“你上次也这样”' },
              { label: 'D', text: '“你这样说不对”' },
            ],
            answer: 'AB',
            note: 'C算翻旧账，属于中度。D是正常反驳。',
          },
          {
            text: '以下哪些属于“地图炮地域黑”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你们XX省的人都是骗子”' },
              { label: 'B', text: '“XX地方的人特别爱吵架”' },
              { label: 'C', text: '“我们村有些人确实懒”' },
              { label: 'D', text: '“那边的人我处不来”' },
            ],
            answer: 'AB',
            note: 'C和D是个体经验或主观感受，没有上升整体。',
          },
          {
            text: '以下哪些属于“刻意深究隐私”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你怎么变成这样的”' },
              { label: 'B', text: '“你家里知道吗”' },
              { label: 'C', text: '“你吃的什么药”' },
              { label: 'D', text: '对方说“不想说”后继续问' },
            ],
            answer: 'ABCD',
            note: '前三项视语境，但若对方不想聊，都可能构成深究。D是最典型的。',
          },
          {
            text: '以下哪些属于“红线内容”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '自残伤口照片' },
              { label: 'B', text: '赌博链接' },
              { label: 'C', text: '黄色段子' },
              { label: 'D', text: '毒品讨论' },
            ],
            answer: 'BCD',
            note: '自残伤口照片在第8条单独管，不一定属于红线，但属于危险内容。',
          },
          {
            text: '以下哪些属于“给痛苦打分”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '“你这也算事？”' },
              { label: 'B', text: '“有人比你更难”' },
              { label: 'C', text: '“你现在很难受吧？”' },
              { label: 'D', text: '“别太脆弱了”' },
            ],
            answer: 'ABD',
            note: 'C是确认感受，不算打分。',
          },
          {
            text: '以下哪些是群友的权利？',
            type: 'multiple',
            options: [
              { label: 'A', text: '说不舒服' },
              { label: 'B', text: '不回复消息' },
              { label: 'C', text: '发一个“1”' },
              { label: 'D', text: '不接别人的痛苦' },
            ],
            answer: 'ABCD',
          },
          {
            text: '以下哪些属于“截图外传”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '把群内聊天截图发到别的群' },
              { label: 'B', text: '给朋友口述群里某人说了什么' },
              { label: 'C', text: '在群里公审时出示截图' },
              { label: 'D', text: '把群里的话发到朋友圈' },
            ],
            answer: 'ABD',
            note: 'C是群内取证，用完即止，不算外传。',
          },
          {
            text: '以下哪些属于“管理组越界”？',
            type: 'multiple',
            options: [
              { label: 'A', text: '公开说“那个人性格不行”' },
              { label: 'B', text: '公开处理结果但不点名' },
              { label: 'C', text: '因为个人好恶踢人' },
              { label: 'D', text: '被处理者问依据时拒绝回答' },
            ],
            answer: 'ACD',
            note: 'B是正常透明度操作。',
          },
        ],
      },
    ],
  },
  {
    id: 'test',
    name: '测试',
    sections: [
      {
        title: '一、判断题（共 1 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          { text: '1 + 1 等于 2。', answer: 'A' },
        ],
      },
      {
        title: '二、单选题（共 1 题，每题 1 分）',
        pointsPerQuestion: 1,
        questions: [
          {
            text: '以下哪个是偶数？',
            options: [
              { label: 'A', text: '1' },
              { label: 'B', text: '3' },
              { label: 'C', text: '2' },
              { label: 'D', text: '5' },
            ],
            answer: 'C',
          },
        ],
      },
    ],
  },
]
