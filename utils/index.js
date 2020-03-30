import cloneDeep from 'lodash/cloneDeep'

export const fixVantData = (data) => {
  const temp = cloneDeep(data)
  if (temp.children) {
    temp.children = temp.children.map(i => fixVantData(i))
  }
  temp.text = temp.label
  delete temp.value
  delete temp.label
  return temp
}
