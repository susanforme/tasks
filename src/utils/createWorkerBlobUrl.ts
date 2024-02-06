/*
 * @Author: susanforme
 * @Date: 2024-02-06 11:27:41
 * @LastEditTime: 2024-02-06 11:27:42
 * @FilePath: \background_task\src\utils\createWorkerBlobUrl.ts
 * @Description:
 */

import depsParser from "./depsParser";
import jobRunner from "./jobRunner";


export default function createWorkerBlobUrl(fn: Function,deps:string[]) {
  const blobCode = `${depsParser(deps)}; onMessage = (${jobRunner})(${fn})`
  const blob = new Blob([blobCode], { type: 'application/javascript' })
  return URL.createObjectURL(blob)
}
