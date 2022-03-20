export default function (context) {
  // 是否热模块
  if (context.isHMR) return
  console.log(context.req?.headers.cookie, 'cookie')
}
