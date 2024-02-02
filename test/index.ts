/*
 * @Author: zhicheng ran
 * @Date: 2023-03-21 13:55:13
 * @LastEditTime: 2024-02-02 16:27:57
 * @FilePath: \background_task\test\index.ts
 * @Description:
 */

import BackgroundTask from '../src'
import Vue from 'vue/types/umd'
import { debounce } from 'lodash'
import Stopwatch from 'statman-stopwatch'

export class Test {
  static async fib() {
    return await BackgroundTask.run({
      tasks: [
        new URL('./works/fib.worker.ts', import.meta.url)
          .href,
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
    const time = (window.Vue as any).reactive({
      fibTime: '',
    })
    const res = (window.Vue as any).reactive({
      fibRes: '',
    })

    return {
      async fib() {
        const s = new Stopwatch()
        console.log(
          '%c [ s ]-39',
          'font-size:13px; background:pink; color:#bf2c9f;',
          s
        )
        s.start()
        let interval = setInterval(() => {
          time.fibTime = s.read(3)
        }, 10)
        const r = await Test.fib()
        console.log(
          '%c [ r ]-52',
          'font-size:13px; background:pink; color:#bf2c9f;',
          r
        )
        res.fibRes = r?.[0]
        clearInterval(interval)
        s.stop()
      },
      time,
      res,
    }
  },
})
