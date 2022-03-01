const express = require('express')
const joyas = require('./data/joyas.js')
const app = express()


const HATEOASV1 = () => joyas.results.map((g) => {
  return {
    name: g.name,
    href: `http://localhost:3000/api/v1/joya/${g.id}`,
  }
});

const HATEOASV2 = () => joyas.results.map((g) => {
  return {
    nombre: g.name,
    url: `http://localhost:3000/api/v2/joya/${g.id}`,
  }
});

const joya = (id) => {
  return joyas.results.find((g) => g.id == id)
}

app.get("/api/v2/joya/:id", (req, res) => {
  const { id } = req.params
  const { fields } = req.query
  const joyaActual = joya(id)
  if (fields) return res.send({
    joya: fieldsSelect(joyaActual, fields.split(","))
  })

  if (joyaActual) {
    res.send({ joya: joyaActual })
  } else {
    res.status(404).send({
      error: "404 No Encontrado",
      message: "No Existe una Joya con ese ID"
    })
  }
});

const filtroByCategory = (category) => {
  return joyas.results.filter((g) => g.category === category)
}

app.get("/api/v2/category/:categoria", (req, res) => {
  const { categoria } = req.params;
  const joyasFiltradas = filtroByCategory(categoria);
  res.send({
    cant: joyasFiltradas.length,
    joyas: joyasFiltradas
  })
})

const fieldsSelect = (joya, fields) => {
  return fields.reduce((acc, currentValue) => {
    acc[currentValue] = joya[currentValue]
    return acc
  }, {})
};

const orderValues = (order) => {
  if (order === "asc") {
    return joyas.results.sort((a, b) => (a.value > b.value ? 1 : -1))
  }else if (order === "desc")  {
    return joyas.results.sort((a, b) => (a.value < b.value ? 1 : -1))
  }
  return joyas.results
};

app.get('/', (req, res) => {
  res.send(joyas)
})

app.get("/api/v1/joyas", (req, res) => {
  res.send({
    joyas: HATEOASV1(),
  })
});

app.get("/api/v2/joyas", (req, res) => {
  const { values } = req.query;

  if (values == 'asc') return res.send(orderValues('asc'))
  if (values == 'desc') return res.send(orderValues('desc'))

  if (req.query.page) {
    const { page } = req.query;
    return res.send({joyas: HATEOASV2().slice(page * 3 - 3, page * 3) });
  }

  res.send({
    joyas: HATEOASV2(),
  })
});


app.listen(3000, () => console.log('Servidor Encendio en el puerto 3000'))