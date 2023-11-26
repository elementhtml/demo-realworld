export default {
    variables: {
        mock: {
            data: {
                auth: {},
                profiles: {},
                users: {},
                articles: {}
            },
            "/api/users": {
                "POST": (server, context, payload) => {
                    if (payload?.user?.username) server.data.users[payload.user.username] = payload.user
                    server.data.users[payload.user.username].token = crypto.randomUUID()
                    server.data.auth[server.data.users[payload.user.username].token] = payload.user.username
                    return server.data.users[payload.user.username]
                }
            },
            "/api/users/login": {
                "POST": (server, context, payload) => {
                    const user = Object.getValues(server.data.users).filter(u => u.email == payload.user.email && u.password == payload.user.password)[0]
                    if (user) {
                        user.token = crypto.randomUUID()
                        server.data.auth[user.token] = user.username
                    }
                    return user
                }
            },
            "/api/user": {
                "GET": (server, context) => {
                    const token = (context?.headers?.Authorization ?? '').slice(6), username = token ? server.data.auth[token] : undefined,
                        user = username ? server.data.users[username] : undefined
                    return user
                },
                "PUT": (server, context, payload) => {
                    const token = (context?.headers?.Authorization ?? '').slice(6), username = token ? server.data.auth[token] : undefined,
                        user = username ? server.data.users[username] : undefined
                    if (user && payload) Object.assign(user, payload)
                    return user
                }
            },
            "/api/profiles/*": {
                "GET": (server, context) => {
                    const username = (context?.headers?.pathname ?? '').split('/')[3], user = username ? server.data.users[username] : undefined
                    let profile
                    if (user) {
                        profile = {}
                        for (const p of ['username', 'bio', 'image', 'following']) profile[p] = user[p]
                    }
                    return profile
                },
                "POST": (server, context, payload) => {
                    const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? server.data.auth[token] : undefined,
                        requestingUser = requestingUsername ? server.data.users[requestingUsername] : undefined
                    if (!requestingUser) return
                    const [, , , usernameToFollow, follow] = (context?.url?.pathname ?? '').split('/'),
                        userToFollow = usernameToFollow ? server.data.users[usernameToFollow] : undefined
                    if (userToFollow && follow) {
                        requestingUser.following ||= []
                        requestingUser.following.push(usernameToFollow)
                    }
                    let profile = {}
                    for (const p of ['username', 'bio', 'image', 'following']) profile[p] = userToFollow[p]
                    return profile
                },
                "DELETE": (server, context, payload) => {
                    const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? server.data.auth[token] : undefined,
                        requestingUser = requestingUsername ? server.data.users[requestingUsername] : undefined
                    if (!requestingUser) return
                    const [, , , usernameToUnfollow, follow] = (context?.url?.pathname ?? '').split('/'),
                        userToUnfollow = usernameToUnfollow ? server.data.users[usernameToUnfollow] : undefined
                    if (userToUnfollow && follow) {
                        requestingUser.following ||= []
                        requestingUser.following = requestingUser.following.filter(u => u != usernameToUnfollow)
                    }
                    let profile = {}
                    for (const p of ['username', 'bio', 'image', 'following']) profile[p] = userToUnfollow[p]
                    return profile
                }
            },
            "/api/articles": {
                "GET": (server, context) => {
                    let articles = Object.getValues(server.data.articles), searchParams = context?.url?.searchParams,
                        filters = searchParams ? Object.fromEntries(searchParams.entries()) : undefined
                    if (filters && Object.keys(filters).length) {
                        articles = articles.filter(a => {
                            const matchesTag = !filters.tag || (filters.tag && (a.tagList ?? []).includes(filter.tags))
                            const matchesAuthor = !filters.author || (filters.author && (a.author?.username) === filter.author)
                            const matchesFavorited = !filters.favorited || (filters.favorited && (a.favorited ?? []).includes(filters.favorited))
                            return matchesTag && matchesAuthor && matchesFavorited
                        })
                        if (filters.offset) articles = articles.slice(filters.offset)
                        if (filters.limit) articles = articles.slice(0, filters.limit)
                    }
                    return articles
                }

            }

        }
    }
}

{
    "article": {
        "slug": "how-to-train-your-dragon",
            "title": "How to train your dragon",
                "description": "Ever wonder how?",
                    "body": "It takes a Jacobian",
                        "tagList": ["dragons", "training"],
                            "createdAt": "2016-02-18T03:22:56.637Z",
                                "updatedAt": "2016-02-18T03:48:35.824Z",
                                    "favorited": false,
                                        "favoritesCount": 0,
                                            "author": {
            "username": "jake",
                "bio": "I work at statefarm",
                    "image": "https://i.stack.imgur.com/xHWG8.jpg",
                        "following": false
        }
    }
}