const filters = Object.fromEntries((new URLSearchParams(window.location.search)).entries()), { limit = 10, offset = 0 } = filters,
    query = (new URLSearchParams({ ...filters, limit, offset })).toString()
export default {
    gateways: {
        api: hostpath => `https://api.realworld.io/${hostpath}}`
    },
    variables: {
        limit, offset,
        articleDefault: `api://api/articles?${query}`,
        articleListRender: ['{"`.article-list`": ($count($) ? ([$map($.articles, function($a) {{',
            '"`.article-meta meta[is=e-data]`@target": "api://api/articles/" & $a.slug & "/favorite",',
            '"`.article-meta a`@href": "./#profile/" & $a.author.username,',
            '"`.article-meta .info a`@href": "./#profile/" & $a.author.username,',
            '"`.article-meta a img`@src": $a.author.image,',
            '"`.article-meta .info .author`.textContent": $a.author.username,',
            '"`.article-meta .info .date`.textContent": $fromMillis($toMillis($a.updatedAt), "[MNn] [D1o]"),',
            '"`.article-meta .favorites-count`": $a.favoritesCount,',
            '"`.preview-link`@href": "./#article/" & $a.slug,',
            '"`.preview-link h1`": $a.title,',
            '"`.preview-link p`": $a.description,',
            '"`.preview-link .tag-list`": $map($a.tagList, function($t) { {".textContent": $t} })',
            '}})]) : []), ',
            '"`.pagination`": [$map($.pages, function($page) { {"@class": ($page.active ? "page-item active" : "page-item"), "`meta`@transform": "{\\"@resource\\": \\"api://api/articles?" & $page.query & "\\"}", "`a`.textContent": $page.number } })]',
            '}'].join(''),
        profileFromHash: () => window.location.hash.replace('#profile/', ''),
        tagListRender: '$map($, function($t) {{ ".textContent": $t, "@href": "./?tag=" & $t }})',
        toggleFeedToAuthor: '{"`main|#article-feed-pointer`@resource": "api://api/articles?author={$profileFromHash()}&' + query + '", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        toggleFeedToFavorited: '{"`main|#article-feed-pointer`@resource": "api://api/articles?favorited={$profileFromHash()}&' + query + '", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        toggleFeedToYour: '{"`main|#article-feed-pointer`@resource": "api://api/articles/feed?' + query + '", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        toggleFeedToGlobal: '{"`main|#article-feed-pointer`@resource": "api://api/articles?' + query + '", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        authPostRender: ['{"`.error-messages`": $each($.errors, function($v, $k) {  $k & " " & $join($v, ", ") }),',
            '"`#user`.write()": $.user ? $.user : {}, "`#router`.to(./#profile)": $boolean($.user) }'].join(''),
        profilePageRender: ['$ ? ({',
            '"`.user-info`@style": "display: block;",',
            '"`.user-info h4.username`": $.username,',
            '"`.user-info span.username`": $.username,',
            '"`.user-info .bio`": $.bio ? $.bio : "No bio",',
            '"`.user-info .user-img`": $.image ? $.image : "https://upload.wikimedia.org/wikipedia/commons/e/e7/Ico_user_profile_blank.png",',
            '"`.user-info .follow`@style": $.isSelf ? "display: none" : null,',
            '"`.user-info .edit`@style": $.isSelf ? null : "display: none" }) : {',
            '"`.user-info`@style": "display: none;"}'].join(''),
        settingsRender: '{ "`.error-messages`": $each($.errors, function($v, $k) {  $k & " " & $join($v, ", ") }), "`form`": $.user }'
    }
}
