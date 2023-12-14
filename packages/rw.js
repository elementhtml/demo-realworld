const headers = { Authorization: "Token ${#user.token}", "Content-Type": "application/json;charset=UTF-8" }
export default {
    variables: {
        blankProfile: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Ico_user_profile_blank.png",
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
        get: { method: 'GET', headers },
        post: { method: 'POST', headers },
        put: { method: 'PUT', headers }
    }
}