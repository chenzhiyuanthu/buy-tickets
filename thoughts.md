逻辑：
1. 如何防止不同用户同时购买的并发
  a. 怎么加锁
  b. 何时加锁释放锁
2. 当用户企图购买多张票的时候 是更prefer连在一起的

数据结构:
1. 座位 一共 (50 + 100) * 26 / 2 * 4 = 7800。从0开始编号，Hash获得具体位置(area, line, column)
   ticket: available in_progress booked
2. User

前端:
1. 因为节点数多 故canvas
2. 因为不支持手动购票，所以不需要图片缩放 只显示就够了 不需要互动
