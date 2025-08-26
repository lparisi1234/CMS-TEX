// @ts-ignore
export default defineEventHandler(async (event) => {
  // Health check simple para AWS
  // @ts-ignore
  setHeader(event, 'Content-Type', 'application/json')
  
  return {
    status: 'healthy',
    service: 'cms-tex',
    timestamp: Date.now(),
    version: '1.0.0'
  }
})
