/*
 * @Author: susanforme
 * @Date: 2024-02-06 11:16:39
 * @LastEditTime: 2024-02-06 11:24:05
 * @FilePath: \background_task\src\utils\depsParser.ts
 * @Description:
 */
/**
 * @example depsParser(['comlink', 'lodash']) => importScripts('comlink', 'lodash')
 * @param deps - array of dependencies
 * @returns
 */
export default function depsParser(deps: string[]) {
  if (deps.length === 0) return ''
  return `importScripts(${deps.map(dep => `'${dep}`)})`
}
