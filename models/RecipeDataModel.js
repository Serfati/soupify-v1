class RecipeDataModel {
    constructor(title, ready_in_minutes, aggregate_likes, serving, vegetarian,
                vegan, gluten_free, image, instructions, extended_ingredients) {
        this.title = title
        this.ready_in_minutes = ready_in_minutes
        this.aggregate_likes = aggregate_likes
        this.serving = serving
        this.vegetarian = vegetarian
        this.vegan = vegan
        this.gluten_free = gluten_free
        this.image = image
        this.instructions = instructions
        this.extended_ingredients = extended_ingredients
    }
}

module.exports = RecipeDataModel