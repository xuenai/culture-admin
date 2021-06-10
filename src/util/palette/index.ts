import { Graph } from './graph'
import { getPalette } from './getPalette';
// @ts-ignore
import Worker from './palette.worker.js';

/**
 * Palette 获取图片色值
 */
export const Palette = (function () {
  let imagePromise:any = null
  const from = function (image: string | HTMLImageElement) {
    imagePromise = new Graph().load(image)
    // @ts-ignore
    return this;
  }
  const getColor = async function () {
    const img = await imagePromise
    const data = img.imgData.data
    // @ts-ignore
    if (window.Worker) {
      // @ts-ignore
      const worker = new Worker()
      const typedArray = new Uint8ClampedArray(data)
      worker.postMessage(typedArray.buffer, [typedArray.buffer])
      return new Promise((resolve) => {
        worker.onmessage = function (e:any) {
          resolve(e.data)
        }
      })
    } else {
      return getPalette(data)
    }
  }
  return {
    from,
    getPalette: getColor
  }
}())
