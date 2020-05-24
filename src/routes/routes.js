import { Home } from './home'
// import { CurrentDate } from './currentDate'
import { DataInEachDay } from './dataInEachDay'
import { DataPerDay } from './dataPerDay'
import { TotalData } from './totalData'

const routes = [
  DataInEachDay, DataPerDay, TotalData
]

const setRoutes = app => {
  app.use('', Home)
  routes.forEach(route => {
    app.use('', route)
  })
}

export { setRoutes }
