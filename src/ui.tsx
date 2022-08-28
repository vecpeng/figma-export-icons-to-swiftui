import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useEffect, useState } from 'react'
import './ui.css'
declare function require(path: string): any
import * as JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver'
import { convert } from 'svg-to-swiftui-core'
const App = () => {
  // 保存svg
  const svgs = []
  // 将svg转换为文件并压缩到一个文件夹中
  const downloadZip = async (svgs, svg) => {
    const zip = new JSZip()
    console.log(svgs);
    if (!svg) {
      for (const svg of svgs) {
        const filename = `${svg.name}.swift`
        const swiftuiStr = convert(svg.content) 
        zip.file(filename, swiftuiStr)
      }
    } else {
      for (const svg of svgs) {
        const filename = `${svg.name.replace("_", "")}.svg`
        zip.file(filename, svg.content)
      }
    }
    await zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        FileSaver.saveAs(blob, 'download.zip')
      })
  }

  const onDownload = () => {
    downloadZip(svgs, false)
  }
  const onDownloadSvg = () => {
    downloadZip(svgs, true)
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  useEffect(() => {
    window.onmessage = (e) => {
      console.log("e: ", e.data.pluginMessage);
      svgs.push(e.data.pluginMessage);
    }
  })

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2>Rectangle Creator</h2>
      <p>Count: </p>
      <button onClick={onCancel}>Cancel</button>
      <button id="create" onClick={onDownload}>Download SwiftUI</button>
      <button id="create" onClick={onDownloadSvg}>Download svg</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
