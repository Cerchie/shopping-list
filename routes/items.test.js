process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let pickles = {
    name: "pickles",
    price: "2.49"
};

beforeEach(function () {
    items.push(pickles);
});

afterEach(function () {
    // make sure this *mutates*, not redefines, `items`
    items.length = 0;
});
// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", function () {
    test("Gets a list of items", async function () {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual(
            items
        );
    });
});
// end

/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /items/:name", function () {
    test("Gets a single item", async function () {
        const resp = await request(app).get(`/items/${pickles.name}`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({
            item: pickles
        });
    });

    test("Responds with 404 if can't find item", async function () {
        const resp = await request(app).get(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});
// end

/** POST/ items - create item from data; return `{item}: item}` */

describe("POST /items", function () {
    test("Creates a new item", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "Eggs",
                price: "1.00"
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            item: {
                name: "Eggs",
                price: "1.00"
            }
        });
    });
});
// end

/** PATCHitems/[name] - update item; return `{item: item}` */

describe("PATCH /items/:name", function () {
    test("Updates a single item", async function () {
        const resp = await request(app)
            .patch(`/items/${pickles.name}`)
            .send({
                name: "sour pickles",
                price: "2.49"
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {
                name: "sour pickles",
                price: "2.49"
            }
        });
    });

    test("Responds with 404 if id invalid", async function () {
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});
// end

/** DELETE /items/[name] - delete item,
 *  return `{message: "item deleted"}` */

describe("DELETE /items/:name", function () {
    test("Deletes a single item", async function () {
        const resp = await request(app).delete(`/items/${pickles.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            message: "Deleted"
        });
    });
});
// end