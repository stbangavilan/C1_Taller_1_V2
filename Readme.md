# Proyecto Taller I – Entorno Full Stack  
**Materia:** Taller I  
**Tema:** Entorno Full Stack con JHipster (Spring Boot + Angular)  
**Alumno:** Esteban Gavilán  

---

## 1. Descripción general

Este proyecto forma parte del trabajo práctico **“Proyecto Taller I – Entorno Full Stack”**.  
El objetivo es construir una aplicación full stack utilizando **JHipster**, generada a partir de un **modelo JDL**, que incluye:

- Backend: **Java 17 + Spring Boot 3 + Maven**
- Frontend: **Angular** (generado por JHipster)
- Base de datos de desarrollo: **H2 en memoria**
- Gestión de esquema: **Liquibase**
- Seguridad: **JWT + Spring Security**

El dominio funcional simula un **módulo de inventario** con unidades de medida, productos, locales, stock y movimientos de inventario.

---

## 2. Modelo de dominio (JDL)

El modelo fue diseñado en **JDL Studio** y luego importado con `jhipster jdl inventario.jdl`.

### 2.1. Enumeraciones

- `DimensionUnidadEnum`
  - `UNIDAD`
  - `PESO`
  - `VOLUMEN`

- `TipoMovimientoEnum`
  - `ENTRADA`
  - `SALIDA`
  - `TRANSFERENCIA`
  - `AJUSTE`

### 2.2. Entidades principales

- **UnidadMedida**
  - `id`
  - `codigo` (ej: `UN`, `KG`, `L`)
  - `nombre`
  - `dimension` (enum `DimensionUnidadEnum`)

- **Categoria**
  - `id`
  - `nombre`
  - `descripcion`
  - Campos de auditoría: `fechaCreacion`, `fechaModificacion`, `usuarioCreacion`, `usuarioModificacion`

- **Producto**
  - `id`
  - `sku`
  - `nombre`
  - `unidadMedida` (relación con `UnidadMedida`)
  - `categoria` (relación con `Categoria`)
  - `pesoPorUnidadKg`
  - `volumenPorUnidadL`
  - Auditoría básica

- **Local**
  - `id`
  - `nombre`
  - `ubicacion`
  - Auditoría básica

- **Stock**
  - `id`
  - `producto` (relación con `Producto`)
  - `local` (relación con `Local`)
  - `cantidad`
  - Índices:
    - `(producto, local)` único
    - Índices individuales por `producto` y `local`

- **Movimiento**
  - `id`
  - `tipo` (enum `TipoMovimientoEnum`)
  - `producto`
  - `localOrigen`
  - `localDestino`
  - `cantidad`
  - `referencia`
  - `fechaMovimiento`
  - Auditoría básica

---

## 3. Tecnologías utilizadas

- **JHipster:** 8.11.0  
- **Java:** 17  
- **Spring Boot:** 3.4.5  
- **Maven:** 3.x  
- **Node.js / NPM:**  
  - Node: ≥ 20.x (JHipster recomienda ≥ 22.15.0)  
  - NPM: ≥ 10.x  
- **Angular:** versión generada por JHipster  
- **Base de datos dev:** H2  
- **Liquibase:** manejo de cambios en BD  
- **JWT / Spring Security:** autenticación y autorización

---

## 4. Requisitos previos

Antes de ejecutar el proyecto, tener instalado:

- [Java 17](https://adoptium.net/)  
- [Maven 3.x](https://maven.apache.org/download.cgi)  
- [Node.js y NPM](https://nodejs.org/)  
- [Git](https://git-scm.com/)

---

## 5. Clonado del repositorio

```bash
git clone https://github.com/stbangavilan/C1_Taller_1.git
cd C1_Taller_1/jhipster-app
