import { proxy, wrap, expose } from 'comlink'
// import type { RunTaskType, Task } from './worker';

export default class BackgroundTask {
  static async run(config: BackgroundTaskConfigType) {
    const promiseTasks = []
    for (const task of config.tasks) {
      try {
        const worker = new Worker(task.url, {
          type: 'module',
        })
        const workerProcessor = wrap<Function>(worker)
        promiseTasks.push(
          workerProcessor
            .call(null, task.params)
            .then((res: any) => {
              task?.onSuccess?.(res)
              worker.terminate()
              return res
            })
            .catch((error: any) => {
              task?.onError?.(error)
              throw error
            })
        )
      } catch (error) {
        throw error
      }
      const results = await Promise.all(promiseTasks)
      return results
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
    onSuccess?: (result: any) => void
    onError?: (error: any) => void
  }[]
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
}
