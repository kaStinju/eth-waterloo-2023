import { Web3Storage, getFilesFromPath } from 'web3.storage'

(async () => {
  const storage = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZmMjM1Njc2NDNCMkFkODIyQzNmMDA3ODRmRjhjNzI0MmI1RTU1M0IiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODc2ODk3NDEzODAsIm5hbWUiOiJub3VucyJ9.SJb9S0Nn1tWNQfU1ej3Sv2ep8u5g6NsVwBUzbn6WXrk' })
  const files = await getFilesFromPath('../build/*')
  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('CID:', cid)
})()
