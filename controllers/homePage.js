const Post = require('../db/models/Post')

module.exports = async (req, res) => {
    const posts = await Post.find({});
    res.render("home", {
        posts:posts
    });
}
