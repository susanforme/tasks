export type Status = 'SUCCESS' | 'ERROR'

export type WorkerReturn<T = any> = {
  type: Status
  payload: T
}
export type WebWorkerStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'RUNNING'
  | 'ERROR'
  | 'TIMEOUT_EXPIRED'
export type TaskStatus = 'PENDING' | 'RUNNING' | 'DONE'
