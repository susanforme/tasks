import {
  TaskStatus,
  WebWorkerStatus,
} from './utils/constant'
import createWorkerBlobUrl from './utils/createWorkerBlobUrl'
// import type { RunTaskType, Task } from './worker';

// type TaskStore = Partial<{
//   results: {
//     status: WebWorkerStatus
//     payload: any
//   }
//   timeoutId: number
// }>
export default class BackgroundTask {
  private tasks: Task[]
  private workers: (Worker & {
    _url?: string
  })[] = []
  private timeoutIds: number[] = []
  private status: TaskStatus = 'PENDING'
  // private store: Map<number, TaskStore> = new Map()
  constructor(config: BackgroundTaskConfigType) {
    this.tasks = config.tasks
  }
  async run() {
    if (this.status === 'RUNNING') {
      return Promise.reject('Task is already running')
    }
    this.status = 'RUNNING'
    const allResults = await Promise.all(
      this.tasks.map((task, index) => {
        return this.runWorker(index, task)
      })
    )

    this.status = 'DONE'
    // 完成后清空
    this.timeoutIds = []
    this.workers = []
    return allResults
  }
  runWorker(
    index: number,
    task: Task
  ): Promise<{ status: WebWorkerStatus; payload: any }> {
    return new Promise(resolve => {
      const blobUrl = createWorkerBlobUrl(
        task.fn,
        task.dependencies
      )
      const newWorker: Worker & {
        _url?: string
      } = new Worker(blobUrl)
      if (task.timeout) {
        this.timeoutIds[index] = setTimeout(() => {
          resolve({
            status: 'TIMEOUT_EXPIRED',
            payload: undefined,
          })
          this.workerTerminate(index)
        }, task.timeout) as unknown as number
      }
      newWorker._url = blobUrl

      newWorker.onmessage = e => {
        if (e.data.type === 'SUCCESS') {
          // this.onSuccess && this.onSuccess(e.data.payload)
          resolve({
            status: 'SUCCESS',
            payload: e.data.payload,
          })
        } else {
          resolve({
            status: 'ERROR',
            payload: e.data.payload,
          })
        }
        this.workerTerminate(index)
      }
      newWorker.onerror = e => {
        e.preventDefault()
        resolve({
          status: 'ERROR',
          payload: e,
        })
        this.workerTerminate(index)
      }

      newWorker.postMessage(task.params)

      this.workers[index] = newWorker
    })
  }
  /**
   * @param index  worker index
   */
  workerTerminate(index: number) {
    this.workers[index].terminate()
    URL.revokeObjectURL(this.workers[index]._url!)
    window.clearTimeout(this.timeoutIds[index] as number)
  }
}

export type Task = {
  fn: Function
  dependencies?: string[]
  timeout?: number
  params?: any[]
}
export type BackgroundTaskConfigType = {
  tasks: Task[]
}
