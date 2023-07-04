import { graphql, rest } from 'msw'

// Mock Data
export const data = {
    'http://localhost:3000/api/v1/user/current': {
        code: 'success',
        message: 'Success',
        data: {
            id: '7',
            name: 'lwzlwz',
            createdTime: 1663858229000,
            isEnabled: true,
            systemRole: 'MAINTAINER',
            projectRoles: {
                '11': 'OWNER',
                '20': 'OWNER',
            },
        },
    },
    'http://localhost:3000/api/v1/system/resourcePool': (await import('./api/model-tree.json')).default.data,
    'http://localhost:3000/api/v1/project/1/model-tree': (await import('./api/model-tree.json')).default.data,
    'http://localhost:3000/api/v1/project/1/runtime-tree': (await import('./api/runtime-tree.json')).default.data,
}

const jsonPlaceHolder = graphql.link('https://jsonplaceholder.ir/graphql')

// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
    ...Object.keys(data).map((url) => rest.get(url, (req, res, ctx) => res(ctx.status(200), ctx.json(data[url])))),

    jsonPlaceHolder.query('posts', (req, res, ctx) => {
        return res(ctx.data({}))
    }),
]
