export default {
    variables: {
        mock: {
            data: {
                users: {},
                auth: {}
            },
            "/api/users": {
                "POST": (server, headers, payload) => {
                    if (payload?.user?.username) server.data.users[payload.user.username] = payload.user
                    server.data.users[payload.user.username].token = crypto.randomUUID()
                    server.data.auth[server.data.users[payload.user.username].token] = payload.user.username
                    return server.data.users[payload.user.username]
                }
            },
            "/api/users/login": {
                "POST": (server, headers, payload) => {
                    const user = Object.getValues(server.data.users).filter(u => u.email == payload.user.email && u.password == payload.user.password)[0]
                    if (user) {
                        user.token = crypto.randomUUID()
                        server.data.auth[user.token] = user.username
                    }
                    return user
                }
            },
            "/api/user": {
                "GET": (server, headers) => {
                    const token = (headers?.Authorization ?? '').slice(6), username = token ? server.data.auth[token] : undefined,
                        user = username ? server.data.users[username] : undefined
                    return user
                }
            },
        }
    }
}