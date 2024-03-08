/*
 * @Author: susanforme
 * @Date: 2024-02-06 11:27:27
 * @LastEditTime: 2024-03-08 15:21:59
 * @FilePath: \background_task\src\utils\jobRunner.ts
 * @Description:
 */

import { WorkerReturn } from './constant'

export default function jobRunner(fn: Function) {
  return async (e: MessageEvent) => {
    const { data } = e
    try {
      const result = await fn.apply(null, data)
      postMessage({
        type: 'SUCCESS',
        payload: result,
      } as WorkerReturn)
    } catch (error) {
      postMessage({
        type: 'ERROR',
        payload: error,
      } as WorkerReturn)
    }
  }
}
