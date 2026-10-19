// app/lib/ingredients.ts

// Grocery categories, listed in the order you'd walk a store.
export const CATEGORIES = {
  VEGETABLE: "Vegetables & Herbs",
  FRUIT: "Fruits",
  PROTEIN: "Proteins",
  DAIRY: "Dairy & Eggs",
  FROZEN: "Frozen",
  GRAIN: "Bread, Grains & Pasta",
  CANNED: "Canned Goods & Legumes",
  BAKING: "Baking",
  NUT: "Nuts, Seeds & Nut Butters",
  SPICE: "Spices & Seasonings",
  CONDIMENT: "Condiments & Sauces",
  OIL: "Oils & Vinegars",
  SUPPLEMENT: "Protein Powders",
  SNACK: "Snacks",
  OTHER: "Other",
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

// Keywords are matched as whole words, singular or plural. When several
// match, the one closest to the end of the name wins, because that is
// usually the item itself ("peanut butter", "chicken stock"). Ties go to
// the longer phrase, so "bell pepper" beats "pepper".
const KEYWORDS: Record<Category, string[]> = {
  [CATEGORIES.VEGETABLE]: [
    "onion", "red onion", "spring onion", "shallot", "scallion", "leek",
    "garlic", "garlic clove", "ginger", "carrot", "celery", "lettuce",
    "iceberg", "rocket", "arugula", "mixed leaf", "salad leaf", "mesclun",
    "spinach", "kale", "silverbeet", "chard", "bok choy", "pak choy",
    "choy sum", "cabbage", "broccoli", "broccolini", "cauliflower",
    "zucchini", "courgette", "squash", "pumpkin", "butternut", "potato",
    "sweet potato", "kumara", "yam", "tomato", "cherry tomato", "cucumber",
    "capsicum", "bell pepper", "red pepper", "green pepper", "yellow pepper",
    "sweet pepper", "chilli", "chili", "jalapeno", "jalapeño", "mushroom",
    "asparagus", "green bean", "snow pea", "sugar snap pea", "pea", "corn",
    "corn kernel", "sweetcorn", "eggplant", "aubergine", "beetroot", "beet",
    "radish", "fennel", "artichoke", "okra", "edamame", "bean sprout",
    "sprout", "alfalfa", "turnip", "parsnip", "swede", "watercress",
    "microgreen", "salad", "coleslaw", "slaw", "vegetable", "veggie",
    // Fresh herbs live in the produce section.
    "parsley", "coriander", "cilantro", "mint", "basil", "thyme", "rosemary",
    "dill", "chive", "sage", "lemongrass", "tarragon", "curry leaf",
    "lime leaf", "herb", "fresh oregano",
  ],
  [CATEGORIES.FRUIT]: [
    "fruit", "apple", "banana", "berry", "blueberry", "raspberry",
    "strawberry", "blackberry", "cranberry", "orange", "lemon", "lime",
    "mango", "pear", "grape", "kiwi", "kiwifruit", "peach", "nectarine",
    "plum", "apricot", "cherry", "pineapple", "melon", "watermelon",
    "rockmelon", "cantaloupe", "papaya", "pawpaw", "passionfruit",
    "pomegranate", "fig", "date", "medjool date", "avocado", "grapefruit",
    "mandarin", "coconut", "lychee", "dragon fruit", "currant", "prune",
    "pomegranate seed",
  ],
  [CATEGORIES.PROTEIN]: [
    "chicken", "beef", "pork", "lamb", "veal", "turkey", "duck", "venison",
    "kangaroo", "mince", "steak", "sirloin", "rump", "brisket", "bacon",
    "ham", "prosciutto", "chorizo", "salami", "sausage", "pancetta", "fish",
    "white fish", "salmon", "tuna", "cod", "barramundi", "snapper", "basa",
    "blue grenadier", "hake", "octopus", "bison", "trout", "prawn", "shrimp", "scallop", "squid",
    "calamari", "mussel", "crab", "seafood", "tofu", "tempeh", "seitan",
  ],
  [CATEGORIES.DAIRY]: [
    "milk", "cheese", "cottage cheese", "cream cheese", "cream",
    "sour cream", "yogurt", "yoghurt", "butter", "buttermilk", "ghee",
    "curd", "ricotta", "mozzarella", "parmesan", "parmigiano", "feta",
    "halloumi", "haloumi", "bocconcini", "brie", "camembert", "quark",
    "skyr", "kefir", "egg", "egg white", "egg yolk",
  ],
  [CATEGORIES.FROZEN]: [
    "ice cream", "frozen yoghurt", "frozen yogurt", "pastry", "puff pastry",
  ],
  [CATEGORIES.GRAIN]: [
    "rice", "brown rice", "basmati", "jasmine rice", "wild rice", "quinoa",
    "oat", "rolled oat", "bread", "wrap", "tortilla", "pita", "pitta", "bun",
    "bread roll", "bagel", "english muffin", "sourdough", "rye", "crumpet",
    "crispbread", "cracker", "rice cake", "rice paper", "pasta", "spaghetti",
    "penne", "fettuccine", "linguine", "macaroni", "lasagne", "lasagna",
    "gnocchi", "noodle", "soba", "udon", "vermicelli", "couscous",
    "cous cous", "barley", "freekeh", "buckwheat", "bulgur", "burghul",
    "polenta", "millet", "farro", "cereal", "muesli", "granola",
    "breadcrumb", "panko", "wheat", "weet-bix",
  ],
  [CATEGORIES.CANNED]: [
    "stock", "broth", "bone broth", "stock cube", "stock powder", "chickpea",
    "lentil", "bean", "black bean", "kidney bean", "cannellini bean",
    "butter bean", "borlotti bean", "four bean mix", "baked bean",
    "tomato paste", "passata", "crushed tomato", "diced tomato",
    "tomato puree", "sun dried tomato", "sundried tomato",
    "semi-dried tomato", "roasted red pepper", "roasted capsicum", "coconut milk",
    "coconut cream", "olive", "pickle", "gherkin", "caper",
    "artichoke heart", "beetroot slice", "anchovy",
  ],
  [CATEGORIES.BAKING]: [
    "flour", "almond meal", "cornflour", "cornstarch", "potato starch",
    "tapioca", "arrowroot", "baking powder", "baking soda", "bicarb",
    "bicarbonate", "yeast", "vanilla", "vanilla extract", "vanilla essence",
    "vanilla bean", "extract", "essence", "sugar", "stevia", "sweetener",
    "erythritol", "monk fruit", "cocoa", "cacao", "cacao nib", "chocolate",
    "chocolate chip", "desiccated coconut", "shredded coconut",
    "coconut flake", "coconut chip", "natvia", "psyllium husk", "raisin", "sultana", "dried fruit", "gelatin",
    "gelatine", "cream of tartar", "sprinkle",
  ],
  [CATEGORIES.NUT]: [
    "nut", "mixed nut", "almond", "cashew", "pistachio", "walnut", "pecan",
    "macadamia", "hazelnut", "brazil nut", "pine nut", "peanut", "seed",
    "chia", "flax", "flaxseed", "linseed", "lsa", "sesame", "sesame seed",
    "sunflower seed", "sunflower kernel", "pumpkin seed", "pepita",
    "hemp seed", "tahini", "peanut butter", "almond butter", "nut butter",
    "cashew butter", "hazelnut spread", "trail mix",
  ],
  [CATEGORIES.SPICE]: [
    "salt", "sea salt", "pepper", "black pepper", "white pepper",
    "peppercorn", "cayenne", "spice", "mixed spice", "allspice", "seasoning",
    "cumin", "cinnamon", "turmeric", "paprika", "smoked paprika",
    "chilli flake", "chili flake", "red pepper flake", "chilli powder",
    "chili powder", "garlic powder", "onion powder", "curry powder",
    "mustard powder", "garam masala", "ras el hanout", "za'atar", "zaatar",
    "sumac", "nutmeg", "clove", "cardamom", "star anise", "fennel seed",
    "mustard seed", "coriander seed", "cilantro seed", "cumin seed",
    "fenugreek seed", "bay leaf", "oregano",
    "dried herb", "mixed herb", "italian herb", "cajun", "five spice",
    "dukkah", "saffron", "fenugreek", "caraway", "celery salt",
    "lemon pepper", "nutritional yeast", "taco seasoning",
  ],
  [CATEGORIES.CONDIMENT]: [
    "sauce", "soy sauce", "tamari", "fish sauce", "oyster sauce", "hoisin",
    "sriracha", "hot sauce", "worcestershire", "tomato sauce", "bbq sauce",
    "ketchup", "mustard", "dijon", "mayonnaise", "mayo", "aioli",
    "dressing", "marinade", "salsa", "pesto", "relish", "chutney", "jam",
    "honey", "syrup", "maple syrup", "rice malt syrup", "agave", "molasses",
    "paste", "curry paste", "miso", "harissa", "hummus", "tzatziki",
    "guacamole", "mirin", "cooking wine", "rice wine", "shaoxing", "gochujang", "sambal",
    "aminos", "liquid aminos", "coconut aminos",
  ],
  [CATEGORIES.OIL]: [
    "oil", "olive oil", "coconut oil", "sesame oil", "avocado oil",
    "cooking spray", "oil spray", "spray oil", "vinegar", "balsamic", "lard",
    "margarine", "dripping",
  ],
  [CATEGORIES.SUPPLEMENT]: [
    "protein", "protein powder", "whey", "whey isolate", "whey protein",
    "pi nutrition", "collagen", "greens powder",
  ],
  [CATEGORIES.SNACK]: ["chip", "corn thin", "popcorn"],
  [CATEGORIES.OTHER]: [
    "water", "coconut water", "coffee", "tea", "ice", "skewer",
  ],
};

// The F45 API's own (coarse) category ids, used when no keyword matches.
const API_CATEGORY_FALLBACK: Record<number, Category> = {
  1: CATEGORIES.PROTEIN,
  2: CATEGORIES.DAIRY,
  3: CATEGORIES.VEGETABLE,
  4: CATEGORIES.SPICE,
  5: CATEGORIES.NUT,
  6: CATEGORIES.GRAIN,
  7: CATEGORIES.OTHER,
};

interface Matcher {
  category: Category;
  pattern: RegExp;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Builds a whole-word pattern that also accepts the plural form.
function keywordPattern(keyword: string): RegExp {
  let body = escapeRegExp(keyword).replace(/\s+/g, "\\s+");
  if (/[^aeiou]y$/.test(keyword)) {
    body = `${body.slice(0, -1)}(?:y|ies)`;
  } else if (keyword.endsWith("f")) {
    body = `${body.slice(0, -1)}(?:f|ves)`;
  } else {
    body = `${body}(?:s|es)?`;
  }
  // A prefix group instead of a lookbehind, which older iOS Safari lacks.
  return new RegExp(`(?:^|[^a-z0-9])(${body})(?![a-z0-9])`, "g");
}

const MATCHERS: Matcher[] = Object.entries(KEYWORDS).flatMap(
  ([category, keywords]) =>
    keywords.map((keyword) => ({
      category: category as Category,
      pattern: keywordPattern(keyword),
    }))
);

function bestMatch(text: string): Category | null {
  let best: { category: Category; end: number; length: number } | null =
    null;

  for (const { category, pattern } of MATCHERS) {
    for (const match of text.matchAll(pattern)) {
      const end = match.index + match[0].length;
      const length = match[1].length;
      if (
        !best ||
        end > best.end ||
        (end === best.end && length > best.length)
      ) {
        best = { category, end, length };
      }
    }
  }

  return best?.category ?? null;
}

export function categorizeIngredient(
  title: string,
  apiCategoryId?: number | null
): Category {
  const name = title.toLowerCase().replace(/’/g, "'").trim();

  // Where it's stored in the store matters more than what it is.
  if (/\bfrozen\b/.test(name)) return CATEGORIES.FROZEN;
  if (/\b(canned|tinned|can of|tin of)\b/.test(name)) return CATEGORIES.CANNED;

  // Ignore notes and alternatives: "chickpeas (drained)", "tuna, in springwater",
  // "whey isolate or plant based alternative".
  const core = name.split(/[(,]|\bor\b/)[0].trim();
  const category = bestMatch(core) ?? bestMatch(name);

  if (category === CATEGORIES.VEGETABLE && /\b(dried|dry|ground)\b/.test(name)) {
    return CATEGORIES.SPICE; // dried mint, ground ginger
  }
  if (category === CATEGORIES.FRUIT && /\bdried\b/.test(name)) {
    return CATEGORIES.BAKING; // dried cranberries, dried apricots
  }
  if (category) return category;

  return (apiCategoryId && API_CATEGORY_FALLBACK[apiCategoryId]) || CATEGORIES.OTHER;
}

// Things nobody needs to buy.
export function isNotForShopping(title: string): boolean {
  return /^(boiling |hot |cold |warm |iced |filtered |tap )?water$/i.test(
    title.trim()
  );
}
