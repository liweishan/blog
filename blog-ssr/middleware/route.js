export default function ({ isHMR, route, redirect }) {
  if (isHMR) return
  if (['/', '/app'].includes(route.fullPath)) return redirect('/app/home')
}
