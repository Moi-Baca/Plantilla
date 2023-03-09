exports.Inicio = (req, res) => {
    const titulo = 'HOME'
    res.render("inicio", {titulo})
}
