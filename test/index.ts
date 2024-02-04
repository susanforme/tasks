/*
 * @Author: zhicheng ran
 * @Date: 2023-03-21 13:55:13
 * @LastEditTime: 2024-02-04 10:42:06
 * @FilePath: \background_task\test\index.ts
 * @Description:
 */

import BackgroundTask from '../src'
import Vue from 'vue/types/umd'
import { debounce } from 'lodash'
import Stopwatch from 'statman-stopwatch'

export class Test {
  static async fib(params: any) {
    return await BackgroundTask.run({
      tasks: [
        {
          url: new URL(
            './works/fib.worker.ts',
            import.meta.url
          ).href,
          params,
        },
      ],
    })
  }
}

const vue = new (
  window as {
    Vue: typeof Vue
  }
).Vue({
  el: '#app',
  setup(props, ctx) {
    const fibTasks = (window.Vue as any).reactive(
      Array(10)
        .fill(0)
        .map(() => {
          return {
            fibTime: '',
            fibRes: '',
            time: 1,
          }
        })
    )
    console.log(
      '%c [ fibTasks ]-38',
      'font-size:13px; background:pink; color:#bf2c9f;',
      fibTasks
    )

    return {
      async fib() {
        fibTasks.forEach(async (task, index) => {
          const s = new Stopwatch()
          s.start()
          let interval = setInterval(() => {
            task.fibTime = s.read(3)
          }, 10)
          const randomTime = random(1, 50)
          task.time = randomTime
          const r = await Test.fib(randomTime)
          task.fibRes = r?.[0]
          clearInterval(interval)
          s.stop()
        })
      },
      fibTasks,
    }
  },
})

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
