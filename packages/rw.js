const feedArticlePreviewTemplate = document.createElement('template')
feedArticlePreviewTemplate.innerHTML = `<div class="article-preview">
    <div class="article-meta">
        <a href><img src /></a>
        <div class="info">
            <a href class="author"></a>
            <span class="date"></span>
        </div>
        <button class="btn btn-outline-primary btn-sm pull-xs-right">
            <i class="ion-heart"></i> <span class="favorites-count"></span>
        </button>
    </div>
    <a href class="preview-link">
        <h1></h1>
        <p></p>
        <span>Read more...</span>
        <ul class="tag-list"></ul>
    </a>
</div>`

export default {
    context: {
        mainCss: "themes/main.css",
        googleFont: "https://fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic&display=swap",
        blankProfile: "data:image/webp;base64,UklGRkgPAABXRUJQVlA4WAoAAAAIAAAALwAALwAAVlA4ILoAAADQBACdASowADAAAUAmJaQAAudZtMCXiKixTCYqjZ18IFbmdvj8RBtZkNRLBb6woAD+/qtnUu9rrHAw6N07OWL989S4KudruGmEJVPKPnIM5OuNVZpP6XqRKLpIxIUzLb4c+1nI/t9+U1I+G/2Q0V+mcsVUEcfVT3CJVnJHqdSrjNfvvACkGxAeQZao0q6z7NDzBZaU8T20lGvvo43yRRpi1ucD3BWb9eTAPv3PCfUn+VnKNHf1T6IAAABFWElGaA4AAElJKgAIAAAAAAAOAAAACAAAAQQAAQAAAAABAAABAQQAAQAAAAABAAACAQMAAwAAAHQAAAADAQMAAQAAAAYAAAAGAQMAAQAAAAYAAAAVAQMAAQAAAAMAAAABAgQAAQAAAHoAAAACAgQAAQAAAO0NAAAAAAAACAAIAAgA/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEAAQADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3PNGabmjNMQ7NGabmjNADs0ZpuaM0AOzRmm5ozQA7NGabmjNAxc0ZpuaM0gFzRmm5pNxoAfuFG4VHuNG40ASbhRuFR7jRuNAEmaM1HuNLuNAD80uaYDS5oAdmjNNzS5oAdmjNNzRmmIdmjNNzRmgB2aM03NGaAHZozTc0ZoAbmjNJRQAuaM0lFAC5ozSUUALmjNJRSGGaM0lITTEKWFNLCmljimljSGOLCkLj3qIucdqaXPtQBJvHvRvHvUO8+1IXPtQBNvHvS7x71X8w+1HmH2oAs7x70oYVXDn2pwc+1AFkOPelDCoAxzTwxxQBNmlBqMGlBoAkzRmm5pc0CFzRmkopgLmjNJRQAuaM0lFACZozTc0ZoAdmjNNzRmgB2aM03NGaAFJpM0hNITQMCaaTSE0wsc0ABYYqNnGe9NZjioXlYN0HSkAplVuADQLd5xuUqAOOaWxgWedkckALnj6itaKzjjUgFuueTTEZZ0uf+/H+Z/wpjabMD96P8z/hW95Y96aYVY5JNIZgC1duAV/Onrp0zDIZPzP+Fa4so1OQz/mKkWBVGATQBj/2ZMP4o/zP+FNNlJGcFk/A1ueWD601rVHOSW/CgDEjnVmwAelTK4I71UkUQLuXkk45p8MrMhJA60xF5WGaeGGKrqxzUgY4oAnBpc0wHmlzQA/NLmm5ozSAdmjNNzRmmA7NGabmjNADaKTNGaQxaKTNGaAFopM0ZoACaaTzQTTSeaYhrMMVGzDNDHio2Y5oAhdgwwKfFYy3Cl0ZAAcck0y0UTylW4AXPFbNnCscJAJ+9nmgCZEKnJxT6KKQwooooAKKKKACiiigCG4haaMKpAIOeayL21dJgCV+72/Gt4VWuLZJ5AzFgQMcUAY8cqs2AD0qdWGKoQOd56dKto5x2piLQPNPB4qEHmng8UASg0tMBp2aQxaKTNGaAFopM0ZoAbmjNNzRmmA7NGabmjNADs0hNJmkJpABPFRseaUnimMeaYETsMVWmkAccHpUsrEKPrUXliX5myD04oEaun2kkE7MxUgrjg+4rRpAgTkZ/GlzSGFFJmjNAC0UmaM0ALRSZozQAtFJmjNAC0oNNzRmgDI1C2dIFJK/e/oapR/IuD69q279A8Cg5+9/Q1jTqI3AHpnmmIsqeakU8VAp5qVTxSGTg0oNRg04GgB+aM03NGaYDs0ZpuaM0ANzRmm5ozQA7NGabmjNAC0ZpM0hPNADSeKjY804nio2PNAivOfkH1qeyG6Ekf3v8Kqzn5B9av6Yge2YnP3z/IUAbRPFJmkzRSGLmjNJRQAuaM0lFAC5ozSUUALmjNJRQAuaM0lFADJxuQAetYWpjbcqD/cH8zXQFQ3BrH1SBTcryfuD+ZoAgU81Kp4qtE5ZiDjpVhTxTETg804GoweaeDxQA7NGabmjNAx2aM03NGaAEzRmm5ozQIdmjNNzRmgBSaQmjNNJoAaTxUbHmnE8UxjzQBDGNzYHpWxpwxbt/vn+QrHRihyK19NYtbMT/fP8hQBezRmm5ozSGOzRmm5ozQA7NGabmjNADs0ZpuaM0AOzRmm5ozQA7NGabmjNADgaytUcC5Xr9wfzNahOKxdXci7Xp9wfzNAipEPmP0qwvSoU4b8KlU8UwJxTgeKjBp4PFAD80ZpuaM0AOzRmm5ozQA3NGabmjNADs0ZpuaM0AKTSE0ZpCaAGnpUbdaeelMbrQBWl4UfWtPST/orf75/kKzJvuD61d02QpbsAB98/yFAG3RQaSkMWikzRmgQtFJmjNAC0UmaM0ALRSZozQAtFJmjNAEVy4SME561haiwkuFI/uY5+prX1FytupGPv/wBDWLOxdwT6UwJF61IvSo161IvSgCUU4GmA0oNAD80ZpuaM0AOzRmm5ozQA3NGabmjNADs0ZpuaM0AOzSE0maM0AIaaetKTTSeaAIm6VWmQlx06VabpUTjJoA1bK/ilmKqrg7c8gf41oq4cZGfxrmbBzHOxGPu45+orfsnMkJJx97HFIZYopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWkLBeDSryap3lw8MwVQpBXPNAFHULuOe3VVDAhs8j2NUY+V/Go1laY7WAA68VKigLTETr1p4pg604UASA0oNNBpc0AOzRmm5ozQA7NGabmjNADc0Zpm40bjQA/NGaZuNG40APzSZpu40ZoAXNITSZppNACHpUbdacTxUbHmgCCQ4X8at2V0kUJVg2d2ePwqpJyv41CZmiO1QMdeaAO13A0VBDIXcggdKmzSGLRSZozQAtFJmjNAC0UmaUUAUdTlWO2UkH74HH0Nc/csJpAy8ADHNaGr3Lm0Thfvj+RrKjcuuTjrTEWl61IvSolPNSKeKAJhThUYY5pwNAEgNLmmBjRuNAD80Zpm40bjQA/NGaZuNG40ANzRmmbjRuNADs0Zpm40ZoAdmjNM3Gk3GgB5YU0sM0zcaQsc0ABPFMJ5oLHFMJoAWCJrhyiEAgZ5rb061eK3ZWK53k8fQVl6Qoa7cH+4f5iuhhGxCB60ASE0ZpuaM0hjs0ZpuaM0AOzRmm5ozQA7NGabmjNAENzbvPGFUqCDnmse80yYzD5o/u+p/wAK380x4VlO5ic9OKBHKo4Ld6lB4qIoIxkZ9OaVGJFMCyDzTgahDHNODGgCbcKM1HuNKGNAEmaM0zNG40ASZozTNxo3GgCPNGabmjNADiwppYU0mkJoAcWFNLCmljTGcg9qAHs4A70wyrnoaZG5lba2MYzxV23sIp4yzM4IOOCKAKyxNKdqkA9ealTTJpRuVo8dOSf8K149LgjbIeTp3I/wqzHbJGuAW655oAjtLV4JSzFSCuODVsmkzRSAXNGaSigBc0ZpKKAFzRmkooAXNGaSigBc0oNNooAw76ykMC/Mn3vU+hrNKGA7WwSeeK6mW3SZQrFgM54qjPpUDuCXk6diP8KYGMsgJ6GnhhiknhWBAykkk45qDzWHYUAWgwpwNRBjShjQBLmnBhUQY0uaAJM0ZpmaXNAEeaCabmkJoAGYAUwyD0NIDu4NXbSwiuIi7s4IbHBH+FAECWckx2qVBHPJq1BpM5Q/PH19T/hWnFYRRMWVnzjHJFWUQRjAz+NADIomjYkkdMcVLmkzRSGLRSZozQIWikzRmgBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRQArciqtxavNIGUqABjk1Zpc0DOdk0mdFyXj6+p/wAKga1eI7WKk9eK6V4lkGCT+FV5NPikbJZ+mOCP8KYjnhIPQ09XBHerd1p0MEQdGcktjkj/AAqg58tsDp15oAmzTgwqPNKDQAwmmFwpwc0pNQTMQ4+lAGtpFu63bElfuH+YrcQbBg1TsoFimLKTnbjmrp60MAopM0ZpDFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRmgBw5rK1O3eW5VlKgbAOfqa1BUM0YkcEk9O1AHKxuGbAz0qYGq0XDH6VMDTENY8VEw3HIpzninRqGXJ9aAOuCkUuaG6U3NIY7NGabmjNADs0ZpuaM0AOzRmm5ozQA7NGabmjNADs0ZpuaM0AOzRmm5ozQA7NGabmjNADs0ZpuaM0AOzRmm5ozQA7NGabmjNADs0ZpuaM0AOzRmm5ozQA7NKOlMzTgeKBHJzoY0BOOuOKjQ5X8at6ggS3UjP3v6GqUZ+U/WmAkh+X8at2KloGI/vf0FUpD8o+taWlqDbN/vn+QoA6M9KbSk8U3NIBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAFopM0ZoAWikzRmgBaKTNGaAMXWEItE6f6wfyNZEf3fxrb1of6Gn/XQfyNYg4FMD//2QA=",
        404: `
                <div class="home-page">
                    <div class="banner">
                        <div class="container">
                            <h1 class="logo-font">error 404</h1>
                            <p>This is not the knowledge you are looking for &#x1F44B;</p>
                        </div>
                    </div>
                </div>
            `,
        api: "https://api.realworld.io/api",
        feedDefaultConfig: { "limit": 10, "offset": 0, "tag": null, "author": null, "favorited": null },
        articleLoading: { "`.article-list`": { "..": "" }, "`.pagination`": { "..": "" } },
        initialArticles: await fetch('https://api.realworld.io/api/articles').then(r => r.json())
    },
    options: {
        jsonata: {
            helpers: {
                markdown2Html: 'text/markdown'
            }
        }
    },
    templates: {
        "feed-article-preview": feedArticlePreviewTemplate
    }
}
