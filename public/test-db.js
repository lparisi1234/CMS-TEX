// Ejemplos de cómo testear el endpoint /api/testdb desde JavaScript

// 1. Usando fetch nativo (funciona en cualquier navegador)
async function testDbWithFetch() {
  try {
    const response = await fetch('/api/testdb')
    const data = await response.json()
    console.log('Test DB con fetch:', data)
    return data
  } catch (error) {
    console.error('Error con fetch:', error)
    throw error
  }
}

// 2. Usando XMLHttpRequest (método clásico)
function testDbWithXHR() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/testdb')
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        console.log('Test DB con XHR:', data)
        resolve(data)
      } else {
        reject(new Error(`HTTP Error: ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error('Network Error'))
    xhr.send()
  })
}

// 3. Usando axios (si lo tienes instalado)
async function testDbWithAxios() {
  try {
    const response = await axios.get('/api/testdb')
    console.log('Test DB con axios:', response.data)
    return response.data
  } catch (error) {
    console.error('Error con axios:', error)
    throw error
  }
}

// 4. Función para probar desde la consola del navegador
window.testDatabase = async function() {
  console.log('🔍 Testeando conexión a la base de datos...')
  
  try {
    const result = await testDbWithFetch()
    
    if (result.success) {
      console.log('✅ Conexión exitosa!')
      console.log('📅 Timestamp del servidor:', result.time.now)
    } else {
      console.log('❌ Conexión falló:', result.error)
    }
    
    return result
  } catch (error) {
    console.error('💥 Error de red:', error)
    return null
  }
}

// Instrucciones para usar en la consola:
console.log(`
🚀 Para testear la base de datos desde la consola del navegador:

1. Abrir DevTools (F12)
2. Ir a la pestaña Console
3. Ejecutar: testDatabase()

O también puedes ejecutar directamente:
- testDbWithFetch()
- testDbWithXHR()
`)

export { testDbWithFetch, testDbWithXHR, testDbWithAxios }
