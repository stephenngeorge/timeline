import auth from './auth'
import nodes from './nodes'
import timelines from './timelines'

export default app => {
    app.use('/auth', auth)
    app.use('/nodes', nodes)
    app.use('/timelines', timelines)
}