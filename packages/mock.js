export default {
    gateways: {
        api: (hostpath, E) => {
            if (hostpath && hostpath[0] !== '/') hostpath = `/${hostpath}`
            if (hostpath && hostpath.startsWith('//')) hostpath = hostpath.slice(1)
            let pathHandler = E.env.variables.mock[hostpath],
                useKey = pathHandler ? undefined : Object.keys(E.env.variables.mock).find(p => new RegExp(p).test(hostpath))
            let handler = pathHandler ?? (useKey ? E.env.variables.mock[useKey] : undefined)
            if (typeof handler === 'function') return handler.bind(E.env.variables.mock)
        }
    },
    variables: {
        mock: {
            data: {
                auth: {},
                profiles: {},
                users: {},
                articles: {},
                comments: {}
            },
            "/api/users": function (context, payload) {
                switch (context.method) {
                    case 'POST':
                        if (payload?.user?.username) this.data.users[payload.user.username] = payload.user
                        this.data.users[payload.user.username].token = crypto.randomUUID()
                        this.data.auth[this.data.users[payload.user.username].token] = payload.user.username
                        return this.data.users[payload.user.username]
                }
            },
            "/api/users/login": function (context, payload) {
                switch (context.method) {
                    case 'POST':
                        const user = Object.getValues(this.data.users).filter(u => u.email == payload.user.email && u.password == payload.user.password)[0]
                        if (user) {
                            user.token = crypto.randomUUID()
                            this.data.auth[user.token] = user.username
                        }
                        return user
                }
            },
            "/api/user": function (context, payload) {
                const token = (context?.headers?.Authorization ?? '').slice(6), username = token ? this.data.auth[token] : undefined,
                    user = username ? this.data.users[username] : undefined
                switch (context.method) {
                    case 'GET':
                        return user
                    case 'PUT':
                        if (user && payload) Object.assign(user, payload)
                        return user
                }
            },
            "/api/profiles/*": function (context, payload) {
                let profile = {}
                switch (context.method) {
                    case 'GET':
                        const username = (context?.url?.pathname ?? '').replace('//', '/').split('/')[3], user = username ? this.data.users[username] : undefined
                        if (user) for (const p of ['username', 'bio', 'image', 'following']) profile[p] = user[p]
                        break
                    case 'POST':
                    case 'DELETE':
                        const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? this.data.auth[token] : undefined,
                            requestingUser = requestingUsername ? this.data.users[requestingUsername] : undefined
                        if (!requestingUser) return
                        const [, , , usernameTo, follow] = (context?.url?.pathname ?? '').replace('//', '/').split('/'),
                            userTo = usernameTo ? this.data.users[usernameTo] : undefined
                        if (userTo && follow) {
                            requestingUser.following ||= []
                            if (context.method === 'POST') requestingUser.following.push(usernameTo)
                            if (context.method === 'DELETE') requestingUser.following = requestingUser.following.filter(u => u != usernameTo)
                        }
                        for (const p of ['username', 'bio', 'image', 'following']) profile[p] = userTo[p]
                }
                return profile
            },
            "/api/articles/*": function (context, payload) {
                switch (context.method) {
                    case 'GET':
                        let articles = Object.values(this.data.articles), searchParams = context?.url?.searchParams,
                            filters = searchParams ? Object.fromEntries(searchParams.entries()) : undefined
                        const [, , , feedOrSlug, comments] = (context?.url?.pathname ?? '').replace('//', '/').split('/')
                        if (feedOrSlug === 'feed') {
                            const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? this.data.auth[token] : undefined,
                                requestingUser = requestingUsername ? this.data.users[requestingUsername] : undefined
                            articles = articles.filter(a => (requestingUser.follows ?? []).includes(a.author?.username))
                        } else if (feedOrSlug && comments) {
                            return this.data.comments[feedOrSlug] ?? []
                        } else if (feedOrSlug) {
                            return this.data.articles[feedOrSlug]
                        }
                        if (articles.length && filters && Object.keys(filters).length) {
                            articles = articles.filter(a => {
                                const matchesTag = !filters.tag || (filters.tag && (a.tagList ?? []).includes(filter.tags))
                                const matchesAuthor = !filters.author || (filters.author && (a.author?.username) === filter.author)
                                const matchesFavorited = !filters.favorited || (filters.favorited && (a.favorited ?? []).includes(filters.favorited))
                                return matchesTag && matchesAuthor && matchesFavorited
                            })
                            articles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                            if (filters.offset) articles = articles.slice(filters.offset)
                            if (filters.limit) articles = articles.slice(0, filters.limit)
                        }
                        return articles
                    case 'POST':
                    case 'PUT':
                    case 'DELETE':
                        const token = (context?.headers?.Authorization ?? '').slice(6), requestingUsername = token ? this.data.auth[token] : undefined,
                            requestingUser = requestingUsername ? this.data.users[requestingUsername] : undefined
                        if (!requestingUser) return
                        const [, , , articleSlug, commentsOrFavorite] = (context?.url?.pathname ?? '').replace('//', '/').split('/')
                        if (!articleSlug) return
                        const author = {
                            username: requestingUser.username,
                            bio: requestingUser.bio,
                            image: requestingUser.image,
                            following: requestingUser.following
                        }
                        if (context.method === 'POST') {
                            if (commentsOrFavorite === 'comments') {
                                if (!this.data.articles[articleSlug]) return
                                this.data.comments[articleSlug] ||= []
                                const comment = {
                                    body: payload?.comment?.body,
                                    id: this.data.comments[articleSlug].length + 1,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                    author: { ...author }
                                }
                                this.data.comments[article.slug].push(comment)
                                return { comment }
                            } else if (commentsOrFavorite === 'favorite') {
                                const article = this.data.articles[articleSlug]
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
                                if (this.data.articles[article.slug]) return
                                article.tagList = (payload?.article ?? {}).tagList ?? []
                                article.createdAt = new Date().toISOString()
                                article.updatedAt = new Date().toISOString()
                                article.favorited = []
                                article.favoritesCount = 0
                                article.author = { ...author }
                                this.data.articles[article.slug] = article
                                return { article }
                            }
                        } else if (context.method === 'PUT') {
                            const article = this.data.articles[articleSlug]
                            if (!article) return
                            if (article.author?.username !== requestingUser.username) return
                            for (const p of ['title', 'description', 'body']) article[p] = (payload?.article ?? {})[p]
                            article.updatedAt = new Date().toISOString()
                            const oldSlug = articleSlug, newSlug = article.title.trim().replaceAll(/[^a-z0-9]+/gi, '-').replaceAll(/\-+/, '-').toLowerCase()
                            this.data.articles[newSlug] = article
                            if (newSlug !== oldSlug) {
                                this.data.comments[newSlug] = this.data.comments[oldSlug]
                                delete this.data.articles[oldSlug]
                            }
                            return { article }
                        } else if (context.method === 'DELETE') {
                            if (!this.data.articles[articleSlug]) return
                            if (article.author?.username !== requestingUser.username) return
                            if (commentsOrFavorite === 'comments' && commentId) {
                                let comments = this.data.comments[articleSlug] ?? []
                                comments = comments.filter(c => c.id != commentId)
                                this.data.comments[articleSlug] = comments
                            } else if (commentsOrFavorite === 'favorite') {
                                const article = this.data.articles[articleSlug]
                                article.favorited ||= []
                                article.favorited.push(requestingUser.username)
                                return { article }
                            } else {
                                delete this.data.articles[articleSlug]
                                delete this.data.comments[articleSlug]
                            }
                        }
                }
            },
            "/api/tags": function (context, payload) {
                switch (context.method) {
                    case 'GET':
                        let tags = {}
                        let articleTags = Object.getValues(this.data.articles).forEach(a => { for (const t of (a.tagList ?? [])) tags[t] = true })
                        tags = Object.keys(tags)
                        tags.sort()
                        return tags
                }
            }
        }
    }
}
