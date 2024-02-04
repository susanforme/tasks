/*
 * @Author: susanforme
 * @Date: 2024-02-02 14:33:34
 * @LastEditTime: 2024-02-04 11:09:35
 * @FilePath: \background_task\test\works\fib.worker.ts
 * @Description:
 */
import BackgroundTask from '../../src/index'

BackgroundTask.wrapper(async (params = 40) => {
  console.log('%c [ params ]-11', 'font-size:13px; background:pink; color:#bf2c9f;', params)
  return fibonacci(params)
  function fibonacci(n: number): number {
    if (n <= 1) {
      return 1
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
  }
})
export default {}
