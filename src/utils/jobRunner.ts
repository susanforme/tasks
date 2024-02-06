/*
 * @Author: susanforme
 * @Date: 2024-02-06 11:27:27
 * @LastEditTime: 2024-02-06 11:48:05
 * @FilePath: \background_task\src\utils\jobRunner.ts
 * @Description:
 */

import { STATUS } from "./constant"

export default function jobRunner(fn: Function) {
  return async (e: MessageEvent) => {
    const { data } = e
    try {
      const result = await fn.apply(null, data)
      postMessage({
        type:STATUS.SUCCESS,
        payload:result
      })
    } catch (error) {
      postMessage({
        type:STATUS.ERROR,
        payload:error
      })
    }
  }
}
