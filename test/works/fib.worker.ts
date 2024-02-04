/*
 * @Author: susanforme
 * @Date: 2024-02-02 14:33:34
 * @LastEditTime: 2024-02-02 14:37:52
 * @FilePath: \background_task\test\works\fib.ts
 * @Description:
 */
import BackgroundTask from '../../src/index'

BackgroundTask.wrapper(async (params = 40) => {
  return fibonacci(params)
  function fibonacci(n: number): number {
    if (n <= 1) {
      return 1
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
  }
})
export default {}
