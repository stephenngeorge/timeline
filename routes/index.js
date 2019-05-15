import nodes from './nodes'
import timelines from './timelines'
import users from './users'

export default app => {
    app.use('/nodes', nodes)
    app.use('/timelines', timelines)
    app.use('/users', users)
}