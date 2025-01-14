// Save this as getSchema.js
async function getSchemaFromEndpoint() {
  try {
    const response = await fetch("https://strapi.f45training.com/recipes/2175");
    const data = await response.json();

    function getSchema(obj) {
      if (Array.isArray(obj)) {
        return obj.length > 0 ? [getSchema(obj[0])] : [];
      }
      if (obj === null || obj === undefined) {
        return typeof obj;
      }
      if (typeof obj !== "object") {
        return typeof obj;
      }

      const schema = {};
      for (const key in obj) {
        schema[key] = getSchema(obj[key]);
      }
      return schema;
    }

    const schema = getSchema(data);
    console.log(JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

getSchemaFromEndpoint();
