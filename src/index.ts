import { proxy, wrap, expose } from 'comlink'
// import type { RunTaskType, Task } from './worker';

export default class BackgroundTask {
  static async run(config: BackgroundTaskConfigType) {
    const promiseTasks = []
    for (const task of config.tasks) {
      try {
        const DataProcessor = wrap<Function>(
          new Worker(task.url, {
            type: 'module',
          })
        )
        promiseTasks.push(DataProcessor.call(task.params))
      } catch (error) {
        console.log(
          '%c [ error ]-16',
          'font-size:13px; background:pink; color:#bf2c9f;',
          error
        )
        // config.onError && config.onError(error)
      }
      return await Promise.all(promiseTasks)
    }
  }
  static async wrapper<T extends any>(fn: T) {
    expose(fn)
  }
}

export type BackgroundTaskConfigType = {
  tasks: {
    url: string
    params?: any
  }[]
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
}
