const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

// CONFIGURACION MORGAN, MIDDLEWARE
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

// PARA OBTENER TODAS LAS PERSONAS EN RESPUESTA FORMATO JSON
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// PARA OBTENER LA INFO
app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<h1>Phonebook has info for ${persons.length} people</h1><br/><h2>${date}</h2>`
  );
});

// PARA OBTENER LA INFO DE UN ID ESPECIFICO
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const person = persons.find((p) => p.id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// FUNCION PARA UN ID ÚNICO
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

// PARA AGREGAR OTRA PERSONA
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const nameFiltered = persons.filter((person) => person.name === body.name);

  // Agregamos validaciones
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "content missing" });
  } else if (nameFiltered) {
    return response.status(400).json({ error: "name must be unique" });
  }

  // Al pasar la validación creamos una nueva persona
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  // Agregamos la persona a persons
  persons = persons.concat(person);
  response.json(person);
});

// PARA ELIMINAR UN ID
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
