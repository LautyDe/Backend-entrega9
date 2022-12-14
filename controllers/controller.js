const fs = require("fs");

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    exists(archivo) {
        /* verifico si existe el archivo */
        try {
            if (!fs.existsSync(archivo)) {
                throw new Error("El archivo no existe");
            } else {
                return true;
            }
        } catch (error) {
            console.log(`Error buscando el archivo: ${error.message}`);
        }
    }

    async readFile(archivo) {
        try {
            /* leo el archivo */
            const data = await fs.readFileSync(archivo);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error leyendo el archivo: ${error.message}`);
        }
    }

    async writeFile(archivo, contenido) {
        try {
            /* escribir archivo */
            await fs.writeFileSync(archivo, JSON.stringify(contenido, null, 4));
        } catch (error) {
            console.log(`Error escribiendo el archivo: ${error.message}`);
        }
    }

    async save(producto) {
        try {
            /* busco si existe el archivo con datos y si no tiene datos agrego el producto con id: 1 */
            if (!this.exists(this.archivo)) {
                let arrayProductos = [];
                producto = { id: 1, ...producto };
                arrayProductos.push(producto);
                await fs.writeFile(this.archivo, arrayProductos);

                return producto.id;
            } else {
                /* si el archivo existe, primero verifico si esta vacio */
                if (this.readFile(this.archivo)) {
                    const data = await this.readFile(this.archivo);
                    if (data.length === 0) {
                        /* Si el archivo esta vacio le asigno el id: 1 */
                        producto = { id: 1, ...producto };
                    } else {
                        /* si ya tiene algun producto, se le asigna el nro de id que siga */
                        let ultimoId = data[data.length - 1].id;
                        producto = { id: ultimoId + 1, ...producto };
                    }

                    data.push(producto);
                    /* se escribe el producto */
                    this.writeFile(this.archivo, data);

                    return producto.id;
                }
            }
        } catch (error) {
            console.log(`Error agregando el producto: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            /* chequeo que exista el documento */
            if (this.exists(this.archivo)) {
                const data = await this.readFile(this.archivo);
                /* uso filter para buscar el producto con el id que queramos */
                const dataId = data.filter(item => item.id === id);
                if (dataId.length === 0) {
                    throw new Error(
                        "No se encontro un producto con el id solicitado"
                    );
                } else {
                    return dataId;
                }
            }
        } catch (error) {
            console.log(`Error buscando producto con el id: ${error.message}`);
        }
    }

    async getAll() {
        /* chequeo si existe el documento */
        try {
            if (this.exists(this.archivo)) {
                const data = await this.readFile(this.archivo);
                /* una vez que verifico si existe, veo si esta vacio o tiene contenido */
                if (data.length !== 0) {
                    return data;
                } else {
                    throw new Error(`El archivo ${this.archivo} esta vacio`);
                }
            }
        } catch (error) {
            console.log(
                `Error obteniendo todos los productos: ${error.message}`
            );
        }
    }

    async modify(id, contenido) {
        try {
            /* verifico que exista el documento */
            if (this.exists(this.archivo)) {
                let data = await this.readFile(this.archivo);
                /* uso filter para buscar el producto con el id que queramos */
                let dataId = data.filter(item => item.id === id);
                if (dataId.length === 0) {
                    /* si no se encuentra el producto lanzo un error */
                    throw new Error(
                        `No se encontro el producto con el id solicitado`
                    );
                } else {
                    /* elimino el produco a editar */
                    data = data.filter(item => item.id !== id);
                    /* agrego uno nuevo con el mismo id */
                    dataId = { id: id, ...contenido };
                    data.push(dataId);
                    this.writeFile(this.archivo, data);

                    return dataId;
                }
            }
        } catch (error) {
            console.log(`Error modificando el producto: ${error.message}`);
        }
    }

    async deleteById(id) {
        /* chequeo si existe el documento */
        try {
            if (this.exists(this.archivo)) {
                const data = await this.readFile(this.archivo);
                /* verifico que exista el id */

                if (data.some(item => item.id === id)) {
                    const data = await this.readFile(this.archivo);
                    /* elimino producto */

                    const datos = data.filter(item => item.id !== id);
                    this.writeFile(this.archivo, datos);
                } else {
                    throw new Error(
                        `No se encontro el producto con el id ${id}`
                    );
                }
            }
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando el producto con el id solicitado: ${error.message}`
            );
        }
    }

    async deleteAll() {
        try {
            /* chequeo si existe el documento */
            let nuevoArray = [];

            await this.writeFile(this.archivo, nuevoArray);
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando los datos: ${error.message}`
            );
        }
    }
}

module.exports = Contenedor;
