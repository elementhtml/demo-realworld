const { limit: articleListLimit = 10, offset: articleListOffset = 0 } = Object.fromEntries((new URLSearchParams(window.location.search)).entries())
export default {
    gateways: {
        api: hostpath => `https://api.realworld.io/${hostpath}}`
    },
    variables: {
        articleListLimit, articleListOffset,
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
            '"`.pagination`": [$map($.pages, function($page) { {"@class": ($page.active ? "page-item active" : "page-item"), "`meta`@transform": "{\\"@resource\\": \\"api://api/articles?limit=" & $page.limit & "&offset=" & $page.offset & "\\"}", "`a`.textContent": $page.number } })]',
            '}'].join(''),
        tagListRender: '$map($, function($t) {{ ".textContent": $t, "@href": "./?tag=" & $t }})',
        toggleFeedToYour: '{"`main|#article-feed-pointer`@resource": "api://api/articles/feed?limit=' + articleListLimit + '&offset=' + articleListOffset + '", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        toggleFeedToGlobal: '{"`main|#article-feed-pointer`@resource": "api://api/articles?limit=' + articleListLimit + '&offset=' + articleListOffset + '", "`ul|li a.active`@class": "nav-link", "`li|a`@class": "nav-link active" }',
        authPostRender: ['{"`.error-messages`": $each($.errors, function($v, $k) {  $k & " " & $join($v, ", ") }),',
            '"`#user`.write()": $.user ? $.user : {}, "`#router`.to(./#profile)": $boolean($.user) }'].join('')
    }
}
