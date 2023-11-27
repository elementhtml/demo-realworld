export default {
    gateways: {
        api: hostpath => `https://api.realworld.io/${hostpath}}`
    },
    variables: {
        articleListRender: ['$map($, function($a) {{',
            '"`.article-meta .favorite-pointer`@target": "api://api/articles/" & $a.slug & "/favorite",',
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
            '}})'].join(''),
        tagListRender: '$map($, function($t) {{ ".textContent": $t, "@href": "./?tag=" & $t }})',
        toggleFeedToYour: '{"`main|#article-feed-pointer`@resource": "api://api/articles/feed", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        toggleFeedToGlobal: '{"`main|#article-feed-pointer`@resource": "api://api/articles", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        authPostRender: ['{"`.error-messages`": $each($.errors, function($v, $k) {  $k & " " & $join($v, ", ") }),',
            '"`#user`.write()": $.user ? $.user : {} }'].join('')
    }
}