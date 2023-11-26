export default {
    variables: {
        mock: {
            data: {
                auth: {},
                profiles: {},
                users: {},
                articles: {},
                comments: {}
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
            "/api/articles/*": {
                "GET": (server, context) => {
                    let articles = Object.getValues(server.data.articles), searchParams = context?.url?.searchParams,
                        filters = searchParams ? Object.fromEntries(searchParams.entries()) : undefined
                    const [, , , feedOrSlug] = (context?.url?.pathname ?? '').split('/')
                    if (feedOrSlug === 'feed') {
                        const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? server.data.auth[token] : undefined,
                            requestingUser = requestingUsername ? server.data.users[requestingUsername] : undefined
                        articles = articles.filter(a => (requestingUser.follows ?? []).includes(a.author?.username))
                    } else if (feedOrSlug) {
                        return server.data.articles[feedOrSlug]
                    }
                    if (articles.length && filters && Object.keys(filters).length) {
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
                },
                "POST": (server, context, payload) => {
                    const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? server.data.auth[token] : undefined,
                        requestingUser = requestingUsername ? server.data.users[requestingUsername] : undefined
                    if (!requestingUser) return
                    const [, , , articleSlug, commentsOrFavorite] = (context?.url?.pathname ?? '').split('/')
                    if (!articleSlug) return
                    const author = {
                        username: requestingUser.username,
                        bio: requestingUser.bio,
                        image: requestingUser.image,
                        following: requestingUser.following
                    }
                    if (commentsOrFavorite === 'comments') {
                        if (!server.data.articles[article.slug]) return
                        server.data.comments[article.slug] ||= []
                        const comment = {
                            body: payload?.comment?.body,
                            id: server.data.comments[article.slug].length + 1,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            author: { ...author }
                        }
                        server.data.comments[article.slug].push(comment)
                        return { comment }
                    } else if (commentsOrFavorite === 'favorite') {
                        const article = server.data.articles[article.slug]
                        if (!article) return
                        article.favorited ||= []
                        article.favorited.push(requestingUser.username)
                        article.favoritesCount += 1
                        article.updatedAt = new Date().toISOString()
                        return { article }
                    } else {
                        const article = {}
                        for (const p of ['title', 'description', 'body']) article[p] = (payload?.article ?? {})[p]
                        article.slug = article.title.trim().replaceAll(/[^a-z0-9]+/gi, '-').replaceAll(/\-+/, '-').toLowerCase()
                        if (server.data.articles[article.slug]) return
                        article.tagList = (payload?.article ?? {}).tagList ?? []
                        article.createdAt = new Date().toISOString()
                        article.updatedAt = new Date().toISOString()
                        article.favorited = []
                        article.favoritesCount = 0
                        article.author = { ...author }
                        server.data.articles[article.slug] = article
                        return { article }
                    }
                },
                "PUT": (server, context, payload) => {
                    const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? server.data.auth[token] : undefined,
                        requestingUser = requestingUsername ? server.data.users[requestingUsername] : undefined
                    if (!requestingUser) return
                    const [, , , articleSlug] = (context?.url?.pathname ?? '').split('/')
                    if (!articleSlug) return
                    const article = server.data.articles[article.slug]
                    if (!article) return
                    if (article.author?.username !== requestingUser.username) return
                    for (const p of ['title', 'description', 'body']) article[p] = (payload?.article ?? {})[p]
                    article.updatedAt = new Date().toISOString()
                    const oldSlug = article.slug, newSlug = article.title.trim().replaceAll(/[^a-z0-9]+/gi, '-').replaceAll(/\-+/, '-').toLowerCase()
                    server.data.articles[newSlug] = article
                    if (newSlug !== oldSlug) delete server.data.articles[oldSlug]
                    return { article }
                }
            }
        },

    }
}
