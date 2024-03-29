/*
 * @Author: zhicheng ran
 * @Date: 2023-03-21 13:55:13
 * @LastEditTime: 2024-03-08 15:52:31
 * @FilePath: \background_task\test\index.ts
 * @Description:
 */

import BackgroundTask from '../src'
import Vue from 'vue/types/umd'
import { debounce } from 'lodash'
import Stopwatch from 'statman-stopwatch'

export class Test {
  static async fib(params: any) {
    const tasks = new BackgroundTask({
      tasks: [
        {
          fn: (params: any) => {
            function fibonacci(n: number): number {
              if (n <= 1) {
                return 1
              }
              return fibonacci(n - 1) + fibonacci(n - 2)
            }
            return fibonacci(params)
          },
          params: [params],
          timeout:3000
        },
      ],
    })
    const results = await tasks.run()
    return results
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
          const randomTime = random(1, 100)
          task.time = randomTime
          console.time(`fib ${index}`)
          const r = await Test.fib(randomTime)
          console.timeEnd(`fib ${index}`)
          task.fibRes = r?.[0]
          clearInterval(interval)
          s.stop()
        })
        console.log(
          '%c [ fibTasks ]-57',
          'font-size:13px; background:pink; color:#bf2c9f;',
          fibTasks
        )
      },
      fibTasks,
    }
  },
})

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
