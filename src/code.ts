figma.showUI(__html__)
let count = 0

// 遍历节点, 寻找icon, 将svg传到ui.tsx
function traverse(node) {
  console.log(node)
  if ("children" in node) {
    if (node.children) {
      let name = ''
      if (node.parent.type === "COMPONENT_SET") {
        console.log("parent is " + node.parent.name)
        name += node.parent.name
      }
      console.log(node.name)
      name += node.name.indexOf("=") !== -1? node.name.split("=")[1] : node.name
      name.replace(/\s/g, "")
      node.exportAsync({ format: "SVG" }).then((res) => {
        const content = String.fromCharCode.apply(null, res)
        figma.ui.postMessage({ content, name: name})
      }).catch((err) => {
        console.log(err)
      })
      count++
    }
    for (let child of node.children) {
      traverse(child)
    }
  }
}

for (let i = 0; i < figma.currentPage.selection.length; i++) {
  traverse(figma.currentPage.selection[i])
}

console.log("icons: " + count)
