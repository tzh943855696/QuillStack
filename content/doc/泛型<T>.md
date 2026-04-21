# 泛型
- 1.问题引入
```ts
// 这样使用函数过于麻烦
function fn1(x: string, y: string): string[] {
    return [x, y]
}

function fn2(x: number, y: number): number[] {
    return [x, y]
}
// 改为
function fn<T>(x: T, y: T): T[] {
  return [x, y]
}
// 或
function fn<A, B>(x: A, y: B): (A | B)[] {
  return [x, y]
}
// 泛型就相当于动态类型
```



- 2.type和interface使用泛型
```ts
type A<T> = number | T
const a: A<boolean> = 1

interface Obj1<T> {
  msg: T
}
const res: Obj1<string | number> = {
  msg: 200,
}
```

- 3.实际应用:axios
```ts
const axios = {
  get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", url)

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        }
      }
      xhr.send(null)
    })
  },
}

interface Data {
  code: number
  msg: string
}

axios.get<Data>("./data.json").then((res) => {
  console.log(res)
})
```