const RecipeDataModel = require('./RecipeDataModel')

class RecipeModel extends RecipeDataModel {
    constructor(id, title, ready_in_minutes, aggregate_likes, serving, vegetarian,
                vegan, gluten_free, image, instructions, extended_ingredients) {
        super(title, ready_in_minutes, aggregate_likes, serving, vegetarian,
            vegan, gluten_free, image, instructions, extended_ingredients)
        this.id = id
    }
}

module.exports = RecipeModel
