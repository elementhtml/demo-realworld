export default {
    gateways: {
        api: hostpath => `https://api.realworld.io/${hostpath}}`
    },
    variables: {
        articleListRender: ['$map($, function($a) {{',
            '"`.article-meta a`@href": "./#profile/" & $a.author.username,',
            '"`.article-meta a img`@src": $a.author.image,',
            '"`.article-meta .info .author`.textContent": $a.author.username,',
            '"`.article-meta .info .date`.textContent": $fromMillis($toMillis($a.updatedAt), "[MNn] [D1o]"),',
            '"`.article-meta .favorites-count`": $a.favoritesCount,',
            '"`.preview-link`@href": "./#article/" & $a.slug,',
            '"`.preview-link h1`": $a.title,',
            '"`.preview-link p`": $a.description,',
            '"`.preview-link .tag-list`": $map($a.tagList, function($t) { {".textContent": $t} })',
            '}})'].join(''),
        tagListRender: '$map($, function($t) {{ ".textContent": $t, "@href": "./?tag=" & $t }})'
    }
}